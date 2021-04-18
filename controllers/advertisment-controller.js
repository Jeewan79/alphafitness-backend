const Advertisment = require('../models/advertisment-model');
const Comment = require('../models/comment-model');

const getAdvertisments = async (req, res, next) => {
	try {
		const advertisments = await Advertisment.find()
			.populate('user')
			.populate({ path: 'comments', populate: { path: 'user' } });

		if (advertisments.length <= 0) {
			return res
				.status(404)
				.json({ msg: 'There is no advertisments yet' });
		}
		return res
			.status(200)
			.json({ msg: 'advertisments found.', advertisments });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const getAdvertismentById = async (req, res, next) => {
	const adId = req.params.id;
	let advertisment;
	try {
		advertisment = await Advertisment.findById(adId)
			.populate('user')
			.populate({ path: 'comments', populate: { path: 'user' } });

		if (!advertisment) {
			return res
				.status(404)
				.json({ msg: 'Cannot find the advertisment' });
		}
		return res
			.status(200)
			.json({ msg: 'advertisment found', advertisment });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addAdvertisment = async (req, res, next) => {
	const { title, image, description } = req.body;
	const userId = req.user.id;

	try {
		let advertisment = new Advertisment({
			user: userId,
			title,
			image,
			description
		});

		await advertisment.save();

		return res
			.status(200)
			.json({ msg: 'Advertisment created successfully', advertisment });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateAdvertisment = async (req, res, next) => {
	const { adId, title, image, description } = req.body;
	const userId = req.user.id;
	const role = req.user.role;
	let advertisment;

	try {
		advertisment = await Advertisment.findById(adId);
		if (!advertisment) {
			return res
				.status(404)
				.json({ msg: 'Cannot find a advertisment for this id' });
		}
		if (advertisment.user === userId || role === 'admin') {
			advertisment.title = title;
			advertisment.description = description;
			if (image) advertisment.image = image;

			await advertisment.save();

			return res.status(202).json({
				msg: 'Advertisment updated successfully',
				advertisment
			});
		}

		return res.status(404).json({
			msg: "You don't have access to perform this task"
		});
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const deleteAdvertisment = async (req, res, next) => {
	const { adId } = req.body;
	const userId = req.user.id;
	const userRole = req.user.role;

	try {
		let advertisment = await Advertisment.findById(adId);
		if (!advertisment) {
			return res
				.status(404)
				.json({ msg: 'Cannot find a advertisment for this id' });
		}
		if (advertisment.user == userId || userRole === 'admin') {
			await advertisment.remove();

			return res
				.status(200)
				.json({ msg: 'Advertisment removed successfully' });
		}

		return res.status(404).json({
			msg: "You don't have access to perform this task"
		});
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addComment = async (req, res, next) => {
	const { advertismentId, commentText } = req.body;
	const userId = req.user.id;

	let advertisment;
	try {
		advertisment = await Advertisment.findById(advertismentId);
		if (!advertisment) {
			return res.status(404).json({ msg: 'Cannot find a advertisment' });
		}

		let comment = new Comment({
			user: userId,
			advertismentId,
			comment: commentText,
			date: Date.now()
		});

		await comment.save();

		advertisment.comments.unshift(comment);
		await advertisment.save();

		return res
			.status(200)
			.json({ msg: 'comment added successfully', comment });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

//comment update delete

exports.addAdvertisment = addAdvertisment;
exports.updateAdvertisment = updateAdvertisment;
exports.deleteAdvertisment = deleteAdvertisment;
exports.getAdvertismentById = getAdvertismentById;
exports.getAdvertisments = getAdvertisments;
exports.addComment = addComment;
