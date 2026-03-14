/**
 * Gas usage routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./gas-usage.controller')

router.get('/', controller.list)

module.exports = router
