const express = require('express');
const cors= require('cors')
const bodyParser = require('body-parser');
var path = require('path');
const mongoose = require('mongoose');
const config = require('./config.js')
const url= config.mongoUrl
const app = express();

const userRouter = require('./userRouter')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// define a simple route

// listen for requests
app.use('/users',userRouter)

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
   
  console.error(`error :${err} `)
  });
  
const connect = mongoose.connect(url)
 connect.then((db)=>{
     console.log("connected to server")
 },err => console.log(err))

app.listen(5000, () => {
    console.log("Server is listening on port 3000");
});