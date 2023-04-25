const particles = [];
const maxParticles = 60; // パーティクルの最大数を設定
let orangeSphere;
let orangeSphereVisible = false;
let orangeSphereTimer;
let rope;

function preload() {
  sparkSounds = [
    loadSound("assets/takibi01.mp3"),
    loadSound("assets/takibi02.mp3"),
    loadSound("assets/takibi03.mp3"),
    loadSound("assets/takibi04.mp3"),
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  orangeSphere = new OrangeSphere();
  rope = new Rope();
}

function draw() {
  background(0, 50);

  rope.show();

  if (orangeSphereVisible) {
    updateOrangeSphere();
    orangeSphere.show();
    drawParticles();
  }

  if (!orangeSphere.falling) {
    for (let i = 0; i < 2; i++) {
      if (particles.length < maxParticles) {
        // パーティクル数が最大数を超えないようにする
        particles.push(new Particle(orangeSphere.pos.x, orangeSphere.pos.y));
        // print(1);
      }
    }
  }
  // パーティクルの数がmaxParticlesを超えた場合、最も古いパーティクルを削除
  if (particles.length > maxParticles) {
    particles.shift();
    // print(0);
  }
}

function mousePressed() {
  if (!orangeSphereVisible) {
    createOrangeSphere();
  }
}

function touchStarted() {
  if (!orangeSphereVisible) {
    createOrangeSphere();
  }
}

function createOrangeSphere() {
  orangeSphereVisible = true;
  orangeSphere.pos = rope.endPos.copy();
  orangeSphere.alpha = 255;
  orangeSphere.falling = false;
  orangeSphere.creationTime = millis();
  orangeSphereTimer = random(15000, 60000);
}

function updateOrangeSphere() {
  orangeSphere.update();

  if (random(0, 1) < 0.05) {
    const selectedSound = random(sparkSounds);
    selectedSound.setVolume(random(0, 0.5));
    selectedSound.play();
  }

  // if (!orangeSphere.falling) {
  //   for (let i = 0; i < 2; i++) {
  //     particles.push(new Particle(orangeSphere.pos.x, orangeSphere.pos.y));
  //   }
  // }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    particles[i].applyForce(createVector(0, 0.05));

    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}


class OrangeSphere {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.alpha = 255;
    this.radius = 22;
    this.falling = false;
    this.twinkle = 0;
    this.twinkleSpeed = 2;
    this.twinkleDirection = random(-2,5);
    this.swayTime = random(3500, 5500);
  }

  update() {
    //落下時間の管理
    const timeElapsed = millis() - this.creationTime;
    const timeToFall = orangeSphereTimer - timeElapsed;
    if (timeToFall < 0) {
      this.falling = true;
    }
    //落ちる前に揺れる実装
    // print(timeToFall);

    if (timeToFall < this.swayTime && timeToFall > 0) {
      this.pos.x += sin(frameCount * 0.75) * 1.2;
      this.pos.y += cos(frameCount * 0.75) * 1.2;
      // print(this.pos.x);
    }

    if (this.falling) {
      this.pos.y += 8;
      this.alpha -= 6.5;
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
    ellipse(this.pos.x, this.pos.y, this.radius + this.twinkle / 26);
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
    this.color = color(random(200, 225), random(140, 150), 60);
    this.branchParticles = [];
  }

  addBranchParticles() {
    for (let i = 0; i < 3; i++) {
      // Increase the number of branch particles created
      const branchParticle = new BranchParticle(
        this.pos.x,
        this.pos.y,
        this.color
      );
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

    if (random() < 0.004) {
      this.addBranchParticles();
    }
  }

  show() {
    if (this instanceof BranchParticle || random(0, 1) < 0.05) {
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
    this.color = color(random(200,255), 0, 50); // Set a different color for BranchParticles, e.g., red
    this.radius = random(2, 6);
    this.life = random(20, 50);
  }
}

class Rope {
  constructor() {
    this.startPos = createVector(width / 2, 0);
    this.endPos = createVector(
      width / 2 + random(-width / 10, width / 10),
      height / 1.78
    );
    this.controlPos = createVector(width / 2, height / 4);
    this.alpha = 255;
  }

  show() {
    strokeWeight(3);
    noFill();

    const segments = 10;
    const segmentLength = (this.endPos.y - this.startPos.y) / segments;

    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;

      const x1 = bezierPoint(
        this.startPos.x,
        this.controlPos.x,
        this.endPos.x,
        this.endPos.x,
        t1
      );
      const y1 = bezierPoint(
        this.startPos.y,
        this.controlPos.y,
        this.endPos.y,
        this.endPos.y,
        t1
      );
      const x2 = bezierPoint(
        this.startPos.x,
        this.controlPos.x,
        this.endPos.x,
        this.endPos.x,
        t2
      );
      const y2 = bezierPoint(
        this.startPos.y,
        this.controlPos.y,
        this.endPos.y,
        this.endPos.y,
        t2
      );

      const col1 = lerpColor(
        color(110, 255, 110, this.alpha),
        color(128, 128, 128, this.alpha),
        t1
      );
      const col2 = lerpColor(
        color(110, 255, 110, this.alpha),
        color(128, 128, 128, this.alpha),
        t2
      );
      const col = lerpColor(
        col1,
        color(255, 255, 110, this.alpha),
        abs(sin(t1 * PI))
      );
      
      stroke(col);
      line(x1, y1, x2, y2);
    }
  }
}
