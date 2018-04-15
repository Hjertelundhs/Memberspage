let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

//Authentication packages
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let MySQLStore = require('express-mysql-session')(session);
let bcrypt = require('bcryptjs');

let index = require('./routes/index');
let users = require('./routes/users');

let app = express();

require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'Fefesdd34235232324_432gfc',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next)  {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
})

app.use('/', index);
app.use('/users', users);

passport.use(new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password'

},

  function(username, password, done) {
      
      console.log(username + ' username');
      console.log(password + ' password');
      
      const db = require('./db');
      db.query('SELECT user_id, password, is_admin FROM users WHERE email = ?', [username], function(err, results, fields)  {
        const is_admin = results[0].is_admin;
        if(err) {done(err)};
        
        if(results.length === 0)  {
          done(null, false);
        } else  {
        
        let hash = results[0].password.toString();
        
        bcrypt.compare(password, hash, function(err, response)  {
          if(response === true) {
            console.log(results[0].user_id)
            return done(null, {user_id: results[0].user_id});
          } else  {
            return done(null, false);
            }
         });
        }
      })  
    }
));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});


module.exports = app;
