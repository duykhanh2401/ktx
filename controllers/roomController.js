const Room = require('../models/roomModels');
const Building = require('../models/buildingModels');
const Student = require('../models/studentModels');
const Contract = require('../models/contractModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./factoryHandle');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// console.log(User);

exports.getAllRooms = catchAsync(async (req, res, next) => {
	const allRoom = await Room.aggregate([
		{
			$lookup: {
				from: 'buildings',
				localField: 'building',
				foreignField: '_id',
				as: 'building',
			},
		},
		{
			$unwind: '$building',
		},
		{
			$lookup: {
				from: 'students',
				localField: '_id',
				foreignField: 'room',
				as: 'student',
			},
		},
		{
			$unwind: {
				path: '$student',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'contracts',
				localField: 'student._id',
				foreignField: 'student',
				as: 'contract',
			},
		},
		{
			$unwind: {
				path: '$contract',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$match: {
				$or: [
					{
						'contract.dueDate': {
							$gte: new Date(),
						},
						'contract.startDate': {
							$lte: new Date(),
						},
					},
					{
						contract: null,
					},
				],
			},
		},

		{
			$project: {
				item: 1,
				maxStudent: 1,
				building: 1,
				roomNumber: 1,
				status: 1,
				createdAt: 1,
				presentStudent: {
					$cond: [
						{
							$gte: ['$contract', undefined],
						},
						1,
						0,
					],
				},
			},
		},

		{
			$group: {
				_id: '$_id',
				presentStudent: { $sum: '$presentStudent' },
				maxStudent: { $last: '$maxStudent' },
				building: { $last: '$building' },
				roomNumber: { $last: '$roomNumber' },
				status: { $last: '$status' },
				createdAt: { $last: '$createdAt' },
			},
		},
		{
			$sort: {
				'building.name': 1,
				roomNumber: 1,
			},
		},
	]);

	return res.status(200).json({
		status: 'success',
		data: allRoom,
	});
});

exports.getRoom = catchAsync(async (req, res, next) => {
	const student = await Student.aggregate([
		{
			$match: {
				room: ObjectId(req.params.id),
			},
		},
		{
			$lookup: {
				from: 'contracts',
				localField: '_id',
				foreignField: 'student',
				as: 'contract',
			},
		},
		{
			$unwind: '$contract',
		},
		{
			$match: {
				$or: [
					{
						'contract.dueDate': {
							$gte: new Date(),
						},
						'contract.startDate': {
							$lte: new Date(),
						},
					},
				],
			},
		},
	]);

	return res.status(200).json({
		status: 'success',
		data: student,
	});
});

exports.addStudent = catchAsync(async (req, res, next) => {
	const { room, student } = req.body;
	const roomSelect = await Room.findById(room);
	const studentInRoom = await Student.aggregate([
		{
			$match: {
				room: ObjectId(room),
			},
		},
		{
			$lookup: {
				from: 'contracts',
				localField: '_id',
				foreignField: 'student',
				as: 'contract',
			},
		},
		{
			$unwind: '$contract',
		},
		{
			$match: {
				$or: [
					{
						'contract.dueDate': {
							$gte: new Date(),
						},
						'contract.startDate': {
							$lte: new Date(),
						},
					},
				],
			},
		},
	]);
	if (studentInRoom.length >= roomSelect.maxStudent) {
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

exports.roommates = catchAsync(async (req, res, next) => {
	if (!req.student.room) {
		return res.status(200).json({
			message: 'Sinh viên chưa có phòng',
		});
	}

	const student = await Student.aggregate([
		{
			$match: {
				room: ObjectId(req.student.room),
			},
		},
		{
			$lookup: {
				from: 'contracts',
				localField: '_id',
				foreignField: 'student',
				as: 'contract',
			},
		},
		{
			$unwind: '$contract',
		},
		{
			$match: {
				$or: [
					{
						'contract.dueDate': {
							$gte: new Date(),
						},
						'contract.startDate': {
							$lte: new Date(),
						},
					},
				],
			},
		},
	]);

	return res.status(200).json({
		status: 'success',
		data: student,
	});
});
exports.createRoom = catchAsync(async (req, res, next) => {
	const { building } = req.body;

	const currentBuilding = await Building.findById(building).populate(
		'presentRoom',
	);
	// console.log(building, roomNumber, maxStudent);
	console.log(currentBuilding);
	if (currentBuilding.presentRoom >= currentBuilding.numberOfRooms) {
		return res.status(400).json({
			message: 'Toà nhà này đã đủ phòng',
		});
	}
	const newRoom = await Room.create(req.body);
	return res.status(200).json({
		status: 'success',
		data: newRoom,
	});
});
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);
