const router = require('express').Router();
const adminController = require(`../controllers/adminController`);
const authController = require(`../controllers/authController`);

router.post('/admin/login', authController.loginAdmin);

router.post('/admin/create', adminController.createAdmin);
module.exports = router;
