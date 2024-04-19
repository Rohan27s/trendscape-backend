const Razorpay = require('razorpay')
// index.js
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders')
const loginRoutes = require('./routes/login')
const paymentRoutes = require('./routes/razorpay')
const revenueRoutes = require('./routes/revenue')

const cors = require('cors');
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/revenue', revenueRoutes);

app.use('/api',loginRoutes)
app.get("/",(req,res)=>{
    res.send("hey");
});

const instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_APT_SECRET
})


const PORT = process.env.PORT || 3700;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// module.exports = instance;