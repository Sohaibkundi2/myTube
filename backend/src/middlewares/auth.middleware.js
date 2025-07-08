import  jwt  from 'jsonwebtoken'
import ApiError from './../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from './../models/user.model.js'

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header('authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'unAuthorized')
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, 'unAuthorized request')
    }

    req.user = user

    next()
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token')
  }
})


export { verifyJWT }