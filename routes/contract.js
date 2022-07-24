const router = require('express').Router();
const contractController = require(`${__dirname}/../controllers/contractController`);

router
	.route('/')
	.get(contractController.getAllContracts)
	.post(contractController.createContract);

router
	.route('/:id')
	.get(contractController.getContract)
	.patch(contractController.updateContract)
	.delete(contractController.deleteContract);

module.exports = router;
