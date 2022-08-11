const router = require('express').Router();
const { request } = require('express');
const adminController = require(`../controllers/adminController`);
const authController = require(`../controllers/authController`);

router.get('/login', adminController.login);

router.use(authController.protectAdmin);

router.get('/', (req, res) => {
	res.redirect('/admin/building');
});

router.get('/student', adminController.getStudent);
router.get('/building', adminController.getBuilding);
router.get('/room', adminController.getRooms);
router.get('/room/:id', adminController.getRoom);
router.get('/contract', adminController.getContract);
router.get('/admin', adminController.getAdminClient);
router.get('/invoice', adminController.getInvoice);
router.get('/reflect', adminController.getReflect);
module.exports = router;
