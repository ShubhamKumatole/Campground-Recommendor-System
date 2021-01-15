var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const { Client } = require('pg');
client = new Client({
    host: '/var/run/postgresql/',
    user: 'shubham',
    password: '7411',
    database: 'campgrounds',
});
client.connect();
router.get("/",function(req,res){
	res.render("landing");
});


//sign up or register route
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser , req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.render("register");
			
		}
		const text = 'INSERT INTO users(firstname, lastname, username,age) VALUES($1, $2 ,$3, $4) RETURNING *'
		const values = [req.body.fname,req.body.lname,req.body.username,req.body.age];
		client.query(text,values)
		.then(res => console.log(res.row[0]))
		.catch(e => console.log(e));
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to Campground Recommendor System "+user.username);
			res.redirect("/campgrounds");
		})
	})
	
});

//show login form
router.get("/login",function(req,res){
	res.render("login");
});

//login post route
router.post("/login",passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
	}),function(req,res){

});

//logout routes
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
})


//logged in middleware
function isLoggegIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;