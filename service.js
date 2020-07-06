const fs = require('fs');
const utils = require('./util.js')
const helper = require('./service-helper.js')
const YAML = require('json2yaml');
const admZip = require('adm-zip');
var MongoHelper = require('./mongo-helper.js').MongoHelper;
const validateSchema = require('yaml-schema-validator')
const fse = require('fs-extra')

require('dotenv').config();


//Extracting LinkedIn Info; return false if failed

async function ExtractingLinkedInInfo(userId, url) {
    console.log(url);
    var tokens = url.split('/');
    var linkedinUserName = tokens[tokens.length - 2];

    var profile_data = await helper.getLinkedInData(url);
    console.log(profile_data);

    if (profile_data != null){
        var linkedInData = {
            name: profile_data.profileAlternative.name,
            title: profile_data.profileAlternative.headline,
            imageUrl: profile_data.profileAlternative.imageurl,
            summary: profile_data.profileAlternative.summary,
            education: [],
            experience: [],
            skills: '',
            username: linkedinUserName
        }
    
        profile_data.skills.forEach(element => {
            linkedInData.skills = linkedInData.skills + ' | ' + element.title;
        });
    
        profile_data.positions.forEach(item => {
            linkedInData.experience.push({
                role: item.title,
                time: item.date1,
                company: item.companyName,
                location: item.location,
                details: item.description
            });
        });
    
        profile_data.educations.forEach(item => {
            linkedInData.education.push({
                university: item.title,
                time: item.date1 + ' - ' + item.date2,
                major: item.fieldofstudy,
                degree: item.degree,
                details: item.description
            });
        });

        var dbo = await MongoHelper.openConnection();
        var response = await MongoHelper.findObject(dbo, {
            user: userId
        });
        if (response != null) {
            await MongoHelper.updateObject(dbo, {
                user: userId
            }, {
                $set: {
                    linkedInData: linkedInData
                }
            });
        }
        MongoHelper.closeConnection();
        return true;
    }
    else
        return false;
}

//Extracting DBLP Info; return false if failed

async function ExtractingDBLPInfo(userId, response) {
    var result = await utils.getUserIdFromDBLPLink(response);
    if (result != null) {
        result = await helper.getDblpData(result);

        var dblpData = [];

        result.forEach(item => {
            if (item.article != null) {
                
                if(typeof(item.article[0].title[0])==='string'){
                    dblpData.push({
                        title: item.article[0].title[0],
                        authors: item.article[0].author.join(', '),
                        conference: item.article[0].journal[0],
                        link: 'https://dblp.org/' + item.article[0].url[0]
                    });
                } else {
                    console.log("Title Object");
                    dblpData.push({
                        title: item.article[0].title[0]._,
                        authors: item.article[0].author.join(', '),
                        conference: item.article[0].journal[0],
                        link: 'https://dblp.org/' + item.article[0].url[0]
                    });
                } 

            }

            if (item.inproceedings != null) {
                
                if(typeof(item.inproceedings[0].title[0])==='string'){
                    dblpData.push({
                        title: item.inproceedings[0].title[0],
                        authors: item.inproceedings[0].author.join(', '),
                        conference: item.inproceedings[0].booktitle[0],
                        link: 'https://dblp.org/' + item.inproceedings[0].url[0]
                    });
                } else {
                    dblpData.push({
                        title: item.inproceedings[0].title[0]._,
                        authors: item.inproceedings[0].author.join(', '),
                        conference: item.inproceedings[0].booktitle[0],
                        link: 'https://dblp.org/' + item.inproceedings[0].url[0]
                    });
                }

            }
        })

        if (result != null) {
            console.log(result);
            var dbo = await MongoHelper.openConnection();
            var response = await MongoHelper.findObject(dbo, {
                user: userId
            });
            if (response != null) {
                await MongoHelper.updateObject(dbo, {
                    user: userId
                }, {
                    $set: {
                        dblpData: dblpData
                    }
                });
            }
            MongoHelper.closeConnection();
            return true;
        } else
            return false;
    } else
        return false;

}

//Extracting Github Info; return false if failed
async function ExtractingGithubInfo(userId, githubUserName) {
    try {
        profile_details = await helper.getGitHubData(githubUserName);
        if(profile_details == null) return false;
        console.log(profile_details);

        var projectDetails = [];
        for (var i = 0; i < profile_details.length; i++) {
            var data = {
                name: profile_details[i].name,
                link: profile_details[i].html_url,
                details: profile_details[i].description
            }
            projectDetails.push(data);
        }

        var dbo = await MongoHelper.openConnection();
        var response = await MongoHelper.findObject(dbo, {
            user: userId
        });
        if (response != null) {
            await MongoHelper.updateObject(dbo, {
                user: userId
            }, {
                $set: {
                    githubData: {projects: projectDetails, author: githubUserName}
                }
            });
        }
        MongoHelper.closeConnection();
        return true;
    } catch (error) {
        return false;
    }
}


// If invalid (userGithubToken | userGithubRepoName) return false
async function createRepoForUser(userId, username, token, path, choice) {
    let zip;
    if (choice == 'a') {
        zip = new admZip('./resources/site-ac.zip');
    }
    else if (choice == 'i') {
        zip = new admZip('./resources/site-in.zip');
    }
    else{
        return false;
    }
    return await helper.prepareRepoForResume(userId, username, token, path, zip);
}


// This function is called when the zippedCV is successfully uploaded;
// Return false if failed
async function uploadZippedCV(userId, path, choice) {
    let zip;
    if (choice == 'a') {
        zip = new admZip('./resources/site-ac.zip');
    }
    else if (choice == 'i') {
        zip = new admZip('./resources/site-in.zip');
    }
    else{
        return null;
    }

    var link = await helper.prepareZippedFile(userId, path, zip)
    return link;
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


// This function merges all the info extracted from the linkedin, dblp, and github page
// and put them in yml file
async function mergeAllInfo(userId) {

    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {
        user: userId
    });

    if (response != null) {
        if (response.linkedInData != null) {
            helper.mergeLinkedInData(response);
        }
        if (response.dblpData != null) {
            helper.mergeDblpData(response);
        }
        if (response.githubData != null) {
            helper.mergeGitHubData(response);
        }

        await MongoHelper.updateObject(dbo, {
            user: userId
        }, {
            $set: {
                profileData: response.profileData
            }
        });
        if (!fs.existsSync(`./tmp`)) fs.mkdirSync(`./tmp`);
        var ymlText = YAML.stringify(response.profileData);
        var randomTmpFolderName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (!fs.existsSync(`./tmp/${randomTmpFolderName}`)) {
            fs.mkdirSync(`./tmp/${randomTmpFolderName}`);
        }
        fs.writeFileSync(`./tmp/${randomTmpFolderName}/data.yml`, ymlText, (err) => {
            console.log(err)
        });
    }
    var link = await utils.upload(`./tmp/${randomTmpFolderName}/data.yml`).catch(exception => {
        return null;
    });
    if (link != null) await MongoHelper.updateObject(dbo, {
        user: userId
    }, {
        $set: {
            generatedYMLFileUrl: link
        }
    });
    MongoHelper.closeConnection();
    fse.removeSync("./tmp/*");
    return link;
}

//Once the session is terminated, all the data relevant to the session will be deleted
async function deleteAllData(user) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {
        user: user
    });

    if(response != null) {
        await MongoHelper.deleteObject(dbo, {user: user})
    }
    MongoHelper.closeConnection();
}


async function downloadYmlFile(url){
    var randomTmpFolderName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (!fs.existsSync(`./tmp`)) fs.mkdirSync(`./tmp`);
    if (!fs.existsSync(`./tmp/${randomTmpFolderName}`)) {
        fs.mkdirSync(`./tmp/${randomTmpFolderName}`);
    }

    if (await utils.download(url, `./tmp/${randomTmpFolderName}`, 'data.yml')  ) 
        return `./tmp/${randomTmpFolderName}/data.yml`
    else 
        return null

}

module.exports = {
    mergeAllInfo: mergeAllInfo,
    verifyYMLContent: verifyYMLContent,
    ExtractingLinkedInInfo: ExtractingLinkedInInfo,
    ExtractingDBLPInfo: ExtractingDBLPInfo,
    ExtractingGithubInfo: ExtractingGithubInfo,
    createRepoForUser: createRepoForUser,
    uploadZippedCV: uploadZippedCV,
    deleteAllData: deleteAllData,
    downloadYmlFile: downloadYmlFile
};