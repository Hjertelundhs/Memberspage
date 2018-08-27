let express = require('express');
let router = express.Router();
let expressValidator = require('express-validator');
let passport = require('passport');
let bcrypt = require('bcryptjs');
require('../app.js')

/* GET home page. */
router.get('/', (req, res) => {

 
  console.log(req.isAuthenticated() + " inloggad");
  
  res.render('home', { title: 'Hem' });
});

router.get('/profile', authenticationMiddleware(), (req, res) => {
    let db = require('../db.js');
    db.query('SELECT is_admin FROM users WHERE email = ?', [user_id], (error, results, fields) =>  {
    let isAdmin = results[0].is_admin;
    console.log(isAdmin + ' admin')
  })
  res.render('profile', { title: 'Din sida', name: name});
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Logga in' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/')
});


router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Registrering' });
});

router.post('/register', (req, res, next) => {
  req.checkBody('name', 'Namn saknas i fälltet. ').notEmpty();
  req.checkBody('name', 'Namnet för bara innehålla bokstäver, mellanrum och bindesträck. ').matches(/^[A-Öa-ö--- ]+$/, 'i');
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
          console.log(hash + "hashed password");
          
          
          db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (error, results, fields) => {
            if(error) throw error;
           
            let db = require('../db.js');
            db.query('SELECT LAST_INSERT_ID(user_id) from users as user_id', (error, result, fields) => {
              
              var user_id = results[0];
              
              if(error) throw error;
              
              req.login(user_id, (error) => {
                res.redirect('/');
              });

              res.render('register', { title: 'Registrering genomförd' });
              
              });
            
            });
          }
          
    });

    

    passport.serializeUser((user_id, done) => {
      done(null, user_id);
    });
    
    passport.deserializeUser((user_id, done) => {
        done(null, user_id);
    });

    function authenticationMiddleware () {  
      return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    
          if (req.isAuthenticated()) return next();
          res.redirect('/login')
      }
    }

module.exports = router;
