//Game canvas width and height
var gameWidth = 800;
var gameHeight = 600;

//Load up the canvases
var canvasPrimaryBg, contextPrimaryBg;
var canvasFg, contextCanvasFg;
var canvasFighter, contextFighter;
var canvasEnemy, contextEnemy;
var isPlaying = false;

loadCanvas();

function loadCanvas() {

    //Primary background canvas
    canvasPrimaryBg = document.createElement( 'canvas' );
    canvasPrimaryBg.width = gameWidth;
    canvasPrimaryBg.height = gameHeight;
    canvasPrimaryBg.id = 'primaryBg';

    contextPrimaryBg = canvasPrimaryBg.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasPrimaryBg );

    //Enemy canvas
    canvasEnemy = document.createElement( 'canvas' );
    canvasEnemy.width = gameWidth;
    canvasEnemy.height = gameHeight;
    canvasEnemy.id = 'enemy';

    contextEnemy = canvasEnemy.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasEnemy );
    
     //Fighter canvas
    canvasFighter = document.createElement( 'canvas' );
    canvasFighter.width = gameWidth;
    canvasFighter.height = gameHeight;
    canvasFighter.id = 'fighter';

    contextFighter = canvasFighter.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasFighter );

    //Foreground canvas
    canvasFg = document.createElement( 'canvas' );
    canvasFg.width = gameWidth;
    canvasFg.height = gameHeight;
    canvasFg.id = 'canvasFg';

    contextCanvasFg= canvasFg.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasFg );
}
//End load canvaes


var imgSprite = new Image();

imgSprite.src = 'images/gameSpriteSheet.png';
imgSprite.addEventListener('load',init,false);

var fighter1;
var numEnemies = 10;
var enemies = [];


//Initialize game environment

function init() {

    spawnEnemies(numEnemies);
     
    drawBg();
 
    fighter1 = new Fighter();
     
    startAnimation();
    
    drawFg();
    
    document.addEventListener('keydown',checkKeyDown,false);
    document.addEventListener('keyup',checkKeyUp,false);
    
}

// requestAnim shim layer
window.requestAnimaFrame = (function(){
  return  window.requestAnimationFrame       || 
	  window.webkitRequestAnimationFrame || 
	  window.mozRequestAnimationFrame    || 
	  window.oRequestAnimationFrame      || 
	  window.msRequestAnimationFrame     || 
	  function(/* function */ callback, /* DOMElement */ element){
	    window.setTimeout(callback, 1000 / 60);
	  };
})();
    
function drawBg() {
    var psrcX = 0;
    var psrcY = 0;
    var pdrawX = 0;
    var pdrawY = 0;
    contextPrimaryBg.drawImage(imgSprite,psrcX,psrcY,gameWidth,gameHeight,pdrawX,pdrawY,gameWidth,gameHeight);
    
}

function drawFg() {
    
    var ssrcX = 0;
    var ssrcY = 720;
    var sdrawX = 0;
    var sdrawY = 60;
    
    contextCanvasFg.drawImage(imgSprite,ssrcX,ssrcY,gameWidth,gameHeight -120 ,sdrawX,sdrawY,gameWidth, gameHeight - 120);
}

function spawnEnemies(n) {

    for ( var i = 0; i < n; i++) {
    
        enemies[i] = new Enemy();

    }
    
}


function drawAllEnemies() {
  
    clearContextEnemy();
      
    for( var i = 0; i < enemies.length; i++ ) {
      
        enemies[i].draw();
    
    }
  
}


function draw() {
    
    fighter1.draw();
    drawAllEnemies();
    
}

//Start game animation
function animate() {
      
    if (isPlaying){
        
      requestAnimaFrame( animate );
      draw();

    }

}

function startAnimation() {
  
    isPlaying = true;
    animate();
  
}

//Pause game animation
function stopAnimation() {
  
    isPlaying = false;
  
}


function clearContextPrimaryBg() {
    
    contextPrimaryBg.clearRect(0,0,gameWidth,gameHeight);    
    
}

function clearContextCanvasFg() {
    
    contextCanvasFg.clearRect(0,0,gameWidth,gameHeight);
    
}




//Fighter Functions
function Fighter() {
    this.srcX = 0;        //Location X on sprite sheet
    this.srcY = 1200;  //Location Y on sprite sheet
    this.width = 137;  //Image width
    this.height = 54;  //Image height
    this.speed = 3;
    this.drawX = Math.floor(gameWidth / 6);  //Location X on canvas
    this.drawY = Math.floor(gameHeight/2);  //Location Y on canvas
    this.noseX = this.drawX + (gameWidth * 0.10);
    this.noseY = this.drawY + ((gameHeight * 0.05)/2);
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.numBullets = 50;
    this.bullets = [];
    this.currentBullet = 0;
    
    for ( var i = 0; i < this.numBullets; i++) {
          this.bullets[i] = new Bullet();
    }
    
}

Fighter.prototype.draw = function() {
    clearContextFighter();
    this.checkDirection();
    this.noseX = this.drawX + (gameWidth * 0.10);
    this.noseY = this.drawY + ((gameHeight * 0.05)/2);
    this.checkShooting();
    this.drawAllBullets();
    contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,gameWidth * 0.10,gameHeight * 0.05);   
};

Fighter.prototype.checkDirection = function() {
    if (this.isUpKey) {
	this.drawY -= this.speed;
    }
    if (this.isRightKey) {
	this.drawX += this.speed;
    }
    if (this.isDownKey) {
	this.drawY += this.speed;
    }
    if (this.isLeftKey) {
	this.drawX -= this.speed;
    }
	
};

Fighter.prototype.drawAllBullets = function() {

    for ( var i = 0; i < this.bullets.length; i++) {
    
        if ( this.bullets[i].drawX >= 0 ) this.bullets[i].draw();

    }
    
}

Fighter.prototype.checkShooting = function() {

    if ( this.isSpacebar && !this.isShooting ) {
     
        this.isShooting = true;
        
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        
        this.currentBullet++;
        
        if ( this.currentBullet >= this.bullets.length ) this.currentBullet = 0;
      
    } else if ( !this.isSpacebar) {
      
         this.isShooting = false;
         
    }
    
}

function clearContextFighter() {
    
    contextFighter.clearRect(0,0,gameWidth,gameHeight);
    
}

// End Fighter Functions



// Enemy Functions
function Enemy() {
    this.srcX = 415;
    this.srcY = 1268;
    this.width = 32;
    this.height = 21;
    this.speed = 3;
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
    
}

Enemy.prototype.draw = function() {
  
    this.drawX -= this.speed;
    
    contextEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,gameWidth * 0.05,gameHeight * 0.05);
    
    //If enemy leaves screen, reset drawX and drawY
    if (this.drawX + this.width <= 0){
      
        this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
        this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
        
    }
    
};

function clearContextEnemy() {
    
    contextEnemy.clearRect(0,0,gameWidth,gameHeight);
    
}

// End Enemy Functions



// Bullet Functions
function Bullet() {
    this.srcX = 480;
    this.srcY = 1266;
    this.width = 4;
    this.height = 4;
    this.speed = 3;
    this.drawX = -20;
    this.drawY = 0;
    
}

Bullet.prototype.draw = function() {
  
    this.drawX += this.speed;
    
    contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    
    //If bullet leaves screen, reset drawX and drawY
    if (this.drawX + this.width > gameWidth) {
      
        this.drawX = -20;
        this.drawY = 0;
        
    }
    
};

Bullet.prototype.fire = function(startX, startY) {
  
    this.drawX = startX;
    this.drawY = startY;
  
  
}

// End Bullet Functions








//Event Functions
function checkKeyDown(e) {
    var keyId = e.keyCode || e.which;
    
    if (keyId === 38 || keyId === 87) { //up arrow or W key
	fighter1.isUpKey = true;
	e.preventDefault();
	
    }
    if (keyId === 39 || keyId === 68) { //right arrow or D key
	 fighter1.isRightKey = true;
	e.preventDefault();
	
    }
    if (keyId === 40 || keyId === 83) { //down arrow or S key
	 fighter1.isDownKey = true;
	e.preventDefault();
	
    }
    if (keyId === 37 || keyId === 65) { //left arrow or A key
	 fighter1.isLeftKey = true;
	e.preventDefault();
	
    }
    if (keyId === 32) { //spacebar
	 fighter1.isSpacebar= true;
	e.preventDefault();
	
    }   
}


function checkKeyUp(e) {
    var keyId = e.keyCode || e.which;
    
    if (keyId === 38 || keyId === 87) { //up arrow or W key
	 fighter1.isUpKey = false;
	e.preventDefault();
	
    }
    if (keyId === 39 || keyId === 68) { //right arrow or D key
	 fighter1.isRightKey = false;
	e.preventDefault();
	
    }
    if (keyId === 40 || keyId === 83) { //down arrow or S key
	 fighter1.isDownKey = false;
	e.preventDefault();
	
    }
    if (keyId === 37 || keyId === 65) { //left arrow or A key
	 fighter1.isLeftKey = false;
	e.preventDefault();
	
    }
    if (keyId === 32) { //spacebar
	 fighter1.isSpacebar = false;
	e.preventDefault();
	
    } 
}

//End Event Functions