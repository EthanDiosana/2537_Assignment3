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

// SERVER LISTENING
server.listen(8000, () => {
  console.log('listening on localhost:8000');
});