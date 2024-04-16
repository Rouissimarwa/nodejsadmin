const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
