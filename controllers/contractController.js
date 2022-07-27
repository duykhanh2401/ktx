const Contract = require(`../models/contractModels`);
const Room = require(`../models/roomModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);

// console.log(User);
exports.createContract = catchAsync(async (req, res, next) => {
	const { student, startDate, dueDate } = req.body;

	if (new Date(dueDate) < Date.now()) {
		return res.status(400).json({
			message: 'Ngày kết thúc không hợp lệ',
		});
	}

	const contract = await Contract.find({
		student,
		dueDate: { $gte: Date.now() },
		startDate: { $lte: Date.now() },
	});

	if (contract.length == 0) {
		const newContract = await Contract.create({
			student,
			startDate,
			dueDate,
			admin: req.admin.id,
		});

		return res.status(200).json({
			status: 'success',
			data: newContract,
		});
	}

	res.json({
		status: true,
	});
});

exports.extendContract = catchAsync(async (req, res, next) => {
	const { student, dueDate } = req.body;

	const contract = await Contract.find({
		student,
		dueDate: { $gte: Date.now() },
		startDate: { $lte: Date.now() },
	});

	if (contract.length == 0) {
		return res.status(400).json({
			message: 'Sinh viên chưa có hợp đồng',
		});
	}

	if (contract.length == 1) {
		if (contract[0].dueDate > new Date(dueDate)) {
			return res.status(400).json({
				message: 'Thời gian kết thúc không hợp lệ, hợp đồng vẫn còn hạn',
			});
		}

		const newStartDate = new Date(contract[0].dueDate.getTime() + 86400000);
		const checkExtend = await Contract.find({
			student,
			startDate: { $gte: Date.now() },
		});
		if (checkExtend.length > 0) {
			return res.status(400).json({
				message: 'Hợp đồng đã được gia hạn',
			});
		}

		if (new Date(dueDate) < newStartDate) {
			return res.status(400).json({
				message: 'Thời gian kết thúc không hợp lệ',
			});
		}
		const newContract = await Contract.create({
			student,
			startDate: newStartDate,
			dueDate,
			admin: req.admin.id,
			info: 'Gia Hạn',
		});

		return res.status(200).json({
			status: 'success',
			data: newContract,
		});
	}
});

exports.getAllContracts = factory.getAll(Contract);
exports.getContract = factory.getOne(Contract);
exports.updateContract = factory.updateOne(Contract);
exports.deleteContract = factory.deleteOne(Contract);
