var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var templateData = {title: "This title is from the template data JSON object"};
	res.render('./index.html', templateData);
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET Productlist page. */
router.get('/productlist', function(req, res) {
    var db = req.db;
    var collection = db.get('catalog');
    collection.find({},{},function(e,docs){
        res.render('productlist', {
            "productlist" : docs
        });
    });
});

/* GET Product Details for selected product. */
router.get('/productdetails', function(req, res) {
    var db = req.db;
    var collection = db.get('catalog');
	var ObjectId = require('mongodb').ObjectID;
	var util = require('util');
	var id = req.param('id');
	var prettyjson = require('prettyjson');

	console.log(id);
	
    collection.find({ _id : ObjectId(id) },function(e,docs){
        if(e) {
			console.log("error");
			console.log(e);
		} else {
			console.log("success");
			console.log(util.inspect(docs, false, null));
		}
		res.render('productdetails', {
            "productdetails" : docs
        });
    });
});

/* GET Search Results. */
router.get('/search', function(req, res) {
    var db = req.db;
    var collection = db.get('catalog');
	var ObjectId = require('mongodb').ObjectID;
	var util = require('util');
	
	var selectedCategory = req.param('selectedCategory');
	var selectedReview = req.param('rating');
	var searchText = req.param('searchText');
	
	console.log(selectedCategory);
	console.log(selectedReview);
	console.log(searchText);
	
	if(selectedReview == "") {
		if(selectedCategory != "All") {
			if(searchText == "") {
				collection.find( {category: selectedCategory} ,function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			} else {
				console.log("text-index ensured in the db directly");
				var query = "\""+selectedCategory+"\" " + "\""+searchText+"\"";
				console.log("query: " + query);
				collection.find( { $text: { $search: query } } , function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			}
		} else {
			if(searchText == "") {
				collection.find({},function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			} else {
				console.log("text-index ensured in the db directly");
				var query = "'Refridgerator' "+"'Microwave' "+"'Books' "+"'Television' "+"'Music-CDs' "+"'Movie-DVDs' "+"'Shoes' "+"'Bags' "+"'Diapers' "+"'Audio Systems' "+"\""+searchText+"\"";
				console.log("query: " + query);
				collection.find( { $text: { $search: query }  } , function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});			
			}
		}
	} else {
		if(selectedCategory != "All") {
			if(searchText == "") {
				collection.find( { category: selectedCategory, review: selectedReview } ,function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			} else {
				console.log("text-index ensured in the db directly");
				var query = "\""+selectedCategory+"\" " + "\""+searchText+"\"" + "\""+selectedReview+"\"" ;
				console.log("query: " + query);
				collection.find( { $text: { $search: query } } , function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			}
		} else {
			if(searchText == "") {
				collection.find({review: selectedReview},function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});
			} else {
				console.log("text-index ensured in the db directly");
				var query = "'Refridgerator' "+"'Microwave' "+"'Books' "+"'Television' "+"'Music-CDs' "+"'Movie-DVDs' "+"'Shoes' "+"'Bags' "+"'Diapers' "+"'Audio Systems' "+"\""+searchText+"\"";
				console.log("query: " + query);
				collection.find( { $text: { $search: query }  } , function(e,docs){
					if(e) {
						console.log("error");
						console.log(e);
					} else {
						console.log("success");
						console.log(util.inspect(docs, false, null));
					}
					res.render('search', {
						"searchresults" : docs
					});
				});			
			}
		}
	}
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});
