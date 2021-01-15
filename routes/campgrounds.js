var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
const { Client } = require('pg');
const { connect } = require("mongoose");
client = new Client({
    host: '/var/run/postgresql/',
    user: 'shubham',
    password: '7411',
    database: 'campgrounds',
});
client.connect();
//show index page
router.get("/",function(req,res){

	
	Campground.find({},function(err,allCampgrounds){
		if (err) {
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser: req.user});
		}
	})
	
	
});


//add new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})

// create a new campground
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price		= req.body.price;
	var author ={
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image,description:description,author:author,price:price};
	var id;
	Campground.create(newCampground,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			console.log("Newly Created ");
			console.log(campground);
			res.redirect("/campgrounds");
			const text = 'INSERT INTO touristplace(id,name, description, price,country,state,city,zipcode) VALUES($1, $2 ,$3, $4, $5, $6, $7, $8) RETURNING *'
			const values = [campground._id,name,description,price,req.body.country,req.body.state,req.body.city,req.body.zipcode];
			client.query(text,values)
			.then(res => console.log(res.row[0]))
			.catch(e => console.log(e));
		}
	});
	
});

//show a campground
router.get("/:id",function(req,res){
	let text = 'select * from touristplace t where t.id=$1';
	client.query(text,["\""+req.params.id+"\""])
	.then(res => console.log(res.rows[0],typeof(res.rows[0].id)))
	.catch(e => console.log(e));
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if (err) {
			console.log(err);
		}
		else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
	
});

//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id , function(err, foundCampground){
	if(err){
		res.redirect("/campgrounds");
	}
	else{
		res.render("campgrounds/edit",{campground: foundCampground});
	}
	})
});

//update campground

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id , function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			const text = 'update touristplace set name=$1,description=$2,price=$3'
			const values = [req.body.campground.name,req.body.campground.description,req.body.campground.price];
			client.query(text,values)
			.then(res => console.log(res.row[0]))
			.catch(e => console.log(e));
		}
	})
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//destroy route

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id , function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			const text = 'delete from touristplace where id=$1'
			const values = [foundCampground._id];
			client.query(text,values)
			.then(res => console.log(res.row[0]))
			.catch(e => console.log(e));
		}
	})
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
			
		}
	})
})




module.exports = router;