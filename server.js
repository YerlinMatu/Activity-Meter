const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 27877;

app.get('/', (req, res) => {
    res.redirect('public/index.html');
});

app.get('/receptor', (req, res) => {
    res.redirect('public/receptor.html');
});

server.listen(port, () => { console.log(`Server Running port ${port}`)});
// Objet sended to client.
let activity = {
    sum: 0,
    time: 0,
    sumtotal: 0
}

function RandomSum(min, max) {
  setInterval(() => {
     activity.sum =  Math.abs(parseInt(Math.random() * (min - max) + min));
     activity.sumtotal += activity.sum;
  }, 1000)
}

io.on('connection', (socket) => {
//  RandomSum(0, 100);
  socket.on('number', (num) => {
    activity.sum = num;
    activity.sumtotal += num;
  })
  setInterval(() => {
    activity.time = new Date().getSeconds();
    socket.emit('info', activity);
  }, 1000);
});
