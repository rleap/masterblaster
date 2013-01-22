//Game canvas width and height
var gameWidth = 800;
var gameHeight = 600;

//Mouse locations
var mouseX = 0;
var mouseY = 0;

//Load up the canvases
var canvasPrimaryBg, contextPrimaryBg;
var canvasFg, contextCanvasFg;
var canvasFighter, contextFighter;
var canvasEnemy, contextEnemy;
var canvasHUD, contextHUD;
var isPlaying = false;

loadCanvas();

function loadCanvas() {
  
    //Primary background canvas
    canvasPrimaryBg = document.createElement( 'canvas' );
    canvasPrimaryBg.width = gameWidth;
    canvasPrimaryBg.height = gameHeight;
    canvasPrimaryBg.id = 'primaryBg';

    contextPrimaryBg = canvasPrimaryBg.getContext( '2d' );
  
    contextPrimaryBg.fillStyle = "hsla(300, 100%, 25%, 0.75)";
    contextPrimaryBg.font = "60px Stencil";

    document.getElementById('mbMain').appendChild( canvasPrimaryBg );

    //Enemy canvas
    canvasEnemy = document.createElement( 'canvas' );
    canvasEnemy.width = gameWidth;
    canvasEnemy.height = gameHeight;
    canvasEnemy.id = 'canvasEnemy';

    contextEnemy = canvasEnemy.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasEnemy );
    
     //Fighter canvas
    canvasFighter = document.createElement( 'canvas' );
    canvasFighter.width = gameWidth;
    canvasFighter.height = gameHeight;
    canvasFighter.id = 'canvasFighter';

    contextFighter = canvasFighter.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasFighter );

    //Foreground canvas
    canvasFg = document.createElement( 'canvas' );
    canvasFg.width = gameWidth;
    canvasFg.height = gameHeight;
    canvasFg.id = 'canvasFg';

    contextCanvasFg= canvasFg.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasFg );
    
    // Heads Up Display (HUD)
    canvasHUD = document.createElement( 'canvas' );
    canvasHUD.width = gameWidth;
    canvasHUD.height = gameHeight;
    canvasHUD.id = 'canvasHUD';

    contextHUD = canvasHUD.getContext( '2d' );

    contextHUD.fillStyle = "hsla(300, 100%, 25%, 0.75)";
    contextHUD.font = "bold 20px Arial";
    
    document.getElementById('mbMain').appendChild( canvasHUD );
    
}
//End load canvaes


var imgSprite = new Image();

imgSprite.src = 'images/gameSpriteSheet.png';
imgSprite.addEventListener('load',init,false);

var fighter1;
var btnPlay;
var numEnemies = 10;
var enemies = [];
var numRocks = 5;
var rocks = [];
var numBoulders = 3;
var boulders = [];



//Initialize game environment

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


function init() {

    spawnEnemies(numEnemies);
    
    spawnRocks(numRocks);
    
    spawnBoulders(numBoulders);
    
    drawBg();
    
    drawFg();
    
    drawMenu();
    
    audioBG.play();
    
    document.addEventListener('click',mouseClicked,false);
    
}

function playGame() {

    drawBg();
 
    fighter1 = new Fighter();
     
    startAnimation();
    
    drawFg();
    
    updateHUD();
    
    document.addEventListener('keydown',checkKeyDown,false);
    document.addEventListener('keyup',checkKeyUp,false);
  
}


function drawMenu() {
    var srcX = 0;
    var srcY = 1336;
    var width = 88;
    var height = 28;
    var drawX = gameWidth / 2 - (width / 2);
    var drawY = gameHeight / 2 - ( height / 2);
    contextPrimaryBg.drawImage(imgSprite,srcX,srcY,width,height,drawX,drawY,width,height);
    
    contextPrimaryBg.fillText("Master Blaster!", gameWidth * 0.17, gameHeight * 0.25);
        
    
    var xL = gameWidth / 2 - (width / 2);
    var xR = (gameWidth / 2 - (width / 2)) + width;
    var yT = gameHeight / 2 - ( height / 2);
    var yB = (gameHeight / 2 - ( height / 2)) + height;
    
    btnPlay = new Button(xL,xR,yT,yB);
}


var bgDrawX1 = 0;
var bgDrawX2 = gameWidth;

function moveBg() {
  
    bgDrawX1 -= 1;
    bgDrawX2 -= 1;
    
    if ( bgDrawX1 <= -gameWidth ) {
      
        bgDrawX1 = gameWidth;
      
    } else if ( bgDrawX2 <= -gameWidth) {
      
        bgDrawX2 = gameWidth;
      
    }
    
    drawBg();
  
}

function drawBg() {
  
    contextPrimaryBg.clearRect(0,0,gameWidth,gameHeight);  

    contextPrimaryBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,bgDrawX1,0,gameWidth,gameHeight);
    
    contextPrimaryBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,bgDrawX2,0,gameWidth,gameHeight);
    
}

var fgDrawX1 = 0;
var fgDrawX2 = gameWidth;

function moveFg() {
  
    fgDrawX1 -= 3;
    fgDrawX2 -= 3;
    
    if ( fgDrawX1 <= -gameWidth ) {
      
        fgDrawX1 = gameWidth;
      
    } else if ( fgDrawX2 <= -gameWidth) {
      
        fgDrawX2 = gameWidth;
      
    }
    
    drawFg();
  
}

function drawFg() {
    
    contextCanvasFg.clearRect(0,0,gameWidth,gameHeight);
    
    contextCanvasFg.drawImage(imgSprite,0,720,gameWidth,gameHeight - 120 ,fgDrawX1,60,gameWidth, gameHeight - 120);
    
    contextCanvasFg.drawImage(imgSprite,0,720,gameWidth,gameHeight - 120 ,fgDrawX2,60,gameWidth, gameHeight -120);
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

function spawnRocks(n) {

    for ( var i = 0; i < n; i++) {
    
        rocks[i] = new Rock();

    }
    
}


function drawAllRocks() {
      
    for( var i = 0; i < rocks.length; i++ ) {
      
        rocks[i].draw();
    
    }
  
}

function spawnBoulders(n) {

    for ( var i = 0; i < n; i++) {
    
        boulders[i] = new Boulder();

    }
    
}


function drawAllBoulders() {
      
    for( var i = 0; i < boulders.length; i++ ) {
      
        boulders[i].draw();
    
    }
  
}

function draw() {
    
    moveBg();
    moveFg();
    fighter1.draw();
    drawAllEnemies();
    drawAllRocks();
    drawAllBoulders();
    
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

function updateHUD() {

    contextHUD.clearRect(0,0,gameWidth,gameHeight);
    contextHUD.fillText("Score: " + fighter1.score, gameWidth - 175, gameHeight - 570);
  
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
    this.leftX = this.drawX;
    this.rightX = this.drawX + (gameWidth * 0.10);
    this.topY =  this.drawY;
    this.bottomY = this.drawY + (gameHeight * 0.05);
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
          this.bullets[i] = new Bullet(this);
    }
    
    this.score = 0;
    
}

Fighter.prototype.draw = function() {
    clearContextFighter();
    this.updateChords();
    this.checkDirection();
    this.checkShooting();
    this.drawAllBullets();
    contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,gameWidth * 0.10,gameHeight * 0.05);   
}

Fighter.prototype.checkDirection = function() {
    if (this.isUpKey && this.topY > 0) {
	this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
	this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
	this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
	this.drawX -= this.speed;
    }
	
}

Fighter.prototype.drawAllBullets = function() {

    for ( var i = 0; i < this.bullets.length; i++) {
    
        if ( this.bullets[i].drawX >= 0 ) this.bullets[i].draw();
        if ( this.bullets[i].explosion.hasHit ) this.bullets[i].explosion.draw();

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

Fighter.prototype.updateScore = function(points) {
  
    this.score += points;
    updateHUD();
  
}

Fighter.prototype.updateChords = function() {
  
    this.noseX = this.drawX + (gameWidth * 0.10);
    this.noseY = this.drawY + ((gameHeight * 0.05)/2);
    this.leftX = this.drawX;
    this.rightX = this.drawX + (gameWidth * 0.10);
    this.topY =  this.drawY;
    this.bottomY = this.drawY + (gameHeight * 0.05);
  
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
    this.speed = 2;
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
    this.points = 5;
    
}

Enemy.prototype.draw = function() {
  
    this.drawX -= this.speed;
    
    contextEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,gameWidth * 0.05,gameHeight * 0.05);
    
    //If enemy leaves screen, reset drawX and drawY
    if (this.drawX + this.width <= 0) this.recycleEnemy();
        
}

Enemy.prototype.recycleEnemy = function() {
  
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
  
}

function clearContextEnemy() {
    
    contextEnemy.clearRect(0,0,gameWidth,gameHeight);
    
}

// End Enemy Functions



// Bullet Functions
function Bullet(f) {
    this.fighter = f;
    this.srcX = 480;
    this.srcY = 1266;
    this.width = 4;
    this.height = 4;
    this.speed = 3;
    this.drawX = -20;
    this.drawY = 0;
    this.explosion = new Explosion();
    
}

Bullet.prototype.draw = function() {
  
    this.drawX += this.speed;
    
    contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width + 3,this.height + 1);
    
    this.checkHitEnemy();
    
    //If bullet leaves screen, reset drawX and drawY
    if (this.drawX + this.width > gameWidth) this.recycle();
        
}

Bullet.prototype.fire = function(startX, startY) {
  
    this.drawX = startX;
    this.drawY = startY;
  
  
}

Bullet.prototype.recycle = function() {

        this.drawX = -20;
        this.drawY = 0;
        
}

Bullet.prototype.checkHitEnemy = function() {
  
    for( var i = 0; i < enemies.length; i++ ) {
      
        if ( this.drawX >= enemies[i].drawX &&
             this.drawX <= enemies[i].drawX + enemies[i].width &&
             this.drawY >= enemies[i].drawY &&
             this.drawY <= enemies[i].drawY + enemies[i].height) {
          
                this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
                this.explosion.drawY = enemies[i].drawY;
                this.explosion.hasHit = true;
                this.recycle();
                enemies[i].recycleEnemy();
                this.fighter.updateScore(enemies[i].points);
          
        }
    
    } 
  
}

// End Bullet Functions

// Explosion Functions
function Explosion() {
    this.srcX = 447;
    this.srcY = 1266;
    this.width = 33;
    this.height = 37;  
    this.drawX = 0;
    this.drawY = 0;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasHit = false;
  
  
}

Explosion.prototype.draw = function() {
    
    if ( this.currentFrame <= this.totalFrames ) {
      
        contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
        this.currentFrame++;
        
    } else {
      
        this.hasHit = false;
        this.currentFrame = 0;
        
    }
    
};


// End of Explosion Functions


// Rocks Functions

function Rock() {
    this.srcX = 274;
    this.srcY = 1267;
    this.width = 38;
    this.height = 34;
    this.speed = 2;
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
    
}

Rock.prototype.draw = function() {
  
    this.drawX -= this.speed;
    
    contextEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    
    //If enemy leaves screen, reset drawX and drawY
    if (this.drawX + this.width <= 0) this.recycleRock();
        
}

Rock.prototype.recycleRock = function() {
  
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
  
}


// End Rock Functions


// Boulder Functions

function Boulder() {
    this.srcX = 70;
    this.srcY = 1267;
    this.width = 67;
    this.height = 67;
    this.speed = 1;
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
    
}

Boulder.prototype.draw = function() {
  
    this.drawX -= this.speed;
    
    contextEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    
    //If enemy leaves screen, reset drawX and drawY
    if (this.drawX + this.width <= 0) this.recycleBoulder();
        
}

Boulder.prototype.recycleBoulder = function() {
  
    this.drawX = Math.floor(Math.random() * (gameWidth + this.width)) + gameWidth;
    this.drawY = Math.floor(Math.random() * (gameHeight - this.width));
  
}


// End Rock Functions



// Button object

function Button(xL, xR, yT, yB) {
  
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
    
}

Button.prototype.checkClicked = function() {
  
      if (this.xLeft  <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
      
  
}

// End Button object





//Event Functions

function mouseClicked(e) {
  
    mouseX = e.pageX - canvasPrimaryBg.offsetLeft;
    mouseY = e.pageY - canvasPrimaryBg.offsetTop;
    
    if (!isPlaying) {
      
        if (btnPlay.checkClicked()) playGame();
    
    }
}

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