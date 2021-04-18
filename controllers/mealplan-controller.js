const Mealplan = require('../models/mealplan-model');
const User = require('../models/user-model');

const getMealplans = async (req, res, next) => {
	try {
		const plans = await Mealplan.find().populate('createdBy');
		if (!plans) {
			return res.status(404).json({ msg: 'No mealplans found' });
		}
		return res
			.status(200)
			.json({ msg: 'mealplans found', mealplans: plans });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const getMealplanById = async (req, res, next) => {
	const id = req.params.id;
	try {
		const plan = await Mealplan.findById(id).populate('createdBy', [
			'name'
		]);
		if (!plans) {
			return res.status(404).json({ msg: 'No mealplan found' });
		}
		return res.status(200).json({ msg: 'mealplan found', plan });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const addMealplan = async (req, res, next) => {
	const { name, description, category } = req.body;
	const insId = req.user.id;
	try {
		const newMealplan = new Mealplan({
			name,
			description,
			category,
			createdBy: insId
		});
		await newMealplan.save();
		return res
			.status(201)
			.json({ msg: 'new mealplan created', newMealplan });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const updateMealplan = async (req, res, next) => {
	const { planId, name, desription, category } = req.body;
	try {
		let mealplan = await Mealplan.findById(planId);
		if (!mealplan) {
			return res.status(404).json({ msg: 'No mealplan for this id' });
		}

		mealplan.name = name;
		mealplan.desription = desription;
		mealplan.category = category;

		await mealplan.save();
		return res
			.status(200)
			.json({ msg: 'Meal plan updated successfully', mealplan });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const deleteMealplan = async (req, res, next) => {
	const { planId } = req.body;

	try {
		let mealplan = await Mealplan.findById(planId);
		if (!mealplan) {
			return res.status(404).json({ msg: 'No mealplan for this id' });
		}

		let userCheck = await User.find({
			mealplans: { $in: planId }
		});
		if (userCheck.length > 0) {
			return res.status(400).json({
				msg:
					'There are some users using this meal plan. please change their meal plans before deleting this one'
			});
		}

		await mealplan.remove();
		return res.status(200).json({ msg: 'Mealplan removed successfully' });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const addMealplanToUser = async (req, res, next) => {
	const { userEmail, planId } = req.body;

	try {
		let user = await User.findOne({ email: userEmail });

		if (!user) {
			return res.status(404).json({ msg: 'No user for this email' });
		}

		let mealplan = await Mealplan.findById(planId);
		if (!mealplan) {
			return res.status(404).json({ msg: 'No mealplan for this id' });
		}

		if (user.mealplans.includes(planId)) {
			return res
				.status(200)
				.json({ msg: 'User already follows this meal plan' });
		}

		user.mealplans.unshift(mealplan);

		await user.save();
		return res
			.status(200)
			.json({ msg: 'Mealplan has been added successfully', user });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const removeMealplanFromUser = async (req, res, next) => {
	const { userId, planId } = req.body;
	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ msg: 'No user for this id' });
		}

		let mealplan = await Mealplan.findById(planId);
		if (!mealplan) {
			return res.status(404).json({ msg: 'No mealplan for this id' });
		}

		if (user.mealplans.includes(planId)) {
			let updatedUser = await User.updateOne(
				{
					_id: userId
				},
				{ $pull: { mealplans: planId } }
			);
			return res
				.status(200)
				.json({ msg: 'mealplan removed from the user', updatedUser });
		}

		return res
			.status(200)
			.json({ msg: 'User does not follow this mealplan' });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const getUsersMealplans = async (req, res, next) => {
	const id = req.params.id;
	try {
		const user = await User.findById(id).populate('mealplans');
		if (!user) {
			return res.status(404).json({ msg: 'No user for this id' });
		}
		return res
			.status(200)
			.json({ msg: 'Mealplans found', mealplans: user.mealplans });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

exports.getMealplans = getMealplans;
exports.getMealplanById = getMealplanById;
exports.addMealplan = addMealplan;
exports.updateMealplan = updateMealplan;
exports.deleteMealplan = deleteMealplan;
exports.addMealplanToUser = addMealplanToUser;
exports.removeMealplanFromUser = removeMealplanFromUser;
exports.getUsersMealplans = getUsersMealplans;
