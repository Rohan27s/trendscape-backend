const mongoose = require('mongoose');

// Define a Mongoose schema based on the Zod schema
const OrderSchema = new mongoose.Schema({
    shippingDetails: {
        name: String,
        mobileNumber: String,
        houseStreet: String,
        cityTown: String,
        state: String,
        pincode: String
    },
    shippingMethod: String,
    paymentMethod: String,
    cartItems: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    cartTotal: Number
});

// Create a Mongoose model based on the schema
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
