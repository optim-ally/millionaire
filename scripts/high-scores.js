var lifelinesUsed, worstEntry, currentEntry, highScoresHTML, minutes, char, name;

// set initial (target) high scores for the user to beat
var highScores = {'traditional':[['TL27',1000000,1,42],['BOB',125000,3,212],['MARIE',64000,0,468],['AMY',64000,2,227],['JAKE',32000,3,84]], 'modern':[['ALICE',250000,2,130],['JAMES',150000,3,46],['SALLY',75000,2,141],['OLAF',75000,4,83],['TOM',1000,2,11]]};

// check for previous user high scores in local storage
highScores = JSON.parse(localStorage.getItem('high-scores')) || highScores;
// and display on the 'high-scores' page
displayHighScores();

// function to check if user's score beats the current worst high score
function highScore() {
  worstEntry = highScores[version][4];
  // first check for difference in winnings (more is better)
  if (Number(money[questionNum-1].replace(',','')) > worstEntry[1]) return true;
  if (Number(money[questionNum-1].replace(',','')) < worstEntry[1]) return false;
  // then check for difference in number of lifelines used (fewer is better)
  lifelinesUsed = usedFiftyFifty + usedPhoneAFriend + usedAskAudience + usedSwitch;
  if (lifelinesUsed < worstEntry[2]) return true;
  if (lifelinesUsed > worstEntry[2]) return false;
  // then check for difference in total time saved (more is better)
  // if all values are identical (unlikely), then the new high score gets priority
  if (timeSaved >= worstEntry[3]) return true;
  return false;
}

// function to print current high scores
function displayHighScores() {
  // print high scores for traditional version
  highScoresHTML = '<tr><th>Position</th><th>Name</th><th>Winnings</th><th>Lifelines</th><th>Spare Time</th></tr>';
  for (var i=0; i<5; i++) {
    currentEntry = highScores.traditional[i];
    highScoresHTML += '<tr><td>'+(i+1)+'</td><td>'+currentEntry[0]+'</td><td>£'+currentEntry[1]+'</td><td>'+currentEntry[2]+'</td><td>'+time(currentEntry[3])+'</td></tr>';
  }
  $('#trad-high-scores').html(highScoresHTML);
  // print high scores for modern version
  highScoresHTML = '<tr><th>Position</th><th>Name</th><th>Winnings</th><th>Lifelines</th><th>Spare Time</th></tr>';
  for (var i=0; i<5; i++) {
    currentEntry = highScores.modern[i];
    highScoresHTML += '<tr><td>'+(i+1)+'</td><td>'+currentEntry[0]+'</td><td>£'+currentEntry[1]+'</td><td>'+currentEntry[2]+'</td><td>'+time(currentEntry[3])+'</td></tr>';
  }
  $('#modn-high-scores').html(highScoresHTML);
}

// function to change time in seconds to time in minutes & seconds
function time( seconds ) {
  minutes = 0;
  while (seconds > 60) {
    minutes++;
    seconds -= 60;
  }
  if (seconds < 10) seconds = '0' + seconds;
  return minutes + ' : ' + seconds;
}

// when current result is a new high score
function newHighScore() {
  stopTimer();
  // prepare and display message
  if (currentMessage == 'winner') $('#message-text').html('You won £1MILLION<br/><br/>Enter your name:');
  else $('#message-text').html('New high score!<br/>Enter your name:');
  currentMessage = 'newHighScore';
  // prompt user to input their name
  $('input').val('').css('visibility','visible');
  // confirm button initially inactive until name is typed
  $('#confirm').html('Done').attr('class','inactive').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#message-board').css('visibility','visible');
}

function updateHighScores() {
  lifelinesUsed = usedFiftyFifty+usedPhoneAFriend+usedAskAudience+usedSwitch;
  if (questionNum > 12)
    currentEntry = [$('input').val(),1000000,lifelinesUsed,timeSaved];
  else currentEntry = [$('input').val(),Number(money[questionNum-1].replace(',','')),lifelinesUsed,timeSaved];
  highScores[version][4] = currentEntry;
  highScores[version].sort(function(a,b){
    if (a[1] > b[1]) return -1;  if (a[1] < b[1]) return 1;
    if (a[2] < b[2]) return -1;  if (a[2] > b[2]) return 1;
    if (a[3] > b[3]) return -1;  if (a[3] < b[3]) return 1;
    return 0;
  });
  displayHighScores();
  localStorage.setItem('high-scores',JSON.stringify(highScores));
}

// event handler for name input
$('input').keydown(function(e) { 
  char = e.which;
  // allow <backspace>
  if (char != 8) e.preventDefault();
  // although if a backspace results in a zero-length name, grey out 'done' button
  else if ($('input').val().length == 1) $('#confirm').attr('class','inactive');
  // else force upper-case letters up to name length of 5
  if (char > 64 && char < 91 && $('input').val().length < 5) {
    $('input').val($('input').val()+String.fromCharCode(char));
    $('#confirm').attr('class','active');
  }
});