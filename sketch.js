let permissionGranted = false
let isAdmin = false
let drawing = [];
let palette = [];
let currentPath = [];
let isCapturing = false;
let drawingStart;

let _x, _y, _z
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

function setup() {
  createCanvas(windowWidth, windowHeight)
  super_btn = createButton("Start Dancing!");
  super_btn.position(width / 2 - 50, height - 100);
  super_btn.style('margin', '0 auto');
  super_btn.size(100);
  super_btn.mousePressed(startPath);
  translate(width / 2, height / 2);

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
  currentPath = [];
  drawing.push(currentPath);
  palette.push(select('#picker').value());
  super_btn.hide();
}

function endPath() {
  drawingStart = null;
  isCapturing = false;
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

function draw() {
  background('#333');
  // line(width / 2, 0, width / 2, height);
  // mx = max(mx,accelerationZ)
  // mn = min(mn, accelerationZ)
  // text(floor(mn)+","+ceil(mx),width/2-10, 50)
  if (!permissionGranted) {
    return
  }
  if (isCapturing && !isAdmin) {
    _x = accelerationX * 5;
    _y = accelerationY * 5;
    _z = 50 + map(accelerationZ, -250, 250, -40, 40);
    let state = {
      x: _x,
      y: _y,
      sz: _z
    };
    currentPath.push(state);
    if (drawingStart && millis() - drawingStart > 10000) {
      endPath();
    }
  }


  strokeWeight(4);
  noFill();
  for (let i = 0; i < drawing.length; i++) {
    let path = drawing[i];
    let col = palette[i];
    stroke(col);
    beginShape();
    for (let j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function keyPressed() {
  if (key == " ") {
    isAdmin = false;
    drawing = [];
    super_btn.show();
  } else if (key == "Escape") {
    endPath();
  }
}

function touchStarted() {
  if (touches.length == 2) {
    isAdmin = false;
    drawing = [];
    super_btn.show();
  } else if (touches.length == 1) {
    endPath();
  }
}
