const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/product');

const createProduct = expressAsyncHandler(async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        await newProduct.save();
        res.status(200).json("Product created");
    } catch (error) {
        res.status(500).json("Failed to create product");
    }
});

const getAllProducts = expressAsyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json("Failed to get products");
    }
});

const getProduct = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json("Product not found");
        }
        const { __v, createdAt, ...productData } = product._doc;
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).json("Failed to get product data");
    }
});

const searchProducts = expressAsyncHandler(async (req, res) => {
    const key = req.params.key;
    try {
        const results = await Product.aggregate([
            {
                $search: {
                    index: "pcportable",
                    text: {
                        query: key,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ]);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json("Failed to search products");
    }
});

const updateProduct = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
            new: true
        });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json("Failed to update product");
    }
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json("Failed to delete product");
    }
});

const addToWishlist = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = req.body.productId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }
        if (user.wishlist.includes(productId)) {
            // Si le produit est déjà dans la liste de souhaits, le retirer
            user.wishlist = user.wishlist.filter(item => item !== productId);
        } else {
            // Sinon, ajouter le produit à la liste de souhaits
            user.wishlist.push(productId);
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json("Failed to add to wishlist");
    }
});

const rating = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, star, comment } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json("Product not found");
        }
        // Vérifier si l'utilisateur a déjà noté ce produit
        const existingRating = product.ratings.find(rating => rating.postedBy.toString() === userId.toString());
        if (existingRating) {
            // Mise à jour de la note existante
            existingRating.star = star;
            existingRating.comment = comment;
        } else {
            // Ajout d'une nouvelle note
            product.ratings.push({
                star: star,
                comment: comment,
                postedBy: userId
            });
        }
        // Calcul de la note moyenne
        const totalStars = product.ratings.reduce((acc, curr) => acc + curr.star, 0);
        product.avgRating = totalStars / product.ratings.length;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json("Failed to rate product");
    }
});

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    searchProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
};
 