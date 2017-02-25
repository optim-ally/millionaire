var questionNum, timeToAnswer, selected = '', winnings, timeSaved, version, money, ladderHTML, checking, category = 'Any';

var currentLevelMusic = level1Music,
    currentLevel = 1,
    level2Music = new Audio('audio/level-2.mp3'),
    level3Music = new Audio('audio/level-3.mp3'),
    wrongAnswerAudio = new Audio('audio/wrong.mp3'),
    rightAnswerAudio = new Audio('audio/right.mp3');

/*
The same element is used to display every message to the user: 
  'are you ready for the next question?'
  'you got that correct'
  'you got that wrong'
  etc...
and the same 'button' elements – 'next', 'quit', 'ok' etc. – are used in each case, hidden or visible, with the text changed depending on which message is being shown.

To ensure the correct function is called when these 'buttons' are pressed (e.g. 'quit game' is different from 'use lifeline now'), the variable 'currentMessage' keeps track of which state the message panel is in. If a 'button' is clicked, it checks the state to decide what to do.
*/
var currentMessage;


// when new game starts
function reset( whichVersion ) {
  // reset all counters
  questionNum = 1;
  version = whichVersion;
  winnings = 0;
  timeSaved = 0;
  $('#timer').html('');
  $('#question').html('');
  $('.answer').html('');

  // reset lifeline images (so they are not greyed out)
  $('#5050').attr('src','images/lifeline-5050.png');
  $('#paf').attr('src','images/lifeline-paf.png');
  $('#ata').attr('src','images/lifeline-ata.png');

  // some lifeline 'buttons' may have been unbound last game after use.
  // unbind any remaining...
  $('#lifelines > img, #switch').unbind();
  // ...and rebind event handlers
  $('#lifelines > img, #switch').mouseover(function(){
    $(this).attr('src','images/lifeline-'+$(this).attr('id')+'-hover.png');
  }).mouseout(function(){
    $(this).attr('src','images/lifeline-'+$(this).attr('id')+'.png');
  }).click(function(){ confirmLifeline($(this).attr('id')); });

  // choose the correct money ladder for the game version selected:
  // traditional version (15 questions)...
  if (version == 'traditional') money = ['0','100','200','300','500','1,000','2,000','4,000','8,000','16,000','32,000','64,000','125,000','250,000','500,000','1 MILLION'];
  // ...or modern version (12 question)...
  if (version == "modern") money = ['0','500','1,000','2,000','5,000','10,000','20,000','50,000','75,000','150,000','250,000','500,000','1 MILLION'];
  // ...then write the values to the money ladder (reverse-ordered list)
  ladderHTML = ''
  for (var i=money.length-1; i; i--)
    ladderHTML += "<li id='q"+i+"'><span>&diams;</span> &nbsp; &pound;"+money[i]+'<div></div></li>';
  $('#ladder').html('<ol reversed>'+ladderHTML+'</ol>');
  // make 'milestone' questions a different colour
  if (version == 'traditional') $('#q5,#q10,#q15').css('color','#FED');
  if (version == 'modern') $('#q2,#q7,#q12').css('color','#FED');

  // prompt user to begin first question
  areYouReady(1);
}


// prompt user to begin the next question
function areYouReady( stage ) {
  // first prepare the next question (get question & answers from API)
  readyQuestion(stage);

  // prepare message panel ('are you ready?' y/n) but don't display yet
  currentMessage = 'ready?';
  if (stage == 1) $('#message-text').html("Ready to begin a new game?<br/><br/>Hit 'Next Question' to start the timer for Question 1");
  else $('#message-text').html("Correct!<br/><br/>When you're ready, click 'Next Question' to go to question "+stage);
  $('#quit').html('Quit Game').css('visibility','inherit');
  $('#next-question').html('Next Question').css('visibility','inherit');
  $('#confirm').css('visibility','hidden');
  $('input').css('visibility','hidden');

  // ONLY when question has successfully loaded, display message
  checking = setInterval(function(){
    if (getQuestionSuccess == true) {
      clearInterval(checking);
      $('#message-board').css('visibility','visible');
    }
  },100);
}


// prompt user to confirm certain decisions (quit game, walk away etc.)
function areYouSure() {
  // prepare message
  $('#message-text').html((money[questionNum-1].length > 1 || currentMessage == 'walk?')? 'Walk away with £'+(money[questionNum-1])+'?':'Are you sure?');
  $('#quit').html('Yes').css('visibility','inherit');
  $('#next-question').html('No').css('visibility','inherit');
  $('#confirm').css('visibility','hidden');
  $('input').css('visibility','hidden');

  // display message
  $('#message-board').css('visibility','visible');
}


// function to load and prepare a question
// question number parameter specifies difficulty
function readyQuestion( k ) {
  // reset question/answer elements
  selected = '';
  remove = [];
  $('#final').attr('class','inactive');
  $('.answer-text').parent().attr('class','');

  // update highlighted value in money tree
  if (k>1) {
    $('#q'+(k-1)).attr('class','');
    $('#q'+(k-1)+'>span').css('visibility','visible');
  }

  // set question difficulty depending on game version & make API request
  if (version == 'modern') {
    timeToAnswer = (k<3)? 15 : (k<8)? 30 : 60;
    (k<5)? getQuestion('easy') : (k<9)? getQuestion('medium') : getQuestion('hard');
  } else {
    timeToAnswer = 60;
    (k<6)? getQuestion('easy') : (k<11)? getQuestion('medium') : getQuestion('hard');
  }
}


// give description of lifeline clicked and ask user to activate or not
function confirmLifeline( name ) {
  // prepare message
  currentMessage = name;
  $('#confirm').html('Ok').css('visibility','hidden');
  $('#quit').html('Ok').css('visibility','inherit');
  $('#next-question').html('Not now').css('visibility','inherit');
  switch(name) {
    case '5050': $('#message-text').html('Use the 50-50 lifeline?<br/>This will remove two incorrect answers'); break;
    case 'paf': $('#message-text').html('Phone a friend?<br/>They may be able to help with the question'); break;
    case 'ata': $('#message-text').html('Ask the audience?<br/>You will be shown how many would choose each answer'); break;
    case 'switch': $('#message-text').html('Use the Switch lifeline?<br/>The question will be replaced by a new one'); break;
    case 'help': $('#message-text').html('You can use each lifeline only once per game<br/><br/>Click on the icons to find out what they do');
      $('#confirm').css('visibility','inherit');
      $('#quit').css('visibility','hidden');
      $('#next-question').css('visibility','hidden');
      break;
  }
  // display message
  $('#message-board').css('visibility','visible');
}


// when final answer is selected, either by user choice or timeout
function finalAnswer() {
  stopTimer();
  $('.hover').attr('class','');
  $('#'+correctAnswer).attr('class','correct');
  if (selected == correctAnswer) {
    // play soundbite
    rightAnswerAudio.play();
    setTimeout(questionSuccess,500);
  } else {
    // play soundbite
    wrongAnswerAudio.play();
    setTimeout(questionFailure,500);
  }
}


// when question is answered correctly
function questionSuccess() {
  // update guaranteed winnings and music at milestone questions
  // also detect game finish at £1M
  if (version == 'traditional') {
    if (questionNum == 5) {
      winnings = 1000;
      startLevel2Music();
    }
    if (questionNum == 10) {
      winnings = 32000;
      startLevel3Music();
    }
    if (questionNum == 15) { millionaire(); return; }
  } else {
    if (questionNum == 2) {
      winnings = 1000;
      startLevel2Music();
    }
    if (questionNum == 7) {
      winnings = 50000;
      startLevel3Music();
    }
    if (questionNum == 12) { millionaire(); return; }
  }
  // prepare next question
  questionNum++
  timeSaved += currentTime;
  areYouReady(questionNum);
}

// when question answer is incorrect
function questionFailure() {
  // check for new high score
  if (highScore()) { newHighScore(); return; }
  // otherwise prepare & display 'you go home with £X' message
  $('#message-text').html('Game over!<br/><br/>You go home with £'+winnings);
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#confirm').html('Back to Menu').css('visibility','inherit');
  $('#message-board').css('visibility','visible');
}


// when user wins the game & £1M
function millionaire() {
  level3Music.volume = 0;
  // increment question number for consistency with high-score functions
  questionNum ++;
  // begin confetti animations
  celebrate();
  // show 3s of unobstructed confetti before displaying congrats message
  currentMessage = 'winner';
  setTimeout(newHighScore,3000);
}


function startLevel2Music() {
  level1Music.volume = 0;
  setInterval(function(){
    level2Music.currentTime = 0;
    level2Music.play();
  },32000);
  level2Music.play();
  currentLevelMusic = level2Music;
  currentLevel = 2;
}


function startLevel3Music() {
  level2Music.volume = 0;
  setInterval(function(){
    level3Music.currentTime = 0;
    level3Music.play();
  },16000);
  level3Music.play();
  currentLevelMusic = level3Music;
  currentLevel = 3;
}


// event handlers for message panel 'buttons'
//
// 'quit' deals with confirming lifeline use, quiting game
$('#quit').click(function(){
  if (currentMessage == '5050') fiftyFifty();
  else if (currentMessage == 'paf') phoneAFriend();
  else if (currentMessage == 'ata') askAudience();
  else if (currentMessage == 'switch') switchQuestion();
  else if (currentMessage != 'ready?' && highScore())
    newHighScore();
  else if (currentMessage != 'ready?' || questionNum == 1) {
    stopTimer();
    $('#home').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
  } else { currentMessage = 'sure?'; areYouSure(); }
});
//
// 'next-question' deals with starting next question, rejecting lifeline use
$('#next-question').click(function(){
  if (currentMessage == 'ready?') {
    // in modern version, a new lifeline is introduced after question 7
    if (version == 'modern' && questionNum == 8) {
      // the user is shown an information panel explaining this:
      $('#message-text').html("New lifeline unlocked!<br/><br/>You can now use the 'Switch' lifeline to change a question");
      $('#quit').css('visibility','hidden');
      $('#next-question').css('visibility','hidden');
      $('#confirm').html('Ok').css('visibility','inherit');
      $('#switch').css('visibility','visible');
      currentMessage = 'new life';
    }
    else { $('#message-board').css('visibility','hidden');
      startQuestion(); }
  } else if (currentMessage == 'sure?') areYouReady(questionNum);
  else $('#message-board').css('visibility','hidden');
});
//
// 'confirm' deals with dismissing information messages, confirming input
$('#confirm').click(function(){
  if (currentMessage == 'new life') startQuestion();
  if (currentMessage == 'info') startTimer();
  if (currentMessage == 'help' || currentMessage == 'info' || currentMessage == 'new life') { $('#message-board').css('visibility','hidden'); return; }
  if ($(this).attr('class') == 'inactive') return;
  if (currentMessage == 'newHighScore') updateHighScores();

  // in cases not already 'returned', go back to the home menu
  $('#home').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
  stopCelebrating();
});


// event handlers for answer choices
//
// turning grey on hover (unless already selected or out of time)
$('.answer-text').mouseover(function(){
  if ($(this).parent().attr('class') == 'chosen' || !timerRunning || $(this).parent().attr('class') == 'removed') return;
  $(this).parent().attr('class','hover');
// turning back to original colour when no longer hovering
}).mouseout(function(){
  if ($(this).parent().attr('class') == 'chosen' || !timerRunning || $(this).parent().attr('class') == 'removed') return;
  $(this).parent().attr('class','');
// selecting (turning orange) when clicked (unless out of time)
}).click(function(){
  if (!timerRunning || $(this).parent().attr('class') == 'removed') return;
  $('.chosen').attr('class','');
  $(this).parent().attr('class','chosen');
  selected = $(this).parent().attr('id');
  $('#final').attr('class','active');
});


// final answer 'button', for locking in current choice
$('#final').click(function(){
  if ($(this).attr('class') == 'active') finalAnswer();
});


// walk-away 'button'
// hovering changes the image to a lighter copy
$('#walk-away').mouseover(function(){
  $(this).attr('src','images/'+$(this).attr('id')+'-hover.png');
}).mouseout(function(){
  $(this).attr('src','images/'+$(this).attr('id')+'.png');
// clicking prompts 'are you sure' message
}).click(function(){ currentMessage = 'walk?'; areYouSure(); });