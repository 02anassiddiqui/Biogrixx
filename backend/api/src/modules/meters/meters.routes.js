/**
 * Meters routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./meters.controller')

router.get('/', controller.list)

module.exports = router
