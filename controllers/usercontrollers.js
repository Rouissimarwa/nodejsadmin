const crypto = require('crypto');
const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const sendEmail = require('./emailconroller');

const getallUser = asyncHandler(async (req, res) => {
    try {
      const getUsers = await User.find().populate("wishlist");
      res.json(getUsers);
    } catch (error) {
      throw new Error(error);
    }
});


module.exports = {
  forgotPasswordToken : asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  }),
    
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            const { password, __v, updatedAt, createdAt, ...userdata } = user._doc;
            res.status(200).json(userdata);
        } catch (error) {
            res.status(500).json(error);
        }
    },
   
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.user.id);
            const { password, __v, updatedAt, createdAt, ...userdata } = user._doc;
            res.status(200).json("User deleted");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updatedUser: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
      
        try {
          const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
              firstname: req?.body?.firstname,
              lastname: req?.body?.lastname,
              email: req?.body?.email,
              numérotelephone: req?.body?.numérotelephone,
            },
            {
              new: true,
            }
          );
          res.json(updatedUser);
        } catch (error) {
          throw new Error(error);
        }
      }),
     
      updatePassword: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { password } = req.body;
        validateMongoDbId(_id);
        const user = await User.findById(_id);
        if (password) {
          user.password = password;
          const updatedPassword = await user.save();
          res.json(updatedPassword);
        } else {
          res.json(user);
        }
      }),
      
      forgotPasswordToken: asyncHandler(async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found with this email");
        try {
          const token = await user.createPasswordResetToken();
          await user.save();
          const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
          const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
          };
          sendEmail(data);
          res.json(token);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      getWishlist: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        try {
          const findUser = await User.findById(_id).populate("wishlist");
          res.json(findUser);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      userCart: asyncHandler(async (req, res) => {
        const { cart } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
          let products = [];
          const user = await User.findById(_id);
          // check if user already have product in cart
          const alreadyExistCart = await Cart.findOne({ orderby: user._id });
          if (alreadyExistCart) {
            alreadyExistCart.remove();
          }
          for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
          }
          let cartTotal = 0;
          for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
          }
          let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
          }).save();
          res.json(newCart);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      getUserCart: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
          const cart = await Cart.findOne({ orderby: _id }).populate(
            "products.product"
          );
          res.json(cart);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      emptyCart: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
          const user = await User.findOne({ _id });
          const cart = await Cart.findOneAndRemove({ orderby: user._id });
          res.json(cart);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      applyCoupon: asyncHandler(async (req, res) => {
        const { coupon } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
          throw new Error("Invalid Coupon");
        }
        const user = await User.findOne({ _id });
        let { cartTotal } = await Cart.findOne({
          orderby: user._id,
        }).populate("products.product");
        let totalAfterDiscount = (
          cartTotal -
          (cartTotal * validCoupon.discount) / 100
        ).toFixed(2);
        await Cart.findOneAndUpdate(
          { orderby: user._id },
          { totalAfterDiscount },
          { new: true }
        );
        res.json(totalAfterDiscount);
      }),
      
      createOrder: asyncHandler(async (req, res) => {
        const { COD, couponApplied } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
          if (!COD) throw new Error("Create cash order failed");
          const user = await User.findById(_id);
          let userCart = await Cart.findOne({ orderby: user._id });
          let finalAmout = 0;
          if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount;
          } else {
            finalAmout = userCart.cartTotal;
          }
      
          let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
              id: uniqid(),
              method: "COD",
              amount: finalAmout,
              status: "Cash on Delivery",
              created: Date.now(),
              currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
          }).save();
          let update = userCart.products.map((item) => {
            return {
              updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
              },
            };
          });
          const updated = await Product.bulkWrite(update, {});
          res.json({ message: "success" });
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      getOrders: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
          const userorders = await Order.findOne({ orderby: _id })
            .populate("products.product")
            .populate("orderby")
            .exec();
          res.json(userorders);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      getAllOrders: asyncHandler(async (req, res) => {
        try {
          const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderby")
            .exec();
          res.json(alluserorders);
        } catch (error) {
          throw new Error(error);
        }
      }),
      getOrderByUserId: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
        try {
          const userorders = await Order.findOne({ orderby: id })
            .populate("products.product")
            .populate("orderby")
            .exec();
          res.json(userorders);
        } catch (error) {
          throw new Error(error);
        }
      }),
      
      updateOrderStatus: asyncHandler(async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;
        validateMongoDbId(id);
        try {
          const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
              orderStatus: status,
              paymentIntent: {
                status: status,
              },
            },
            { new: true }
          );
          res.json(updateOrderStatus);
        } catch (error) {
          throw new Error(error);
        }
      })
};
