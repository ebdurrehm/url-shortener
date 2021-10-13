var express = require('express');
var app = express();
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var {nanoid} = require('nanoid');
dotenv.config({path:"secret.env"});
var bodyParser = require('body-parser');
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
//define middlware to send response as json



app.get('/', (req,res)=>{
    res.sendFile('/public/index.html',{root: __dirname});})

// create post route and endpoint /api/
app.post('/api/', (req,res)=>{
 
    //get user entered url
    const orginalUrl = req.body.orginalUrl;
   
    const shortedUrl = myUrl+nanoid(5); //create random unique 5 digits code (nanoid is for this purpose) and add to your base url, your shourted url are ready
    
    // send all data to database
    Db.create ({orginalUrl,myUrl, shortedUrl}, (err,data)=>{
        if(err) res.json("your url alredy exsist!");//check if url alredy exsist in database throw an error
        res.status(200).json(data.shortedUrl ); // else send to user created url
    });
    
});

app.get('/:url',async (req,res)=>{
    const url =req.params.url;
    const findUrl= myUrl+url;
    const data = await Db.findOne({shortedUrl:findUrl});
    const orgUrl = data.orginalUrl;
    console.log(data);
    console.log(orgUrl);
    res.redirect(orgUrl);
    
})
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});

