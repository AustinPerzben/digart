let permissionGranted = false
let isAdmin = false
let drawing = [];
let palette = [];
let currentPath = [];
let isCapturing = false;
let drawingStart;

let _x = 0, _y = 0, _z
let mn = 0
let mx = 0

// will handle first time visiting to grant access
function onAskButtonClicked() {
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === 'granted') {
      permissionGranted = true
    } else {
      permissionGranted = false
    }
    this.remove()
  }).catch(console.error)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  start_btn = document.getElementById("start");

  if (typeof (DeviceMotionEvent.requestPermission) === 'function') {
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
        permissionGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    permissionGranted = true
  }
}

function startPath() {
  drawingStart = millis();
  isCapturing = true;
  drawing = [];
  palette = [];
  currentPath = [];
  drawing.push(currentPath);
  palette.push(select('#picker').value());
  start_btn.disabled = true;
}

function endPath() {
  drawingStart = null;
  isCapturing = false;
  start_btn.disabled = false;
}

function visualizeData(data) {
  isAdmin = true;
  drawing = [];
  palette = [];
  let keys = Object.keys(data);
  let values = Object.values(data);
  for (let i = 0; i < keys.length; i++) {
    drawing.push(values[i].path);
    palette.push(values[i].color);
  }
  console.log(drawing, palette);
}

function updateColor() {
  let color = select('#picker').value();
  document.querySelector("i");
  document.querySelector("i").style.color = color;
}

function draw() {
  background('#333');
  // stroke(255);
  // line(width / 2, 0, width / 2, height);
  // mx = max(mx,accelerationZ)
  // mn = min(mn, accelerationZ)
  // text(floor(mn)+","+ceil(mx),width/2-10, 50)
  if (!permissionGranted) {
    return
  }
  if (isCapturing && !isAdmin) {
    _x += (mouseX - _x) * 0.1;
    _y += (mouseY - _y) * 0.1;
    _z = 5; //0 + map(accelerationZ, -250, 250, -40, 40);
    let state = {
      x: _x,
      y: _y,
      z: _z
    };
    currentPath.push(state);
    start_btn.innerHTML = floor(millis() / 1000) + "s";
    if (drawingStart && millis() - drawingStart > 10000) {
      endPath();
    }
  } else {
    start_btn.innerHTML = "Start Dancing!";
  }

  // translate(width / 2, height / 2);
  noFill();
  for (let i = 0; i < drawing.length; i++) {
    let path = drawing[i];
    let col = palette[i];
    stroke(col);
    beginShape();
    for (let j = 0; j < path.length - 4; j += 3) {
      strokeWeight(_z);
      vertex(path[j].x, path[j].y);
      bezierVertex(path[j].x, path[j].y, path[j + 1].x, path[j + 1].y, path[j + 2].x, path[j + 2].y);
    }
    endShape();
  }

  if (!isCapturing) {
    _x = mouseX;
    _y = mouseY;
    _z = 5; //0 + map(accelerationZ, -250, 250, -40, 40);
  }


}

function keyPressed() {
  if (key == " ") {
    isAdmin = false;
    drawing = [];
    palette = [];
    endPath();
    start_btn.disabled = false;
  } else if (key == "Escape") {
    endPath();
  }
}

function touchStarted() {
  if (touches.length == 3) {
    isAdmin = false;
    drawing = [];
    palette = [];
    endPath();
    start_btn.disabled = false;
  } else if (touches.length == 2) {
    endPath();
  }
}



