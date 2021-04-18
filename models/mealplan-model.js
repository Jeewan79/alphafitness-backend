const mongoose = require('mongoose');

const MealplanSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	category: {
		type: String
	}
});

module.exports = mongoose.model('Mealplan', MealplanSchema);
