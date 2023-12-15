const router = require('express').Router();
const { createOrder, getOrder, getOrders } = require('../controllers/order.Controller');
const { protect } = require('../middleware/protect');

// Create a new order
router.route('/createOrder/:userId').post(createOrder);

// Get all orders
router.route('/getOrder').get(protect, getOrders);

// Get a single order by ID
router.route('/orders/:orderId').get(protect, getOrder);


module.exports = router;
