const router = require('express').Router();
const cartController = require('../controllers/cartcontrollers'); // Assurez-vous que le nom du contrôleur est correct
const { verifyToken } = require('../middleware/verifyToken'); // Assurez-vous que le middleware est correctement importé

router.get('/find', verifyToken, cartController.getCart);
router.post('/', verifyToken, cartController.addCart);
router.delete('/:cartItem', verifyToken, cartController.deleteCartItem);

module.exports = router;
