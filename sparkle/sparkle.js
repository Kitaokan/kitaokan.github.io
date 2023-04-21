const particles = [];
let orangeSphere;
let orangeSphereVisible = false;
let orangeSphereTimer;
let rope;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  orangeSphere = new OrangeSphere();
  rope = new Rope();
  sparkSounds = [
    loadSound("assets/takibi01.mp3"),
    loadSound("assets/takibi02.mp3"),
    loadSound("assets/takibi03.mp3"),
    loadSound("assets/takibi04.mp3"),
  ];
}

function draw() {
  background(0, 50);
  const selectedSound = random(sparkSounds);
  selectedSound.setVolume(random(0, 0.5));
  
  rope.show();

  if (orangeSphereVisible) {
    orangeSphere.update();
    orangeSphere.show();
    // orangeSphere.pos = rope.endPos;

    if (random(0, 1) < 0.05) {
      selectedSound.play();
    }
    if (!orangeSphere.falling) {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(orangeSphere.pos.x, orangeSphere.pos.y));
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    particles[i].applyForce(createVector(0, 0.05));

    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  orangeSphereVisible = true;
  orangeSphere.pos = rope.endPos.copy();
  orangeSphere.alpha = 255;
  orangeSphere.falling = false;
  clearTimeout(orangeSphereTimer);
  orangeSphereTimer = setTimeout(() => {
    orangeSphere.falling = true;
  }, random(15000, 60000));
  
  // rope.endPos = createVector(mouseX, mouseY);
}

class OrangeSphere {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.alpha = 255;
    this.radius = 22;
    this.falling = false;
    this.twinkle = 0;
    this.twinkleSpeed = 2;
    this.twinkleDirection = 1;
  }

  update() {
    if (this.falling) {
      this.pos.y += 8;
      this.alpha -= 5.5;
      if (this.alpha < 0) {
        this.alpha = 0;
        orangeSphereVisible = false;
      }
    }
    
    // 煌めきの更新
    this.twinkle += random(0, this.twinkleSpeed) * this.twinkleDirection;
    if (this.twinkle >= 50 || this.twinkle <= 0) {
      this.twinkleDirection *= -1;
    }
  }

  show() {
    // fill(255, 100, 0, this.alpha);
    // noStroke();
    // ellipse(this.pos.x, this.pos.y, this.radius);
    
    // 煌めきを表示に反映
    fill(255, 100 + this.twinkle, 0, this.alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius + this.twinkle/26);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.acc = createVector(0, 0);
    this.alpha = 255;
    this.radius = random(4, 10);
    this.life = random(40, 100);
    this.color = color(random(200, 255), random(100, 150), 0);
    this.branchParticles = [];
  }

  addBranchParticles() {
    for (let i = 0; i < 3; i++) { // Increase the number of branch particles created
      const branchParticle = new BranchParticle(this.pos.x, this.pos.y, this.color);
      particles.push(branchParticle); // Add the branch particle directly to the particles array
    }
  }

  finished() {
    return this.alpha < 0;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.alpha -= 255 / this.life;

    this.life--;

    if (random() < 0.005) {
      this.addBranchParticles();
    }
  }

  show() {
    if (this instanceof BranchParticle || random(0,1) < 0.05) {
      noStroke();
      fill(this.color, this.alpha);
      ellipse(this.pos.x, this.pos.y, this.radius);
    }
    for (let branchParticle of this.branchParticles) {
      branchParticle.update();
      branchParticle.show();
    }
  }
}

class BranchParticle extends Particle {
  constructor(x, y, parentColor) {
    super(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 6)); // Increase the range of velocities for longer spread in the x-direction
    this.color = color(255, 0, 0); // Set a different color for BranchParticles, e.g., red
    this.radius = random(2, 6);
    this.life = random(20, 50);
  }
}

class Rope {
  constructor() {
    this.startPos = createVector(width / 2, 0);
    this.endPos = createVector(width / 2 + random(-width/10,width/10), height / 1.78);
    this.controlPos = createVector(width / 2, height / 4);
    this.alpha = 90;
  }

  show() {
    strokeWeight(3);
    noFill();

    const segments = 100;
    const segmentLength = (this.endPos.y - this.startPos.y) / segments;

    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;

      const x1 = bezierPoint(this.startPos.x, this.controlPos.x, this.endPos.x, this.endPos.x, t1);
      const y1 = bezierPoint(this.startPos.y, this.controlPos.y, this.endPos.y, this.endPos.y, t1);
      const x2 = bezierPoint(this.startPos.x, this.controlPos.x, this.endPos.x, this.endPos.x, t2);
      const y2 = bezierPoint(this.startPos.y, this.controlPos.y, this.endPos.y, this.endPos.y, t2);

      const col1 = lerpColor(color(0, 255, 0, this.alpha), color(128, 128, 128, this.alpha), t1);
      const col2 = lerpColor(color(0, 255, 0, this.alpha), color(128, 128, 128, this.alpha), t2);
      const col = lerpColor(col1, color(255, 255, 0, this.alpha), abs(sin(t1 * PI)));

      stroke(col);
      line(x1, y1, x2, y2);
    }
  }
}
