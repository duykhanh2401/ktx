const Student = require('../models/studentModels');
const Room = require('../models/roomModels');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Contract = require(`../models/contractModels`);

exports.getContract = async (req, res, next) => {
	res.status(200).render('student/contract');
};

exports.login = async (req, res, next) => {
	try {
		let token;
		if (req.cookies.jwt) {
			token = req.cookies.jwt;
		}
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
		return res.status(200).render('student/login');
	}

	res.redirect('/contract');
};
exports.getReflect = async (req, res, next) => {
	res.status(200).render('student/reflect');
};
exports.getContract = async (req, res, next) => {
	const contracts = await Contract.find({ student: req.student.id });
	res.status(200).render('student/contract', { contracts });
};

exports.getInvoice = async (req, res, next) => {
	const rooms = await Room.find();
	res.status(200).render('student/invoice', { rooms });
};

exports.getRoom = async (req, res, next) => {
	console.log(req.student);
	res.status(200).render('student/room');
};
