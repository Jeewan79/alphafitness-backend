const mongoose = require('mongoose');

const InstructorSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	salary: {
		basic: {
			type: Number
		},
		ot: {
			type: Number
		},
		bonus: {
			type: Number
		}
	},
	customers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

module.exports = mongoose.model('Instructor', InstructorSchema);
