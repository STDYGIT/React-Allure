const express = require('express')
const router = express.Router()

const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/services.controller')

// PUBLIC
router.get('/', getServices)

// ADMIN
router.post('/', createService)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

module.exports = router
