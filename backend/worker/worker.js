// backend/worker/worker.js
require("dotenv").config();
const startScheduler = require("./scheduler");

console.log("-----------------------------------------");
console.log("⚙️  BIOGRIX WORKER ENGINE STARTED");
console.log("🚀 Automation: Monthly Billing Active");
console.log("-----------------------------------------");

startScheduler();
