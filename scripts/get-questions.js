var baseURL = 'https%3A%2F%2Fopentdb.com%2Fapi.php%3Famount%3D1', answerText = $('.answer'), getQuestionSuccess, responseCode, question, answers, correctAnswer, token, url;

// start by getting a session token from the question source
// this ensures no repeat questions in the current session until neccessary
$(function(){ getNewToken(); });


// function to request a question from the database and assign the data to variables 'question', 'correctAnswer', etc.
function getQuestion( difficulty ) {
  // variable lets other functions know when request is completed
  getQuestionSuccess = false;

  // convert category to corresponding numerical id
  switch(category) {
    case 'Any': category = 0; break;
    case 'General Knowledge': category = 9; break;
    case 'Books': category = 10; break;
    case 'Film': category = 11; break;
    case 'Music': category = 12; break;
    case 'Video Games': category = 15; break;
    case 'Science &amp; Nature': category = 17; break;
    case 'Computers': category = 18; break;
    case 'Sports': category = 21; break;
    case 'Geography': category = 22; break;
    case 'History': category = 23; break;
    case 'Animals': category = 27; break;
    case 'Vehicles': category = 28; break;
    case 'Japanese Anime &amp; Manga': category = 31; break;

    // the following categories are supported by the API, but do not have enough questions to last a single game:
    /*
      'Entertainment: Musicals & Theatres'   category = 13;
      'Entertainment: Television'            category = 14;
      'Entertainment: Board Games'           category = 16;
      'Science: Mathematics'                 category = 19;
      'Mythology'                            category = 20;
      'Politics'                             category = 24;
      'Art'                                  category = 25;
      'Celebrities'                          category = 26;
      'Entertainment: Comics'                category = 29;
      'Science: Gadgets'                     category = 30;
      'Entertainment: Cartoon & Animations'  category = 32;
    */
  }

  // construct url for JSON request
  url = baseURL;
  url += '%26category%3D'+category;
  url += '%26difficulty%3D'+difficulty;
  url += '%26type%3Dmultiple';
  url += '%26token%3D'+token
  url += '%22&format=json&diagnostics=true&callback=';

  // make the request (via Yahoo YQL to avoid CORS issues)
  $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22'+url, callback);

  function callback(data) {
    data = data.query.results.json;
    responseCode = data.response_code;
    // check if database has run out of questions in the relevant category
    if (responseCode == 4) {
      // if so, reset the token and alert the user
      getNewToken();
      setTimeout(getQuestion(difficulty),1000);
      $('#message-text').html("Out of questions!<br/>We'll have to start reusing them. You can improve the game by adding to the database <a href='https://opentdb.com'>here</a>.");
      return;
    // check for any other errors and retry if detected
    } else if (responseCode != 0) { getQuestion(difficulty); return; }

    // if there are no issues, assign the important data to be used elsewhere...
    question = data.results.question;
    answers = data.results.incorrect_answers;
    correctAnswer = Math.floor(Math.random()*4);
    answers.splice(correctAnswer,0,data.results.correct_answer);
    correctAnswer = ['A','B','C','D'][correctAnswer];
    // ...and then advertise that the request is complete
    getQuestionSuccess = true;
  }
}


// function to display question & answer text and begin the countdown
function startQuestion() {
  $('#question').html(question);
  for (var i=0; i<4; i++)
    answerText[i].innerHTML = answers[i];
  startTimer(timeToAnswer);
  // also highlight the current question & value on the money ladder
  $('#q'+questionNum).attr('class','selected');
}


// when the database runs out of new questions, we are forced to repeat
// only neccessary if the user plays several games back-to-back
function getNewToken() {
  $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fopentdb.com%2Fapi_token.php%3Fcommand%3Drequest%22&format=json&diagnostics=true&callback=', tokenCallback);

  function tokenCallback(data) { token = data.query.results.json.token; }
}