const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const roomSchema = mongoose.Schema(
	{
		building: {
			type: mongoose.Schema.ObjectId,
			ref: 'Building',
			required: [true, 'Vui lòng nhập toà nhà'],
		},
		roomNumber: {
			type: String,
			required: [true, 'Vui lòng nhập số phòng'],
		},
		maxStudent: {
			type: Number,
			required: [true, 'Vui lòng nhập số lượng sinh viên'],
		},
		presentStudent: {
			type: Number,
			default: 0,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate
roomSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'building',
	});

	next();
});

const Category = mongoose.model('Room', roomSchema);
module.exports = Category;
