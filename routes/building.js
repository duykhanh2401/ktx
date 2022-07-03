const router = require('express').Router();
const buildingController = require(`${__dirname}/../controllers/buildingController`);

router
	.route('/')
	.get(buildingController.getAllCategories)
	.post(buildingController.createBuilding);

router
	.route('/:id')
	.get(buildingController.getBuilding)
	.patch(buildingController.updateBuilding)
	.delete(buildingController.deleteBuilding);

module.exports = router;
