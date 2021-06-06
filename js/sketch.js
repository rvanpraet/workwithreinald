// Array of vectors
let vectors = new Array(50);
let canvas;
let bodyHeight = document.body.scrollHeight;
let attractor;
let backgroundColor = "#13242b";
let moverColor = 255;

function setup() {
  let w = windowWidth;
  canvas = createCanvas(w, bodyHeight);
  canvas.position(0, 0);
  canvas.style("z-index", -1);

  // Init attracktor on mouse position
  attractor = new Attractor(mouseX, mouseY);

  // Init movers
  for (let i = 0; i < vectors.length; i++) {
    let v = new Mover(random(width), random(height), random(1, 2));
    vectors[i] = v;
  }
}

function draw() {
  //   clear();
  background(backgroundColor);
  let angle;
  let xOff = 0;
  let yOff = 0;
  for (let i = 0; i < vectors.length; i++) {
    let mover = vectors[i];

    // Update attractor position
    attractor.update(mouseX, mouseY);

    // Update movers
    mover.update();
    mover.edges();
    mover.show(vectors);

    // Attract movers in the area
    attractor.attract(mover);

    xOff += 0.01;
    yOff += 0.1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, bodyHeight);
}

// Because holding mousepress attracts moving objects, on mouse release we want to push them away with a big force, but only the ones who are in range
function mouseReleased() {
  // Iterate movers
  for (let i = 0; i < vectors.length; i++) {
    let mover = vectors[i];
    // Update current attractor position
    attractor.update(mouseX, mouseY);
    // Condition distance
    if (
      dist(attractor.pos.x, attractor.pos.y, mover.pos.x, mover.pos.y) < 225
    ) {
      // push away
      calculateAtrraction(attractor, mover, pow(10, 25), -1);
    }
  }
}

class Mover {
  constructor(x, y, m = 4) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(5));
    this.acc = createVector(0, 0);
    this.angle = 0;
    this.maxspeed = 1;
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
  }

  direct(angle) {
    this.angle += angle;
    this.applyForce(this.angle);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.vel.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show(connectors) {
    // Outer ellipse
    noStroke();
    fill(255, 80);
    push();
    ellipse(this.pos.x, this.pos.y, this.r + 2);
    pop();

    // Inner ellipse
    noStroke();
    fill(255, 255);
    push();
    ellipse(this.pos.x, this.pos.y, this.r);
    pop();

    this.interact(connectors);
  }

  interact(neighbours) {
    //Draw lines between particles
    for (let j = 0; j < neighbours.length; j++) {
      let neighbour = neighbours[j];
      calculateAtrraction(this, neighbour, 5, sin(TWO_PI));
      this.connect(
        this.pos.x,
        this.pos.y,
        neighbour.pos.x,
        neighbour.pos.y,
        false
      );
    }

    //Draw a line between particles and mouse
    this.connect(this.pos.x, this.pos.y, mouseX, mouseY, true);
  }

  connect(x1, y1, x2, y2, mouse) {
    let alphaMult = 60;
    if (!mouse) {
      alphaMult = alphaMult / 3;
    }
    let d = dist(x1, y1, x2, y2);
    if (d < 225) {
      let alpha = log(225 / d) * alphaMult;
      stroke(255, alpha);
      strokeWeight(1);
      line(x1, y1, x2, y2);
    }
  }

  edges() {
    if (this.pos.x - this.r > width) {
      this.pos.x = 0;
    }
    if (this.pos.x + this.r < 0) {
      this.pos.x = width;
    }
    if (this.pos.y - this.r > height) {
      this.pos.y = 0;
    }
    if (this.pos.y + this.r < 0) {
      this.pos.y = height;
    }
  }
}

class Attractor {
  constructor(x, y, m = 8) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
  }

  update(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  attract(mover) {
    let G = 2;
    let distance = dist(this.pos.x, this.pos.y, mover.pos.x, mover.pos.y);
    if (mouseIsPressed & (distance < 450)) {
      G = 200;
    }
    calculateAtrraction(this, mover, G, 1);
  }
}

function calculateAtrraction(attractor, mover, G, mod = 1) {
  // To apply force
  let force = p5.Vector.sub(attractor.pos, mover.pos);
  let distanceSq = constrain(force.magSq(), pow(50, 2), pow(225, 2));

  // "Universal" gravitational force
  //   let G = 0.5;

  // Calculated strength F = (m1 * m2) * G / r²
  let strength = ((G * (attractor.mass * mover.mass)) / distanceSq) * mod;
  // * sin(TWO_PI);

  force.setMag(strength);

  mover.applyForce(force);
}
