var express		= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	Campground  = require("./models/campground"),
	mongoose	= require("mongoose"),
	methodOverride = require("method-override"),
	Comment     = require("./models/comment"),
	passport 	= require("passport"),
	LocalStratergy = require("passport-local"),
	flash		= require("connect-flash"),
	User 		= require("./models/user");
	// seedDB      = require("./seeds");
	// knex 		= require('knex');	 
	// pg 			= require("./node_modules/pg");
//requiring routes
var commentRoutes	 	= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

//mongoDB setup
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("__method"));
app.use(flash());
// seedDB();
var knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'shubham',
	  password : '7411',
	  database : 'campgrounds'
	}
  });
//   console.log(knex.select('*').from('users'));
//passport COnfiguration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error	= req.flash("error");
	res.locals.success	= req.flash("success");
	next();
});
//using routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//get the server started
app.listen(8000,function(){
	console.log("Campground Recommendor System Started");
});
