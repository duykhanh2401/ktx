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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate

const Category = mongoose.model('Building', buildingSchema);
module.exports = Category;
