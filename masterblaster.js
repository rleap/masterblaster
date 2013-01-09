//Game canvas width and height
var gameWidth = 800;
var gameHeight = 600;

//Load up the canvases
var canvasPrimaryBg, contextPrimaryBg;
var canvasFg, contextCanvasFg;
var canvasFighter, contextFighter;

loadCanvas();

function loadCanvas() {

    //Primary background canvas
    canvasPrimaryBg = document.createElement( 'canvas' );
    canvasPrimaryBg.width = gameWidth;
    canvasPrimaryBg.height = gameHeight;
    canvasPrimaryBg.id = 'primaryBg';

    contextPrimaryBg = canvasPrimaryBg.getContext( '2d' );

    document.getElementById('mbMain').appendChild( canvasPrimaryBg );
 
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



//Initialize game environment

function init() {

    drawBg();
 
    fighter1 = new Fighter();
     
    animate();
    
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

function draw() {
    
    fighter1.draw();
    
}

function animate() {
    requestAnimaFrame( animate );
    draw();

}

function clearContextPrimaryBg() {
    
    contextPrimaryBg.clearRect(0,0,gameWidth,gameHeight);    
    
}

function clearContextCanvasFg() {
    
    contextCanvasFg.clearRect(0,0,gameWidth,gameHeight);
    
}




//Fighter Functions
function Fighter() {
    this.srcX = 0;
    this.srcY = 1200;
    this.drawX = 200;
    this.drawY = 172;
    this.width = 137;
    this.height = 54;
    this.speed = 3;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    
}

Fighter.prototype.draw = function() {
    clearContextFighter();
    this.checkKeys();
    contextFighter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,gameWidth * 0.10,gameHeight * 0.05);   
};

Fighter.prototype.checkKeys = function() {
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

function clearContextFighter() {
    
    contextFighter.clearRect(0,0,gameWidth,gameHeight);
    
}

// End Fighter Functions














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
}

//End Event Functions