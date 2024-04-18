// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     shippingDetails: {
//       name: String,
//       mobileNumber: String,
//       houseStreet: String,
//       cityTown: String,
//       state: String,
//       pincode: String,
//     },
//     shippingMethod: String,
//     paymentMethod: String,
//     cartItems: [
//       {
//         id: String,
//         name: String,
//         price: Number,
//         quantity: Number,
//         imageUrl: [String],
//       },
//     ],
//     cartTotal: Number,
//   },
//   { timestamps: true } // This option adds createdAt and updatedAt fields automatically
// );

// const Order = mongoose.model('Order', OrderSchema);

// module.exports = Order;
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    razorpayOrderId: String, // Store Razorpay order ID
    paymentId: String, // Store Razorpay payment ID
    amount: Number, // Store payment amount
    currency: String, // Store currency
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'], // Status of the payment
      default: 'pending',
    },
    shippingDetails: {
      name: String,
      mobileNumber: String,
      houseStreet: String,
      cityTown: String,
      state: String,
      pincode: String,
    },
    shippingMethod: String,
    paymentMethod: String,
    cartItems: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: [String],
      },
    ],
    cartTotal: Number,
  },
  { timestamps: true } // This option adds createdAt and updatedAt fields automatically
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
