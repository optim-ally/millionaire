var ctx = document.getElementById('bg').getContext('2d'),
    img = document.getElementById('studio');

// create gradient for bottom of background image
var fadeToBlack = ctx.createLinearGradient(0,350,0,650);
fadeToBlack.addColorStop(0,'transparent');
fadeToBlack.addColorStop(.16,'#026');
fadeToBlack.addColorStop(1,'#012');

// draw the background
$(function(){
  // first the studio image
  ctx.drawImage(img,0,0);
  // then the bottom fade
  ctx.fillStyle = fadeToBlack;
  ctx.fillRect(0,300,760,650);
});