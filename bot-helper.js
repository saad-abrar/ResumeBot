var MongoHelper = require('./mongo-helper.js').MongoHelper;
// There are three levels. 0-2
// 0: starts with 'start'
// 1: starts with 'I am ready'
// 2: starts with 'verify'

var profileData = {
    intro: {
        name: '...',
        title: '...',
        avatar: {
            display: true,
            path: '...'
        }
    },
    contact: {
        email: "johndoe@unknowndomain.com",
        phone: '+19998880000',
        wechat: null,
        telegram: null,
        website: null,
        linkedin: "test",
        github: "test",
        gitlab: null,
        bitbucket: null,
        twitter: null,
        stackoverflow: null,
        codewars: null,
        goodreads: null,
        googlescholar: "...",
        researchgate: "...",
        resume: "..."
    },
    languages: {
        display: false,
        title: "Languages",
        items: [
            {
                idiom: "English",
                level: "Professional"
            }
        ]
    },
    interests: {
        display: true,
        title: "Interests",
        items: [
        {
            "item": "Coding"
        },
        {
            "item": "Reading"
        }
        ]
    },
    profile: {
        "display": false,
        "title": "Profile",
        "details": "It's your career profile, you can wirte markdown format text.\n+ First\n+ Second\n"
    },
    education: {
        display: true,
        title: "Education",
        items: [
            {
                university: "[University of ...",
                time: "2xxx-2xxx",
                major: "...",
                degree: "...",
                details: "..."
              }, 
              {
                university: "[University of ...",
                time: "2xxx-2xxx",
                major: "...",
                degree: "...",
                details: "..."
              }
        ]
    },
    experiences: {
        display: true,
        title: "Experiences",
        items: [
            {
                role: "designation",
                time: "2xxx-2xxx",
                company: "...",
                location: "...",
                details: '...'
              },
              {
                role: "designation",
                time: "2xxx-2xxx",
                company: "...",
                location: "...",
                details: '...'
              }
        ]
    },
    projects: {
        display: true,
        title: 'Projects',
        intro: 'these are my projects...',
        items: [
            {
                name: 'p1',
                link: '...',
                details: '...'
            },
            {
                name: 'p2',
                link: '...',
                details: '...'
            }
        ]
    },
    publications: {
        display: true,
        title: 'Publications',
        intro: 'these are my papers...',
        items: [
            {
                title: 'paper title',
                authors: 'mr x, mr y',
                conference: 'conf name',
                link: '...'
            }, 
            {
                title: 'paper title',
                authors: 'mr x, mr y',
                conference: 'conf name',
                link: '...'
            }

        ]
    },
    skills: {
        display: true,
        title: 'Skills',
        details: 'here is my skills a b c...'
    },
    evaluation: {
        display: false,
        title: "Self-evaluation",
        details: "Here is my self evaluation..."
    },
    footer: {
        display: true
    },
    close: 'please contact me at '
}


async function setLevel(level, userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {level: level}});
    }
    MongoHelper.closeConnection();
}

async function setUserUploadedYmlUrl(url, userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {userUploadedYMLFileUrl: url}});
    }
    MongoHelper.closeConnection();
}

async function setZippedCvUrl(url, userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {generatedSiteLink: url}});
    }
    MongoHelper.closeConnection();
}

async function getLevel(userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    await MongoHelper.closeConnection();
    if (response == null) return 0;
    else {
        return response.level;
    }
}

async function getProfileData(userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    await MongoHelper.closeConnection();
    if (response == null) return 0;
    else {
        return response.profileData;
    }
}

async function incrementLevel(userId) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {level: response.level+1}});
    }
    MongoHelper.closeConnection();
}

async function setUser(userId) {
    var dbo = await MongoHelper.openConnection();
    await MongoHelper.insertObjectToCollection(dbo, {user: userId}, {
        level: 0,
        user: userId,
        fileURL: '',
        zippedSiteUrl: '',
        githubToken: '',
        githubUserName: '',
        linkedInURL: '',
        dblpUrl: '',
        linkedInData: null,
        dblpData: null,
        githubData: null,
        generatedYMLFileUrl: '',
        userUploadedYMLFileUrl: '',
        generatedSiteLink: '',
        profileData: profileData
    });
    MongoHelper.closeConnection();
}

async function deleteUser(userId){
    var dbo = await MongoHelper.openConnection();
    await MongoHelper.deleteObject(dbo, {user: userId});
    MongoHelper.closeConnection();
}


async function setLinkedInUrl(userId, url) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {linkedInURL: url}});
    }
    MongoHelper.closeConnection();
}

async function setDBLPUrl(userId, url) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {dblpUrl: url}});
    }
    MongoHelper.closeConnection();
}

async function setGithubUserName(userId, githubUserName) {
    var dbo = await MongoHelper.openConnection();
    var response = await MongoHelper.findObject(dbo, {user: userId});
    if (response != null) {
        await MongoHelper.updateObject(dbo, {user: userId}, {$set: {githubUserName: githubUserName}});
    }
    MongoHelper.closeConnection();
}


module.exports = {
    setLevel: setLevel,
    getLevel: getLevel,
    incrementLevel: incrementLevel,
    setUser: setUser,
    deleteUser: deleteUser,
    setLinkedInUrl: setLinkedInUrl,
    setDBLPUrl: setDBLPUrl,
    setGithubUserName: setGithubUserName,
    setUserUploadedYmlUrl: setUserUploadedYmlUrl,
    setZippedCvUrl: setZippedCvUrl,
    getProfileData: getProfileData
};