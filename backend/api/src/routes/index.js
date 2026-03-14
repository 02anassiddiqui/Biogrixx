/**
 * Global route loader.
 * Registers routes from all modules.
 */

const express = require('express')
const router = express.Router()

const customersRoutes = require('../modules/customers/customers.routes')
const plantsRoutes = require('../modules/plants/plants.routes')
const metersRoutes = require('../modules/meters/meters.routes')
const gasUsageRoutes = require('../modules/gas-usage/gas-usage.routes')
const billingRoutes = require('../modules/billing/billing.routes')
const paymentsRoutes = require('../modules/payments/payments.routes')
const complaintsRoutes = require('../modules/complaints/complaints.routes')
const maintenanceRoutes = require('../modules/maintenance/maintenance.routes')
const reportsRoutes = require('../modules/reports/reports.routes')

router.use('/customers', customersRoutes)
router.use('/plants', plantsRoutes)
router.use('/meters', metersRoutes)
router.use('/gas-usage', gasUsageRoutes)
router.use('/billing', billingRoutes)
router.use('/payments', paymentsRoutes)
router.use('/complaints', complaintsRoutes)
router.use('/maintenance', maintenanceRoutes)
router.use('/reports', reportsRoutes)

module.exports = router
