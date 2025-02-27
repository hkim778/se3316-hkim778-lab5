//app.js 

const express = require('express');
const bodyParser = require('body-parser');

//initialize
const app = express();

//jswon webtokn token
const jwt = require ('jsonwebtoken');


//connect mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root123@ds341557.mlab.com:41557/lab5',{useNewUrlParser:true,useUnifiedTopology:true});

//Model Schemas
var Song = require("./app/models/song");
var User = require("./app/models/user");
var Policy = require("./app/models/policy");
var Claim = require("./app/models/claim");

//for email verification
var nev = require("email-verification")(mongoose);
var nodeEmailer = require("nodemailer");

//soft-matching
var stringSimilarity = require('string-similarity');

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
var port = 8081;//process.env.PORT || 8080;  

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
        if(accountInfo(email,password)!= ""){
            return res.send(accountInfo(email,password));
        }

        
        User.findOne({email: email},function(err,objectFound){
            if(err)
                return res.send(err);
            //if the object does not exist in the DB
            if (objectFound === null){
                return res.send({message: "Account is invalid"}); 
            }

            //if the password from the body doesn't match the hashed password in DB for the correct email
            if(!bcrypt.compareSync(password,objectFound.password)){
                return res.send({message: "Account is invalid"}); //so the adversary doesn't know if the account or if the password is wrong
            }   

            //if the account is deactivated
            if(!objectFound.activation){
                return res.send({message:"Account is deactivated. Contact the store manager"});
            }
            
            //if the account is not verfied
            if(!objectFound.emailVerification){
                verifyEmail(objectFound,req.get('host'));
                return res.send({message: "Verification neeeded. Email resent"})
            }
            if(objectFound.admin)
            {
                return res.send({message: "Welcome, Admin"});
            }
            
            return res.send({message: "Logged in successfully!"});
        });
        
    });

//Create new user
router.route('/newUser')
    .post(function(req,res){
        var verificationCode;
        var email = req.body.email;

        var user = new User();
        
        if(accountInfo(email,req.body.password)!= ""){
            return res.send(accountInfo(email,req.body.password));
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
        var code= req.params.verificationCode;
        
        User.findOne({verificationCode: code},function(err,objectFound){
            if(err)
                return res.send(err);
            if(objectFound!=null){
                objectFound.emailVerification = true;
                objectFound.save(function(err){
                    
                    if(err)
                        return res.send(err);
                    return res.send("<h1>User has been Verified</h1>")
                })
                
            }
            else{
                return res.send("<h1>User does not exist</h1>")
            }
        });


    })

//if the input is not given for the id and password
function accountInfo(email,password){
    var message = "";

    //empty password
    if(password ===""){
        message = {message:"Please Enter your Password"};
    }

    //for invalid email format
    var emailVerify = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
    var emailTest = true;
    if(email != "site manager"){
        emailTest = emailVerify.test(email);
    }
 
    if(!emailTest){
        message = {message: "Invalid email"};
    }

    return message;
}

function verifyEmail(user,host){
    var verificationEmail,verificationLink;

    //link to the file
    verificationLink = "http://" + host+ "/api/verify/" + user.verificationCode;
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
            
            var total=0, average = 0;
            var temp = [];
            //for each songs in the DB
            for(var i =0; i <songs.length;i ++){
                total = 0;
                average = 0;
                //for each ratings
                //console.log(songs[i].review.length);
                for(var j = 0; j<songs[i].review.length;j++){
                    //console.log(songs[i].review[j].rating)
                    //calculates the average of the specific song
                    total += songs[i].review[j].rating;
                    average = total / (songs[i].review.length)
                    
                }
                //add the average
                temp.push(average);
            }
            
            //console.log(temp);
            
            //sort it by the average ratings
            for (var i = 0; i<temp.length; i ++){
                for(var j = i+1; j<temp.length; j++){
                    if(temp[i]<temp[j]){
                        var tempB = temp[i];
                        temp[i] = temp[j];
                        temp[j]= tempB;
                    
                        var tempA = songs[i];
                        songs[i] = songs[j];
                        songs[j] = tempA;
                        
                    }
                }
            }
        
            //console.log(songs);
            res.json(songs);
        }).limit(10)
    })

//search for a specific song
router.route('/open/song/search/:title')
    .get(function(req,res){
        var name = req.params.title;
        console.log(name);
        
        //The gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string.
        name = new RegExp(req.params.title,'gi');
        //console.log(name);
        //need soft matching
        Song.find({title:name},function(err,songFound){
            
            if(err)
                return res.send(err);

            if(songFound.length == 0){
                return res.send({message: "Not in our database"})
            }
            res.json(songFound);
        })
    })

//add review to the song
router.route('/secure/review/:title')
    .put(function(req,res){
        var name = req.params.title;

        var username = req.body.username;
        var review = req.body.review;
        
        var ratings = req.body.rating;

        var temp = {username: username, review: review, rating: ratings}

        Song.findOne({title:name},function(err,songFound){
            if(err)
                return res.send(err);
            songFound.review.push(temp);
            songFound.save(function(err){
                if(err)
                    return res.send(err);

                return res.send({message: "Review is added"});
            })
        })
    })

router.route('/secure/song')
    .post(function(req,res){
        var title = req.body.title;
        var artist = req.body.artist;

        song = new Song();
        song.title = title;
        song.artist = artist;
        song.album = req.body.album;
        song.year= req.body.year;
        song.track = req.body.track;
        song.genre= req.body.genre;

        var username = req.body.username;
        var review = req.body.review;
        
        var ratings = req.body.rating;
        var temp = {username: username, review: review, rating: ratings}
        song.review.push(temp);


        song.save(function(err){
            if (err)
                return res.send(err);

            return res.send({message: "song has been saved"});
        })



    })

router.route("/admin/users")
    .get(function(req,res){
        User.find(function(err,found){
            if(err)
                return res.send(err);
            if(found === null)
                return res.send({message:"User does not exist"});
            
            res.json(found);
        })
    })

router.route("/admin/user/:id")
    .get(function(req,res){
        var id = req.params.id;



        User.findById(id,function(err,userFound){
            if(err)
                return res.send(err);
            
            if(userFound == null){
                return res.send({message:"That user does not exist"})
            }

            if(!userFound.admin)
                userFound.admin = true;
                userFound.save(function(err){
                    if (err)
                        return res.send(err);
                    return res.send({message:"Priviledge is granted"});
                })

            
        })

    })

router.route("/admin/user/deactivate/:id")
    .get(function(req,res){
        var id = req.params.id;
        User.findById(id,function(err,userFound){
            if(err)
                return res.send(err);
            
            if(userFound == null){
                return res.send({message:"That user does not exist"})
            }

            if(!userFound.activation)
                userFound.activation = true;
            else
                userFound.activation = false;

            userFound.save(function(err){
                if (err)
                    return res.send(err);
                if(userFound.activation)
                {
                    return res.send({message:"Account is activated"});
                }
                else{
                    return res.send({message:"Account is deactivated"});
                }
                
            })

            
        })
    })

//retrieve and create 

router.route("/admin/policy")
    .get(function(req,res){
        Policy.find(function(err,policies){
            if (err)
                return res.send(err);
            if(policies == null){
                return res.send({message: "policy does not exist"});
            }
            res.json(policies);
        })
    })
    .post(function(req,res){
        policy = new Policy();

        policy.policy1 = req.body.policy1;
        policy.policy2 = req.body.policy2;
        policy.policy3 = req.body.policy3;

        policy.save(function(err){
            if(err)
                return res.send(err);

            return res.send({message:"Policy is created"});
        })
    })
//update policy
router.route("/admin/policy/:id")
    .put(function(req,res){
        var id = req.params.id;

        var policy1 = req.body.policy1;
        var policy2 = req.body.policy2;
        var policy3 = req.body.policy3;


        Policy.findById(id, function(err,foundPolicy){
            if(policy1 == "" || policy1 ==null||policy1 == undefined){
                
                foundPolicy.policy1 = foundPolicy.policy1;
            }
            else{
                foundPolicy.policy1 = policy1;
            }
            
            if(policy2 == "" || policy2 ==null||policy2 == undefined){
                
                foundPolicy.policy2 = foundPolicy.policy2;
            }
            else{
                foundPolicy.policy2 = policy2;
            }
            if(policy3 == "" || policy3 ==null||policy3 == undefined){
                
                foundPolicy.policy3 = foundPolicy.policy3;
            }
            else{
                foundPolicy.policy3 = policy3;
            }

            foundPolicy.save(function(err){
                if(err)
                    return res.send(err);
                return res.send({message: "Policy has been updated"});
            })
        })
    })

    //retrieve and create 

router.route("/admin/claim")
.get(function(req,res){
    Claim.find(function(err,claims){
        if (err)
            return res.send(err);
        if(claims == null){
            return res.send({message: "claims do not exist"});
        }
        res.json(claims);
    })
})
.post(function(req,res){
    claim= new Claim();

    claim.name = req.body.name;
    claim.description = req.body.description;

    claim.save(function(err){
        if(err)
            return res.send(err);

        return res.send({message:"Claim is created"});
    })
})








// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);