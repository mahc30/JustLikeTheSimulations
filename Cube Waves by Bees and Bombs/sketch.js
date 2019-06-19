var angle = 0;
var w = 48;
var ma;
var maxD;
var labelText = "Z Position of light:";
var z = 0;
var r = 0;
var g = 0;
var b = 100;

/*Get Z position of light value
from zlight*/
$("#zlight").on('input change', function() {
  z = document.getElementById("zlight").value;
  document.getElementById("label").innerText = labelText + z;
});

//Get R value from slider
$("#R").on('input change', function() {
  r = document.getElementById("R").value;
  //document.getElementById("label").innerText = labelText + r;
});
//Get G value from slider
$("#G").on('input change', function() {
  g = document.getElementById("G").value;
  //document.getElementById("label").innerText = labelText + g;
});
//Get B value from slider
$("#B").on('input change', function() {
  b = document.getElementById("B").value;
  //document.getElementById("label").innerText = labelText + b;
});


function setup() {
  createCanvas(screen.height/2, screen.height/2, WEBGL);
  ma = atan(1 / sqrt(2));
  maxD = dist(0,0,200,200);
}


function draw() {
  background(0);
  //translate(width / 2, height / 2); //Mueve todo estas cantidades
  rectMode(CENTER); //Changes position of rectangles to center
  //fill(255); //White Fill to objects
  ortho(-400,400,400,-400,0,1000);
  
  rotateX(angle * 0.2);
  rotateY(angle * 0.1);
  //rotateY(PI/8);
  
  var offset = 0;
  specularMaterial(250);
  
  var locX = mouseX - height / 2;
  var locY = (-1)*(mouseY - width / 2);

  ambientLight(r, g, b);
  pointLight(0, 0, angle*-10, locX, locY, z);
  
  for(z = 0; z < height; z += w){
    for (x = 0; x < width; x += w) {
      push();
      var d = dist(x,z,width/2,height/2);
      offset = map(d,0, maxD, -PI,PI);
      var a = angle + offset;
      var h = map(sin(a), -1, 1, 100, 400);
      translate(x - width / 2, 0, z - height/2);
      box(w - 2, h ,w - 2);
      
      //rect(x - width / 2 + w / 2, 0, w - 2, h);
      pop();
    }
    
  }
  
  angle -= 0.05;
}