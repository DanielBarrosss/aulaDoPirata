const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world;
var bgimg
var tower, towerimg
var cannon
var angle = 20
var balls = []
var boats = []
var boatAnimation = [];
var boatSpriteData;
var boatSpriteSheet;
var brokenBoatAnimation = [];
var brokenBoatSpriteData;
var brokenBoatSpriteSheet;
var waterAnimation = [];
var waterSpriteData;
var waterSpriteSheet;
var waterSound, pirateSound, bgSound, cannonSound;
var isGameOver=false
var isLaughing=false
var score=0

function preload() {
  bgimg = loadImage("./assets/background.gif");
  towerimg = loadImage("./assets/tower.png")
  boatSpriteData = loadJSON("./assets/boat/boat.json")
  boatSpriteSheet = loadImage("./assets/boat/boat.png")
  brokenBoatSpriteData = loadJSON("./assets/boat/broken_boat.json")
  brokenBoatSpriteSheet = loadImage("./assets/boat/broken_boat.png")
  waterSpriteData = loadJSON("./assets/water_splash/water_splash.json")
  waterSpriteSheet = loadImage("./assets/water_splash/water_splash.png")
  waterSound = loadSound("./assets/cannon_water.mp3")
  pirateSound = loadSound("./assets/pirate_laugh.mp3")
  bgSound = loadSound("./assets/background_music.mp3")
  cannonSound = loadSound("./assets/cannon_explosion.mp3")


}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options)
  World.add(world, tower)

  angleMode(DEGREES)
  angle = 15
  cannon = new Cannon(180, 110, 130, 100, angle)

  var boatFrames = boatSpriteData.frames
  for (let i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
    boatAnimation.push(img)
  }

  var brokenBoatFrames = brokenBoatSpriteData.frames
  for (let i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position
    var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
    brokenBoatAnimation.push(img)
  }

  var waterFrames = waterSpriteData.frames
  for (let i = 0; i < waterFrames.length; i++) {
    var pos = waterFrames[i].position
    var img = waterSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
    waterAnimation.push(img)
  }

}


function draw() {

  background("darkblue")
  image(bgimg, 0, 0, 1200, 600)
  rectMode(CENTER)

  if (!bgSound.isPlaying()) {
    bgSound.play()
    bgSound.setVolume(0.1)
    
  }

  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);

  push()
  imageMode(CENTER)
  image(towerimg, tower.position.x, tower.position.y, 160, 310)
  pop()

  cannon.display()
  showboats()
  for (let i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i)
    collisionwithboat(i)
  }

fill("black")
textSize(40)
text(`pontuação: ${score}`,width-300,50)
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    cannonSound.play()
    cannonSound.setVolume(0.05)
    balls[balls.length - 1].shoot()
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y)
    balls.push(cannonBall)
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display()
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      if (!waterSound.isPlaying()) {
        waterSound.play()
        waterSound.setVolume(0.3)
        
      }
      ball.remove(index)
    }
  }
}

function showboats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] === undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -70, -20]
      var position = [random(positions)]
      var boat = new Boat(width - 79, height - 60, 170, 170, position, boatAnimation)
      boats.push(boat)
    }
    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, { x: -0.9, y: 0 })
        boats[i].display()
        boats[i].animate()

        var collision=Matter.SAT.collides(this.tower,boats[i].body)
        if (collision.collided&& !boats[i].isBroken) {
          if (!isLaughing&& !pirateSound.isPlaying()) {
            pirateSound.play()
            isLaughing=true
            
          }
          isGameOver=true
          gameOver()
        }
      }


    }
  } else {
    var boat = new Boat(width - 79, height - 60, 170, 170, -80, boatAnimation)
    boats.push(boat)
  }
}
function collisionwithboat(index) {
  for (let i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body)
      if (collision.collided) {
        score+=5
        boats[i].remove(i)
        Matter.World.remove(world, balls[index].body)
        delete balls[index]

      }
    }
  }
}

function gameOver(){
  swal({
    title:"fim de jogo",
    text:"obrigado por jogar",
    imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize:"150x150",
    confirmButtonText:"jogar novamente?"
  },
  function(isConfirm){
    if (isConfirm) {
      location.reload()
      
    }
  })

}