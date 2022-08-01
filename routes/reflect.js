const router = require('express').Router();
const reflectController = require('../controllers/reflectController');
const authController = require('../controllers/authController');

router
	.route('/')
	.get(authController.protectAdmin, reflectController.getAllReflects)
	.post(reflectController.createReflect);

router
	.route('/:id')
	.get(reflectController.getReflect)
	.patch(authController.protectAdmin, reflectController.updateReflect)
	.delete(authController.protectAdmin, reflectController.deleteReflect);

module.exports = router;
