const Reflect = require(`../models/reflectModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);
const { EntryPlugin } = require('webpack');

// console.log(User);

exports.getAllReflectsStudent = catchAsync(async (req, res, next) => {
	const reflects = await Reflect.find({ student: req.student._id });

	return res.status(200).json({
		status: 'success',
		data: reflects,
	});
});

exports.createReflect = catchAsync(async (req, res, next) => {
	const { title, content } = req.body;
	const reflect = await Reflect.create({
		student: req.student._id,
		content,
		title,
	});

	return res.status(200).json({
		status: 'success',
		data: reflect,
	});
});

exports.getAllReflects = factory.getAll(Reflect);
exports.getReflect = factory.getOne(Reflect);
exports.updateReflect = factory.updateOne(Reflect);
exports.deleteReflect = factory.deleteOne(Reflect);
