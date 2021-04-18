const express = require('express');
const {
	getProgressByUser,
	addProgressReport,
	updateProgress,
	deleteProgress
} = require('../controllers/progress-controller');
const InstructorAuthentication = require('../middleware/InstructorAuthentication');

const router = express.Router();

router.get('/:id', getProgressByUser);
router.post('/', InstructorAuthentication, addProgressReport);
router.put('/update', InstructorAuthentication, updateProgress);
router.delete('/delete', InstructorAuthentication, deleteProgress);

module.exports = router;
