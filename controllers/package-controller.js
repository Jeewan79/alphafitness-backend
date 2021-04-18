const Package = require('../models/package-model');
const PackageCategory = require('../models/package-category-model');
const User = require('../models/user-model');

const getCategories = async (req, res, next) => {
	try {
		const categories = await PackageCategory.find();

		if (!categories) {
			return res.status(404).json({ msg: 'There is no categories yet' });
		}
		return res.status(200).json({ msg: 'categories found.', categories });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const assignPackageToUser = async (req, res, next) => {
	const { packageId, email } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				msg:
					'There is no user for this email. Please re check the email'
			});
		}

		user.package = packageId;
		await user.save();

		return res.status(200).json({ msg: 'package changed successfully' });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const addCategory = async (req, res, next) => {
	const { name } = req.body;
	const adminId = req.user.id;

	try {
		const category = new PackageCategory({
			name,
			createdBy: adminId,
			createdDate: Date.now()
		});
		await category.save();

		return res
			.status(201)
			.json({ msg: 'Type created successfully', category });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateCategory = async (req, res, next) => {
	const { id, name } = req.body;
	id;
	try {
		let category = await PackageCategory.findById(id);
		if (!category) {
			return res
				.status(404)
				.json({ msg: 'There is no category for this id' });
		}

		category.name = name;
		await category.save();

		return res
			.status(201)
			.json({ msg: 'Category updated successfully', category });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const deleteCategory = async (req, res, next) => {
	const { id } = req.body;

	try {
		let packages = await Package.find({ category: id });

		if (packages.length > 0) {
			return res.status(400).json({
				msg:
					'There are packages that use this category. please change them before deleting this category'
			});
		}
		let category = await PackageCategory.findById(id);
		if (!category) {
			return res
				.status(404)
				.json({ msg: 'There is no category for this id' });
		}

		await category.remove();

		return res.status(201).json({ msg: 'Category removed successfully' });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const getPackages = async (req, res, next) => {
	try {
		const packages = await Package.find().populate('category');

		if (!packages) {
			return res.status(404).json({ msg: 'There is no packages yet' });
		}
		return res.status(200).json({ msg: 'packages found.', packages });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const getPakcageById = async (req, res, next) => {
	const packId = req.params.id;
	let package;
	try {
		package = await Package.findById(packId);

		if (!package) {
			return res.status(404).json({ msg: 'Cannot find the package' });
		}
		return res.status(200).json({ msg: 'package found', package });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const createPackage = async (req, res, next) => {
	const { name, description, price, categoryId } = req.body;

	try {
		const category = await PackageCategory.findById(categoryId);
		if (!category) {
			return res
				.status(404)
				.json({ msg: 'There is no category for this id' });
		}
		let package = new Package({
			name,
			description,
			price,
			category: categoryId
		});

		await package.save();

		return res.status(201).json({ msg: 'package created', package });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updatePackage = async (req, res, next) => {
	const { name, description, price, categoryId, packageId } = req.body;
	try {
		const package = await Package.findById(packageId);
		if (!package) {
			return res
				.status(404)
				.json({ msg: 'There is no package for this id' });
		}

		package.name = name;
		package.description = description;
		package.price = price;
		package.categorie = categoryId;

		await package.save();

		return res.status(201).json({ msg: 'package updated', package });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const deletePackage = async (req, res, next) => {
	const { id } = req.body;

	try {
		const user = await User.find({ package: id });
		if (user.length > 0) {
			return res.status(400).json({
				msg:
					'There are users that use have this package. please change them before deleting this package'
			});
		}

		let package = await Package.findById(id);
		if (!package) {
			return res
				.status(404)
				.json({ msg: 'There is no package for this id' });
		}

		await package.remove();

		return res.status(201).json({ msg: 'package removed successfully' });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

exports.getCategories = getCategories;

exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;

exports.getPackages = getPackages;
exports.getPakcageById = getPakcageById;
exports.createPackage = createPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;

exports.assignPackageToUser = assignPackageToUser;
