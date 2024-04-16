const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: Array,
      required: true,
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  sold:{
    type: Number,
    default: 0,
},

  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"category",
    required: true,
  },
  brand:{
    type:String,
    enum:["snmsung","artison","asus","lG","hp","MI","oppo","huwaei"],

  },
  rattings:[
    {
      star:Number,
      postedb:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    }
  ]
  
});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product, productSchema };