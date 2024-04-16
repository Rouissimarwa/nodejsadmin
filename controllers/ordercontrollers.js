const Order = require("../models/order");

module.exports = {
    getUserOrders: async (req, res) => {
        const userId = req.user.id;
        try {
            const userOrders = await Order.find({ userId })
                .populate({
                    path: 'products.product', // Correction du chemin de la population
                    select: '-oldPrice -description'
                })
                .exec();
            res.status(200).json(userOrders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to get orders" });
        }
    }
};
