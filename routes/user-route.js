const express = require('express');
const {
	login,

	addUser,
	promoteUser
} = require('../controllers/user-controller');
const adminAuth = require('../middleware/AdminAuthentication');

const router = express.Router();

router.post('/login', login);
// router.post('/', signUp);
router.post('/create', adminAuth, addUser);
router.post('/promote', adminAuth, promoteUser);

module.exports = router;
