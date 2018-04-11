let express = require('express');
let router = express.Router();
let expressValidator = require('express-validator');

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registrering' });
});

router.post('/register', function(req, res, next) {
  // req.checkBody('name', 'Namn saknas i fälltet. ').notEmpty();
  // req.checkBody('name', 'Namnen måste vara mellan 4 och 25 bokstäver. ').len(4, 25);
  // req.checkBody('email', 'Epostadressen är ogiltig, vänligen försök igen.').isEmail();
  // req.checkBody('email', 'Epostadressen ska vara mellan 4 och 100 tecken lång. ').len(4, 100);
  // req.checkBody('password', 'Lösenordet ska vara mellan 6 och 100 tecken långt.').len(6, 100);
  // req.checkBody('passwordMatch', 'Lösenordet ska vara mellan 6 och 100 tecken långt.').len(6, 100);
  // req.checkBody('passwordMatch', 'Lösenorden matchar inte varandra, försök igen. ').equals(req.body.password);

  // Additional validation to ensure username is alphanumeric with underscores and dashes
  req.checkBody('name', 'Namnet för bara innehålla bokstäver och bindesträck. ').matches(/^[A-Za-z--]+$/, 'i');
  

  const errors = req.validationErrors();
  
  if(errors) {
    console.log(`errors: ${JSON.stringify(errors)}`);
    res.render('register', {title: 'fel vid registrering. '})
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const db = require('../db.js');
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function(error, results, fields) {
    if(error) throw error;
    res.render('register', { title: 'Registrering genomförd' });
  });
  
});

module.exports = router;
