require('./models/db');
const express = require('express');
const path = require('path');
const {Socket}=require('socket.io');   
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyparser = require('body-parser');
const Occupation = require('./models/occupation.model');
const QRCode = require('qrcode');
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

const blocController = require('./controllers/blocController');
const salleController = require('./controllers/salleController');
const crenauController = require('./controllers/crenauController');
const dashboardController = require('./controllers/dashboardController');
const occupationController = require('./controllers/occupationController');
const mongoose=require('mongoose');
const Bloc=mongoose.model('Bloc');
const Salle=mongoose.model('Salle');
var app = express();


var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('user connected');

    var labels=[];
    var donnees=[];
    
    Bloc.find((err, docs) => {
      docs.forEach(element => {
          console.log(element);
     
        labels.push(element.name);
        Salle.count({ blocName:element.name}, function(err, result) {
          if (err) {
            res.send(err);
          } else {
            
            donnees.push(result);
          }
        });
      });
    });
    console.log(donnees);
    const myTimeout = setTimeout(fun, 1500);
    var data;
    function fun() {
     data = {
      labels: labels,
      datasets: [{
        label: '',
        backgroundColor:[
          
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          
          'rgba(54, 162, 235)',
          'rgba(255, 99, 132)',
          'rgba(255, 159, 64)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderWidth: 1,
        data: donnees,
      }]
    };
    socket.emit("display",data);
  }
    
    
    const changeStream = Occupation.watch();
    changeStream.on('change', next => {
        const resumeToken = changeStream.resumeToken;
        const operation = next.operationType;

        if (next.operationType === 'insert') {
            
            //  console.log(next.fullDocument._idSalle)
            socket.emit("test",  next.fullDocument.date, next.fullDocument.namesalle, next.fullDocument.crenauhr,next.fullDocument._id);
        }
    });

})
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
http.listen(3000, () => {
    console.log('Express server started at port :3000');
});

app.use('/bloc', blocController);
app.use('/salle', salleController);
app.use('/crenau', crenauController);
app.use('/occupation', occupationController);
app.use('/dashboard', dashboardController);
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );