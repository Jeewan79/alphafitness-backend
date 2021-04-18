const express = require('express');
const {
	getMealplans,
	getMealplanById,
	addMealplan,
	updateMealplan,
	deleteMealplan,
	addMealplanToUser,
	removeMealplanFromUser,
	getUsersMealplans
} = require('../controllers/mealplan-controller');
const InstructorAuthentication = require('../middleware/InstructorAuthentication');

const router = express.Router();
router.get('/:id', getUsersMealplans);
router.get('/', getMealplans);
router.get('/plan/:id', getMealplanById);
router.post('/', InstructorAuthentication, addMealplan);
router.put('/update', InstructorAuthentication, updateMealplan);
router.delete('/delete', InstructorAuthentication, deleteMealplan);
router.put('/add', InstructorAuthentication, addMealplanToUser);
router.delete('/remove', InstructorAuthentication, removeMealplanFromUser);

module.exports = router;
