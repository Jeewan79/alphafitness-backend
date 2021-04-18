const mongoose = require('mongoose');

const ProgressSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date.now()
	},
	height: {
		type: Number
	},
	weight: {
		type: Number
	},
	bicep: {
		type: Number
	},
	thigh: {
		type: Number
	},
	hips: {
		type: Number
	},
	chest: {
		type: Number
	},
	arm: {
		type: Number
	},
	shoulder: {
		type: Number
	},
	bmi: {
		type: Number
	},
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Progress', ProgressSchema);
