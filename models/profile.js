var mongoose=require("mongoose");
//var passportLocalMongoose=require("passport-local-mongoose");

var profileSchema=new mongoose.Schema({
    username:String,
    gender:String,
    profession:String,
    joindate:String,
    displayname:String,
    userId:String
});

module.exports=mongoose.model("Profile",profileSchema);