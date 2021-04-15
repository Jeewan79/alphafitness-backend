const Instructor = require('../models/instructor-model');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

const getInstructors = async (req, res, next) => {
	try {
		const instructors = await Instructor.find()
			.populate('user')
			.populate('customers');
		if (!instructors) {
			return res
				.status(404)
				.json({ msg: 'No instuctors found at the moment' });
		}

		return res
			.status(200)
			.json({ msg: 'Successfully found instructors', instructors });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addInstructor = async (req, res, next) => {
	const {
		email,
		image,
		password,
		firstName,
		lastName,
		address,
		gender,
		age,
		mobile
	} = req.body;

	email;
	let user;
	try {
		user = await User.findOne({ email });
		if (user) {
			return res.status(404).json({
				msg: 'This email is being used. please use a different email'
			});
		}
		user = new User({
			email,
			image: image
				? image
				: 'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg',
			password,
			firstName,
			lastName,
			age,
			address,
			mobile,
			gender,
			role: 'instructor'
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();
		let insSalary = new Instructor({
			user: user._id,
			salary: {
				basic: 0,
				ot: 0,
				bonus: 0
			}
		});

		await insSalary.save();
		const data = {
			user: {
				firstName: user.firstName,
				id: user.id,
				role: user.role
			}
		};
		return res.status(201).json({
			msg: `${firstName} created as an Instructor`,
			data
		});
	} catch (err) {
		err;
		return res.status(500).json({
			msg: err
		});
	}
};

const getInstructorById = async (req, res, next) => {
	const instructorId = req.params.id;
	try {
		let instructor = await Instructor.findOne({
			user: instructorId
		}).populate('user');
		if (!instructor) {
			return res
				.status(404)
				.json({ msg: 'There is no instructor for this id' });
		}

		return res.status(200).json({ msg: 'instructor found', instructor });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addInstructorSalary = async (req, res, next) => {
	const { id, basic, ot, bonus } = req.body;
	let instructor;
	try {
		instructor = await Instructor.findOne({ user: id });
		if (!instructor) {
			return res
				.status(404)
				.json({ msg: 'There is no instructor for this id' });
		}

		instructor.salary.basic = basic;
		instructor.salary.ot = ot;
		instructor.salary.bonus = bonus;

		await instructor.save();
		return res
			.status(200)
			.json({ msg: 'salary added successfully', instructor });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateInstructorSalary = async (req, res, next) => {
	const { id, basic, ot, bonus } = req.body;
	let instructor;
	try {
		instructor = await Instructor.findOne({ user: id }).populate('user');
		if (!instructor) {
			return res
				.status(404)
				.json({ msg: 'There is no instructor for this id' });
		}

		instructor.salary.basic = basic;
		instructor.salary.ot = ot;
		instructor.salary.bonus = bonus;

		await instructor.save();
		return res
			.status(200)
			.json({ msg: 'salary updated successfully', instructor });
	} catch (err) {
		err;
		return res.status(500).json({
			msg: err
		});
	}
};

//delete instructor
const deleteInstructor = async (req, res, next) => {
	const { insId } = req.body;

	let instructor;
	try {
		instructor = await User.findById(insId);
		if (!instructor) {
			return res.status(404).json({
				msg:
					'No instructor found, instructor already deleted or never exited'
			});
		}
		let users = await User.find({ instructor: insId });
		if (users.length > 0) {
			return res.status(404).json({
				msg:
					'There are customers assign to this instructor, please change before deleting'
			});
		}
		await Instructor.deleteMany({ user: insId });
		await instructor.remove();

		return res.status(200).json({ msg: 'instructor removed successfully' });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const addInstructorToUser = async (req, res, next) => {
	const { userEmail, instructorId } = req.body;

	try {
		let user = await User.findOne({ email: userEmail });
		if (!user) {
			return res.status(404).json({
				msg: "Can't find a user for this email address, please recheck"
			});
		}
		let instructor = await Instructor.findOne({
			user: instructorId
		}).populate('user');

		if (!instructor) {
			return res.status(404).json({
				msg: "Can't find a instructor for this id"
			});
		}

		if (user.role != 'user') {
			return res.status(400).json({
				msg: 'Instructors can be assigned only to customers'
			});
		}

		if (instructor.user.role != 'instructor') {
			return res.status(400).json({
				msg: 'Only Instructors can be assigned  to customers'
			});
		}

		user.instructor = instructorId;
		let found = false;
		instructor.customers.forEach((cus) => {
			if (cus == user.id) {
				found = true;
			}
		});

		if (found) {
			return res.status(200).json({
				msg: 'User already assigned to this instructor'
			});
		}
		instructor.customers.unshift(user);
		await instructor.save();
		await user.save();
		return res
			.status(200)
			.json({ msg: 'Instructor has been added to the user', user });
	} catch (err) {
		err;
		return res.status(500).json({
			msg: err
		});
	}
};

exports.getInstructors = getInstructors;
exports.getInstructorById = getInstructorById;
exports.addInstructorSalary = addInstructorSalary;
exports.updateInstructorSalary = updateInstructorSalary;
exports.addInstructor = addInstructor;
exports.deleteInstructor = deleteInstructor;
exports.addInstructorToUser = addInstructorToUser;
