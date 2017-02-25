var usedFiftyFifty = 0, usedPhoneAFriend = 0, usedAskAudience = 0, usedSwitch = 0, message;

// variables for the 50-50 lifeline
var remove = [], remaining;
// once use of 50-50 lifeline has been confirmed
function fiftyFifty() {
  // start by choosing the 2 answers to be removed
  remove = ['A','B','C','D'];
  // they can't include the correct answer
  remove.splice(remove.indexOf(correctAnswer),1);
  // and keep a random incorrect answer
  remove.splice(Math.floor(Math.random()*3),1);
  // then invoke the CSS style (greyed-out) associated with the .removed class for the two removed answers
  // (the answer selection handler will stop working for answers with the .removed class, and these classes will be deleted before the next question begins)
  for (var i in remove) $('#'+remove[i]).attr('class','removed');
  $('#message-board').css('visibility','hidden');
  // finally, grey out the 50-50 icon and record its use
  $('#5050').attr('src','images/lifeline-5050-used.png').unbind();
  usedFiftyFifty = 1;
}


// once use of 'phone-a-friend' lifeline has been confirmed
function phoneAFriend() {
  stopTimer();
  currentMessage = 'info';
  // only consider answers that have not already been removed by the 50-50 lifeline
  remaining = ['A','B','C','D'].filter(function(x){ return remove.indexOf(x) < 0 });

  // randomly chosen competence of 'friend'
  // (2/5 expert, 2/5 competent, 1/5 hopeless)
  switch(Math.floor(Math.random()*5)) {
    case 0: case 1: message = "\"I know this one! It's definitely " + correctAnswer + ', you can trust me on that\"'; break;
    case 2: case 3: message = "\"Hmmm... I'm not certain, but I have a strong feeling the answer is " + ((Math.random()<.7)? correctAnswer:remaining[1]) + '\"'; break;
    case 4: message = '\"Oh, wow. I have no idea! If I had to guess, it might be ' + remaining[Math.floor(Math.random()*remaining.length)] + '\"';
  }
  // message panel already visible, so just update the text
  $('#message-text').html(message);
  $('#confirm').html('Ok').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  // finally, grey out the 'phone-a-friend' icon and record its use
  $('#paf').attr('src','images/lifeline-paf-used.png').unbind();
  usedPhoneAFriend = 1;
}


// variables for the ask-the-audience lifeline
var percent = {'A':0,'B':0,'C':0,'D':0}, toc, x, done;
// once use of 'ask-the-audience' lifeline has been confirmed
function askAudience() {
  stopTimer();
  currentMessage = 'info';
  // only consider answers that have not already been removed by the 50-50 lifeline
  remaining = ['A','B','C','D'].filter(function(x){ return remove.indexOf(x) < 0 });

  done = false;
  while(!done) {
    // set all voting % to zero, since the below loop missed any removed answers
    percent = {'A':0,'B':0,'C':0,'D':0};
    // empirically chosen audience-competence function:
    for (var i in remaining) percent[remaining[i]] = Math.floor(Math.random()*Math.random()*50); 
    // the correct answer gets the remainder of the audience vote
    percent[correctAnswer] += 100-percent['A']-percent['B']-percent['C']-percent['D'];
    // in rare case of premature overflow of 100%, try again
    if (percent[correctAnswer] >= 0) done = true;
  }

  // draw the results as a bar chart directly into the message body
  // (pre-formatted in CSS)
  $('#message-text').html("<div><div id='bar-A'></div><div id='bar-B'></div><div id='bar-C'></div><div id='bar-D'></div></div><table><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></table>");
  // animate the bars so they seem to be growing upwards
  $('#message-text > div > div').css('height',0);
  toc = setInterval(frame,5);
  x = 0;
  function frame() {
    if (x >= 1) clearInterval(toc);
    else {
      for (var i in remaining)
      $('#bar-'+remaining[i]).css({'height':x*percent[remaining[i]]+'%', 'top':100-x*percent[remaining[i]]+'%'});
      x += .01;
    }
  }

  // update the rest of the message-panel text
  $('#confirm').html('Ok').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  // finally, grey out the 'ask-the-audience' icon and record its use
  $('#ata').attr('src','images/lifeline-ata-used.png').unbind();
  usedAskAudience = 1;
}


// once use of 'switch' lifeline has been confirmed
function switchQuestion() {
  stopTimer();
  // prepare the replacement question
  readyQuestion(questionNum);
  // ONLY when the question has fully loaded, display it and hide the message
  checking = setInterval(function(){
    if (getQuestionSuccess == true) {
      clearInterval(checking);
      startQuestion();
      $('#message-board').css('visibility','hidden');
      // this is only a late-addition lifeline: the icon pops up after Q8 and disppears after use, so hide and deactivate it
      $('#switch').css('visibility','hidden').unbind();
    }
  },100);
  // record lifeline use
  usedSwitch = 1;
}