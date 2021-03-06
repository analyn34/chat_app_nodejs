var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = '';

var Message = mongoose.model('Message', { name : String, message : String });

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  });
})

io.on('connection', () => {
  console.log('a user is connected');
})

mongoose.connect(dbUrl, (err) => {
  console.log('mongodb connected', err);
})

server.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});