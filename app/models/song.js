const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SongSchema = new Schema({
    //id:{type:String, required: true},
    title: String,
    artist:String,
    album: String,
    year: {type:Number, max:4},
    
    

})

module.exports=mongoose.model('Songs',SongSchema);