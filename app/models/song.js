const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReviewSchema = new Schema ({
    username: String,
    review: String,
    rating: {type: Number, max:10},
})


let SongSchema = new Schema({
    //id:{type:String, required: true},
    title: {type:String, required: true},
    artist:{type:String, required: true},
    album: {type:String, required: true},
    year: {type: Number, required:true},
    track: {type:Number, required: true},
    genre: {type:String, required: true},

    review: [ReviewSchema],
    

})

module.exports=mongoose.model('Songs',SongSchema);