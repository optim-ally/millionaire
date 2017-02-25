// video skip event handler
$('#video-container > div').click(function(){
  $('#video-container').remove();
  startLevel1Music();
});

// main menu music (custom loop)
var level1Music = new Audio('audio/level-1.mp3'), level1MusicOn = false;
function startLevel1Music() {
  if (!level1MusicOn) {
    setInterval(function(){
      level1Music.currentTime = 0;
      level1Music.play();
    },13970);
    level1Music.play();
    level1MusicOn = true;
  }
}
// if intro video is not skipped, the music starts automatically
setTimeout(startLevel1Music,20400);

// event handlers for hovering over 'buttons' on the home menu
$('#home .button').mouseover(function(){
  $(this).css('border-image',"url('images/question-frame-highlight.png') 30% stretch");
  $(this).children().css('background-color','#404040');
}).mouseout(function(){
  $(this).css('border-image',"url('images/question-frame.png') 30% stretch");
  $(this).children().css('background-color','black');
});

// event handlers for clicking on high-score or how-to-play 'buttons'
$('#to-high-scores,#to-how-to-play').click(function(){
  // rearrange the z-indices to put the chosen panel in front of the game interface
  $('#message-board').css('visibility','hidden');
  $('input').val('').css('visibility','hidden');
  $('#high-scores,#how-to-play').css('z-index',0);
  $('#'+$(this).attr('id').slice(3)).css('z-index',1);

  // then scroll the home menu out of the way and the chosen one in
  $('#home').css({animation:'outRight 1s','animation-fill-mode':'forwards'});
  $('#high-scores,#how-to-play').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
});

// event handlers for clicking to start a new game
$('#play-traditional,#play-modern').click(function(){
  // prepare the chosen game mode
  reset($(this).attr('id').slice(5));
  // hide the other panels behind the game interface
  $('#high-scores,#how-to-play').css('z-index',-1);
  // then scroll the home menu out of the way
  $('#home').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});

// event handler for clicking back-to-menu 'button'
$('.back-to-menu').click(function(){
  // simply scroll the home menu back into view
  $('#home').css({animation:'inRight 1s','animation-fill-mode':'forwards'});$('#high-scores,#how-to-play').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});

// event handler for opening and closing the category settings
$('#home #to-settings').click(function(){
  $('#settings').css('visibility','visible');
});
$('#done').click(function(){
  $('#settings').css('visibility','hidden');
});

// event handlers for muting/unmuting audio
$('#home #volume').click(function(){
  if ($(this).attr('src') == 'images/sound-on.png') {
    $(this).attr('src','images/sound-off.png');
    level1Music.volume = 0;
    timerAudio.volume = 0;
    wrongAnswerAudio.volume = 0;
    rightAnswerAudio.volume = 0;
    celebrationMusic.volume = 0;
  } else {
    $(this).attr('src','images/sound-on.png');
    level1Music.volume = 1;
    timerAudio.volume = 1;
    wrongAnswerAudio.volume = 1;
    rightAnswerAudio.volume = 1;
    celebrationMusic.volume = 1;
  }
});

// event handlers for changing category settings
$('#settings > div > div').not('#done').click(function(){
  $('.chosen-category').attr('class','');
  $(this).children().attr('class','chosen-category');
  category = $(this).children().html();
});
