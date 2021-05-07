const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	},
	price: {
		type: Number,
		require: true
	},
	address: {
		type: String
	},
	qty: {
		type: Number,
		require: true
	},
	purchaseDate: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Order', OrderSchema);
