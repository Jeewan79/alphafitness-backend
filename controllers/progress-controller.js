const Progress = require('../models/progress-model');
const User = require('../models/user-model');

const getProgressByUser = async (req, res, next) => {
	const userId = req.params.id;

	try {
		const progress = await Progress.find({ user: userId })
			.sort({
				date: -1
			})
			.populate('instructor');

		if (progress.length === 0) {
			return res
				.status(404)
				.json({ msg: 'No progress report for this user yet' });
		}
		return res.status(200).json({ msg: 'progress found', progress });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const addProgressReport = async (req, res, next) => {
	const {
		userId,
		height,
		weight,
		bicep,
		thigh,
		hips,
		chest,
		arm,
		shoulder,
		bmi
	} = req.body;
	const insId = req.user.id;
	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ msg: 'No user found for this id' });
		}
		let newProgress = new Progress({
			user: userId,
			height,
			weight,
			bicep,
			thigh,
			hips,
			chest,
			arm,
			shoulder,
			bmi,
			instructor: insId
		});

		await newProgress.save();
		// user.progress.unshift(newProgress);
		// await user.save();

		return res
			.status(201)
			.json({ msg: 'new progress added to the user', newProgress });
	} catch (err) {
		err;
		return res.status(500).json({ msg: err });
	}
};

const deleteProgress = async (req, res, next) => {
	const { progressId } = req.body;
	try {
		let progress = await Progress.findById(progressId);
		if (!progress) {
			return res.status(404).json({
				msg:
					'No progress report found for this id, progress might be deleted'
			});
		}
		await progress.remove();
		return res.status(200).json({
			msg: 'progress removed successfully'
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const updateProgress = async (req, res, next) => {
	const {
		progressId,
		height,
		weight,
		bicep,
		thigh,
		hips,
		chest,
		arm,
		shoulder,
		bmi
	} = req.body;
	try {
		let progress = await Progress.findById(progressId);
		if (!progress) {
			return res.status(404).json({
				msg:
					'No progress report found for this id, progress might be deleted'
			});
		}

		progress.height = height;
		progress.weight = weight;
		progress.bicep = bicep;
		progress.thigh = thigh;
		progress.hips = hips;
		progress.arm = arm;
		progress.chest = chest;
		progress.shoulder = shoulder;
		progress.bmi = bmi;

		await progress.save();
		return res.status(200).json({ msg: 'progress updated', progress });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

exports.deleteProgress = deleteProgress;
exports.updateProgress = updateProgress;
exports.addProgressReport = addProgressReport;
exports.getProgressByUser = getProgressByUser;
