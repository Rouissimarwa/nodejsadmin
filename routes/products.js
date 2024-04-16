const router = require('express').Router();
const productController = require('../controllers/productController');

// Créer un nouveau produit
router.post('/', productController.createProduct);

// Récupérer tous les produits
router.get('/', productController.getAllProducts);

// Récupérer un produit par son ID
router.get('/:id', productController.getProduct);

// Rechercher des produits par mot-clé
router.get('/search/:key', productController.searchProducts);

// Mettre à jour un produit
router.put('/:id', productController.updateProduct);

// Supprimer un produit
router.delete('/:id', productController.deleteProduct);

// Ajouter un produit à la liste de souhaits
router.post('/wishlist', productController.addToWishlist);

// Noter un produit
router.post('/rating', productController.rating);

module.exports = router;
