const mongoose = require('mongoose');

const PackageSchema = mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	price: {
		type: Number
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PackageCategory'
	}
});

module.exports = mongoose.model('Package', PackageSchema);
