const router = require('express').Router();
const invoiceController = require('../controllers/invoiceController');

router
	.route('/')
	.get(invoiceController.getAllInvoice)
	.post(invoiceController.createInvoice);

router
	.route('/:id')
	.get(invoiceController.getInvoiceByRoom)
	.patch(invoiceController.updateInvoice);

module.exports = router;
