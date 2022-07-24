const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const validator = require('validator');

mongoose.plugin(slug);

const adminSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên toà nhà'],
			unique: true,
		},
		position: {
			type: String,
			required: [true, 'Vui lòng nhập vị trí'],
		},
		phone: {
			type: String,
			required: [true, 'Vui lòng  nhập số điện thoại'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		email: {
			type: String,
			required: [true, 'Vui lòng nhập email của bạn'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Đây không phải là email'],
		},
		password: {
			type: String,
			require: [true, 'Vui lòng nhập mật khẩu'],
			minLength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Vui lòng nhập lại mật khẩu'],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				messages: 'Vui lòng nhập mật khẩu giống nhau',
			},
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate

const Category = mongoose.model('Admin', adminSchema);
module.exports = Category;
