const Admin = require(`./../models/adminModels`);
const Building = require(`./../models/buildingModels`);
const Room = require(`./../models/roomModels`);
const catchAsync = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);
const factory = require(`./factoryHandle`);

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

	const updateAdmin = await Admin.findByIdAndUpdate(req.admin.id, filterBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: updateAdmin,
	});
});

exports.getMe = (req, res, next) => {
	req.params.id = req.Admin.id;
	next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
	await Admin.findByIdAndUpdate(req.admin.id, { active: false });
	res.status(204).json({
		status: 'success',
	});
});

exports.getStudent = async (req, res, next) => {
	const rooms = await Room.find();
	res.status(200).render('admin/student', { rooms });
};

exports.getBuilding = async (req, res, next) => {
	res.status(200).render('admin/building');
};

exports.getRoom = async (req, res, next) => {
	const buildings = await Building.find();
	res.status(200).render('admin/room', { buildings });
};

exports.login = async (req, res, next) => {
	return res.status(200).render('admin/login');

	// return res.status(200).render('admin/login');

	// res.redirect('/admin');
};

exports.getAllAdmins = factory.getAll(Admin, '+active');
exports.getAdmin = factory.getOne(Admin);
exports.createAdmin = factory.createOne(Admin);
exports.updateAdmin = factory.updateOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);
