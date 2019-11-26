//app.js 

const express = require('express');
const bodyParser = require('body-parser');

//initialize
const app = express();

//connect mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root123@ds341557.mlab.com:41557/lab5',{useNewUrlParser:true,useUnifiedTopology:true});

//Schemas
var Song = require("./models/song");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//port number
var port = process.env.PORT || 8080;  

router = express.Router();

//middleware to use for all requests
router.use(function(req,res,next){
    //do logging
    console.log('Something is happening');
 
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accpet");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    next();
 });

//routs that will be used

// /open is for the user without authentication

// /open/song returns 10 songs, ordered in average view 
router.route('/open/song')
    .get(function(req,res){
        Song.find(function(err,songs){
            if(err)
                res.send(err);

            res.json(songs);
        });
    });
//
router.route('/open/song/search')
    .get(function(req,res){
        res.json("hello");
    });




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);