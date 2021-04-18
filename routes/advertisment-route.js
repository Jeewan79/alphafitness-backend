const express = require('express');
const {
	addAdvertisment,
	updateAdvertisment,
	deleteAdvertisment,
	getAdvertisments,
	getAdvertismentById,
	addComment
} = require('../controllers/advertisment-controller');
const auth = require('../middleware/Authentication');
const router = express.Router();

router.put('/comment', auth, addComment);
router.get('/ad/:id', getAdvertismentById);
router.get('/', getAdvertisments);
router.post('/', auth, addAdvertisment);
router.put('/update', auth, updateAdvertisment);
router.delete('/delete', auth, deleteAdvertisment);

module.exports = router;
