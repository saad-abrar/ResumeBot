const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();
const axios = require("axios");
var xml2js = require('xml2js');

const http_request = require('got');
const validateSchema = require('yaml-schema-validator')

var mock_data = require('./resources/mock_data.json');




const s3 = new AWS.S3({
    accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY
});

var gitHubToken = process.env.GITHUB_TOKEN;

var sessionData = {
    fileURL: ''
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

async function getDblpData(userName) {
    var result = mock_data.dblp_profile;
    return result;

}

//Extracting LinkedIn Info; return false if failed

async function ExtractingLinkedInInfo(userId, url) {

    var profile_data = mock_data.linkedInProfile;
    if (profile_data != null) {
        return true;
    } else
        return false;
}

//Extracting DBLP Info; return false if failed

async function ExtractingDBLPInfo(userId, response) {
    var result = mock_data.dblp_profile;
    if (result != null) {
        return true;
    } else
        return false;

}

//Extracting Github Info; return false if failed
async function ExtractingGithubInfo(userId, githubUserName) {
    
    try {
        var profile_details = mock_data.gitRepos;

        var projectDetails = [];
        for (var i = 0; i < profile_details.length; i++) {
            var data = {
                name: profile_details[i].name,
                link: profile_details[i].html_url,
                details: profile_details[i].description
            }
            projectDetails.push(data);
        }
        return true;
    } catch (error) {
        return false;
    }
}

async function createRepo(repo, token) {

}


// If invalid (userGithubToken | userGithubRepoName) return false
async function createRepoForUser(userId, username, token, path, choice) {
    return true;

}

// This function is called when the zippedCV is successfully uploaded;
// Return false if failed
async function uploadZippedCV(userId, path, choice) {
}

// This function verifies the yml content of the file uploaded by the user
// Return false if the content is inconsistent with the data obtained from the links or
// submitted earlier by the user
function verifyYMLContent(path) {
    var errors = validateSchema(path, {
        schemaPath: './schema.yaml' // can also be schema.json
    });
    return (errors.length == 0) ? true : false;
}

// This function uploads an empty template for the user to fill in when they don't have
// one or any links
function uploadEmptyTemplate() {

}

// This function merges all the info extracted from the linkedin, dblp, and github page
// and put them in yml file
async function mergeAllInfo(userId) {
}

//Once the session is terminated, all the data relevant to the session will be deleted
async function deleteAllData(user) {
}

async function download (url, dir, fileName) {  
}

async function downloadYmlFile(url){

}

//module.exports.verifyYMLContent = verifyYMLContent;

module.exports = {
    mergeAllInfo: mergeAllInfo,
    verifyYMLContent: verifyYMLContent,
    ExtractingLinkedInInfo: ExtractingLinkedInInfo,
    ExtractingDBLPInfo: ExtractingDBLPInfo,
    ExtractingGithubInfo: ExtractingGithubInfo,
    createRepoForUser: createRepoForUser,
    uploadZippedCV: uploadZippedCV,
    uploadEmptyTemplate: uploadEmptyTemplate,
    fs: fs,
    AWS: AWS,
    s3: s3,
    deleteAllData: deleteAllData,
    ExtractingDBLPInfo: ExtractingDBLPInfo,
    getDblpData: getDblpData,
    getUserIdFromDBLPLink: getUserIdFromDBLPLink,
    downloadYmlFile: downloadYmlFile
};