const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	image: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	baseqty: {
		type: Number,
		require: true
	},
	qty: {
		type: Number,
		require: true
	},
	smallDescription: {
		type: String,
		require: true
	},
	description: {
		type: String
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductCategory'
	},
	brand: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductBrand'
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Product', ProductSchema);
