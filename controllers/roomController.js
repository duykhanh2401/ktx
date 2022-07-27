const Room = require(`../models/roomModels`);
const Student = require(`../models/studentModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);
const mongoose = require('mongoose');
// console.log(User);

exports.getAllCategories = factory.getAll(Room);
exports.getRoom = catchAsync(async (req, res, next) => {
	const student = await Student.find({
		room: req.params.id,
	});
	return res.status(200).json({
		status: 'success',
		data: student,
	});
});
exports.addStudent = catchAsync(async (req, res, next) => {
	const { room, student } = req.body;
	const roomSelect = await Room.findById(room);
	if (roomSelect.presentStudent >= roomSelect.maxStudent) {
		return res.status(400).json({
			message: 'Phòng đã đầy',
		});
	}

	const studentFind = await Student.findById(student);
	if (studentFind.room) {
		return res.status(400).json({
			message: 'Sinh viên đã có phòng',
		});
	}

	const studentUpdate = await Student.findByIdAndUpdate(student, { room });

	console.log(studentUpdate);
	return res.status(200).json({
		status: 'success',
		data: studentUpdate,
	});
});

exports.removeStudent = catchAsync(async (req, res, next) => {
	const { student, room } = req.body;
	const studentSelect = await Student.findOne({ id: student, room });
	if (!studentSelect) {
		return res.status(400).json({
			message: 'Sinh viên không hợp lệ',
		});
	}

	studentSelect.room = undefined;
	await studentSelect.save();
	return res.status(200).json({
		status: 'success',
	});
});
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);
