var hasher = require('wordpress-hash-node');
var password = 'Wewillrockyou1986!';

//both the same !?
var hash = "$P$BuenxTT/vmYwzhq6nmVpSSbgkHNQLB.";
var hash = "$P$BxH/8lJxeaE1xITcXvNEaDcblCAf5S/";
var checked = hasher.CheckPassword(password, hash); //This will return true; 

console.log("checked: " + checked);