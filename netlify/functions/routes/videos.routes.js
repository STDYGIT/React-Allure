const express = require('express')
const router = express.Router()

const {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videos.controller')

const upload = require('../config/multer')

// PUBLIC
router.get('/', getVideos)

// ADMIN — FIXED
router.post(
  '/',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  createVideo
)

router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)

module.exports = router
