// backend/worker/scheduler/index.js
const cron = require("node-cron");
const { generateMonthlyBills } = require("../jobs/billingJob");


// * Every Month
const startScheduler = () => {
  // 🕒 Schedule: Every 1st of the month at 00:00
  cron.schedule("0 0 1 * *", () => {
    generateMonthlyBills();
  });

  // 💡 Tip: Testing ke liye har 2 minute mein chalane ke liye:
  // cron.schedule("*/2 * * * *", () => { generateMonthlyBills(); });
};


// // * Every Minute (Only For Testing)
// const startScheduler = () => {
//   // 🕒 Testing: Har 1 minute mein chalega
//   cron.schedule("* * * * *", () => {
//     console.log("⚡ [TEST] Running Billing Job right now...");
//     generateMonthlyBills();
//   });
// };

module.exports = startScheduler;