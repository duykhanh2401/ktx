const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const electricitySchema = mongoose.Schema(
	{
		startNumber: {
			type: 'Number',
			required: [true, 'Vui lòng nhập chỉ số cũ'],
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

const Electricity = mongoose.model('Electricity', electricitySchema);
module.exports = Electricity;
