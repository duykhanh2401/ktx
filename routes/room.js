const router = require('express').Router();
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');

router.use(authController.protectAdmin);
router.post('/addStudent', roomController.addStudent);
router.post('/removeStudent', roomController.removeStudent);

router
	.route('/')
	.get(roomController.getAllRooms)
	.post(roomController.createRoom);

router
	.route('/:id')
	.get(roomController.getRoom)
	.patch(roomController.updateRoom)
	.delete(roomController.deleteRoom);

module.exports = router;
