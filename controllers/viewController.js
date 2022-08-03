exports.getContract = async (req, res, next) => {
	res.status(200).render('student/contract');
};

exports.login = async (req, res, next) => {
	res.status(200).render('student/login');
};
// exports.getBuilding = async (req, res, next) => {
// 	res.status(200).render('admin/building');
// };

// exports.getInvoice = async (req, res, next) => {
// 	const rooms = await Room.find();
// 	console.log(rooms);
// 	res.status(200).render('admin/invoice', { rooms });
// };
