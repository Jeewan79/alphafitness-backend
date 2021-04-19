const express = require('express');
const {
	login,
	addUser,
	promoteUser,

	updateUser,
	getUsers,
	deleteCustomer,
	uploadProfilePic
} = require('../controllers/user-controller');
const adminAuth = require('../middleware/AdminAuthentication');
const Authentication = require('../middleware/Authentication');
const instructorAuth = require('../middleware/InstructorAuthentication');
const router = express.Router();

router.get('/', getUsers);
router.post('/login', login);
// router.post('/', signUp); admin register
router.post('/create', adminAuth, addUser);
router.post('/promote', adminAuth, promoteUser);

router.put('/update', adminAuth, updateUser);
router.put('/profilepic', Authentication, uploadProfilePic);
router.delete('/delete', adminAuth, deleteCustomer);

module.exports = router;
