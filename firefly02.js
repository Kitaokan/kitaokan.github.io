const ct = 15;
const r = [];
const x = [];
const y = [];
const dx = [];
const dy = [];
let seed = 0;
var noiseValX = [];
var noiseValY = [];
var noiseValL = [];
var soundState = [];

let noiseSpeed = [];
let sample;
let wave = [];

function preload(){
  soundFormats('mp3', 'ogg');
  drop00 = loadSound('assets/drop_00.mp3');
  drop01 = loadSound('assets/drop_01.mp3');
  drop02 = loadSound('assets/drop_02.mp3');
  drop03 = loadSound('assets/drop_03.mp3');
  drop04 = loadSound('assets/drop_04.mp3');
  drop05 = loadSound('assets/drop_05.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS);
  colorMode(HSB);
  background(240,100,10);
  frameRate(50);
  drop00.playMode('sustain');
  drop01.playMode('sustain');
  drop02.playMode('sustain');
  drop03.playMode('sustain');
  drop04.playMode('sustain');
  drop05.playMode('sustain');
  for (let i = 0; i < ct; i++) {
    r[i] = random(15, 40);
    x[i] = random(r[i], width - r[i]);
    y[i] = random(r[i], height - r[i]);
    dx[i] = random(-1, 1);
    dy[i] = random(-1, 1);
    noiseValX[i] = Math.random()*100;
    noiseValY[i] = Math.random()*100;
    noiseValL[i] = Math.random()*2;
    // noiseSpeed[i] = 0.02;
    soundState[i] = 'False';
    wave[i] = 1;
    
    delay = new p5.Delay();
    
    // drone.loop();
  }
}
function draw() {
  background(240,100,10);
  for (let i = 0; i < ct; i++) {
    ellipse(x[i], y[i], r[i] * noise(noiseValL[i]) + 15);
    noStroke();
    x[i] = x[i] + noise(noiseValX[i])*8-3.7 + (mouseX - x[i])/500;
    y[i] = y[i] + noise(noiseValY[i])*8-3.7 + (mouseY - y[i])/500;
    
    if (x[i] > width) { x[i] = width; }
    if (x[i] < 0) { x[i] = 0; }
    if (y[i] > height) { y[i] = height; }
    if (y[i] < 0) { y[i] = 0; }
    
    let B = noise(noiseValL[i])*160 - 40;
    let al = B / 100;
    fill(65, 100, 100, al);
    
    if (soundState[i] == 'False'){
      if (al < 0.2){
        rand = int(random(10))
        switch (rand) {
          case 0:
            drop00.amp(random(0.2));
            drop00.play();
            delay.process(drop00, 0.1, .5, 2000);
            wave[i] = 5;
            break;
          case 1:
            drop01.amp(random(0.2));
            drop01.play();
            delay.process(drop01, 0.1, .5, 2000);
            wave[i] = 5;
            break;
          case 2:
            drop02.amp(random(0.4));
            drop02.play();
            delay.process(drop02, 0.1, .5, 2000);
            wave[i] = 5;
            break;
          case 3:
            drop03.amp(random(0.5));
            drop03.play();   
            delay.process(drop03, 0.1, .5, 2000);
            wave[i] = 5;
            break;
          case 4:
            drop04.amp(random(0.5));
            drop04.play();
            delay.process(drop04, 0.1, .5, 2000);
            wave[i] = 5;
            break;
          case 5:
            drop05.amp(random(0.5));
            drop05.play();
            delay.process(drop05, 0.1, .7, 2000);
            wave[i] = 5;
            break;
          default:
        }
        soundState[i] = 'True';
      }
    }
    if (al > 0.2){
      soundState[i] = 'False';
      wave[i] = 0.008;
      // noiseSpeed[i] = 0.02;
    }
    noiseValX[i] += 0.02;
    noiseValY[i] += 0.02;
    noiseValL[i] += wave[i]; // 0.008
  }
}