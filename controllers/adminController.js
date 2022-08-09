const Admin = require(`./../models/adminModels`);
const Building = require(`./../models/buildingModels`);
const Room = require(`./../models/roomModels`);
const Contract = require(`./../models/contractModels`);
const Student = require(`./../models/studentModels`);
const catchAsync = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);
const factory = require(`./factoryHandle`);
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { mongoose } = require('mongoose');

exports.getStudent = async (req, res, next) => {
	res.status(200).render('admin/student');
};

exports.getBuilding = async (req, res, next) => {
	res.status(200).render('admin/building');
};

exports.getInvoice = async (req, res, next) => {
	const rooms = await Room.find();
	res.status(200).render('admin/invoice', { rooms });
};

exports.getContract = async (req, res, next) => {
	const contract = await Contract.find({
		status: { $ne: 'discipline' },
	}).select('student');
	const arrContract = contract.map((el) =>
		mongoose.Types.ObjectId(el.student.id),
	);
	const studentsNoContract = await Student.find({
		$or: [
			{
				_id: {
					$nin: arrContract,
				},
			},
		],
	});

	const studentsContract = await Student.find({
		_id: {
			$in: arrContract,
		},
	});

	const allStudent = await Student.find();
	res.status(200).render('admin/contract', {
		studentsNoContract,
		studentsContract,
		allStudent,
	});
};

exports.getRooms = async (req, res, next) => {
	const buildings = await Building.find();
	res.status(200).render('admin/rooms', { buildings });
};

exports.getAdminClient = async (req, res, next) => {
	res.status(200).render('admin/admin');
};

exports.getRoom = async (req, res, next) => {
	const room = await Room.findById(req.params.id);
	res.status(200).render('admin/room', { room });
};

exports.login = async (req, res, next) => {
	try {
		let token;
		if (req.cookies.jwt_admin) {
			token = req.cookies.jwt_admin;
		}
		if (!token) {
			return res.status(200).render('admin/login');
		}
		const decode = await promisify(jwt.verify)(
			token,
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9',
		);
		const currentAdmin = await Admin.findById(decode.id);
		if (!currentAdmin) {
			return res.status(200).render('admin/login');
		}
	} catch (error) {
		console.log(error);
		return res.status(200).render('admin/login');
	}

	res.redirect('/admin/building');
};

exports.updateAdmin = catchAsync(async (req, res, next) => {
	let data;
	if (req.body.password == '') {
		delete req.body.password;
		data = await Admin.findByIdAndUpdate(req.params.id, req.body);
	} else {
		data = await Admin.findByIdAndUpdate(req.params.id, req.body);

		data.password = req.body.password;
		await data.save();
	}

	res.status(200).json({
		status: 'success',
	});
});

exports.getAllAdmins = factory.getAll(Admin, '+active');
exports.createAdmin = factory.createOne(Admin);
