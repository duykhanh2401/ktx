const router = require('express').Router();
const adminController = require(`../controllers/adminController`);
const authController = require(`../controllers/authController`);

router.post('/admin/login', authController.loginAdmin);

router.use(authController.protectAdmin);
router.post('/admin', adminController.createAdmin);
router.patch('/admin/:id', adminController.updateAdmin);
router.get('/admin', adminController.getAllAdmins);
module.exports = router;
