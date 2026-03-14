/**
 * Payments routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./payments.controller')

router.get('/', controller.list)

module.exports = router
