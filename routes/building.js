const router = require('express').Router();
const buildingController = require('../controllers/buildingController');
const authController = require('../controllers/authController');

router.use(authController.protectAdmin);
router
	.route('/')
	.get(buildingController.getAllBuildings)
	.post(buildingController.createBuilding);

router
	.route('/:id')
	.get(buildingController.getBuilding)
	.patch(buildingController.updateBuilding)
	.delete(buildingController.deleteBuilding);

module.exports = router;
