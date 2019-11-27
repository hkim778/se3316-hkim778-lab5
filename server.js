//app.js 

const express = require('express');
const bodyParser = require('body-parser');

//initialize
const app = express();



//connect mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root123@ds341557.mlab.com:41557/lab5',{useNewUrlParser:true,useUnifiedTopology:true});

//Model Schemas
var Song = require("./app/models/song");
var User = require("./app/models/user");

//for email verification
var nev = require("email-verification")(mongoose);
var nodeEmailer = require("nodemailer");

//for random verification code
var randomstring = require("randomstring");

//for hashing passwords
const bcrypt = require('bcrypt');

//constant for salt
const roundOfSalt = 10;

//server email to send verification
var serverEmail = nodeEmailer.createTransport({
    service: "Gmail",
    auth:{
        user:'hkim778.se3316.lab5@gmail.com',
        pass:'Example123'
    }
});


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
        if(emptySubmission(email,password)!= ""){
            return res.send(emptySubmission(email,password));
        }

        
        User.findOne({email: email},function(err,objectFound){
            if(err)
                return res.send(err);
            //if the object does not exist in the DB
            if (objectFound === null){
                return res.send({message: "Account is invalid"}); 
            }
            //if the account is not verfied
            if(!objectFound.emailVerification){
                verifyEmail(objectFound,req.get('host'));
                return res.send({message: "Verification neeeded. Email resent"})
            }
            //if the password from the body matches the hashed password in DB for the correct email
            if(bcrypt.compareSync(password,objectFound.password)){
                return res.send({message: "Logged in successfully!"});
            }
            else //incorrect password
                return res.send({message: "Account is invalid"}); //so the adversary doesn't know if the account or if the password is wrong
            
        });
        
    });

//Create new user
router.route('/newUser')
    .post(function(req,res){
        var verificationCode;
        var email = req.body.email;

        var user = new User();
        
        if(emptySubmission(email,req.body.password)!= ""){
            return res.send(emptySubmission(email,req.body.password));
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

                verificationCode = randomstring.generate();
                console.log(verificationCode);

                user.verificationCode = verificationCode;

                //sends the email
                verifyEmail(user,req.get('host'));    

                user.save(function(err){
                    if(err){
                        return res.send(err);
                    }
                    return res.send({message: "New Account is created. Check your email to verify"});
                })
            }
            //other outcome
            else {
                return res.send({message: "Account creation failed. Try again"});
            }  
        })
    })

//for email verification website
router.route('/verify/:verificationCode')

    //initially put was attempted since i did not know we can alter the data from GET option
    //when the user accesses the link, they will be verfied
    .get(function(req,res){
        var code= req.params.verifcationCode;
        User.findOne({verifcationCode: code},function(err,objectFound){
            if(err){
                return res.send(error);
            }
            // if the user with the corresponding verification code does not exist
            if(objectFound === null){
                return res.send({message: "User does not exist"})
            }

            objectFound.emailVerification = true;
            objectFound.save(function(err){
                if(err)
                    return res.send(err);
            })
            return res.send({message: "Account has been successfully registered"});

        });
    })
    
 





//if the input is not given for the id and password
function emptySubmission(email,password){
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

function verifyEmail(user,host){
    var verificationEmail,verificationLink;

    //link to the file
    verificationLink = "http://" + host+ "/api/verify/:" + user.verificationCode;
    //console.log(verificationLink);
    
    //creates the required fields to who to send the email to 
    verificationEmail = {
        to: user.email,
        subject: 'Confirm Your Email',
        text: 'hi',
        html:'<p>To Verfiy click <a href="'+ verificationLink +'">here</a></p>'
    }

    serverEmail.sendMail(verificationEmail,function(err,emaiSent){
        if(err){
            console.log("sending email unsuccessful");
            return false;
        }
        else{
            console.log("sending email successful");
            return true;
        }
            
            
    });



}

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



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);