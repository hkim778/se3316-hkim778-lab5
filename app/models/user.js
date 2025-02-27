const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    
    email:      String,
    password:   String,
    emailVerification: {type: Boolean, default: false},
    verificationCode: String,
    activation: {type:Boolean, default:true}, // if it's deactivated or not
    admin : {type:Boolean, default: false}
    

})

module.exports=mongoose.model('Users',UserSchema);