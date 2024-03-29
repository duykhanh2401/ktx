const Student = require(`./../models/studentModels`);
const Contract = require(`./../models/contractModels`);
const catchAsync = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);
const factory = require(`./factoryHandle`);
const mongoose = require('mongoose');
const filterObject = (obj, ...fields) => {
	const objectResult = {};

	Object.keys(obj).forEach((el) => {
		if (fields.includes(el)) objectResult[el] = obj[el];
	});

	return objectResult;
};

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError('Cập nhật mật khẩu vui lòng sử dụng /updatePassword', 400),
		);

	const filterBody = filterObject(req.body, 'name', 'phoneNumber', 'address');

	const updateStudent = await Student.findByIdAndUpdate(
		req.Student.id,
		filterBody,
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(200).json({
		status: 'success',
		data: updateStudent,
	});
});

exports.getMe = (req, res, next) => {
	req.params.id = req.Student.id;
	next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
	await Student.findByIdAndUpdate(req.Student.id, { active: false });
	res.status(204).json({
		status: 'success',
	});
});

exports.getStudentNoRoom = catchAsync(async (req, res, next) => {
	const contract = await Contract.find().select('student');
	const arrContract = contract.map((el) =>
		mongoose.Types.ObjectId(el.student.id),
	);
	const studentsContract = await Student.find({
		$and: [
			{ room: null },
			{ discipline: false },
			{
				_id: {
					$in: arrContract,
				},
			},
		],
	});

	res.status(200).json({
		status: 'success',
		data: studentsContract,
	});
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
	const allStudent = await Student.find();

	res.status(200).json({
		status: 'success',
		data: allStudent,
	});
});
exports.updateStudent = catchAsync(async (req, res, next) => {
	let data;

	if (req.body.password == '') {
		delete req.body.password;
		data = await Student.findByIdAndUpdate(req.params.id, req.body);
	} else {
		data = await Student.findByIdAndUpdate(req.params.id, req.body);

		data.password = req.body.password;
		await data.save();
	}

	res.status(200).json({
		status: 'success',
	});
});

exports.disciplineStudent = catchAsync(async (req, res, next) => {
	const { student, note } = req.body;
	console.log(student, note);
	const studentCurrent = await Student.findOne({
		_id: student,
		// discipline: false,
	});
	if (!studentCurrent) {
		return next(
			new AppError('Sinh viên không tồn tại hoặc đã bị kỷ luật', 400),
		);
	}

	studentCurrent.discipline = true;
	studentCurrent.note = note;
	studentCurrent.room = undefined;
	await studentCurrent.save();

	await Contract.updateMany({ student }, { isCancel: 'discipline' });
	return res.status(200).json({
		status: 'success',
	});
});

exports.getStudent = factory.getOne(Student);
exports.createStudent = factory.createOne(Student);
exports.deleteStudent = factory.deleteOne(Student);
