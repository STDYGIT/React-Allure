const express = require('express')
const router = express.Router()
const { login, getStats, getContacts } = require('../controllers/admin.controller')
const { authenticate } = require('../middleware/auth')

// Public routes
router.post('/login', login)

// Protected routes
router.get('/stats', authenticate, getStats)
router.get('/contacts', authenticate, getContacts)

module.exports = router
