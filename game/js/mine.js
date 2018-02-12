"use strict";


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ball = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var color = "#faebd7"
var showStart = true;

var dx = 2;
var dy = -2;

var paddleH = 10;
var paddleW = 75;
var paddleX = (canvas.width - paddleW) / 2;
var paddleMove = 5; 

var rightKey = false;
var leftKey = false;

var brickRows = 5;
var brickCol = 10;
var brickW = 40;
var brickH = 20;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 17;

var score = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickCol; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRows; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1 }
    }
}

document.addEventListener("keydown", keyDownHandler,false); //when keys are pressed
document.addEventListener("keyup", keyUpHandler, false); //when keys are released
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawBall() { //draws the ball on the canvas
    ctx.beginPath();
    ctx.arc(x, y, ball, 0, Math.PI * 2); //draws the ball
    ctx.fillStyle = color;
    ctx.fill(); //fills in the circle, use stroke for an empty circle
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleH , paddleW, paddleH);
    ctx.fillStyle = "#b0e0e6";
    ctx.fill();
    ctx.closePath;
}

function drawBricks() {
    for(c=0; c<brickCol; c++) {
        for(r=0; r<brickRows; r++) {
            var b=bricks[c][r];
            if(b.status == 1) { //only draw if brick is active
                var brickX = brickOffsetLeft+ (c*(brickW+brickPadding));
                var brickY = brickOffsetTop + (r*(brickH+brickPadding));
                b.x = brickX;
                b.y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickW, brickH);
                ctx.fillStyle = "#ffe4e1";
                ctx.fill();
                ctx.closePath();
        }
    }
}
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //ensures ball leaves no trail
    drawBricks();
    drawBall();
    drawPaddle();
    keepScore();
    collisionDetection();

    if(y + dy < 10) {  //ball will change directions when it hits the top wall and its y value becomes less than 0
        dy = -dy; 
        color = getRandomColor;
    }
    
    if(x + dx < 10) { //ball will change directions when it hits the left wall
        dx = -dx;
        color = getRandomColor();
    }
    
    if(x + dx > canvas.width-10) { //ball will change directions when it hits the right wall
        dx = -dx;
        color = getRandomColor();
    }
    
    if (y + dy > canvas.height-paddleH-ball && x > paddleX && x < paddleX + paddleW) { //ball will change directions if it hits the paddle, if statement checks if center of ball is between the left and right edges of the paddle
            dy = -dy; 
    }
    
    else if(y + dy > canvas.height-ball) { //if ball hits bottom wall
        gameOver();
        setTimeout("location.reload();",500);
    }
    
    x += dx;
    y += dy; //constantly updates position with every frame so bar appears to move
    
    if(rightKey && paddleX < canvas.width-paddleW) { //if right key is pressed move paddle right pixels
        paddleX += paddleMove;
    }
    else if(leftKey && paddleX > 0) { //if left key is pressed move paddle left 7 pixels
        paddleX -= paddleMove;
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) { //39 = right cursor key
        rightKey = true;
    }
    else if(e.keyCode == 37) { //37 = left cursor key
        leftKey = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightKey = false;
    }
    else if(e.keyCode == 37) {
        leftKey = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickCol; c++) {
        for(r=0; r<brickRows; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickW && y > b.y && y < b.y+brickH) {
                    dy = -dy; //change direction when ball hits brick
                    b.status = 0;
                    color = getRandomColor;
                    score++;
                    if(score == brickRows*brickCol) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                }
                
                    
        }
        }
    }
}
}

function keepScore() {
    ctx.font = "30px";
    ctx.fillStyle = "#666666";
    ctx.fillText("Score: "+score, 8, 20);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft; //relative x position is mouse position in viewport minus left margin of canvas 
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleW/2;
    }
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 240 , 130); // text and position
}

function handleMouseClick(){
  showStart = false;
  setInterval(draw, 10);//draw will be executed every 10 miliseconds
}

function drawStart() {
    if(showStart == true){
      ctx.fillStyle = "#666666";
      ctx.fillText("CLICK TO START", 200, 130);
    }

}

drawStart();
canvas.addEventListener('mousedown', handleMouseClick);

// a key map of allowed keys
var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

// the 'official' Konami Code sequence
var konamiCode = ['left', 'right', 'up', 'down'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {
    score=brickCol*brickRows;
    alert("YOU WIN, CONGRATS!");
    location.reload();
}