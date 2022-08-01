const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const waterSchema = mongoose.Schema(
	{
		startNumber: {
			type: 'Number',
			default: 0,
		},
		endNumber: {
			type: 'Number',
			required: [true, 'Vui lòng nhập chỉ số mới'],
		},
		total: Number,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate

const Water = mongoose.model('Water', waterSchema);
module.exports = Water;
