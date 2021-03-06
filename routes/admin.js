const router = require('express').Router();
const adminController = require(`../controllers/adminController`);
const authController = require(`../controllers/authController`);

router.get('/login', adminController.login);

router.use(authController.protectAdmin);

router.post('/updateMe', adminController.updateMe);
router.delete('/deleteMe', adminController.deleteMe);

router.get('/student', adminController.getStudent);
router.get('/building', adminController.getBuilding);
router.get('/room', adminController.getRooms);
router.get('/room/:id', adminController.getRoom);
router.get('/contract', adminController.getContract);

module.exports = router;
