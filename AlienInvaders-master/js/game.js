
var AlienFlock = function AlienFlock() {//Beginning of AlienFlock function
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 30;

  this.draw = function() {};

  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien )  {//if the class alien then
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}//Ending of AlienFlock function

var Alien = function Alien(opts) {//Start of Alien function(Object constructor?)
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
    GameAudio.play('music');
}//end of Alien function

Alien.prototype.draw = function(canvas) {//Draws the Alien, using 
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}//end of draw function

Alien.prototype.die = function() {//start of alien die function
     Game.playerScore+=10//score stuff
  GameAudio.play('die');
  this.flock.speed += 1;
  this.board.remove(this);
}//end of alien die function

Alien.prototype.step = function(dt) {//start of movement function
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+5) % 6;
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}//end of alien move function

Alien.prototype.fireSometimes = function() {//alien shooting function
      if(Math.random()*100 < 20) {//when random number returns less than 10 fire.
          GameAudio.play('alienFire');
        this.board.addSprite('alienmissile',this.x + this.w/2 - Sprites.map.alienmissile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
    

}//end of alien shooting function
//alien big starts

//alien big ends

var Player = function Player(opts) { 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas) {//draws the player onto the canvas
   Sprites.draw(canvas,'player',this.x,this.y);
}//end of draw function


Player.prototype.die = function() {//start of player die function
  GameAudio.play('die');
  Game.callbacks['die']();
}//end of player die function

Player.prototype.step = function(dt) {//start of control function(parses in information from engine.js)
  if(Game.keys['left']) { this.x -= 100 * dt; }
  if(Game.keys['right']) { this.x += 100 * dt; }
  if(Game.keys['up']) {this.y -=100 * dt;}
  if(Game.keys['down']) {this.y += 100 * dt;}
    
  if(this.x < 0) this.x = 0;//if statement to stop player leaving canvas on the x axis
  if(this.x > Game.width-this.w) this.x = Game.width-this.w;
  if(this.y < 0) this.y = 0;
  if(this.y > Game.height-this.h) this.y = Game.height-this.h;
    
  this.reloading--;

  if(Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 6) {
    GameAudio.play('fire');
    this.board.addSprite('missile',
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
    this.reloading = 5;
  }
  return true;
}//end of player control


var Missile = function Missile(opts) {//start of misssle function
   this.dy = opts.dy;
   this.player = opts.player;
}//end of missle function

Missile.prototype.draw = function(canvas) {//start of missle draw
   Sprites.draw(canvas,'missile',this.x,this.y);
}//end of missle draw

Missile.prototype.step = function(dt) {//missle movement
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}//end of missle movement

Missile.prototype.die = function() {//missle die function
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}//end of missie die function

//alien missle??
var alienMissile = function alienMissile(opts) {//start of misssle function
   this.dy = opts.dy;
   this.player = opts.player;
}//end of missle function

alienMissile.prototype.draw = function(canvas) {//start of missle draw
   Sprites.draw(canvas,'alienmissile',this.x,this.y);
}//end of missle draw

alienMissile.prototype.step = function(dt) {//missle movement
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}//end of missle movement

alienMissile.prototype.die = function() {//missle die function
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}//end of missie die function

