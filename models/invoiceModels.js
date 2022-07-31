const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const invoiceSchema = mongoose.Schema(
	{
		room: {
			type: mongoose.Schema.ObjectId,
			ref: 'Room',
		},
		admin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Admin',
			required: [true, 'Vui lòng nhập quản lý'],
		},
		electricity: {
			type: mongoose.Schema.ObjectId,
			ref: 'Electricity',
			required: [true, 'Vui lòng nhập thông tin điện'],
		},
		water: {
			type: mongoose.Schema.ObjectId,
			ref: 'Water',
			required: [true, 'Vui lòng nhập thông tin nước'],
		},
		month: {
			type: 'Number',
			min: 1,
			max: 12,
		},
		year: {
			type: 'Number',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
