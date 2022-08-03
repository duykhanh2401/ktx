const router = require('express').Router();
const viewController = require(`../controllers/viewController`);

// router.get('/login', adminController.login);

router.get('/', (req, res) => {
	res.redirect('/contract');
});
router.get('/login', viewController.login);
router.get('/contract', viewController.getContract);

module.exports = router;
