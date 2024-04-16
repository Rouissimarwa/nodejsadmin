const router = require('express').Router();
const usercontrollers = require('../controllers/usercontrollers');
const { verifyToken } = require('../middleware/verifyToken');

// Route GET pour récupérer les informations de l'utilisateur
router.get('/', verifyToken, usercontrollers.getUser);

// Route DELETE pour supprimer l'utilisateur
router.delete('/', verifyToken, usercontrollers.deleteUser);

// Route PUT pour mettre à jour les informations de l'utilisateur
router.put('/', verifyToken, usercontrollers.updatedUser);
// Route PUT pour mettre à jour le mot de passe de l'utilisateur
router.put('/password', verifyToken, usercontrollers.updatePassword);


router.post('/forgot-password-token', usercontrollers.forgotPasswordToken);

// Route GET pour récupérer la liste de souhaits de l'utilisateur
router.get('/wishlist', verifyToken, usercontrollers.getWishlist);

// Route POST pour ajouter des produits au panier de l'utilisateur
router.post('/cart', verifyToken, usercontrollers.userCart);

// Route GET pour récupérer le panier de l'utilisateur
router.get('/cart', verifyToken, usercontrollers.getUserCart);

// Route DELETE pour vider le panier de l'utilisateur
router.delete('/cart', verifyToken, usercontrollers.emptyCart);

// Route POST pour appliquer un coupon au panier de l'utilisateur
router.post('/apply-coupon', verifyToken, usercontrollers.applyCoupon);

// Route POST pour créer une commande
router.post('/orders', verifyToken, usercontrollers.createOrder);

// Route GET pour récupérer les commandes de l'utilisateur
router.get('/orders', verifyToken, usercontrollers.getOrders);

// Route GET pour récupérer toutes les commandes
router.get('/all-orders', verifyToken, usercontrollers.getAllOrders);

// Route GET pour récupérer les commandes d'un utilisateur spécifique
router.get('/orders/:id', verifyToken, usercontrollers.getOrderByUserId);

// Route PUT pour mettre à jour le statut d'une commande
router.put('/orders/:id', verifyToken, usercontrollers.updateOrderStatus);

module.exports = router;
