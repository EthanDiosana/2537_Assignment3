const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);

//SERVING STATIC FILES (SCRIPT, CSS)
app.use(express.static(path.join(__dirname, 'Images')));
app.use(express.static(path.join(__dirname, 'Styles')));
app.use(express.static(path.join(__dirname, 'Scripts')));

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

  console.log("Username: ", req.body.username);
  console.log("Password: ", req.body.password);
})

// SERVER LISTENING
server.listen(8000, () => {
  console.log('listening on localhost:8000');
});