var fs = require('fs');
var request = require('request');
var crypto = require('crypto');
var walk = require('walk');

const gitHubUrl = "https://api.github.com";

require('dotenv').config();


// Retrieve

console.log(process.env.COOKIE)