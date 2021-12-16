const ct = 20;
const r = [];
const x = [];
const y = [];
const dx = [];
const dy = [];
let seed = 0;
var noiseValX = [];
var noiseValY = [];
var noiseValL = [];

let playMode = 'sustain';
let sample;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS);
  background(0);
  frameRate(50);
  for (let i = 0; i < ct; i++) {
    r[i] = random(15, 50);
    x[i] = random(r[i], width - r[i]);
    y[i] = random(r[i], height - r[i]);
    dx[i] = random(-1, 1);
    dy[i] = random(-1, 1);
    noiseValX[i] = Math.random()*100;
    noiseValY[i] = Math.random()*100;
    noiseValL[i] = Math.random()*2;
  }

  sample = loadSound('./kin.mp3');
}
function draw() {
  background(0);
  for (let i = 0; i < ct; i++) {
    ellipse(x[i], y[i], r[i] * noise(noiseValL[i]) + 15);
    noStroke();
    x[i] = x[i] + noise(noiseValX[i])*8-3.7 + (mouseX - x[i])/750;
    y[i] = y[i] + noise(noiseValY[i])*8-3.7 + (mouseY - y[i])/750;
    
    // if (y[i] > height - r[i] || y[i] < r[i]) dy[i] = -dy[i];
    // if (x[i] > width - r[i] || x[i] < r[i]) dx[i] = -dx[i];
    
    if (x[i] > width) { x[i] = width; }
    if (x[i] < 0) { x[i] = 0; }
    if (y[i] > height) { y[i] = height; }
    if (y[i] < 0) { y[i] = 0; }
    
    // fill(250, 255, 0, noise(noiseValX[i])*150 - 40);
    colorMode(HSB);
    let B = noise(noiseValL[i])*150 - 40;
    let al = B / 100;
    fill(65, 100, 100, al);
    // fill(65, 100, B, al);
    // fill(65, 100,  B, 1);

    if (al = 1){
        sample.play();
    }
    
    noiseValX[i] += 0.02;
    noiseValY[i] += 0.02;
    noiseValL[i] += 0.008;
  }
}