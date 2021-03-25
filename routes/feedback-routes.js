const express = require('express');
const {
	addFeedback,
	updateFeedback,
	deleteFeedback
} = require('../controllers/feedback-controller');
const auth = require('../middleware/Authentication');
const router = express.Router();

router.post('/', auth, addFeedback);
router.put('/update', auth, updateFeedback);
router.delete('/delete', auth, deleteFeedback);

module.exports = router;
