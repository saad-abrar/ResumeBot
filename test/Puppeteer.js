const puppeteer = require('puppeteer')
var chai   = require('chai');
var assert = chai.assert,
    expect = chai.expect;

require('dotenv').config();

const loginEmail = process.env.SLACK_EMAIL;
const loginPassword = process.env.SLACK_PWD;
const slackSpaceUrl = 'https://northcarolina-s8o7157.slack.com';

//Level of Conversation
var level=0;
//No github link
var noGithubLink=false;
var noLinkedInLink=false;
var noDblpLink=false;

async function login(browser, url) {
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle0'});

  // Login
  await page.type('input[id=email]', loginEmail);
  await page.type('input[id=password]', loginPassword);
  //await page.click('button[id=signin_btn]');
  await page.keyboard.press('Enter');
  // Wait for redirect
  await page.waitForNavigation();
  return page;
}
async function OpenBotChannel(page){
  await page.goto(`${slackSpaceUrl}/messages/DPJ0ZN02J`,{waitUntil: 'networkidle0'});
  return page;
}

async function postMessage(page, msg)
{
  // Waiting for page to load
  await page.waitForSelector("#msg_input");

  // Focus on post textbox and press enter.
  await page.focus('#post_textbox')
  await page.keyboard.type( msg );
  await page.keyboard.press('Enter');
}
//Delaying the function
async function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

//Extracting Page information
async function ExtractPageInfo(page,msg){
  await page.keyboard.type(msg);
  await page.keyboard.press('Enter');
  await delay(4000);

  const title1 = await page.$x("//span[@class='c-message__body' and @data-qa='message-text']");
  let messages = await page.evaluate(span => span.textContent, title1[title1.length-1]);
  console.log(messages)
  return messages;
}
//Test for UseCase1
async function UseCase1(page){
  //UseCase 1
  var messages = await ExtractPageInfo(page, "start");
  console.log("Message: "+messages);
  if(messages.includes(' ready')){
    level++;
    console.log(level);
  } else if(messages === "A session is already going on. Do you want to start a new session [y/n]?"){
    console.log("new session");
    await page.keyboard.type("y");
    await page.keyboard.press('Enter');      
    await delay(6000);
    await UseCase1(page);
  }
  return page;
}
//Test for UseCase2
async function UseCase2(page){
  var messages = await ExtractPageInfo(page, "I am ready");
  if(messages === 'Please tell me if you have a LinkedIn account?[yes/no]'){
    var LrandomNumberBetween0and1 = Math.floor(Math.random() * 2);
    LrandomNumberBetween0and1=1;
    if(LrandomNumberBetween0and1===1){
      messages = await ExtractPageInfo(page, "yes");
    }else{
      noLinkedInLink=true;
      messages = await ExtractPageInfo(page, "no");
    }
    if(noLinkedInLink===false){
      if (messages === 'Great! Please provide your LinkedIn account ID.'){
        messages = await ExtractPageInfo(page, "https://www.linkedin.com/in/saad-abrar-5744b060/");
        if(messages === 'Great! Please provide your LinkedIn account token'){
          messages = await ExtractPageInfo(page, 'adjhsgj2343jf');
        }
      }
    }
    if(messages === 'Awesome! Now tell me if you have a DBLP account?[yes/no]'){
        var DrandomNumberBetween0and1 = Math.floor(Math.random() * 2);
        DrandomNumberBetween0and1=1;
        if(DrandomNumberBetween0and1===1){
          messages = await ExtractPageInfo(page, "yes");
        }else{
          noDblpLink=true;
          messages = await ExtractPageInfo(page, "no");
        }
        if (noDblpLink === false){
          if(messages === 'Amazing! Please provide me with the DBLP link.'){
            messages = await ExtractPageInfo(page, 'https://dblp.uni-trier.de/pers/hd/r/Rahman:Rayhanur');
          }
        }
        if(messages === 'Awesome! Now tell me if you have a Github account?[yes/no]'|| messages.includes('clutter')){
          var GrandomNumberBetween0and1 = Math.floor(Math.random() * 2);
          //GrandomNumberBetween0and1=1;
          //messages = await ExtractPageInfo(page, 'yes');
          if(GrandomNumberBetween0and1===1){
            messages = await ExtractPageInfo(page, "yes");
          } else{
            noGithubLink=true;
            messages = await ExtractPageInfo(page, "no");
          }
          if(noGithubLink === false){
            if(messages === 'Amazing! Please provide me with Github link.'){
              messages = await ExtractPageInfo(page, 'https://github.ncsu.edu/sabrar');
            }
          }
          if(noGithubLink || noLinkedInLink|| noDblpLink){
            console.log("Hello: Eikhane "+ messages);
            if(messages.includes('several information missing')){
              messages = await ExtractPageInfo(page, 'https://transfer.sh/gIusU/data.yml');
            }
          }
          if(messages.includes('File uploaded successfully')){
            level++;
          }
        }
      }
  }
  return page;  
}
//Test for UseCase3
async function UseCase3(page){
  var messages = await ExtractPageInfo(page, "verify");
  if(messages === 'Please give me a link of the yml file'){
    messages = await ExtractPageInfo(page, "https://transfer.sh/fHtrT/data.yml");
    if(messages === 'Data verified. Do you want your CV in industrial or academic format?[i/a]'){
      messages = await ExtractPageInfo(page, "i");
      if(messages === 'Do you want your CV in Github.io or in zipped format?[github/zip].'){
        var randomNumberBetween0and1 = Math.floor(Math.random() * 2);
        randomNumberBetween0and1=0;
        if(randomNumberBetween0and1===1){
          messages = await ExtractPageInfo(page, "zip");
        } else{ //alternate path
          messages = await ExtractPageInfo(page,"github");
        }
        if(messages === 'Token?' && randomNumberBetween0and1===0){
          messages = await ExtractPageInfo(page,'sadghad23412jhsasfd');
          if(messages === 'User name?'){
            messages = await ExtractPageInfo(page,'sabrar');
          }
        }
      }
      if(messages.includes(" terminate")){
        messages = await ExtractPageInfo(page, "terminate");
        level = 0;
      }
    }
  }
  return page;

}

(async () => {
  //Connecting the browser and redirecting to Slack Space
  const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
  let page = await login( browser, `${slackSpaceUrl}` );
  //Go to chatting page with bot
  page = await OpenBotChannel(page);
  //Chatting with bot
  //await page.keyboard.type("Hello");
  //await page.keyboard.press('Enter');
  //await postMessage(page, "start");
  //const example = await page.evaluate(element => {
  //  return element.textContent;
  //}, 
  //Delay for waiting for page to render
  //await delay(4000);
  //const title = await page.$x("//span[@class='c-message__body' and @data-qa='message-text']");

  //for(var i=0; i<title.length; i++){
  //  let messages = await page.evaluate(span => span.textContent, title[i]);
  //  console.log(messages); 
  //}
  
  page = await UseCase1(page);
  console.log("passed")
  if(level===1){
    page = await UseCase2(page);
  } else {
    console.log("Did not expect this convo! Failed at Level1");
  }

  if(level===2){
    page = await UseCase3(page);
    if(level===0){
      console.log("Path successful!");
    }
  }else {
    console.log("Did not expect this convo! Failed at Level2");
  }

    // const html = await page.content(); // serialized HTML of page DOM.
  // browser.close();
})()


// Pretend you are a iPhone X
//await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
//await page.setViewport({ width: 375, height: 812 });