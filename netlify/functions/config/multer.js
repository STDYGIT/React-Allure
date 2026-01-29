const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'video') {
      return {
        folder: 'allure',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'webm', 'mkv']
      }
    }

    if (file.fieldname === 'thumbnail') {
      return {
        folder: 'thumbnails',
        resource_type: 'image'
      }
    }
  }
})

const upload = multer({ storage })

module.exports = upload
