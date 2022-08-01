const router = require('express').Router();
const contractController = require(`${__dirname}/../controllers/contractController`);
const authController = require(`${__dirname}/../controllers/authController`);

router
	.route('/')
	.get(contractController.getAllContracts)
	.post(authController.protectAdmin, contractController.createContract);

router.post(
	'/extend',
	authController.protectAdmin,
	contractController.extendContract,
);
router
	.route('/:id')
	.get(contractController.getContract)
	.patch(authController.protectAdmin, contractController.updateContract)
	.delete(authController.protectAdmin, contractController.deleteContract);

module.exports = router;
