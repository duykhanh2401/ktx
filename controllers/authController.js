const Student = require(`${__dirname}/../models/studentModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (student, statusCode, res) => {
	const token = createToken(student._id);

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 24 * 60 * 1000,
		),
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
	const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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

	// Kiểm tra người dùng thay đổi mật khẩu sau khi token được tạo
	// if (currentStudent.changedPasswordAfter(decode.iat)) {
	// 	return next(
	// 		new AppError(
	// 			'Student recently changed password! Please log in again',
	// 			401,
	// 		),
	// 	);
	// }
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
		return next(new AppError('Please provide email or password', 400));

	// 2) Check Email Password đúng hay k
	const Student = await Student.findOne({ email }).select('+password');
	// console.log(Student);
	if (!Student || !(await Student.correctPassword(password))) {
		return next(new AppError('Incorrect email or password', 400));
	}
	if (Student.role !== 'admin') {
		return next(new AppError('Bạn không có quyền truy cập đường dẫn này', 400));
	}

	const token = createToken(Student._id);

	res.cookie('jwt_admin', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 24 * 60 * 1000,
		),
	});

	Student.password = undefined;
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.isLoggedIn = async (req, res, next) => {
	const category = await Category.find().select('slug name');
	res.locals.category = category;
	try {
		if (req.cookies.jwt) {
			// Verification token
			const decode = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET,
			);

			// Check if Student still exists || Kiểm tra người dùng tồn tại hay k
			const currentStudent = await Student.findById(decode.id);
			if (!currentStudent) {
				return next();
			}

			if (currentStudent.role === 'admin') {
				res.cookie('jwt', 'logouttoken', {
					httpOnly: true,
					expires: new Date(Date.now() + 5000),
				});
				return next();
			}

			res.locals.Student = currentStudent;
			req.Student = currentStudent;
			return next();
		}
	} catch (err) {
		return next();
	}
	next();
};
