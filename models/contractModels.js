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
		info: {
			type: String,
			default: 'Hợp đồng',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

contractSchema.virtual('status').get(function () {
	return this.dueDate - Date.now() > 0 ? true : false;
});

contractSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'admin',
	}).populate({
		path: 'student',
	});

	next();
});

const Category = mongoose.model('Contract', contractSchema);
module.exports = Category;
