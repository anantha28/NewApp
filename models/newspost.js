var mongoose=require("mongoose");
var newspostSchema=new mongoose.Schema({
    name:String,
    description1:String,
    description2:String,
    image1:String,
    image2:String,
    userId:String,
    username:String,
    posttype:String,
    place:String,
    sourceLink:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//var Campground=mongoose.model("Newspost",newspostSchema);

module.exports=mongoose.model("Newspost",newspostSchema);