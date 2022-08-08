const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const contractSchema = mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.ObjectId,
			ref: 'Student',
			required: [true, 'Vui lòng nhập sinh viên'],
		},
		startDate: {
			type: Date,
			required: [true, 'Vui lòng nhập ngày bắt đầu'],
		},
		dueDate: {
			type: Date,
			required: [true, 'Vui lòng nhập ngày kết thúc'],
		},
		admin: {
			type: mongoose.Schema.ObjectId,
			ref: 'Admin',
			required: [true, 'Vui lòng nhập quản lý'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		isCancel: {
			type: String,
			enum: ['cancel', 'discipline'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

contractSchema.virtual('status').get(function () {
	const today = Date.now();
	if (this.isCancel == 'cancel') {
		return 'cancel';
	} else if (this.isCancel == 'discipline') {
		return 'discipline';
	} else if (this.startDate < today && today < this.dueDate) {
		return 'active';
	} else if (this.startDate > today) {
		return 'extend';
	} else if (this.dueDate < today) {
		return 'inactive';
	}
});

contractSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'admin',
	});

	next();
});

const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;
