'use strict';

/*
Liam Arabsky      A01229067 larabsky1@my.bcit.ca
Trevor Hong       A01232148
Ethan Diosana     A01248983
John Braithwaite  A01206633
*/

const express = require('express');
const session = require('express-session');
const fs = require("fs");
const { JSDOM } = require('jsdom');
const app = express();
const http = require('http');
const path = require('path');
const { connect } = require('http2');
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

// USING MYSQL2 ASYNC TO CREATE DATABASE
async function initializeDB() {

  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS test;
    use test;
    CREATE TABLE IF NOT EXISTS user (
      ID int NOT NULL AUTO_INCREMENT,
      username varchar(30),
      password varchar(30),
      PRIMARY KEY (ID)
    );`;

  await connection.query(createDBAndTables);
  let results = await connection.query("SELECT COUNT(*) FROM user");
  let count = results[0][0]['COUNT(*)'];
  if (count < 1) {
    results = await connection.query("INSERT INTO user (username, password) VALUES ('arron_ferguson@bcit.ca', 'admin');");
    console.log('Added one user record');
  }
  connection.end();
}

async function initializeStudentsDB() {
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  const createDBAndSchema = `CREATE DATABASE IF NOT EXISTS test;
    use test;
    CREATE TABLE IF NOT EXISTS students (
      ID int NOT NULL AUTO_INCREMENT,
      firstName varchar(30),
      lastName varchar(30),
      studentID varchar(9),
      PRIMARY KEY (ID)
    );`;
  await connection.query(createDBAndSchema);
  let results = await connection.query("SELECT COUNT(*) FROM students");
  let numberOfStudents = results[0][0]['COUNT(*)'];
  if (numberOfStudents < 1) {
    results = await connection.query("INSERT INTO students (firstName, lastName, studentID) VALUES ('John', 'Braithwaite', 'A01206633');");
    console.log('added Johns data');
  }
  connection.end();

}

async function retrieveStudents() {
  const mysql = await require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });
  await connection.query('use test;');
  let results = await connection.query('SELECT * FROM students;');
  connection.end();
  return results;
}

//GET REQUESTS

/* GET login.html */
app.get('/', (req, res) => {
  let doc = fs.readFileSync(__dirname + '/login.html', 'utf-8');
  initializeDB();
  res.set('Server', 'Zamboni Engine');
  res.set('X-Powered-By', 'Zamboni');
  res.send(doc);
});

app.get('/sign_out', (req, res) => {
  req.session.destroy();
  res.send(200);
})

/* GET index.html */
app.get('/profile', (req, res) => {
  initializeStudentsDB();
  // check for a session
  if (req.session.loggedIn) {
    let templateFile = fs.readFileSync(__dirname + '/Templates/profile_template.html', 'utf-8');
    let templateDOM = new JSDOM(templateFile);
    let $template = require('jquery')(templateDOM.window);

    // put username into profile page
    $template('#usernameDisplay').html(req.session.username);
    $template('#tertiaryDiv').html(fs.readFileSync('./Templates/ethan.html')
      + fs.readFileSync('./Templates/liam.html')
      + fs.readFileSync('./Templates/john.html')
      + fs.readFileSync('./Templates/trevor.html'));
    $template("")

    // query database for student info
    let results = retrieveStudents();


    console.log(results);


    res.send(templateDOM.serialize());
  } else {
    // with out a session, not logged in
    res.redirect('/');
  }

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
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });

  connection.query("SELECT * FROM user WHERE username = ? AND password = ?", [user, pwd], function (error, results) {
    if (error) {
      throw error;
    }

    if (results.length > 0) {
      // username and password are found
      return callback(results[0]);
    } else {
      return callback(null);
    }

  })
}