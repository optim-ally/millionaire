var pi2 = 2*Math.PI, allConfetti = [], colors = ['#0dd','#d0d','#0f0','#dd0'], generatingConfetti, movingConfetti, animationFrame, counter = 0;

var celebrationMusic = new Audio('audio/winner.mp3');

// canvas context for confetti animation
var ctx0 = $('#celebration')[0].getContext('2d');

// called when user wins game and £1M
function celebrate() {
  // change timer appearance to flashing celebration lights
  stopTimer();
  $('#timer').html('£M');
  for (var i=0; i<lights.length; i++) {
    lights[i].style.animationDelay = -i/4 + 's';
    lights[i].className = 'light flashing';
  }
  // start confetti shower
  generatingConfetti = setInterval(newConfetti,1000);
  movingConfetti = requestAnimationFrame(moveConfetti);

  // play celebration music
  celebrationMusic.currentTime = 0;
  celebrationMusic.play();
}

// called when user exits game
function stopCelebrating() {
  // reset all confetti animations
  clearTimeout(movingConfetti);
  cancelAnimationFrame(animationFrame);
  clearInterval(generatingConfetti);
  allConfetti = [];
  // clear celebration canvas
  ctx0.clearRect(0,0,760,1000);

  // stop music
  celebrationMusic.pause();
}

// function called periodically to drop next load of confetti
function newConfetti() {
  // confetti has random x,y positions (y pos from 0 to -200)
  for (var i=0; i<60; i++) allConfetti.push(new confetti(Math.random()*760,-Math.random()*200,colors[Math.floor(Math.random()*4)]));
  counter++;
  // once confetti passes the bottom of the screen, it is deleted
  if (counter > 7) allConfetti.splice(0,60);
}

// looping function to animate the falling confetti
function moveConfetti() {
  ctx0.clearRect(0,0,760,1000);
  // once canvas is cleared, move each piece of confetti
  // .move() also draws the piece
  for (var i in allConfetti) allConfetti[i].move();
  movingConfetti = setTimeout(function(){
    animationFrame = requestAnimationFrame(moveConfetti);
  },20);
}

// define confetti object
// empirically chosen constants for realistic movement
function confetti( x, y, color ) {
  this.x = x;
  this.y = y;
  this.dx = Math.random()*6-3
  this.color = color;

  this.move = function(){
    this.x += this.dx;
    this.dx += Math.random()*1-.5;
    this.dx = Math.min(Math.max(this.dx,-3),3);
    this.y += 5;
    ctx0.beginPath();
    ctx0.arc(this.x,this.y,5,0,pi2);
    ctx0.fillStyle = this.color;
    ctx0.fill();
  }
}