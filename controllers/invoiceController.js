const Room = require(`../models/roomModels`);
const Invoice = require(`../models/invoiceModels`);
const Water = require(`../models/waterModels`);
const Electricity = require(`../models/electricityModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);

exports.createInvoice = catchAsync(async (req, res, next) => {
	const { room, month, year, electricity, water } = req.body;

	const currentMonth = await Invoice.findOne({ room, month, year });
	if (currentMonth)
		return next(new AppError('Hoá đơn tháng này đã tồn tại', 400));

	const lastMonth = await Invoice.findOne({ room, month: month - 1, year });
	let totalElectricity = 0,
		totalWater = 0,
		startElectricity = 0,
		startWater = 0;
	if (!lastMonth) {
		totalElectricity = electricity * 2000;
		totalWater = water * 8000;
	} else {
		startElectricity = lastMonth.electricity.endNumber;
		startWater = lastMonth.water.endNumber;
		if (startElectricity > electricity) {
			return next(new AppError('Số điện không hợp lệ', 400));
		}

		if (startWater > water) {
			return next(new AppError('Chỉ số nước không hợp lệ', 400));
		}

		totalElectricity = (electricity - startElectricity) * 2000;
		totalWater = (water - startWater) * 8000;
	}

	const electricityCreate = await Electricity.create({
		startNumber: startElectricity,
		endNumber: electricity * 1,
		total: totalElectricity,
	});

	const waterCreate = await Water.create({
		startNumber: startWater,
		endNumber: water * 1,
		total: totalWater,
	});

	const invoiceCreate = await Invoice.create({
		room,
		electricity: electricityCreate._id,
		water: waterCreate._id,
		month,
		year,
		admin: req.admin._id,
	});
	res.status(200).json({
		status: 'success',
		data: invoiceCreate,
	});
});

exports.getAllInvoice = factory.getAll(Invoice);

exports.getInvoiceByRoom = catchAsync(async (req, res, next) => {
	const invoice = await Invoice.find({ room: req.student.room });

	res.status(200).json({
		status: 'success',
		data: invoice,
	});
});
exports.updateInvoice = factory.updateOne(Invoice);
