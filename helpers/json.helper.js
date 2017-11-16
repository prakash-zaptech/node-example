const fs = require('fs');
module.exports = function() {
    fs.readFile('./users.json', 'utf-8', function(err, data) {
		if (err) throw err

		var arrayOfObjects = JSON.parse(data);
		// console.log("TTT-->"+arrayOfObjects); return false;
		return arrayOfObjects;
		// var count = Object.keys(arrayOfObjects.users).length;
	})
}
