## Bot Integration
We have used [botkit-ai](https://botkit.ai) and nodejs to build our bot for slack platform. 

## Use Cases Refinement
Based on the feedback from our design milestone and initial implementation, the use cases for the bot have been improved.
The changed use cases are as follows:

### Use Case # 1: Initiate a session with the resumebot
#### Preconditions
The user must join a slack channel and the bot must be invited to the slack channel.

#### Main Flow
- The user wants to initiate a conversation with the bot [S1].
- If the bot does not have any ongoing session, it will reply an acknwoledgement message letting the user know how to proceed [S2].
	- The user follows the reply from the bot to proceed [S2-1]
- Else, the bot will inform the user about the ongoing session and ask whether he wants to start a new one.[S3].
	- If yes, the user will go back to [S1] and the ongoing session will be discarded [S3-A].
	- If no, the bot will reply 'Alright' and the ongoing session will continue [S3-B].
- At any point, the user can terminate a session. This option is independent of any use cases or states the user/bot is at the moment   [S4].


#### SubFlow
- [S1] The user says "start" in a one-to-one communication with the bot.
- [S2] The bot replies "Welcome! Please say 'I am ready' when you are ready"
	-[S2-1] The user says "I am ready" and proceeds to the next use case.
- [S3] The bot replies, "A session is already going on. Do you want to start a new session [y/n]?"
	- [S3-A] The user replies 'y' and the bot replies 'Please say 'start' to start a new session'.
	- [S3-B] The user replies 'n' and the ongoing session goes on with no reply from the bot.
- [S4] The user says "terminate" and the bot replies "session terminated! You can say 'start' to create a new session". The user will 		go back to [S1].
 
### Use Case # 2: Gather Information from the user
#### Preconditions
The user must be in the state S[2-1] \(use case 1\) to be able to continue.

#### Main Flow
- The bot will ask the user about his/her profiles (public) in LinkedIn, GitHub, and DBLP [S1]. 
- If the user does not have one/more profiles, the bot will provide a .yml template (partially filled if user had at least one profile and unfilled if the user has no profiles) to the user and ask him to fill in and give the link of .yml file to the bot. The bot will upload the CV in exact field values the user filled in [S2]. 
	- The user uploads the link [S2-1]
- Else, the bot will process all the information in the background and prepare a .yml file (filled up) containing relevant information. The template in [S1-A] is the same as in this state [S3].
	- The user at this point will download the .yml file and check whether the bot extracted the data correctly.

#### Sub Flow
- [S1] 
	- The bot asks "Please tell me if you have a LinkedIn account?[yes/no]"
		- The user replies "yes". The bot replies "Amazing! Please provide me with the link" and the user gives a valid link. 
		- The user replies "no". The bot continues to the next question.
	- The bot asks "Awesome! Now tell me if you have a DBLP account?[yes/no]"
		- The user replies "yes". The bot replies "Amazing! Please provide me with the link" and the user gives a valid link. 
		- The user replies "no". The bot continues to the next question.
	- The bot asks "Awesome! Now tell me if you have a Github account?[yes/no]"
		- The user replies "yes". The bot replies "Amazing! Please provide me with the link" and the user gives a valid link. 
		- The user replies "no". The bot continues to the next question.	
- [S2] The bot replies "I see that you have several information missing that I require. Please fill up this template at http://... and upload"
	- [S2-1] The user fills in the black template and move to use case 3.
- [S3] The bot replies "File uploaded successfully at http://..."
	- [S3-1] The user downloads the .yml file, verify whether the data is correct and move  to use case 3. 


### Use Case 3: Validate the Information from the User and provide the CV

#### Precondition
The user must be in the state S[2-1] or S[3-1] \(use case 2\) to be able to continue.

#### Main Flow
- The user verified the .yml file and the bot asks for the link of that file [S1].
- The bot acknowledged the verified data and asks the user whether he wants his CV to be in academic/ industrial format. The user replies with his preference [S2].
- The bot asks whether the user wants his CV in GitHub.io or in zipped format [S3]
	- [S3-1] The user chooses GitHub and the bot asks for his token and repo name. Next the bot uploads the CV at at github.io
	- [S3-2] The user chooses zip and the bot uploads the zipped CV with user's preference.
- The bot nexts asks the user to terminate the session [S4].

#### Sub Flow
- [S1] The user says "verfiy" and the bot replies "Data verified. Do you want your CV in Github.io or in zipped format?[github/zip]"
- [S2] The bot asks "Data verified. Do you want your CV in industrial or academic format?[i/a]". based on i/a the bot will choose an industrial or academia template for user.
- [S3] The bot asks "Data verified. Do you want your CV in Github.io or in zipped format?[github/zip]"
	- [S3-1] The user replies "github" and the bot asks "token?" the user replies a valid token and the bot replies "Repo name?". The user replies a valid repo name. Finally with the token and repo name  the bot replies "website has been published at <your github username>.github.io"
	- [S3-2] The user replies "zip" and the bot replies "Thanks. The zipped CV has been uploaded successfully at "http://...""
- [S4] The bot finally says "Please say \'terminate\' to terminate the session".

### Use Case # 4: Terminate a session with the resumebot

#### Preconditions
At any point, the user can terminate a session. This option is independent of any use cases or states the user/bot is at the moment

#### Main Flow
- The user wants to terminate a session [S1].
- The bot acknowledges with a reply that the session terminated and how to start a session again [S2]. 

#### SubFlow
- [S1] The user says "terminate".
- [S2] The bot replies "session terminated! You can say \'start\' to create a new session".

## Automation Testing
We have used [Puppeteer](https://github.com/GoogleChrome/puppeteer) to build our selenium tests. Those test cases can be found in ```test/Puppeteer.js```

## Mocking Infrastructure 
We have used ```nock``` to mock the service calls that uses http requests. We have also used mock functions and data that can be found in ```service-mock.js``` and ```mock_data.json```. We have also wrote a few unit test cases using ```mocha``` and the code can be found in ```test/unit_tests.js```.

## Installation
To run, type ```npm start```. But you will need to use https tunelling, collect tokens from bots and oauth redirection urls. So, unless these things are collected, the bot won't work.
To run the unit test cases, type ```npm test```.

## Screencast
The screencasts of the bot working and interacting via browser automation is provided. 

The happy path screencast is provided in the link: https://drive.google.com/open?id=1eYSI-jP74kJPBot-TAtZqaz4kGxxwJZF.

One alternative path for use case 1 is provided in the link: https://drive.google.com/open?id=16X5PCgXezzqPZ9zxipRyiLUjP1CITaPa.

One alternative path for use case 2 is provided in the link: https://drive.google.com/open?id=1ir0wLWpSJtr0V_BCRJKzslRWNhNlIxOh.

One alternative path for use case 3 is provided in the link: https://drive.google.com/open?id=1lbiA18p08ky4t2GtMvDrv5i2d0k1UYtv.
