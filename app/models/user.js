const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    
    email:      String,
    password:   String,
    emailVerification: {type:Boolean, default:false},
    verificationCode: String,
    activation: Boolean, // if it's deactivated or not
    

})

module.exports=mongoose.model('Users',UserSchema);