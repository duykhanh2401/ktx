const router = require('express').Router();
const adminController = require(`../controllers/adminController`);
const authController = require(`../controllers/authController`);

router.post('/login', authController.login);
router.get('/login', adminController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

router.post('/updateMyPassword', authController.updateMyPassword);
router.post('/updateMe', adminController.updateMe);
router.get('/me', adminController.getMe, adminController.getAdmin);
router.delete('/deleteMe', adminController.deleteMe);

router.get('/student', adminController.getStudent);
router.get('/building', adminController.getBuilding);
router.get('/room', adminController.getRoom);

router
	.route('/')
	.get(adminController.getAllAdmins)
	.post(adminController.createAdmin);

router
	.route('/:id')
	.get(adminController.getAdmin)
	.patch(adminController.updateAdmin)
	.delete(adminController.deleteAdmin);

module.exports = router;
