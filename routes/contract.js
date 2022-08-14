const router = require('express').Router();
const contractController = require('../controllers/contractController');
const authController = require('../controllers/authController');

router.get(
	'/student',
	authController.protect,
	contractController.getAllContractsStudent,
);

router.use(authController.protectAdmin);
router.get('/data', contractController.getAllContractsUpdate);
router.post('/data-dashboard', contractController.getDashboardData);

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
	.patch(contractController.cancelContract)
	.delete(contractController.deleteContract);

module.exports = router;
