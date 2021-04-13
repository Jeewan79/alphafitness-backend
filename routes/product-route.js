const express = require('express');
const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getCategories,
	getCategoryById,
	addCategory,
	updateCategory,
	deleteCategory,
	getBrands,
	addBrand,
	updateBrand,
	deleteBrand,
	getOptions
} = require('../controllers/product-controller');
const adminAuth = require('../middleware/AdminAuthentication');

const router = express.Router();

//product category routes.
router.get('/category', getCategories);
router.get('/category/:id', getCategoryById);
router.post('/category', adminAuth, addCategory);
router.put('/category/update', adminAuth, updateCategory);
router.delete('/category/delete', adminAuth, deleteCategory);

//brnad routes
router.put('/brand/update', adminAuth, updateBrand);
router.get('/brand', getBrands);
router.post('/brand', adminAuth, addBrand);
router.delete('/brand/delete', adminAuth, deleteBrand);
router.get('/options', getOptions);
//product routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', adminAuth, createProduct);
router.put('/update', adminAuth, updateProduct);
router.delete('/delete', adminAuth, deleteProduct);

module.exports = router;
