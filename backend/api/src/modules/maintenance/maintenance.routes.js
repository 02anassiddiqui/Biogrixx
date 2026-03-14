/**
 * Maintenance routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./maintenance.controller')

router.get('/', controller.list)

module.exports = router
