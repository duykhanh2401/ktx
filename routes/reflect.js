const router = require('express').Router();
const reflectController = require('../controllers/reflectController');
const authController = require('../controllers/authController');

router
	.route('/')
	.get(authController.protectAdmin, reflectController.getAllReflects)
	.post(authController.protect, reflectController.createReflect);

router
	.route('/:id')
	.get(authController.protect, reflectController.getAllReflectsStudent)
	.patch(authController.protectAdmin, reflectController.updateReflect)
	.delete(authController.protectAdmin, reflectController.deleteReflect);

module.exports = router;
