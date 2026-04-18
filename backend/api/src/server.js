/**
 * Biogrix API server.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { requestLogger } = require("./middleware/requestLogger");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// --- 1. CORS SECURITY CONFIGURATION ---
const allowedOrigins = [
  "https://biogrix.vercel.app",
  "https://biogrix-admin.vercel.app",
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:3002",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
    credentials: true,
  }),
);

// --- 2. GLOBAL MIDDLEWARES (Routes se pehle hona zaroori hai!) ---
app.use(express.json()); // 👈 Ye ab sabse upar hai, taaki req.body mil sake
app.use(requestLogger);

// --- 3. HEALTH CHECK ---
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Biogrix API is alive and kicking!",
    timestamp: new Date().toISOString(),
  });
});

// --- 4. API ROUTES ---

// 🤖 AI Translation Module (Modular approach)
// Note: Is module ke andar humne batching logic dala hai
app.use("/v1/ai", require("./modules/ai/ai.routes"));

// Business Modules
app.use("/v1/leads", require("./modules/leads/leads.routes"));
app.use("/v1/auth", require("./modules/auth/auth.routes"));
app.use("/v1/plants", require("./modules/plants/plants.routes"));
app.use("/v1/customers", require("./modules/customers/customers.routes"));
app.use("/v1/gas-usage", require("./modules/gas-usage/gas-usage.routes"));
app.use("/v1/payments", require("./modules/payments/payments.routes"));
app.use("/v1/meters", require("./modules/meters/meters.routes"));
app.use("/v1/billing", require("./modules/billing/billing.routes"));
app.use("/v1/complaints", require("./modules/complaints/complaints.routes"));
app.use("/v1/maintenance", require("./modules/maintenance/maintenance.routes"));
app.use("/v1/reports", require("./modules/reports/reports.routes"));
app.use("/v1/profile", require("./modules/profile/profile.routes"));
app.use("/v1/workers", require("./modules/workers/workers.routes"));

// --- 5. ERROR HANDLING ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- 6. SERVER START ---
app.listen(PORT, () => {
  console.log(`
  🚀 BIOGRIX ENGINE STARTED
  📡 URL: http://localhost:${PORT}
  🏥 HEALTH: http://localhost:${PORT}/health
  `);
});
