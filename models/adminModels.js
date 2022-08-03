const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const validator = require('validator');
const bcrypt = require('bcrypt');

mongoose.plugin(slug);

const adminSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên toà nhà'],
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
			default: new Date().toISOString(),
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
			select: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

adminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.correctPassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
