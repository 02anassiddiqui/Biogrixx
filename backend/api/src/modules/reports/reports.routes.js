/**
 * Reports routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./reports.controller')

router.get('/', controller.list)

module.exports = router
