const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const reflectSchema = mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.ObjectId,
			ref: 'Student',
			required: [true, 'Vui lòng nhập sinh viên'],
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
		status: {
			type: String,
			default: 'Mới tạo',
		},
		title: {
			type: String,
			required: [true, 'Vui lòng nhập tiêu đề'],
		},
		content: {
			type: String,
			required: [true, 'Vui lòng nhập nội dung'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

reflectSchema.virtual('status').get(function () {
	return this.dueDate - Date.now() > 0 ? true : false;
});

reflectSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'admin',
	}).populate({
		path: 'student',
	});

	next();
});

const Category = mongoose.model('Contract', reflectSchema);
module.exports = Category;
