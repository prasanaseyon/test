var cactus, trex, groundimg, trex_running, trexcollide, unseenground, groundimg, cloudimg, cloud, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, obstaclechoose, cacti, oio, gameState, clouds, overimg, gameover, trexover, edges, restartimg, restart, play, playimg, score;
var jumping = true;
p5.disableFriendlyErrors = true;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimg = loadImage('ground2.jpg');
  cloudimg = loadImage('cloud.png');
  cactus1 = loadImage('obstacle1.png');
  cactus2 = loadImage('obstacle2.png');
  cactus3 = loadImage('obstacle3.png');
  cactus4 = loadImage('obstacle4.png');
  cactus5 = loadImage('obstacle5.png');
  cactus6 = loadImage('obstacle6.png');
  overimg = loadImage('gameOver.png');
  trexover = loadAnimation('trex_collided.png');
  restartimg = loadImage('restart.png');
  playimg = loadImage('play_button_better.png');
}

function setup() {
  createCanvas(600, 300)
  score = 0;
  play = createSprite(300, 150, 100, 100);
  play.addImage(playimg);
  play.scale = 0.75;
  play.tint = 'red';
  
  
  gameState = "START";  
  cacti = createGroup();
  clouds = createGroup();
  
  gameover = createSprite(300, 100, 200, 100);
  gameover.visible = false;
  gameover.addImage(overimg);
  gameover.scale = 0.75;
  
  restart = createSprite(300, 150, 200, 100);
  restart.visible = false;
  restart.addImage(restartimg);
  restart.scale = 0.75;
  
  unseenground = createSprite(300, 287.5, 600, 0.1);

  ground = createSprite(0, 300, 1000, 25);
  ground.addImage(groundimg);
  ground.scale = 0.5;
  ground.debug = true;
  // ground.x = (ground.y / 2);
  ground.visible = false;
  
  trex = createSprite(50, 260, 50, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexover);
  trex.scale = 0.5;
  trex.x = 50;
  trex.tint = "cyan";
  trex.visible = false;
  // trex.debug = true;
  // trex.debug = true;
}
function draw() {
  background("white");
  edges = createEdgeSprites();
  unseenground.visible = false;
  drawSprites();
  fill("gold");
  textSize(20);
  text(("Score: " + score), 495, 30);
  // ground.velocityX = -20;
  if (gameState == "START") {
    if (mousePressedOver(play) == true) {
      gameState = "GO";
    }
  } else if (gameState == "GO") {
    
    trex.visible = true;
    ground.visible = true;
    play.visible = false;
    ground.velocityX = -20;
    if (ground.x == -300) {
      ground.x = 900;
    }
    trex.changeAnimation("running")
    spawnClouds();
    spawnCacti();

    if (keyDown("up") == true){
      if (jumping == true) {  
        trex.velocityY -= 20;
        jumping = false;
      }
    }

    if (trex.isTouching(unseenground) == true) {
      jumping = true;
    }

    trex.velocityY += 1;

    trex.collide(unseenground);
    if (trex.isTouching(cacti) == true) {
      gameState = "END";
    }
    if (cacti.isTouching(edges[0]) == true) {
      cacti.destroyEach();
    }
    if (clouds.isTouching(edges[0])) {
      clouds.destroyEach();
    }
    changeScore();
    trex.depth += 1;
    cacti.setDepthEach(trex.depth - 1);
    ground.depth = trex.depth - 1;
    clouds.setDepthEach(trex.depth + 1);
    
  } else if (gameState == "END") {
    ground.velocityX = 0;
    cacti.setVelocityEach(0, 0);
    clouds.setVelocityEach(0, 0);
    trex.setVelocity(0, 0);
    gameover.visible = true;
    trex.changeAnimation("collided");
    restart.visible = true;
    restart.debug = true;
    if (mousePressedOver(restart) == true) {
      restart.visible = false;
      gameover.visible = false;
      cacti.destroyEach();
      clouds.destroyEach();
      gameState = "GO";
      score = 0;
    }
  }
  
}
function spawnClouds() {
  if (frameCount%60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudimg);
    cloud.y = Math.round(random(5, 80));
    cloud.scale = 0.7;
    cloud.velocityX = -10;
    cloud.tint = 'black';
    cloud.depth = trex.depth;
    trex.depth += 1;
    clouds.add(cloud);
  }
}
function spawnCacti() {
  if (frameCount%30 === 0) {
    oio = Math.round(random(10, 30));
    
    cactus = createSprite((600 + oio), 260, 10, 40);
    cactus.velocityX = -20;
    
    obstaclechoose = Math.round(random(1, 6));
    //console.log(obstaclechoose);
    switch(obstaclechoose) {
      case 1: cactus.addImage(cactus1);
              cactus.width = 5;
              cactus.height = 10;
        break;
      case 2: cactus.addImage(cactus2);
              cactus.width = 10;
              cactus.height = 10;
        break;
      case 3: cactus.addImage(cactus3);
              cactus.width = 15;
              cactus.height = 10;
        break;
      case 4: cactus.addImage(cactus4);
              cactus.width = 7.5;
              cactus.height = 15;
        break;
      case 5: cactus.addImage(cactus5);
              cactus.width = 15;
              cactus.height = 15;
        break;
      case 6: cactus.addImage(cactus6);
              cactus.width = 20;
              cactus.height = 15;
        break;
      default: break;
         }
    
    cactus.scale = 0.5;
    
    cactus.tint = 'lime';
    cactus.y = 270;
    cacti.add(cactus);
  }
}
function changeScore() {
  if (frameCount%14 == 0) {
    score += 1;
  }
}