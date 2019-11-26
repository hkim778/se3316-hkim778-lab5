const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SongSchema = new Schema({
    id:{type:String, required: true},
    name:{type:String, required: true, max:30},

})

module.exports=mongoose.model('Songs',SongSchema);