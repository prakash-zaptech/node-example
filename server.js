var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/routes.js")(app);

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
// global.getJson = require("./helpers/json.helper.js");
const openApi = require('./routes/routes');

app.get("/users/", function(req, res) {
	 fs.readFile('./users.json', 'utf-8', function(err, data) {
			if (err) throw err

			var arrayOfObjects = JSON.parse(data)
			var count = Object.keys(arrayOfObjects.users).length;
			if(count > 0){
				return res.send({"status" : "success","data" : arrayOfObjects.users});
			}
			else{
				return res.send({"status" : "error", "message" : "No user found"});
				}
	});
})

app.post('/user/add', function(req, res) {

    // var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    if(name == '' || name == undefined || age == '' || age == undefined){ 
    	return res.send({"status" : "error", "message" : "Please enter all values"});
    }
    else{
	    fs.readFile('./users.json', 'utf-8', function(err, data) {
			if (err) throw err

			var arrayOfObjects = JSON.parse(data)
		 	var count = Object.keys(arrayOfObjects.users).length;
			if(count > 0){
				var lastId = arrayOfObjects.users[arrayOfObjects.users.length-1].id;
				var id = lastId + 1;
			}
			else{
				var id = 1;
			}
			arrayOfObjects.users.push({
				id : id,
				name: name,
				age: age
			})
			fs.writeFile('./users.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
			if (err) throw err
			return res.send({"status" : "success", "message" : "User added successfully!!!"});
		})
	});
	}
});

app.get("/user/:id", function(req, res) {
    if(!req.params.id) {
        return res.send({"status": "error", "message": "missing user id"});
    } else {
    	fs.readFile('./users.json', 'utf-8', function(err, data) {
		if (err) throw err
		var userData = JSON.parse(data);
    	userData = userData.users.find(item => item.id === parseInt(req.params.id))
    	if(!userData){
    		return res.send({"status": "error", "message": "This user id does not exist"});
    	}
    	else{
    		return res.send(userData);	
    	}
    })
        
    }
});

app.post("/user/edit/:id", function(req, res) {
	var name = req.body.name;
    var age = req.body.age;
    if(!req.params.id) {
        return res.send({"status": "error", "message": "missing user id"});
    } 
    else {
    	
    	fs.readFile('./users.json', 'utf-8', function(err, data) {
			if (err) throw err
			var userData = JSON.parse(data);
			var json = userData.users
			userData.users.find(function(item){

				 if (item.id === parseInt(req.params.id)) {
			        item['name'] = name;
			        item['age'] = age;
			    }
			})
			fs.writeFile('./users.json', JSON.stringify(userData), 'utf-8', function(err) {
				if (err) throw err
				return res.send({"status" : "success", "message" : "User updated successfully!!!"});

			})
		});
    }
});

app.get("/user/delete/:id", function(req, res) {
    if(!req.params.id) {
        return res.send({"status": "error", "message": "missing user id"});
    } else {
    	fs.readFile('./users.json', 'utf-8', function(err, data) {
		if (err) throw err
		var json = JSON.parse(data);
		var users = json.users;
		json.users = users.filter((user) => {
		 	return user.id !== parseInt(req.params.id)
		  });
		fs.writeFileSync('users.json', JSON.stringify(json, null, 2));
		return res.send({"status" : "success", "message" : "User deleted!!!"});
    })
        
    }
});