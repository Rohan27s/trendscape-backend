const express = require("express");
const router = express.Router();
const Order = require("../models/order");

router.get("/", async (req, res) => {
//   console.log("first");
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the start of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // console.log("first");
    // Get orders for today
    const ordersToday = await Order.find({
      createdAt: { $gte: today },
    });

    const ordersThisMonth = await Order.find({
      createdAt: { $gte: startOfMonth },
    });

    const revenueToday = ordersToday.reduce(
      (total, order) => total + order.cartTotal,
      0
    );
    // const revenueForMonth = async (startOfMonth) => {
    //     // Find orders for the specified month
    //     const ordersForMonth = await Order.find({
    //       createdAt: { $gte: startOfMonth },
    //     });
        
        // Calculate total revenue for the month
        const totalRevenue = ordersThisMonth.reduce((total, order) => {
          return total + order.cartTotal;
        }, 0);
        console.log(totalRevenue,'total')
        // return totalRevenue;
    //   };
    //   revenueForMonth()
    // console.log("first", ordersToday);
    res.json({ ordersToday, ordersThisMonth, revenueToday,totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// router.get('/revenue', async (req, res) => {
//     console.log("object");
//     try {
//       // Get today's date
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       // Calculate the start of the current month
//       const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         console.log("first")
//       // Get orders for today
// //       const ordersToday = await Order.find({
// //         createdAt: { $gte: today },
// //       });

// //       // Get orders for the current month
// //       const ordersThisMonth = await Order.find({
// //         createdAt: { $gte: startOfMonth },
// //       });

// //       // Calculate total revenue for today
// //       const revenueToday = ordersToday.reduce(
// //         (total, order) => total + order.cartTotal,
// //         0
// //       );
// //   console.log(ordersThisMonth,ordersToday);
// //       // Return the revenue and order statistics
// //       res.json({
// //         revenueToday,
// //         ordersToday: ordersToday.length,
// //         ordersThisMonth: ordersThisMonth.length,
// //       });
//     } catch (err) {
//       res.status(401).json({ message: err.message });
//     }
//   });
