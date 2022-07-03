const AppError = require('../utils/appError');

const handleJsonWebTokenError = () =>
	new AppError('Invalid token. Please try again', 401);

const handleTokenExpiredError = () =>
	new AppError('Expired token, login again', 401);

const handleCastErrorDB = (error) => {
	const msg = `Invalid ${error.path}: ${error.value}`;
	return new AppError(msg, 400);
};

const handleDuplicateFieldsDB = (error) => {
	const value = Object.values(error.keyValue)[0];
	const msg = `Dữ liệu đã tồn tại: '${value}'. Xin vui lòng thử lại!!`;
	return new AppError(msg, 400);
};

const handleValidationErrorDB = (error) => {
	const value = Object.values(error.errors).map((el) => el.properties.messages);
	const msg = `${value.join('. ')}`;
	return new AppError(msg, 400);
};

const sendErrorDev = (err, req, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err,
	});
};

const sendErrorProd = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}

		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong !!',
		});
	}
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			status: err.status,
			message: err.message,
		});
	}

	return res.status(500).render('error', {
		status: 'error',
		message: 'Something went very wrong !!',
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err, message: err.message };
		if (err.name === 'CastError') error = handleCastErrorDB(err);
		if (err.code === 11000) error = handleDuplicateFieldsDB(err);
		if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
		if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
		if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
		sendErrorProd(error, req, res);
	}
};
