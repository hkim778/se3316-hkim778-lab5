const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SongSchema = new Schema({
    //id:{type:String, required: true},
    title:{type:String, required: true, max:30},
    artist:{type:String, required: true}
    

})

module.exports=mongoose.model('Songs',SongSchema);