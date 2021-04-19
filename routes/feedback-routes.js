const express = require('express');
const {
	addFeedback,
	updateFeedback,
	deleteFeedback,
	getFeedbacks,
	getFeedbackById
} = require('../controllers/feedback-controller');

const auth = require('../middleware/Authentication');
const router = express.Router();

router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', auth, addFeedback);
router.put('/update', auth, updateFeedback);
router.delete('/delete', auth, deleteFeedback);

module.exports = router;
