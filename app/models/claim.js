const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ClaimSchema = new Schema({

    name: String,
    description: String
    

})

module.exports=mongoose.model('Claim',ClaimSchema);