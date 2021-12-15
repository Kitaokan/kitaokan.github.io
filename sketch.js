const ct = 300;
const r = [];
const x = [];
const y = [];
const dx = [];
const dy = [];

function setup() {
  createCanvas(765, 765);
  rectMode(RADIUS);
  background(0);
  frameRate(50);
  for (let i = 0; i < ct; i++) {
    r[i] = random(1, 200);
    x[i] = random(r[i], width - r[i]);
    y[i] = random(r[i], height - r[i]);
    dx[i] = random(-5, 6);
    dy[i] = random(-5, 6);
  }
}
function draw() {
  background(0);
  for (let i = 0; i < ct; i++) {
    rect(x[i], y[i], r[i], r[i]);
    noStroke();
    x[i] = x[i] + dx[i];
    y[i] = y[i] + dy[i];
    if (y[i] > height - r[i] || y[i] < r[i]) dy[i] = -dy[i];
    if (x[i] > width - r[i] || x[i] < r[i]) dx[i] = -dx[i];
    if (i == ct - 1) fill(x[0] / 3, y[0] / 3, 205, 100);
    if (i != ct - 1) fill(x[i + 1] / 3, y[i + 1] / 3, 205, 100);
  }
}