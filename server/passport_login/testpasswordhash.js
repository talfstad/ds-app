var hasher = require('wordpress-hash-node');
var password = 'Wewillrockyou1986!';

var pass = process.argv[2];

//both the same !?
var hash = "$P$BuenxTT/vmYwzhq6nmVpSSbgkHNQLB.";
var hash = "$P$BxH/8lJxeaE1xITcXvNEaDcblCAf5S/";
var checked = hasher.CheckPassword(password, hash); //This will return true; 

console.log(pass + " hashed is: " + hasher.HashPassword(pass));
