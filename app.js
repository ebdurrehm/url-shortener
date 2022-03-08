var express = require('express');
var app = express();
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var {nanoid} = require('nanoid');
dotenv.config({path:"secret.env"});
var bodyParser = require('body-parser');

//define middlware to send response as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static('public'));
//get model
var Db = require('./models/db');
const myUrl = ' https://u-shortner.herokuapp.com/';
//connect to database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) console.log(err);
    console.log("you are connected to db");
});


app.get('/', (req,res)=>{
    res.sendFile('/public/index.html',{root: __dirname});})

// create post route and endpoint /api/
app.post('/api/', (req,res)=>{
 
    //get user entered url
    const orginalUrl = req.body.orginalUrl;
     const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
   
    const shortedUrl = myUrl+nanoid(5); //create random unique 5 digits code (nanoid is for this purpose) and add to your base url, your shourted url are ready
    
     if(regex.test(orginalUrl)){
    const parsedUrl = new URL(orginalUrl);
   const hostname = parsedUrl.hostname;
    //check if the dns adresses of the hostname are valid
    dns.lookup(hostname,(err, family, adress)=> {
      if(err){ res.json({"error":"Invalid Hostname"})}
      else{
    // send all data to database
    Db.create ({orginalUrl,myUrl, shortedUrl}, (err,data)=>{
        try {
            res.send("<h1 style='text-align:center; margin-bottom:20px; color:chocolate; font-size:50;'> Your shortened url &#128071;</h1> "+ "<p style='text-align:center'><a style='background-color: cornsilk; padding: 10px; ' href="+data.shortedUrl+">"+"&#128279;"+data.shortedUrl+"</a></p>"); // else send to user created url
          }
          catch (exception_var) {
            if (err) res.send("<p style='background-color: red; padding: 40px; color: white; font-size: 20px; text-align: center;'>your url alredy exsists!</p>");
          }
          
   }) }
      
    })
    
  }
  else{
    res.json({"error":"Invalid URL"});
  }
    
});

//configure user request that contain shortened url
app.get('/:url',async (req,res)=>{
    const url =req.params.url; // grab url code
    const findUrl= myUrl+url; //create shoret url again
    const data = await Db.findOne({shortedUrl:findUrl}); //get data which contain user shortened url
    const orgUrl = data.orginalUrl; // get orginal url 
    console.log(data);
    console.log(orgUrl);
    res.redirect(orgUrl); // redirect user to orginal url
    
})

//server configuration
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});

