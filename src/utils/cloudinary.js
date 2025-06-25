import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.MY_CLOUD_NAME,
  api_key: process.env.MY_CLOUD_API_KEY,
  api_secret: process.env.MY_CLOUD_SECRET_KEY,
})

const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    })
    console.log('file uploaded on cloudinary , file src : ' + response.url)
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
    return null
  }
}
console.error(' Cloudinary upload failed:', error.message)
export { uploadOnCloudinary }
