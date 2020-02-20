const canvas_w = 512
const canvas_h = 512

var bar_w = 15;

var barh_g = 0;
var barh_s = 0;
var barh_h = 0;
var barh_r = 0;

function setup() {
    createCanvas(canvas_w, canvas_h);
    textSize(16);
}

function draw() {

    barh_g = constrain(barh_g, -canvas_h / 2 + 10, canvas_h / 2 - 30)
    barh_s = constrain(barh_s, -canvas_h / 2 + 10, canvas_h / 2 - 30)
    barh_h = constrain(barh_h, -canvas_h / 2 + 10, canvas_h / 2 - 30)
    barh_r = constrain(barh_r, -canvas_h / 2 + 10, canvas_h / 2 - 30)

    background('#00000');
    line(0, canvas_h / 2, canvas_w, canvas_h / 2);

    fill('red');
    rect(100, canvas_h / 2, bar_w, -barh_g);
    text('Gryffindor', 70, 26);

    fill('green');
    rect(200, canvas_h / 2, bar_w, -barh_s);
    text('Slytherin', 170, 26);

    fill('yellow');
    rect(300, canvas_h / 2, bar_w, -barh_h);
    text('Hufflepuff', 270, 26);

    fill('black');
    rect(400, canvas_h / 2, bar_w, -barh_r);
    text('Ravenclaw', 370, 26);
}

function update_vals() {

    barh_g += parseInt(document.getElementById("p_g").value);
    barh_s += parseInt(document.getElementById("p_s").value);
    barh_h += parseInt(document.getElementById("p_h").value);
    barh_r += parseInt(document.getElementById("p_r").value);

    document.getElementById("p_g").value = 0;
    document.getElementById("p_s").value = 0;
    document.getElementById("p_h").value = 0;
    document.getElementById("p_r").value = 0;
}