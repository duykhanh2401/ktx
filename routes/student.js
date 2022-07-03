const router = require('express').Router();
const studentController = require(`${__dirname}/../controllers/studentController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

router.post(
	'/updateMyPassword',
	authController.protect,
	authController.updateMyPassword,
);
router.post('/updateMe', authController.protect, studentController.updateMe);
router.get(
	'/me',
	authController.protect,
	studentController.getMe,
	studentController.getStudent,
);
router.delete('/deleteMe', authController.protect, studentController.deleteMe);

router
	.route('/')
	.get(studentController.getAllStudents)
	.post(studentController.createStudent);

router
	.route('/:id')
	.get(studentController.getStudent)
	.patch(studentController.updateStudent)
	.delete(studentController.deleteStudent);

module.exports = router;
