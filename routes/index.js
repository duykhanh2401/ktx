const router = require('express').Router();
const viewController = require(`../controllers/viewController`);
const authController = require(`../controllers/authController`);

// router.get('/login', adminController.login);

router.get('/', (req, res) => {
	res.redirect('/contract');
});
router.get('/login', viewController.login);
router.use(authController.protect);
router.get('/contract', viewController.getContract);

module.exports = router;
