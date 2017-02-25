var tic, currentTime = 60, timerRunning, timerHTML = '', lights;

var timerAudio = new Audio('audio/tic-toc.mp3'), timerAudioInterval;

// add 36 small, rounded divs around the timer to be lights
$(function(){
  for (var i=0; i<36; i++) timerHTML += "<div class='light'/>";
  $('#timer-display').append("<div id='light-container'>" + timerHTML + '</div>');

  lights = $('.light');
  // use Math.sin() and Math.cos() to position them in a circle
  for (var i=0; i<lights.length; i++) {
    lights[i].style.marginTop = 50-53*Math.cos(i/18*Math.PI) + '%';
    lights[i].style.marginLeft = 50+53*Math.sin(i/18*Math.PI) + '%';
    lights[i].className = 'light';
  }
});


function startTimer( t ) {
  timerRunning = true;
  // if no parameter is given, restart the timer from current state
  currentTime = t || currentTime;
  // delay successive light's animations by another 1/36s to give the illusion of colours moving around the circle
  for (var i=0; i<lights.length; i++) {
    lights[i].style.animationDelay = i/36-1 + 's';
    lights[i].className = 'light lit';
  }
  // define looped function to cause timer to tick down
  // (light animations are separate, but in sync with the timer)
  function countDown() {
    $('#timer').html(currentTime);
    currentTime--;
    if (currentTime >= 0) tic = setTimeout(countDown,1000);
    // once the timer reaches 0, it stops and the lights all turn red
    else {
      for (var i=0; i<lights.length; i++) { lights[i].style.backgroundColor = 'red'; }
      stopTimer();
      // if user has an answer selected, that answer is locked in
      finalAnswer();
    }
  }
  // initial call to enter countdown loop
  countDown();

  // set up audio loop
  timerAudioInterval = setInterval(function(){
    timerAudio.currentTime = 0;
    timerAudio.play();
  },2000);
  // and initialise
  timerAudio.currentTime = 0;
  timerAudio.play();
  // background music fades to quiet when timer is running
  if (currentLevel == 1) currentLevelMusic.volume = Math.min(currentLevelMusic.volume,.1);
  else currentLevelMusic.volume = Math.min(currentLevelMusic.volume,.3);
}

function stopTimer() {
  clearTimeout(tic);
  clearInterval(timerAudioInterval);
  timerRunning = false;
  timerAudio.pause();
  // background music returns to normal volume (which may be 0 or 1)
  if (currentLevel == 1) currentLevelMusic.volume = Math.min(currentLevelMusic.volume*10,1);
  else currentLevelMusic.volume = Math.min(currentLevelMusic.volume*4,1);
  // if it's just a pause, all lights go white(-ish) until the timer starts again
  // (if time runs out, the lights will stay red, since 'style.backgroundColor' overrules the default CSS styling of the 'light' class)
  for (var i=0; i<lights.length; i++) { lights[i].className = 'light'; }
}