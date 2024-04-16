const router = require('express').Router();
const orderControllers = require('../controllers/ordercontrollers'); // "orderControllers" au lieu de "ordercontrollers"
const { verifyToken } = require('../middleware/verifyToken'); // "verifyToken" au lieu de "verifytoken"

// Utilisez le middleware verifyToken dans vos routes
router.get('/', verifyToken, orderControllers.getUserOrders); // "orderControllers" au lieu de "ordercontrollers"

module.exports = router;
