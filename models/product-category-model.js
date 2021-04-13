const mongoose = require('mongoose');

const ProductCategorySchema = mongoose.Schema({
	name: {
		type: String,
		require: true
	},

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	createdDate: {
		type: Date
	}
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);
