/**
 * Biogrix API server.
 * TODO: Add JWT auth middleware, rate limiting.
 */

const express = require('express')
const { requestLogger } = require('./middleware/requestLogger')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(requestLogger)
app.use('/v1', require('./routes/v1'))
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Biogrix API running on http://localhost:${PORT}`)
})
