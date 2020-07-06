
const fs = require('fs');
const axios = require("axios");
const Path = require('path')  
const { zip } = require('zip-a-folder');
const request = require('request');

require('dotenv').config();


function upload(filename) {
    return new Promise((resolve, reject) => {
        request.post('https://0x0.st', function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        }).form().append('file', fs.createReadStream(filename));
    });
}

async function download (url, dir, fileName) {  
    const path = Path.resolve(__dirname, dir, fileName)
    const writer = fs.createWriteStream(path)
  
    return await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    }).then(function (response) {
        response.data.pipe(writer)
        return true
      }).catch(rej => {
          return false})
}

function getUserIdFromDBLPLink(userLink) {
    return axios(userLink)
        .then(response => {
            var regexForPid = /homepages\/[0-9]*\/[0-9]*/g;
            var found = response.data.match(regexForPid);
            return found[0].substring(9);

        })
        .catch(err => {
            return null;
        });
}



//Function to read file from directory and convert it to Base-64 format
async function ReadFileAndConvertToBase_64(pathName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(pathName, function (err, data) {
            if (err) {
                return console.error(err);
            }
            //console.log(data.toString());
            //var b = new Buffer(data.toString());
            var base_64_format_file = data.toString('base64');
            resolve(base_64_format_file);
        });
    });
}

async function zipFolder(srcPath, destPath){
    return await zip(srcPath, destPath)
    .then(s => {return true})
    .catch(e => {return false});
}


module.exports = {
	upload : upload,
	download : download,
	getUserIdFromDBLPLink : getUserIdFromDBLPLink,
	ReadFileAndConvertToBase_64 : ReadFileAndConvertToBase_64,
	zipFolder : zipFolder
}
//linkedintester88
//qwerty12