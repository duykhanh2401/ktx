const Student = require('../models/studentModels');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
exports.getContract = async (req, res, next) => {
	res.status(200).render('student/contract');
};

exports.login = async (req, res, next) => {
	try {
		let token;
		if (req.cookies.jwt) {
			token = req.cookies.jwt;
		}
		console.log(token);
		if (!token) {
			return res.status(200).render('student/login');
		}
		const decode = await promisify(jwt.verify)(
			token,
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9',
		);
		const currentStudent = await Student.findById(decode.id);
		if (!currentStudent) {
			return res.status(200).render('student/login');
		}
	} catch (error) {
		console.log(error);
		return res.status(200).render('student/login');
	}

	res.redirect('/contract');
};
// exports.getBuilding = async (req, res, next) => {
// 	res.status(200).render('admin/building');
// };

// exports.getInvoice = async (req, res, next) => {
// 	const rooms = await Room.find();
// 	console.log(rooms);
// 	res.status(200).render('admin/invoice', { rooms });
// };
