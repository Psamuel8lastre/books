let mysql = require('mysql2');
let connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'database_name_here'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;