// index.js
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders')
const loginRoutes = require('./routes/login')

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
app.use('/api',loginRoutes)
app.get("/",(req,res)=>{
    res.send("hey");
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
