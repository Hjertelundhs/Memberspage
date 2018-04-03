let express = require('express');
let router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

router.post('/users', function(req, res, next){
	console.log(req.body.username);
	console.log(req.body.email);
	console.log(req.body.password);
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
