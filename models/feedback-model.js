const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	appearance: {
		type: Number,
		require: 5
	},
	quality: {
		type: Number,
		require: 5
	},
	overall: {
		type: Number,
		require: 5
	},
	date: {
		type: Date
	}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
