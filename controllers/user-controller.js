const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ msg: 'No user found for this email' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				msg: 'Email and password does not match'
			});
		}
		const data = {
			user: {
				id: user.id,
				role: user.role
			}
		};

		jwt.sign(data, 'alphafitness', { expiresIn: 360000 }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token,
				firstName: user.firstName,
				lastName: user.lastName,
				id: user.id,
				role: user.role
			});
		});
	} catch (error) {
		return res.status(500).json({
			error: err
		});
	}
};

const addUser = async (req, res, next) => {
	const {
		email,
		password,
		firstName,
		lastName,
		address,
		age,
		mobile,
		userRole
	} = req.body;
	const adminId = req.user.id;
	const role = req.user.role;
	console.log(userRole);
	if (role != 'admin') {
		return res.status(403).json({
			msg: "You don't have access to perform this action"
		});
	} else {
		if (
			userRole == 'user' ||
			userRole == 'instructor' ||
			userRole == 'admin'
		) {
			try {
				let user = await User.findOne({ email });
				if (user) {
					return res.status(404).json({
						msg:
							'This email is being used. please use a different email'
					});
				} else {
					user = new User({
						email,
						password,
						firstName,
						lastName,
						age,
						address,
						mobile,
						role: userRole
					});

					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(password, salt);

					await user.save();

					const data = {
						user: {
							firstName: user.firstName,
							id: user.id,
							role: user.role
						}
					};
					return res.status(201).json({
						msg: `user ${user.firstName} created as a ${userRole}`,
						data
					});
				}
			} catch (error) {
				return res.status(500).json({
					msg: err
				});
			}
		}
		return res.status(403).json({
			msg: 'No roles found, please select among user, admin or instructor'
		});
	}
};
const promoteUser = async (req, res, next) => {
	const { userId, promotingRole } = req.body;
	const adminId = req.user.id;
	const role = req.user.role;

	if (role != 'admin') {
		return res.status(403).json({
			msg: "You don't have access to perform this action"
		});
	} else {
		if (promotingRole == 'admin' || promotingRole == 'instructor') {
			try {
				let user = await User.findById(userId);
				if (!user) {
					return res.status(404).json({
						msg: "Can't find a user for this id"
					});
				} else {
					if (user.role == promotingRole) {
						return res.status(208).json({
							msg: `User is already an ${promotingRole}`
						});
					}

					user.role = promotingRole;
					user.promotedBy = adminId;
					user.promoteDate = Date.now();

					await user.save();

					delete user.password;
					return res.status(200).json({
						msg: `user ${user.firstName} promoted as an ${promotingRole}`,
						user
					});
				}
			} catch (error) {
				return res.status(500).json({
					msg: err
				});
			}
		}

		return res.status(403).json({
			msg: 'No roles found, please select among admin, or instructor'
		});
	}
};

// const signUp = async (req, res, next) => {
// 	const {
// 		email,
// 		password,
// 		firstName,
// 		lastName,
// 		address,
// 		age,
// 		mobile
// 	} = req.body;

// 	let user;
// 	try {
// 		user = new User({
// 			email,
// 			password,
// 			firstName,
// 			lastName,
// 			age,
// 			address,
// 			mobile,
// 			role: 'admin'
// 		});
// 		const salt = await bcrypt.genSalt(10);
// 		user.password = await bcrypt.hash(password, salt);

// 		await user.save();

// 		const data = {
// 			user: {
// 				id: user.id,
// 				role: user.role
// 			}
// 		};

// 		jwt.sign(data, 'alphafitness', { expiresIn: 360000 }, (err, token) => {
// 			if (err) throw err;
// 			return res.status(200).json({
// 				token,
// 				name: firstName,
// 				id: user.id,
// 				role: user.role
// 			});
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			error: err
// 		});
// 	}
// };

const validateEmail = (email) => {
	const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return emailRegexp.test(String(email).toLowerCase());
};

exports.login = login;
exports.addUser = addUser;
exports.promoteUser = promoteUser;
// exports.signUp = signUp;
