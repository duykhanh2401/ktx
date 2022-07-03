const router = require('express').Router();
const roomController = require(`${__dirname}/../controllers/roomController`);

router
	.route('/')
	.get(roomController.getAllCategories)
	.post(roomController.createRoom);

router
	.route('/:id')
	.get(roomController.getRoom)
	.patch(roomController.updateRoom)
	.delete(roomController.deleteRoom);

module.exports = router;
