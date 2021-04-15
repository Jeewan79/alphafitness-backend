const express = require('express');
const {
	getInstructors,
	getInstructorById,
	addInstructorSalary,
	updateInstructorSalary,
	addInstructor,
	deleteInstructor,
	addInstructorToUser
} = require('../controllers/instructor-controller');

const adminAuth = require('../middleware/AdminAuthentication');

const router = express.Router();
router.put('/assign', adminAuth, addInstructorToUser);
router.get('/', getInstructors);
router.post('/', adminAuth, addInstructor);
router.get('/:id', getInstructorById);
router.post('/salary', adminAuth, addInstructorSalary);
router.put('/update', adminAuth, updateInstructorSalary);
router.delete('/delete', adminAuth, deleteInstructor);

module.exports = router;
