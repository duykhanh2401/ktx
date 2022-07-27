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
		// presentStudent: {
		// 	type: Number,
		// 	default: 0,
		// },
		createdAt: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			default: 'active',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

roomSchema.index({ building: 1, roomNumber: 1 }, { unique: true });

roomSchema.virtual('presentStudent', {
	ref: 'Student',
	localField: '_id',
	foreignField: 'room',
	justOne: false,
	count: true,
});

// Virtual populate
roomSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'building',
	}).populate({
		path: 'presentStudent',
	});

	next();
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
