var x_pos = 30;
var y_pos = 250;


function setup() {
    createCanvas(600, 500);
    
  }

function draw(){
  background(0);
  //Drawing The Circle
   ellipse(x_pos, y_pos, 30, 30);
   stroke(255, 255, 255);
   strokeWeight(3);
   fill(0);
   
   //Literally Just moving the Circle
   x_pos += 1;
}

