const express = require('express')
const router = express.Router()
const { submitContact } = require('../controllers/contacts.controller')

// Public route
router.post('/', submitContact)

module.exports = router
