const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Name, Email, Password , PasswordConfirm, IMG, PhoneNumber, Address, Role.
const studentSchema = mongoose.Schema(
	{
		studentID: {
			type: String,
			unique: true,
			required: [true, 'Vui lòng nhập mã số sinh viên'],
		},
		name: {
			type: String,
			require: [true, 'Vui lòng nhập tên của bạn'],
		},
		password: {
			type: String,
			select: false,
		},
		passwordConfirm: {
			type: String,
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				messages: 'Vui lòng nhập mật khẩu giống nhau',
			},
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},

		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		image: String,
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: [true, 'Vui lòng nhập giới tính'],
		},
		dateOfBirth: {
			type: String,
			required: [true, 'Vui lòng nhập ngày sinh'],
		},
		class: {
			type: String,
			required: [true, 'Vui lòng nhập lớp'],
		},
		address: {
			type: String,
			required: [true, 'Vui lòng nhập địa chỉ'],
		},
		academic: { type: Number, required: true },
		father: { type: String, required: [true, 'Vui lòng nhập tên bố'] },
		mother: { type: String, required: [true, 'Vui lòng nhập tên mẹ'] },
		room: {
			type: mongoose.Schema.ObjectId,
			ref: 'Room',
		},
		discipline: {
			type: Boolean,
			default: false,
		},
		note: String,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

studentSchema.virtual('contract', {
	ref: 'Contract',
	localField: '_id',
	foreignField: 'student',
});

studentSchema.virtual('allContract', {
	ref: 'Contract',
	localField: '_id',
	foreignField: 'student',
});

studentSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
});

// Cập nhật giờ thay đổi mật khẩu
studentSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangeAt = Date.now() - 1000;
	next();
});

studentSchema.pre(/^find/, async function (next) {
	this.find({ active: { $ne: false } });
	next();
});

//Check Password
studentSchema.methods.correctPassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
