const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const buildingSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên toà nhà'],
			unique: true,
		},
		numberOfRooms: Number,
		unitPrice: String,
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

// Virtual populate

buildingSchema.virtual('presentRoom', {
	ref: 'Room',
	localField: '_id',
	foreignField: 'building',
	justOne: false,
	count: true,
});

const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;
