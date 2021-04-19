const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		require: true
	},
	image: {
		type: String,
		default:
			'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg'
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
	gender: {
		type: String,
		default: 'Male'
	},
	package: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Package'
	},
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	role: {
		type: String,
		default: 'user'
	},
	workouts: [
		{
			workout: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Workout'
			},
			day: {
				type: Number
			}
		}
	],
	mealplans: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Mealplan'
		}
	],
	promotedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	promotedDate: {
		type: Date
	}
});

module.exports = mongoose.model('User', UserSchema);
