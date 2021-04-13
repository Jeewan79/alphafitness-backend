const Product = require('../models/product-model');
const ProductCategory = require('../models/product-category-model');
const Brand = require('../models/product-brands-model');
const Order = require('../models/order-model');

// Product category functions
// add
// update
// delete
// and filter categories
const getCategories = async (req, res, next) => {
	try {
		const categories = await ProductCategory.find().populate('createdBy');
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

const getCategoryById = async (req, res, next) => {
	const catId = req.params.id;
	let category;
	try {
		category = await ProductCategory.findById(catId);

		if (!category) {
			return res.status(404).json({ msg: 'Cannot find the category' });
		}
		return res.status(200).json({ msg: 'category found', category });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addCategory = async (req, res, next) => {
	const { name } = req.body;
	const adminId = req.user.id;

	try {
		const category = new ProductCategory({
			name,
			createdBy: adminId,
			createdDate: Date.now()
		});
		await category.save();

		return res
			.status(201)
			.json({ msg: 'Category created successfully', category });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateCategory = async (req, res, next) => {
	const { id, name } = req.body;

	try {
		let category = await ProductCategory.findById(id);
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
		let products = await Product.find({ category: id });

		if (products.length > 0) {
			return res.status(400).json({
				msg:
					'There are products that use this category. please change them before deleting this category'
			});
		}
		let category = await ProductCategory.findById(id);
		if (!category) {
			return res
				.status(404)
				.json({ msg: 'There is no category for this id' });
		}

		await category.remove();

		return res.status(200).json({ msg: 'Category removed successfully' });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

// Products
// create, update, delete products
const getProducts = async (req, res, next) => {
	try {
		const products = await Product.find()
			.populate('brand')
			.populate('category');

		if (!products) {
			return res.status(404).json({ msg: 'There is no products yet' });
		}
		return res.status(200).json({ msg: 'products found.', products });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const getProductById = async (req, res, next) => {
	const packId = req.params.id;
	let product;
	try {
		product = await Product.findById(packId)
			.populate('brand')
			.populate('category');

		if (!product) {
			return res.status(404).json({ msg: 'Cannot find the product' });
		}
		return res.status(200).json({ msg: 'product found', product });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const createProduct = async (req, res, next) => {
	const {
		name,
		smallDescription,
		description,
		price,
		qty,
		image,
		category,
		brand
	} = req.body;

	try {
		const cat = await ProductCategory.findById(category);
		if (!cat) {
			return res
				.status(404)
				.json({ msg: 'There is no category for this id' });
		}
		const brd = await Brand.findById(brand);
		if (!brd) {
			return res
				.status(404)
				.json({ msg: 'There is no brand for this id' });
		}
		let product = new Product({
			name,
			smallDescription,
			description,
			price,
			baseqty: qty,
			qty,
			image,
			category,
			brand,
			date: Date.now()
		});

		await product.save();

		return res.status(201).json({ msg: 'product created', product });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateProduct = async (req, res, next) => {
	const {
		productId,
		name,
		smallDescription,
		description,
		price,
		qty,
		image,
		category,
		brand
	} = req.body;
	try {
		const product = await Product.findById(productId);
		if (!product) {
			return res
				.status(404)
				.json({ msg: 'There is no product for this id' });
		}

		product.name = name;
		product.smallDescription = smallDescription;
		product.description = description;
		product.image = image;
		product.qty = qty;
		product.price = price;
		product.categorie = category;
		product.brand = brand;

		await product.save();

		return res.status(200).json({ msg: 'product updated', product });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const deleteProduct = async (req, res, next) => {
	const { id } = req.body;

	try {
		let product = await Product.findById(id);
		if (!product) {
			return res
				.status(404)
				.json({ msg: 'There is no product for this id' });
		}

		await Order.deleteMany({ product: id });

		await product.remove();

		return res.status(200).json({ msg: 'product removed successfully' });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

// Product brands
// create, update, delete product brands

const getBrands = async (req, res, next) => {
	try {
		const brands = await Brand.find().populate('createdBy');
		if (!brands) {
			return res.status(404).json({ msg: 'There is no brands yet' });
		}
		return res.status(200).json({ msg: 'brands found.', brands });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const addBrand = async (req, res, next) => {
	const { name } = req.body;
	const adminId = req.user.id;

	try {
		const brand = new Brand({
			name,
			createdBy: adminId,
			createdDate: Date.now()
		});
		await brand.save();

		return res
			.status(201)
			.json({ msg: 'brand created successfully', brand });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const updateBrand = async (req, res, next) => {
	const { id, name } = req.body;

	try {
		let brand = await Brand.findById(id);
		if (!brand) {
			return res
				.status(404)
				.json({ msg: 'There is no brand for this id' });
		}

		brand.name = name;
		await brand.save();

		return res
			.status(201)
			.json({ msg: 'brand updated successfully', brand });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

const deleteBrand = async (req, res, next) => {
	('delete');
	const { id } = req.body;

	try {
		let products = await Product.find({ brand: id });

		if (products.length > 0) {
			return res.status(400).json({
				msg:
					'There are products that use this brand. please change them before deleting this brand'
			});
		}
		let brand = await Brand.findById(id);
		if (!brand) {
			('b');
			return res
				.status(404)
				.json({ msg: 'There is no brand for this id' });
		}

		await brand.remove();

		return res.status(200).json({ msg: 'brand removed successfully' });
	} catch (err) {
		return res.status(500).json({
			msg: err
		});
	}
};

// get both categories and brands in one request to provide options in adding image
const getOptions = async (req, res, next) => {
	try {
		const categories = await ProductCategory.find();
		const brands = await Brand.find();

		return res.status(200).json({ msg: 'options', categories, brands });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;

exports.getBrands = getBrands;
exports.addBrand = addBrand;
exports.updateBrand = updateBrand;
exports.deleteBrand = deleteBrand;
exports.getOptions = getOptions;
