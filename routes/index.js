let express = require('express');
let router = express.Router();
let expressValidator = require('express-validator');
let passport = require('passport');
let bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Hem' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registrering' });
});

router.post('/register', function(req, res, next) {
  req.checkBody('name', 'Namn saknas i fälltet. ').notEmpty();
  req.checkBody('name', 'Namnet för bara innehålla bokstäver, mellanrum och bindesträck. ').matches(/^[A-Za-z--- ]+$/, 'i');
  req.checkBody('name', 'Namnen måste vara mellan 4 och 25 bokstäver. ').len(4, 25);
  req.checkBody('email', 'Epostadressen är ogiltig, vänligen försök igen.').isEmail();
  req.checkBody('email', 'Epostadressen ska vara mellan 4 och 100 tecken lång. ').len(4, 100);
  req.checkBody('password', 'Lösenordet ska vara mellan 6 och 100 tecken långt.').len(6, 100);
  req.checkBody('passwordMatch', 'Lösenorden matchar inte varandra, försök igen. ').equals(req.body.password);

  

  const errors = req.validationErrors();
  

  
  if(errors) {
      console.log(`errors: ${JSON.stringify(errors)}`);
      res.render('register', {title: 'fel vid registrering. ',
                              errors: errors
    });
  } else  {
          const name = req.body.name;
          const email = req.body.email;
          const password = req.body.password;
          
          //Hash the password before db entry
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(password, salt);
          console.log(hash);
          
          const db = require('../db.js');
          db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function(error, results, fields) {
            if(error) throw error;

            db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
              
              let user_id = results[0];

              if(error) throw error;
              console.log(user_id);
              req.login(user_id, function(error) {
                res.redirect('/');
              });

              res.render('register', { title: 'Registrering genomförd' });
              
              });
            
            });
          }
  
    });

    passport.serializeUser(function(user_id, done) {
      done(null, user_id);
    });
    
    passport.deserializeUser(function(user_id, done) {
        done(null, user_id);
    });

module.exports = router;
