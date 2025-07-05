
let planets = [];
let lastCollisionTime = 0;
let stars = [];
let player;
let movement = { x: 0, y: 0 };
let angle = 0;

let spaceshipImg;
let planetImgs = [];

function preload() {
  spaceshipImg = loadImage("assets/spaceship.png");

  planetImgs.push(loadImage("assets/planet1.png"));
  planetImgs.push(loadImage("assets/planet2.png"));
  planetImgs.push(loadImage("assets/planet3.png"));
  planetImgs.push(loadImage("assets/planet4.png"));
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  planets.push({ x: 200, y: 150, label: "Despre mine", link: "#about", depth: 1, img: planetImgs[0] });
  planets.push({ x: 600, y: 300, label: "Proiecte", link: "#projects", depth: 1.5, img: planetImgs[1] });
  planets.push({ x: 1000, y: 200, label: "CV", link: "#cv", depth: 2, img: planetImgs[2] });
  planets.push({ x: 400, y: 500, label: "Contact", link: "#contact", depth: 1.2, img: planetImgs[3] });

  for (let i = 0; i < 200; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), speed: random(0.1, 0.5) });
  }

  player = {
    x: width / 2,
    y: height / 2,
    speed: 5,
    size: 40
  };
}

function draw() {
  background(0);
  drawStars();
  drawPlanets();
  drawSpaceship();
  handleInput();
  handleEdgeWrap();
  checkCollision();
}

function drawStars() {
  noStroke();
  fill(255);
  stars.forEach(star => {
    ellipse(star.x, star.y, star.size);
    star.x -= star.speed;
    if (star.x < 0) star.x = width;
  });
}

function drawPlanets() {
  planets.forEach(planet => {
    let scale = 2.5 / planet.depth;
    let size = 60 * scale;
    imageMode(CENTER);
    image(planet.img, planet.x, planet.y, size, size);

    fill(255);
    textAlign(CENTER);
    textSize(14 * scale);
    text(planet.label, planet.x, planet.y - (40 * scale));
  });
}

function drawSpaceship() {
  if (!spaceshipImg) return; // siguranță în plus
  push();
  translate(player.x, player.y);
  rotate(angle + HALF_PI);
  imageMode(CENTER);
  image(spaceshipImg, 0, 0, player.size, player.size);
  pop();
}

function handleInput() {
  movement.x = 0;
  movement.y = 0;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) movement.x = -1;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) movement.x = 1;
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) movement.y = -1;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) movement.y = 1;
  if (movement.x !== 0 || movement.y !== 0) {
    angle = atan2(movement.y, movement.x);
    player.x += movement.x * player.speed;
    player.y += movement.y * player.speed;
  }
}

function handleEdgeWrap() {
  if (player.x < 0) player.x = width;
  if (player.x > width) player.x = 0;
  if (player.y < 0) player.y = height;
  if (player.y > height) player.y = 0;
}

function checkCollision() {
  const now = millis();
  if (now - lastCollisionTime < 1000) return;
  planets.forEach(p => {
    let d = dist(player.x, player.y, p.x, p.y);
    let collisionDist = 30 + (60 * (2.5 / p.depth)) / 2;
    if (d < collisionDist) {
      lastCollisionTime = now;
      let angle = atan2(player.y - p.y, player.x - p.x);
      let pushBack = 30;
      player.x += cos(angle) * pushBack;
      player.y += sin(angle) * pushBack;
      alert("Navighezi către: " + p.label);
      window.location.href = p.link;
    }
  });
}
