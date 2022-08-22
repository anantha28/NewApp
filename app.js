var express=require("express");
//testing
var app=express=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var flash=require("connect-flash");
app.locals.moment=require("moment");
//var request=require("request");



mongoose.connect("mongodb://localhost/news_appv1",{useNewUrlParser: true});
var passport=require("passport");
var localStrategy=require("passport-local");
var methodOverride=require("method-override");

var Newspost=require("./models/newspost");
var Profile=require("./models/profile");


app.use(methodOverride("_method"));/////////for method Override this has to be added.

app.use(bodyParser.urlencoded({extended:true}));

var User=require("./models/user");

app.use(require("express-session")({
    secret:"Rusty is the best",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());


app.use(function(req,res,next)//////////////this helps to pass a variable which can be used in any ejs files.
//this will pass status of user as log in or log out to every page.
{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");///////for displaying flash message in any page under the name error if required.////////
    res.locals.success=req.flash("success");
    next();
});


app.get("/",function(req,res)
{   
    
    Newspost.find({place:"card"},function(err, card) {
        if(err)
        {
            console.log(err);
        }
        else{
            
            //console.log(card);
           
             Newspost.find({place:"breaking"},function(err, breaking){
                if(err)
                console.log(err);
                else
                {
                    Newspost.find({place:"trending"},function(err, trending) {
                        if(err)
                        console.log(err);
                        else{
                            Newspost.aggregate([{$match:{place:"collage"}},{$sort:{createdAt:-1}}],function(err,collage)
                            {
                                if(err)
                                console.log(err);
                                else{
                                    //console.log(collage);
                                    Newspost.find({place:"rightcollage"},function(err, rightcollage) {
                                        if(err)
                                        console.log(err);
                                        else
                                        {   
                                            Newspost.find({posttype:"politics"},function(err, politics) {
                                                if(err)
                                                console.log(err);
                                                else{
                                                    politics=politics.slice(Math.ceil(politics.length/2),politics.length-1);
                                                    Newspost.find({posttype:"sports"},function(err, sports) {
                                                        if(err)
                                                        console.log(err);
                                                        else{
                                                            sports=sports.slice(Math.ceil(sports.length/2),sports.length-1);
                                                            Newspost.find({posttype:"technology"},function(err, technology) {
                                                                if(err)
                                                                console.log(err);
                                                                else
                                                                {
                                                                  technology=technology.slice(Math.ceil(technology.length/2),technology.length-1);
                                                                  Newspost.find({posttype:"business"},function(err, business) {
                                                                      if(err)
                                                                      console.log(err);
                                                                      else{
                                                                         business=business.slice(Math.ceil(business.length/2),business.length-1);
                                                                         Newspost.find({posttype:"automobiles"},function(err, automobiles) {
                                                                             if(err)
                                                                             console.log(err);
                                                                             else{
                                                                                 automobiles=automobiles.slice(Math.ceil(automobiles.length/2),automobiles.length-1);
                                                                                 Newspost.find({posttype:"health"},function(err, health) {
                                                                                     if(err)
                                                                                     console.log(err);
                                                                                     else{
                                                                                         health=health.slice(Math.ceil(health.length/2),health.length-1);
                                                                                         Newspost.find({posttype:"entertainment"},function(err, entertainment) {
                                                                                             if(err)
                                                                                             console.log(err);
                                                                                             else{
                                                                                                 //console.log(collage);
                                                                                                 Newspost.find({posttype:"nature"},function(err,nature){
                                                                                                     if(err)
                                                                                                     console.log(err);
                                                                                                     else{
                                                                                                         entertainment=entertainment.slice(Math.ceil(entertainment.length/2),entertainment.length-1);
                                                                                                 res.render("landing.ejs",{card:card,collage:collage,breaking:breaking,rightcollage:rightcollage,trending:trending,politics:politics,
                                                                                                     sports:sports,technology:technology,business:business,automobiles:automobiles,health:health,entertainment:entertainment,nature:nature
                                                                                                 });
                                                                                                     }
                                                                                                 });
                                                                                                 
                                                                                             }
                                                                                         });
                                                                                     }
                                                                                 });
                                                                             }
                                                                         });
                                                                      }
                                                                  });
                                                                }
                                                                
                                                            });
                                                        }
                                                    });
                                                }
                                            });
    
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
             });
             
        }
        
    });
  
    });
    

app.get("/login",function(req, res) {
    req.flash("error");
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local",
{
  successRedirect:"/",
  failureRedirect:"/login",
  failureFlash:true////////////////////added this to give flash message when username or passsword is wrong///////////.
}),function(req, res) {
//console.log("entered");
});

app.get("/logout",function(req,res){
   req.logout();
   req.flash("success","Successfully logged you out");
   res.redirect("/login");
});


app.get("/show/:id",isLoggedIn,function(req,res){
    var postid=req.params.id;
    if(postid.match(/^[0-9-a-fA-F]{24}$/)){
    Newspost.findById(postid,function(err,foundp){
        if(err)
        console.log(err);
        else{
            var tag=foundp.posttype;
            Newspost.find({posttype:tag},function(err, similarpost) {
                if(err)
                console.log(err);
                else{
                 var simtags=[];
               similarpost.forEach(function(f){
                   if(f._id!=postid)
                   simtags.push(f);
               });
             var result=[];
            var len = simtags.length;
            var n=4;
            var taken = new Array(len);
             if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
             while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = simtags[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
                        }
            Newspost.aggregate([{$match:{posttype:{$ne:tag}}},{$sample:{size:9}}],function(err,otherss){
                if(err)
                console.log(err);
                else{
                    res.render("show.ejs",{foundp:foundp,result:result,otherss:otherss}); 
                }
            });
               
                }
            });
        }
    });
    }
});



//----------------------PROFILE ROUTE--------------------------------------------

app.get("/profile",function(req, res) {
    //var username=req.user.username;
   // var userid=req.user._id;
    
    var joindate=new Date().toDateString();
    //console.log(joindate);
    var requser=req.user.username;
    res.render("newprofile.ejs",{requser:requser,joindate:joindate});
        
});

app.get("/profilenav",function(req,res) {
    var userclickedid=req.user._id;
    Profile.find({userId:userclickedid},function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else{
            //console.log(foundUser[0]);///////////////////////////no idea why an array is being created.
            res.render("profile.ejs",{foundUser:foundUser[0]});/////////////
        }
    });
});

app.put("/profilenav/update",function(req, res) {
    var userId=req.body.userId;
    var displayname=req.body.displayname;
    var gender=req.body.gender;
    var profession=req.body.profession;
    Profile.find({userId:userId},function(err,foundUser)
    {
        if(err)
        console.log(err);
        else{
            //console.log(foundUser);
            foundUser[0].displayname=displayname;///////////////no idea why getting an array//////////
            foundUser[0].gender=gender;
            foundUser[0].profession=profession;
            foundUser[0].save();
            res.redirect("/profilenav");
        }
    });
});

app.post("/profile",function(req,res) {
    var username=req.body.displayname;
    var gender=req.body.gender;
    var profession=req.body.profession;
    var displayname=req.body.displayname;
    var joindate=req.body.joindate;
    var newprofile={username:username,displayname:displayname,gender:gender,profession:profession,joindate:joindate};
    Profile.create(newprofile,function(err, newprofile) {
        if(err)
        {
            console.log(err);
        }
        else
        {       
            newprofile.userId=req.user._id;
            newprofile.save();
            console.log(newprofile);
            req.flash("success","Created profile");
            res.redirect("/");
        }
    });
});


app.get("/landing",function(req, res) {
        res.render("landing.ejs");
    
});


app.get("/newspost/new",isLoggedIn,function(req,res){
   res.render("newspostnew.ejs");
});
app.post("/newspost/new",isLoggedIn,function(req,res){
    var name=req.body.name;
    var description1=req.body.description1;
    var description2=req.body.description2;
    var image1=req.body.image1;
    var image2=req.body.image2;
    var posttype=req.body.posttype;
    var username=req.user.username;
    var userId=req.user._id;
    var place=req.body.place;
    var sourceLink=req.body.sourceLink;
    var newpost={name:name,description2:description2,description1:description1,image1:image1,image2:image2,posttype:posttype,userId:userId,username:username,place:place,sourceLink:sourceLink};
    
    Newspost.create(newpost,function(err,newpost){
       if(err)
       console.log(err);
       else{
           res.redirect("/newspost/new");
       }
    });
    //res.render("trial.ejs");
});

app.delete("/show/delete/:id",function(req,res){
    var id=req.params.id;
    Newspost.findByIdAndRemove(id,function(err,d){
        if(err)
        console.log(err);
        else{
            res.redirect("/") ;
            }
    });
});

app.get("/register",function(req,res)
{
    res.render("register.ejs"); 
});
app.post("/register",function(req,res)
{
    //var username=req.body.username;
   // var passsword=req.body.passsword;
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,users)
    {
        if(err){
        console.log(err);
        req.flash("error",""+err.message);
        return res.redirect("/register");
        }
        else
        {
            passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome "+users.username);
           res.redirect("/profile");
       });
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
     req.flash("error","Please login first");
    res.redirect("/login");
   
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("NewsApp has started");
})
