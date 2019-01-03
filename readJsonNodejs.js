/*
[
{  
   category:'social',
   question:'In S3 what can be used to delete a large number of objects',
   answers:{  
      A:'QuickDelete',
      B:'Multi-Object Delete',
      C:'Multi-S3 Delete',
      D:'There is no such option available'
   },
   ID:'2',
   correct:'B'
},
{  
   category:'social',
   question:'S3 buckets can contain both encrypted and non-encrypted objects',
   answers:{  
      A:'False',
      B:'True'
   },
   ID:'1',
   correct:'B'
}
]
*/

'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

let questions;
const GAME_LENGTH = 2;
const ANSWER_COUNT = 4;
var gameQuestions = [];
var myMap = new Map();
myMap.set(0,"A");
myMap.set(1,"B");
myMap.set(2,"C");
myMap.set(3,"D");
myMap.set(4,"E");

function getWelcomeResponse(callback)
{
    var sessionAttributes = {};
     var speechOutput = '';
   
    gameQuestions = populateGameQuestions();
    var currentQuestionIndex = 0;
    var answerList = questions[gameQuestions[currentQuestionIndex]].answers;
    console.log(answerList);
    var answerlenght = Object.keys(answerList).length;
    var spokenQuestion = questions[gameQuestions[currentQuestionIndex]].question;
    var repromptText = "Question 1. " + spokenQuestion + " ";
    
    var i, j;
    
    
    for (i = 0; i < answerlenght; i++) {
        repromptText += myMap.get(i) + ". " + answerList[myMap.get(i)] + ". "
    }
    
    speechOutput += repromptText;
    callback(speechOutput, repromptText);
    
}

function populateGameQuestions() {
    var indexList = [];
    var index = Object.keys(questions).length;

   
    for (var i = 0; i < questions.length; i++){
        indexList.push(i);
    }

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]); 
    }
    return gameQuestions; 
}

exports.handler = function(event, context, callback){
	var params = {
            TableName: 'Question',
			FilterExpression: "#category = :cat",
			ExpressionAttributeNames:{
              "#category":"category"
			},
          ExpressionAttributeValues: {
              ":cat": 'social'
			},
        };
        
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		    
		}else{
			questions = data.Items;
			console.log(getWelcomeResponse(callback));
			
	       
		}
	});
	// 
    //console.log(questions);

}




/*exports.handler = (event, context, callback) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    callback(null, response);
};*/




