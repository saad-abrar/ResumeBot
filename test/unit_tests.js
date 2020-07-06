const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const nock = require("nock");

const service = require("../service.js");
const helper = require("../bot-helper.js");

require('dotenv').config();

var gitHubToken = process.env.GITHUB_TOKEN;
var linkedInToken = process.env.LINKEDIN_TOKEN

var userId = "testuser123"

// describe('testService', function () {

  describe('#testSetUser()', function () {
    it('should set userId to mongoDB', function(done) {
      helper.setUser(userId).then(function (results) 
      {
        done();
      });
    });
  });

  describe('#checkExtractingGitHubData()', function () {
   	it('should return true after collecting GitHub profile', function(done) {
      service.ExtractingGithubInfo(userId, "marufhaque3").then(function (results) 
      {
        expect(results).equal(true);
        done();
      });
    });
  });

  describe('#checkExtractingGitHubDataFromWrongUserName()', function () {
    it('should return false while trying to collect GitHub profile', function(done) {
     service.ExtractingGithubInfo(userId, "").then(function (results) 
     {
       expect(results).equal(false);
       done();
     });
   });
 });

 


 describe('#checkExtractingDBLPData()', function () {
  
  it('should return true after collecting dblp profile', async() => {
    await service.ExtractingDBLPInfo(userId, "https://dblp.org/pers/hd/r/Rahman:Rayhan").then(function (result)
    {
      expect(result).equal(true);
    });
 });
});
// describe('#hudai', function(){
//   it('should return undefined', async function(){
//     var output = await service_helper.createRepo('hudai', '4ea3724f70b3227f0839a2209d094e39a3b921d3');
//     assert.equal(output, true)
//   })
// }); 
describe('#checkExtractingDBLPDataFromWrongUserName()', function () {
 it('should return false while trying to collect dblp profile', function(done) {
  service.ExtractingDBLPInfo(userId, "marufhaque").then(function (results) 
  {
    expect(results).equal(false);
    done();
  });
 });
});

describe('#checkExtractingLinkedInData()', function () {
  it('should return true after collecting linkedIn profile', async() => {
   await service.ExtractingLinkedInInfo(userId, "https://www.linkedin.com/in/marufulhaque").then(function (results) 
   {
     expect(results).equal(true);
   });
 });
});

describe('#checkExtractingLinkedInDataFromWrongUserName()', function () {
 it('should return false while trying to collect linkedIn profile', function(done) {
  service.ExtractingLinkedInInfo(userId, "").then(function (results) 
  {
    expect(results).equal(false);
    done();
  });
 });
});

describe('#checkMergingData()', function () {
  it('should return a link after after merging', async() => {
   await service.mergeAllInfo(userId).then(function (results) 
   {
     expect(results).to.match(/^http(.+).yml\n$/);
   });
 });
});

describe('#checkMergingDataWithInvalidUser()', function () {
  it('should return null while trying to merge', async() => {
   await service.mergeAllInfo("userId").then(function (results) 
   {
     expect(results).equal(null);
   });
 });
});


  describe('#testDeleteUser()', function () {
    it('should delete userId from mongoDB', function(done) {
      helper.deleteUser(userId).then(function (results) 
      {
        done();
      });
    });
  });

// });
