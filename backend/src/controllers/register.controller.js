import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from './../utils/ApiError.js'
import { User } from '../models/user.model.js'
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponce.js'
import  jwt  from 'jsonwebtoken'
import mongoose from 'mongoose'

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body || {}

  //validatiom
  
  if (
    [username, fullName, email, password].some(field => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required')
  }

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existUser) {
    throw new ApiError(409, 'User with username or email is already exists')
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is missing')
  }

  let avatar
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath)
  } catch (error) {
    console.log('Error while uploading avatar', error)
    throw new ApiError(400, 'failed to upload avatar')
  }
  let coverImage
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath)
  } catch (error) {
    console.log('Error while uploading coverImage', error)
    throw new ApiError(400, 'failed to upload coverImage')
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // let coverImage = ""
  // if(coverLocalPath){
  //     coverImage = await uploadOnCloudinary(coverLocalPath);
  // }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      fullName,
      avatar: avatar?.url,
      coverImage: coverImage?.url || '',
    })

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken',
    )

    if (!createdUser) {
      throw new ApiError(500, 'something went wrong while creating user')
    }

    res
      .status(201)
      .json(new ApiResponse(201, createdUser, 'user created successfully'))
  } catch (error) {
      console.error("User creation failed:", error);
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id)
    }

    throw new ApiError(
      500,
      'something went wrong while registering the user and images were deleted',
    )
  }
})

const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      throw new ApiError(404, 'User not found while generating tokens')
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log('Error while generating access and refresh tokens', error)
    throw new ApiError(500, 'Error while generating Tokens')
  }
}

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'User does not exist')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  )

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  )
  if (!loggedInUser) {
    throw new ApiError(500, 'Something went wrong while logging in')
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully',
      ),
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: null,
    },
    {
      new: true,
    },
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'user logout successfully'))
})

const generateAccessRefreshToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken

  if (!incommingRefreshToken) {
    throw new ApiError(401, 'refreshToken is required')
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, 'invalid refresh token')
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'invalid refresh token')
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id)

    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'New access and refresh token generated successfully',
        ),
      )
  } catch (error) {
    throw new ApiError(
      500,
      'something went wrong while creating access and refresh token ',
    )
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordValid) {
    throw new ApiError(402, 'invalid old password')
  }

  user.password = newPassword

  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'password change successfully'))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user details'))
})

const changeAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body

  if (!fullName && !email) {
    throw new ApiError(401, 'all fields are required')
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      fullName,
      email,
    },
  }, { new: true }).select('-password')

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'account details updated successfuly'))
})

const updateAvatarImage = asyncHandler(async (req, res) => {
  const localFilePath = req?.file?.path

  if (!localFilePath) {
    throw new ApiError(401, 'new avatar is missing')
  }

  const avatar = await uploadOnCloudinary(localFilePath)

  if (!avatar) {
    throw new ApiError(500, 'error while uploading image on cloadinary')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select('-password -refreshToken')

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'avatar image update sucessfully'))
})
const updateCoverImage = asyncHandler(async (req, res) => {
  const localFilePath = req?.file?.path

  if (!localFilePath) {
    throw new ApiError(401, 'new coverImage is missing')
  }

  const coverImage = await uploadOnCloudinary(localFilePath)

  if (!coverImage) {
    throw new ApiError(500, 'error while uploading image on cloadinary')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true },
  ).select('-password -refreshToken')

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'coverImage image update sucessfully'))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params

  if (!username.trim()) {
    throw new ApiError(401, 'username is missing')
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
      },
    },
    {
      $addFields: {
        subscribersToCount: {
          size: '$subscribers',
        },
        channelSubcribedToCount: {
          size: '$subscribedTo',
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                req.user._id,
                {
                  $map: {
                    input: '$subscribers',
                    as: 's',
                    in: '$$s.subscriber',
                  },
                },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersToCount: 1,
        channelSubcribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ])

  console.log('channel checking...........', channel)

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], 'user channel fetched successfully'))
})

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: '$owner',
              },
            },
          },
        ],
      },
    },
  ])

  if (!user.length) {
    throw new ApiError(404, 'User not found')
  }

  if (!user[0].watchHistory.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], 'No watch history yet.'))
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        'watchHistory fetched successfully',
      ),
    )
})

export {
  registerUser,
  loginUser,
  generateAccessRefreshToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  changeAccountDetails,
  updateAvatarImage,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
}
