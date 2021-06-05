// Array of vectors
let vectors = new Array(100);
let canvas;
let bodyHeight = document.body.scrollHeight;
let attractor;

function setup() {
  let w = windowWidth;
  canvas = createCanvas(w, bodyHeight);
  canvas.position(0, 0);
  canvas.style("z-index", -1);

  for (let i = 0; i < vectors.length; i++) {
    let v = new Mover(random(width), random(height), random(1, 2));
    vectors[i] = v;
  }
}

function draw() {
  clear();
  background(255, 10);
  let angle;
  let xOff = 0;
  let yOff = 0;
  for (let i = 0; i < vectors.length; i++) {
    let mover = vectors[i];
    attractor = new Attractor(mouseX, mouseY);
    // randomVal = random(0, 600)
    // if (mover.pos.x % 17 === 0) {
    //   angle =
    //     sin(noise((i / mover.pos.x) * xOff, (mover.pos.y / i) * yOff)) /
    //     random(50, 100);
    //   mover.direct(angle);
    // }
    mover.update();
    mover.edges();
    mover.show(vectors);

    attractor.attract(mover);

    xOff += 0.01;
    yOff += 0.1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, bodyHeight);
}

function mouseClicked() {}

class Mover {
  constructor(x, y, m = 4) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(5));
    this.acc = createVector(0, 0);
    this.angle = 0;
    this.maxspeed = 0.3;
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
    // this.acc.setMag(0.001);
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show(connectors) {
    this.isConnected(connectors);
    // Outer ellipse
    noStroke();
    fill(0, 30);
    push();
    ellipse(this.pos.x, this.pos.y, this.r + 2);
    pop();

    // Inner ellipse
    noStroke();
    fill(0, 80);
    push();
    ellipse(this.pos.x, this.pos.y, this.r);
    pop();
  }

  isConnected(neighbours) {
    //Draw lines between particles
    for (let j = 0; j < neighbours.length; j++) {
      let neighbour = neighbours[j];
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
    if (d < 250) {
      let alpha = log(150 / d) * alphaMult;
      stroke(0, alpha);
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
  constructor(x, y, m = 4) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
  }

  attract(mover) {
    // To apply force
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 2500);

    // "Universal" gravitational force
    let G = 0.5;

    // Calculated strength F = (m1 * m2) * G / r²
    let strength = (G * (this.mass * mover.mass)) / distanceSq;

    force.setMag(strength);

    mover.applyForce(force);
  }
}
