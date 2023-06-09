let permissionGranted = false;
let isAdmin = false;
let drawing = [];
let palette = [];
let currentPath = [];
let isCapturing = false;
let drawingStart;
let step = null;

// Position Variables
let x = 0;
let y = 0;
let z = 0;

// Speed - Velocity
let vx = 0;
let vy = 0;
let dz = 0;

// Acceleration
let ax = 0;
let ay = 0;
let az = 0;

// Rotation
let rx = 0;
let ry = 0;

let vMultiplier = 0.1;
let bMultiplier = 0.4;
let sMultiplier = 0.1;
let rMultiplier = 0.05;

let gravity = 0.01;
let drag = 0.9;

// will handle first time visiting to grant access
function onAskButtonClicked() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') {
      orientationGranted = true
    } else {
      orientationGranted = false
    }
    this.remove()
  }).catch(console.error);

  DeviceMotionEvent.requestPermission().then(response => {
    if (response === 'granted') {
      motionGranted = true
    } else {
      motionGranted = false
    }
    this.remove()
  }).catch(console.error);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  background('transparent');

  x = width / 2;
  y = height / 2;
  start_btn = document.getElementById("start");

  if (typeof (DeviceOrientationEvent.requestPermission) === 'function') {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        // it needs to be a user gesture (requirement) in this case, click
        let askButton = createButton("Allow acess to sensors")
        askButton.style("font-size", "24px")
        askButton.position(0, 0)
        askButton.mousePressed(onAskButtonClicked)
        throw error // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        orientationGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    orientationGranted = true
  }
  if (typeof (DeviceMotionEvent.requestPermission) === 'function') {
    DeviceMotionEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        // it needs to be a user gesture (requirement) in this case, click
        let askButton = createButton("Allow acess to sensors")
        askButton.style("font-size", "24px")
        askButton.position(0, 0)
        askButton.mousePressed(onAskButtonClicked)
        throw error // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        motionGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    motionGranted = true
  }
}

function startPath() {
  clear();
  drawingStart = millis();
  isCapturing = true;
  drawing = [];
  palette = [];
  currentPath = [];
  drawing.push(currentPath);
  palette.push(select('#picker').value());
  console.log(palette[0]);
  start_btn.disabled = true;
}

function endPath() {
  if (isCapturing) {
    start_btn.innerHTML = "Thank you for Dancing!";
  }
  isAdmin = false;
  drawingStart = null;
  isCapturing = false;
  step = null;
  start_btn.disabled = false;
  setTimeout(() => {
    start_btn.innerHTML = "Start Dancing!";
  }, 3000);
}

function visualizeData(data) {
  isAdmin = true;
  tracker = [];
  drawing = [];
  palette = [];
  start_btn.disabled = true;
  start_btn.innerHTML = "Visualizing...";
  let keys = Object.keys(data);
  let values = Object.values(data);
  for (let i = 0; i < keys.length; i++) {
    drawing.push(values[i].path);
    palette.push(values[i].color);
    tracker.push(false)
  }
  // console.log(drawing, palette);
}

function updateColor() {
  let color = select('#picker').value();
  document.querySelector("i");
  document.querySelector("i").style.color = color;
}

function draw() {
  // line(width / 2, 0, width / 2, height);
  if (!motionGranted || !orientationGranted) {
    return
  }
  if (isCapturing) {
    ballMove();
    ballSize();
    let state = { x: x, y: y, z: z };
    let col = palette[0];
    currentPath.push(state);
    noStroke();
    fill(col);
    ellipse(x, y, 10 + z, 10 + z);
    start_btn.innerHTML = 30 - round((millis() - drawingStart) / 1000, 0) + "s";
    if (drawingStart && millis() - drawingStart > 30000) {
      endPath();
    }
  }

  if (isAdmin) {
    if (step == null) {
      step = 0;
    }
    for (let i = 0; i < drawing.length; i++) {
      let path = drawing[i];
      let col = palette[i];
      noStroke();
      fill(col);
      if (step >= path.length) {
        tracker[i] = true;
      }
      if (!tracker.includes(false)) {
        isAdmin = false;
        step = null;
        start_btn.disabled = false;
        start_btn.innerHTML = "Start Dancing!";
        break;
      }
      if (!tracker[i]) {
        ellipse(path[step].x, path[step].y, path[step].z, path[step].z);
      }

    }
    step++;

  }
}

function keyPressed() {
  if (key == " ") {
    drawing = [];
    palette = [];
    endPath();
    clear();
    start_btn.innerHTML = "Clearing...";
    return false;
  } else if (key == "Escape") {
    endPath();
    return false;
  }
}

function touchStarted() {
  if (touches.length == 3) {
    drawing = [];
    palette = [];
    endPath();
    clear();
  } else if (touches.length == 2) {
    endPath();
  }
}


function ballMove() {
  ax = accelerationX + (x - width / 2) * -gravity;
  ay = accelerationY + (y - height / 2) * -gravity;
  rx = rotationX + z ** 2 * -gravity;
  ry = rotationY + z ** 2 * -gravity;

  vx += ax;
  vy += ay;
  vx *= drag;
  vy *= drag;
  y += vy * vMultiplier + rx * rMultiplier;
  x += vx * vMultiplier + ry * rMultiplier;

  // Bounce when touch the edge of the canvas
  if (x < 0) {
    x = 0;
    vx = -vx * bMultiplier;
  }
  if (y < 0) {
    y = 0;
    vy = -vy * bMultiplier;
  }
  if (x > width - 5) {
    x = width - 5;
    vx = -vx * bMultiplier;
  }
  if (y > height - 5) {
    y = height - 5;
    vy = -vy * bMultiplier;
  }
}

function ballSize() {
  az = accelerationZ;
  dz += az;
  z += dz * sMultiplier;

  if (z > 10) {
    z = 10;
    dz = -dz * bMultiplier;
  }
  if (z < 0) {
    z = 0;
    dz = -dz * bMultiplier;
  }
}
