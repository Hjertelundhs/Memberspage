var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registrering' });
});

router.post('/register', function(req, res, next) {
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
