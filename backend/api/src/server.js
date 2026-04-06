/**
 * Biogrix API server.
 */
require("dotenv").config(); // 👈 .env load karne ke liye
const express = require("express");
const cors = require("cors"); // 👈 Frontend communication ke liye
const { requestLogger } = require("./middleware/requestLogger");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
// Note: Port 4000 use ho raha hai
const PORT = process.env.PORT || 4000;

// --- 1. CORS SECURITY CONFIGURATION ---
const allowedOrigins = [
  "https://biogrix.vercel.app", // Landing Page
  "https://biogrix-admin.vercel.app", // Admin Dashboard
  "http://localhost:3001", // Local Admin
  "http://localhost:3000", // Local Frontend
  "http://localhost:4000", // Local Backend
  "http://localhost:3002", // Local Agent
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
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
); // 👈 Taaki frontend block na ho

// 1. Global Middlewares
app.use(express.json());
app.use(requestLogger);

// 3. HEALTH CHECK (For Render & UptimeRobot)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Biogrix API is alive and kicking!",
    timestamp: new Date().toISOString(),
  });
});

// 4. API Routes (Versioning follow ho rahi hai)
app.use("/v1/leads", require("./modules/leads/leads.routes"));
app.use("/v1/auth", require("./modules/auth/auth.routes"));
app.use("/v1/plants", require("./modules/plants/plants.routes"));
app.use("/v1/customers", require("./modules/customers/customers.routes"));
app.use("/v1/gas-usage", require("./modules/gas-usage/gas-usage.routes"));
app.use("/v1/payments", require("./modules/payments/payments.routes"));

// ✅ NEW: METERS MODULE ROUTES (Iske bina 404 aa raha tha)
app.use("/v1/meters", require("./modules/meters/meters.routes"));

// ✅ NEW: BILLING MODULE ROUTES
app.use("/v1/billing", require("./modules/billing/billing.routes"));

app.use("/v1/complaints", require("./modules/complaints/complaints.routes"));

app.use("/v1/maintenance", require("./modules/maintenance/maintenance.routes"));

app.use("/v1/reports", require("./modules/reports/reports.routes"));
// 5. Error Handling (Inhe hamesha routes ke baad rakhte hain)
app.use(notFoundHandler);
app.use(errorHandler);

// 6. SERVER START
app.listen(PORT, () => {
  console.log(`
  🚀 BIOGRIX ENGINE STARTED
  📡 URL: http://localhost:${PORT}
  🏥 HEALTH: http://localhost:${PORT}/health
  `);
});
