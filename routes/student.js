const router = require('express').Router();
const studentController = require(`../controllers/studentController`);
const authController = require(`../controllers/authController`);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/updateMyPassword', authController.updateMyPassword);
router.post('/updateMe', studentController.updateMe);
router.get('/me', studentController.getMe, studentController.getStudent);

router.use(authController.protectAdmin);
router.get('/no-room', studentController.getStudentNoRoom);

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
