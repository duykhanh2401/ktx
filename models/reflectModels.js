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

const Category = mongoose.model('Reflect', reflectSchema);
module.exports = Category;
