/**
 * Billing routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./billing.controller')

router.get('/', controller.list)

module.exports = router
