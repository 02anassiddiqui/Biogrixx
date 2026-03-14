/**
 * Complaints routes.
 */

const express = require('express')
const router = express.Router()
const controller = require('./complaints.controller')

router.get('/', controller.list)

module.exports = router
