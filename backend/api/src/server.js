/**
 * Biogrix API server.
 */
require('dotenv').config(); // 👈 Sabse zaroori: .env load karne ke liye
const express = require('express');
const cors = require('cors'); // 👈 Frontend communication ke liye
const { requestLogger } = require('./middleware/requestLogger');
const { notFoundHandler } = require('./middleware/notFoundHandler');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
// Note: Port 4000 use ho raha hai as per your skeleton
const PORT = process.env.PORT || 4000;

// 1. Global Middlewares
app.use(cors()); // 👈 Taaki frontend block na ho
app.use(express.json());
app.use(requestLogger);

// 2. Base Health Check (Test karne ke liye)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Biogrix API is alive' });
});

// 3. API Routes (Versioning follow ho rahi hai)
app.use('/v1/customers', require('./modules/customers/customers.routes'));
app.use('/v1/auth', require('./modules/auth/auth.routes'));

// 4. Error Handling (Inhe hamesha routes ke baad rakhte hain)
app.use(notFoundHandler);
app.use(errorHandler);



app.listen(PORT, () => {
  console.log(`
  🚀 BIOGRIX ENGINE STARTED
  📡 URL: http://localhost:${PORT}
  🏥 HEALTH: http://localhost:${PORT}/health
  `);
});