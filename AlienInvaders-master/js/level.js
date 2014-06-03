
  var levelData = { //array to describe alien layout on canvas 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,3,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,0,0,2,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,0],
          [0,0,0,0,0,0,1,1,1,1,0],
          [0,0,0,0,0,0,0,1,1,0,0],
          [0,0,0,0,0,0,1,0,1,1,0]],
    3:   [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,0],
          [0,0,0,0,0,0,1,1,1,1,0],
          [0,0,0,0,0,0,0,1,1,0,0],
          [0,0,0,0,0,0,1,0,1,1,0]]};

  var spriteData = {//start of spriteData, which is itself an object??? but seemingly made up from strings?
    'alien1': { sx: 342,  sy: 67,  w: 25, h: 30, cls: Alien, frames: 6},//draws Alien 1 on the level, uses the coordinates from the Sx and Sy of the height and width under W,H gives it the class of alien and specifices the number of frames for each image, same for each of the sprite_data entires
    'alien2': { sx: 336,  sy: 16, w: 40, h: 40, cls: Alien, frames: 6 },
    'alien3': { sx: 330,  sy: 102,  w:50, h: 60, cls: Alien, frames: 6 }, 
    'player': { sx: 0,  sy: 0, w: 73, h: 71, cls: Player },
    'missile': { sx: 335,  sy: 107, w: 3,  h: 14, cls: Missile },
  } 

  function startGame() {//function to start game
    var screen = new GameScreen("Alien Invaders","press space to start",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {//function to lose game
    var screen = new GameScreen("Game Over","(press space to restart)",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {//function to win game
    var screen = new GameScreen("You Win!","(press space to restart)",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {//function to load audio
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/explosion.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });

 