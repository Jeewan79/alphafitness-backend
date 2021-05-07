const Product = require('../models/product-model');
const Order = require('../models/order-model');

const placeOrder = async (req, res, next) => {
	const { productId, qty, address } = req.body;
	const userId = req.user.id;
	let order;
	try {
		let product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				msg: 'No products found for this id, Order cannot be processed'
			});
		}

		if (product.qty < qty) {
			product.qty = 0;
			order = new Order({
				user: userId,
				product: productId,
				address,
				price: product.qty * product.price,
				qty: product.qty
			});
			await product.save();
			await order.save();
			return res.status(200).json({
				msg: `Product only have ${product.qty} items. Order proceessed with ${product.qty} items`,
				order
			});
		}
		product.qty = product.qty - qty;
		order = new Order({
			user: userId,
			product: productId,
			address,
			price: qty * product.price,
			qty: qty
		});
		await product.save();
		await order.save();
		return res.status(201).json({
			msg: `Order processed with ${qty} items`,
			order
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const getAllOrders = async (req, res, next) => {
	try {
		const orders = await Order.find().populate('product').populate('user');
		if (orders.length === 0) {
			return res.status(404).json({ msg: 'no orders yet' });
		}
		return res.status(200).json({ msg: 'Orders found', orders });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const getOrdersByUser = async (req, res, next) => {
	const userId = req.user.id;
	try {
		const orders = await Order.find({ user: userId }).populate('product');
		if (orders.length === 0) {
			return res.status(404).json({ msg: 'no orders yet' });
		}
		return res.status(200).json({ msg: 'Orders found', orders });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};
exports.placeOrder = placeOrder;
exports.getAllOrders = getAllOrders;
exports.getOrdersByUser = getOrdersByUser;
