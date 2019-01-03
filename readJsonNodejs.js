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
	        var gameQuestions = populateGameQuestions(questions);
		    console.log("The game qustion",gameQuestions);
		    var correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
		    
		    var currentQuestionIndex = 0;
            var spokenQuestion = questions[gameQuestions[currentQuestionIndex]].question;
            var repromptText = "Question 1. " + spokenQuestion + " ";
            console.log("this is repromptetext", repromptText);
            var answerlenght = questions[gameQuestions[currentQuestionIndex]].answers;
            console.log(Object.keys(answerlenght).length);
            console.log(Object.keys(questions[0]).length);
            
            console.log(questions[gameQuestions[currentQuestionIndex]].correct);
		}
	});
	// 
    //console.log(questions);

}

function populateGameQuestions(questions) {
    var gameQuestions = [];
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

/*exports.handler = (event, context, callback) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    callback(null, response);
};*/


