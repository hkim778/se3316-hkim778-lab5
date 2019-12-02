const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PolicySchema = new Schema({

    policy1: String,
    policy2: String,
    policy3: String,
    

})

module.exports=mongoose.model('Policy',PolicySchema);