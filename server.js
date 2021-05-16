const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);

//SERVING STATIC FILES (SCRIPT, CSS)
app.use(express.static(path.join(__dirname, 'Images')));
app.use(express.static(path.join(__dirname, 'Styles')));
app.use(express.static(path.join(__dirname, 'Scripts')));

app.use(session(
  {
    secret: 'the unaltered void beyond all things',
    name: 'zamSessionID',
    resave: false,
    saveUninitialized: true
  }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//GET REQUESTS

/* GET login.html */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

/* GET index.html */
app.get('/getIndex', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// POST trying to sign into a profile
app.post('/authorize', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(`Username: ${req.body.username}, Password: ${req.body.password}`);
  let results = authenticate(req.body.username, req.body.password, function (rows) {
    if (rows == null) {
      // no users found
      res.send({
        status: "fail",
        msg: 'User account not found.'
      });
    } else {
      // authenticate the user, create a session
      req.session.loggedIn = true;
      req.session.username = rows.username;
      req.session.save(function (err) {
        // session is saved
      })


      res.send({
        status: 'success',
        msg: 'Logged in.'
      });
    }
  })
})

// SERVER LISTENING
server.listen(8000, () => {
  console.log('listening on localhost:8000');
});


function authenticate(user, pwd, callback) {
  const mysql = require('mysql2');
  const connection = mysql.createConnection({

  })
}