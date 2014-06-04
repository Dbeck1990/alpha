var Game = new function() { //Beginning of game function                                                           
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire', 38:'up',40:'down' };//declare variables for controls giving them names alongside the keyboard numbers for the keys
  this.keys = {}; //this key but left empty??

    //initialises canvas
  this.initialize = function(canvas_dom,level_data,sprite_data,callbacks) {
    this.canvas_elem = $(canvas_dom)[0];//???
    this.canvas = this.canvas_elem.getContext('2d');//
    this.width = $(this.canvas_elem).attr('width');
    this.height= $(this.canvas_elem).attr('height');
    this.playerScore =0//score stuff
      
      
//Here the control input is gathered
    $(window).keydown(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = true;
    });

    $(window).keyup(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = false;
    });

    this.level_data = level_data;
    this.callbacks = callbacks;
    Sprites.load(sprite_data,this.callbacks['start']);
  };

  this.loadBoard = function(board) { Game.board = board; };

    
    //Speed of game controlled in this function
  this.loop = function() { 
      document.getElementById('playerScore').innerHTML = Game.playerScore;//score stuff
    Game.board.step(30/1000);//game speed controls 
    Game.board.render(Game.canvas);
    setTimeout(Game.loop,30);//the higher the loop the slower the game
  };
};//end of Game function


//Where the sprites data is loaded in
var Sprites = new function() {//Beginning of Sprites function
  this.map = { }; 

  this.load = function(sprite_data,callback) { 
    this.map = sprite_data;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites2.png';//source for the sprites
  };

  this.draw = function(canvas,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;//if frame 0, draw this part of the sprite sheet
    canvas.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x,y, s.w, s.h);//then draw the image and the others next to it as frame iterates 
  };
}// end of Sprites function
//This is where the starts screen is created
var GameScreen = function GameScreen(text,text2,callback) {//beginning of GameScreen function
  this.step = function(dt) {
    if(Game.keys['fire'] && callback) callback();
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    canvas.font = "bold 40px stencil";
    var measure = canvas.measureText(text);  
    canvas.fillStyle = "black";
    canvas.fillText(text,Game.width/2 - measure.width/2,Game.height/2);
    canvas.font = "bold 20px stencil";
    var measure2 = canvas.measureText(text2);
    canvas.fillText(text2,Game.width/2 - measure2.width/2,Game.height/2 + 40);
  };
};//end of game screen function

var GameBoard = function GameBoard(level_number) {//beginning of GameBoard function
  this.removed_objs = [];
  this.missiles = 0;
  this.level = level_number;
  var board = this;

  this.add =    function(obj) { obj.board=this; this.objects.push(obj); return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj); };

  this.addSprite = function(name,x,y,opts) {
    var sprite = this.add(new Sprites.map[name].cls(opts));
    sprite.name = name;
    sprite.x = x; sprite.y = y;
    sprite.w = Sprites.map[name].w; 
    sprite.h = Sprites.map[name].h;
    return sprite;
  };
  
    var playerScore = 0;//score stuff

this.render = function(canvas)	{//scorestuff
    canvas.font = "80px biteBullet";
    var measure = canvas.measureText(text);  
	canvas.fillStyle = "#ff81b6"; //colour of font used
	canvas.fillText( "score:" + playerScore + "score:", 100, 100); //scoreboard text and coordinates
	Game.playerScore++
}

   this.iterate = function(func) {
     for(var i=0,len=this.objects.length;i<len;i++) {
    func.call(this.objects[i]);
     }
  };

  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  this.step = function(dt) { 
      
      //alienship
      
      //end alienship
      
      
      
      
    this.removed_objs = [];
    this.iterate(function() { 
        if(!this.step(dt)) this.die();
    }); 

    for(var i=0,len=this.removed_objs.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed_objs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    this.iterate(function() { this.draw(canvas); });
  };

  this.collision = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(obj) {
    return this.detect(function() {
      if(obj != this && !this.invulnrable)
       return board.collision(obj,this) ? this : false;
    });
  };
    
  this.loadLevel = function(level) {
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Game.width/2, // X
                                 Game.height - Sprites.map['player'].h - 10); // Y

    var flock = this.add(new AlienFlock());
    for(var y=0,rows=level.length;y<rows;y++) {
      for(var x=0,cols=level[y].length;x<cols;x++) {
        var alien = Sprites.map['alien' + level[y][x]];
        if(alien) { 
          this.addSprite('alien' + level[y][x], // Which Sprite
                         (alien.w+10)*x,  // X
                         alien.h*y,       // Y
                         { flock: flock }); // Options
        }
      }
    }
  };

  this.nextLevel = function() { 
    return Game.level_data[level_number + 1] ? (level_number + 1) : false 
  };
 
  this.loadLevel(Game.level_data[level_number]);
};//end og GameBoard function

var GameAudio = new function() {//beginning of GameAudio function
  this.load_queue = [];
  this.loading_sounds = 0;
  this.sounds = {};

  var channel_max = 10;		
  audio_channels = new Array();
  for (a=0;a<channel_max;a++) {	
    audio_channels[a] = new Array();
    audio_channels[a]['channel'] = new Audio(); 
    audio_channels[a]['finished'] = -1;	
  }

  this.load = function(files,callback) {
    var audioCallback = function() { GameAudio.finished(callback); }

    for(name in files) {
      var filename = files[name];
      this.loading_sounds++;
      var snd = new Audio();
      this.sounds[name] = snd;
      snd.addEventListener('canplaythrough',audioCallback,false);
      snd.src = filename;
      snd.load();
    }
  };

  this.finished = function(callback) {
    this.loading_sounds--;
    if(this.loading_sounds == 0) {
      callback();
    }
  };

  this.play = function(s) {
    for (a=0;a<audio_channels.length;a++) {
      thistime = new Date();
      if (audio_channels[a]['finished'] < thistime.getTime()) {	
        audio_channels[a]['finished'] = thistime.getTime() + this.sounds[s].duration*1000;
        audio_channels[a]['channel'].src = this.sounds[s].src;
        audio_channels[a]['channel'].load();
        audio_channels[a]['channel'].play();
        break;
      }
    }
  };
};//end of Game Audio function

