const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	firstName: {
		type: String,
		require: true
	},
	lastName: {
		type: String,
		require: true
	},
	address: {
		type: String
	},
	age: {
		type: Number
	},
	mobile: {
		type: String
	},
	role: {
		type: String,
		default: 'user'
	},
	promotedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	promotedDate: {
		type: Date
	}
});

module.exports = mongoose.model('User', UserSchema);
