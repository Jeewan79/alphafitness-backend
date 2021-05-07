const express = require('express');
const {
	placeOrder,
	getAllOrders,
	getOrdersByUser
} = require('../controllers/order-controller');
const AdminAuthentication = require('../middleware/AdminAuthentication');
const Authentication = require('../middleware/Authentication');

const router = express.Router();

router.post('/', Authentication, placeOrder);
router.get('/all', AdminAuthentication, getAllOrders);
router.get('/', Authentication, getOrdersByUser);
module.exports = router;
