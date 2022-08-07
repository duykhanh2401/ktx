const router = require('express').Router();
const contractController = require(`${__dirname}/../controllers/contractController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.get(
	'/student',
	authController.protect,
	contractController.getAllContractsStudent,
);

router.use(authController.protectAdmin);
router
	.route('/')
	.get(contractController.getAllContracts)
	.post(contractController.createContract);

router.post(
	'/extend',

	contractController.extendContract,
);
router
	.route('/:id')
	.get(contractController.getContract)
	.patch(contractController.updateContract)
	.delete(contractController.deleteContract);

module.exports = router;
