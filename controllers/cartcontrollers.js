const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports = {
    addCart: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "User is not authenticated" });
        }
    
        const userId = req.user.id;
        const { cartItem, quantity } = req.body;
        try {
            let cart = await Cart.findOne({ userId });
            if (cart) {
                const existingProduct = cart.products.find(
                    (product) => product.cartItem.toString() === cartItem
                );
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.products.push({ cartItem, quantity: 1 });
                }
                await cart.save();
                return res.status(200).json({ message: "Product added to cart successfully" });
            } else {
                cart = new Cart({
                    userId,
                    products: [{ cartItem, quantity: 1 }]
                });
                await cart.save();
                return res.status(200).json({ message: "Product added to cart successfully" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to add product to cart" });
        }
    },
    

    getCart: async (req, res) => {
        const userId = req.user.id;
        try {
            const cart = await Cart.findOne({ userId });
            res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to fetch cart");
        }
    },

    deleteCartItem: async (req, res) => {
        const cartItemId = req.params.cartItem;
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { userId: req.user.id },
                { $pull: { products: { _id: cartItemId } } },
                { new: true }
            );
            if (!updatedCart) {
                return res.status(404).json({ message: "Cart item not found" });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to delete cart item" });
        }
    }
};
