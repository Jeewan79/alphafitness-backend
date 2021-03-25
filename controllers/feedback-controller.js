const Feedback = require('../models/feedback-model');

const addFeedback = async (req, res, next) => {
	const { appearance, quality, overall } = req.body;
	const userId = req.user.id;

	try {
		let feedback = new Feedback({
			user: userId,
			appearance,
			quality,
			overall,
			date: Date.now()
		});

		await feedback.save();

		return res
			.status(201)
			.json({ msg: 'feedback created successfully', feedback });
	} catch {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateFeedback = async (req, res, next) => {
	const { feedbackId, appearance, quality, overall } = req.body;
	const userId = req.user.id;

	let feedback;
	try {
		feedback = await Feedback.findById(feedbackId);
		if (!feedback) {
			return res
				.status(404)
				.json({ msg: 'Cannot find a feedback for this id' });
		}
		if (feedback.user != userId) {
			return res.status(404).json({
				msg: "You don't have access to perform this task"
			});
		}
		feedback.appearance = appearance;
		feedback.quality = quality;
		feedback.overall = overall;

		await feedback.save();

		return res
			.status(200)
			.json({ msg: 'feedback updated successfully', feedback });
	} catch {
		return res.status(500).json({
			msg: err
		});
	}
};

const deleteFeedback = async (req, res, next) => {
	const { feedbackId } = req.body;
	const userId = req.user.id;

	let feedback;
	try {
		feedback = await Feedback.findById(feedbackId);
		if (!feedback) {
			return res
				.status(404)
				.json({ msg: 'Cannot find a feedback for this id' });
		}
		if (feedback.user != userId) {
			return res.status(404).json({
				msg: "You don't have access to perform this task"
			});
		}
		await feedback.remove();

		return res.status(200).json({ msg: 'feedback removed successfully' });
	} catch {
		return res.status(500).json({
			msg: err
		});
	}
};
exports.addFeedback = addFeedback;
exports.updateFeedback = updateFeedback;
exports.deleteFeedback = deleteFeedback;
