const Admin = require(`${__dirname}/../models/adminModels`);
const Student = require(`${__dirname}/../models/studentModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const createToken = (id) => {
	return jwt.sign({ id }, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9', {
		expiresIn: '30d',
	});
};

const createSendToken = (student, statusCode, res) => {
	const token = createToken(student._id);

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(Date.now() + 30 * 60 * 24 * 60 * 1000),
	});

	student.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		token,
	});
};

exports.register = catchAsync(async (req, res, next) => {
	const newStudent = await Student.create({
		name: req.body.name.trim(),
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});
	createSendToken(newStudent, 200, res);
});

exports.login = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	// 1) Check Email Password nhập vào
	if (!email || !password)
		return next(new AppError('Please provide email or password', 400));

	// 2) Check Email Password đúng hay k
	const student = await Student.findOne({ email }).select('+password');

	if (
		!student ||
		!(await student.correctPassword(password, student.password))
	) {
		return next(new AppError('Email hoặc mật khẩu không đúng', 400));
	}

	if (student.role === 'admin') {
		return next(new AppError('Tài khoản không tồn tại', 400));
	}

	createSendToken(student, 200, res);
});

exports.logout = (req, res, next) => {
	res.cookie('jwt', 'logouttoken', {
		httpOnly: true,
		expires: new Date(Date.now() + 5000),
	});

	res.status(200).json({
		status: 'success',
	});
};

// Kiểm tra đăng nhập chưa với token
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token)
		return next(
			new AppError('You are not logged in! Please log in to get access', 401),
		);

	// Verification token
	const decode = await promisify(jwt.verify)(
		token,
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9',
	);

	// Check if Student still exists || Kiểm tra người dùng tồn tại hay k
	const currentStudent = await Student.findById(decode.id);
	if (!currentStudent) {
		return next(
			new AppError(
				'The Student belonging to this token does no longer exists',
				401,
			),
		);
	}

	req.Student = currentStudent;
	res.locals.Student = currentStudent;
	next();
});

exports.restrictTo = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.Student.role)) {
			return next(
				new AppError('Bạn không có quyền truy cập vào đường dẫn này', 400),
			);
		}
		next();
	};
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
	const Student = await Student.findById(req.Student.id).select('+password');

	if (!(await Student.correctPassword(req.body.passwordCurrent))) {
		return next(new AppError('Mật khẩu cũ không đúng', 401));
	}

	Student.password = req.body.password;
	Student.passwordConfirm = req.body.passwordConfirm;
	await Student.save();
	createSendToken(Student, 200, res);
});

exports.loginAdmin = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	// 1) Check Email Password nhập vào
	if (!email || !password)
		return next(new AppError('Vui lòng nhập email và mật khẩu', 400));

	// 2) Check Email Password đúng hay k
	const admin = await Admin.findOne({ email }).select('+password');

	if (!admin || !(await admin.correctPassword(password))) {
		return next(new AppError('Email hoặc mật khẩu không đúng', 400));
	}

	const token = createToken(admin._id);

	res.cookie('jwt_admin', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(Date.now() + 30 * 60 * 24 * 60 * 1000),
	});

	admin.password = undefined;
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.protectAdmin = async (req, res, next) => {
	const checkAPI = req.originalUrl.startsWith('/api');
	try {
		let token;
		if (req.cookies.jwt_admin) {
			token = req.cookies.jwt_admin;
		}
		if (!token) {
			return checkAPI
				? res.status(401).json({
						status: 'failed',
						message: 'Bạn không có quyền truy cập vào đường dẫn này',
				  })
				: res.redirect(`/admin/login`);
		}

		const decode = await promisify(jwt.verify)(
			token,
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9',
		);
		const currentAdmin = await Admin.findById(decode.id);
		if (!currentAdmin) {
			return checkAPI
				? res.status(401).json({
						status: 'failed',
						message: 'Bạn không có quyền truy cập vào đường dẫn này',
				  })
				: res.redirect(`/admin/login`);
		}
		req.admin = currentAdmin;
		res.locals.admin = currentAdmin;
		return next();
	} catch (error) {
		return checkAPI
			? res.status(401).json({
					status: 'failed',
					message: 'Bạn không có quyền truy cập vào đường dẫn này',
			  })
			: res.redirect(`/admin/login`);
		// return res.status(200).render('admin/login');
	}
};
