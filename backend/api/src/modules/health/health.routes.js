/**
 * Health routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./health.controller')

router.get('/', controller.check)

module.exports = router
