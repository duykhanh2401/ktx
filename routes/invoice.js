const router = require('express').Router();
const invoiceController = require('../controllers/invoiceController');
const authController = require('../controllers/authController');

router
	.route('/')
	.get(invoiceController.getAllInvoice)
	.post(authController.protectAdmin, invoiceController.createInvoice);

router
	.route('/:id')
	.get(invoiceController.getInvoiceByRoom)
	.patch(authController.protectAdmin, invoiceController.updateInvoice);

module.exports = router;
