//app.js 

const express = require('express');
const bodyParser = require('body-parser');

//initialize
const app = express();

//for hashing passwords
const bcrypt = require('bcrypt');

//connect mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root123@ds341557.mlab.com:41557/lab5',{useNewUrlParser:true,useUnifiedTopology:true});

//Model Schemas
var Song = require("./app/models/song");
var User = require("./app/models/user");

//constant for salt
const roundOfSalt = 10;


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

//LOG IN USER
router.route('/login')
    .post(function(req,res){
        var email = req.body.email;
        var password = req.body.password;


        //When user didn't enter anything
        //return is used so it doesn't duplicate send
        if(validateEmail(email,password)!= ""){
            return res.send(validateEmail(email,password));
        }

        
        User.findOne({email: email},function(err,objectFound){
            if(err)
                return res.send(err);
            //if the object does not exist in the DB
            if (objectFound === null){
                return res.send({message: "Account is invalid"}); 
            }
            //if the password from the body matches the password in DB of the correct email
            if(bcrypt.compareSync(password,objectFound.password)){
                return res.send({message: "Logged in successful!"});
            }
            else //incorrect password
                return res.send({message: "Account is invalid"}); //so the adversary doesn't know if the account or if the password is wrong
            
        });
        
    });

//Create new user
router.route('/newUser')
    .post(function(req,res){
        var email = req.body.email;

        var user = new User();
        
        if(validateEmail(email,req.body.password)!= ""){
            return res.send(validateEmail(email,req.body.password));
        }

        User.findOne({email: email},function(err,objectFound){
            if(err){
                return res.send(err);
            }
            //when the acclunt does not exist in the db so it's valid for new users
            if (objectFound === null){
                user.email = email;

                //hash the password 
                //for hashing the password, done synchronously
                var salt = bcrypt.genSaltSync(roundOfSalt);
                var password = bcrypt.hashSync(req.body.password, salt);

                user.password = password;


                user.save(function(err){
                    if(err){
                        return res.send(err);
                    }
                    return res.send({message: "New Account is created"});
                })
            }
            //other outcome
            else {
                return res.send({message: "Account creation failed. Try again"});
            }
            
        })

    })


// FOR NON-LOG IN USERS
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


//if the input is not given for the id and password
function validateEmail(email,password){
    var message = "";
        if (email ==="" && password ===""){
            message = {message:"Please enter your account information"};
        }
        if(email ===""){
            
            message = {message: "Please Enter your email"};
        }
        if(password ===""){
            message = {message:"Please Enter your Password"};
        }
    return message;
}


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);