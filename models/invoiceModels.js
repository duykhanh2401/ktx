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
			type: Number,
			min: 1,
			max: 12,
		},
		year: {
			type: Number,
		},
		status: {
			type: String,
			default: 'Chưa thanh toán',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

invoiceSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'electricity',
	}).populate({
		path: 'water',
	});

	next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
