const Student = require('../models/studentModels');
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
exports.getBuilding = async (req, res, next) => {
	res.status(200).render('student/building');
};
exports.getContract = async (req, res, next) => {
	const contracts = await Contract.find({ student: req.student.id });
	res.status(200).render('student/contract', { contracts });
};

exports.getInvoice = async (req, res, next) => {
	res.status(200).render('student/invoice');
};

exports.getRoom = async (req, res, next) => {
	res.status(200).render('student/room');
};
