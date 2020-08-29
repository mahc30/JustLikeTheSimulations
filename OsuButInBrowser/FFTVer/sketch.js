var song;
var fft;
var spectrum = [];
var peak;
var peakThreshold;

var screenWidth = 1024;
var screenHeigth = screen.height / 2;


var debugCount = 0;

function preload() {
    song = loadSound('../sounds/test.mp3');
}

function toggleSong() {
    song.isPlaying() ? song.pause() : song.play();
}

function setup() {
    createCanvas(screenWidth, screenHeigth);
    angleMode(DEGREES);
    fill(255);
    noStroke();
    song.play();
    fft = new p5.FFT(0.5, 256);
    button = createButton('toggle');
    button.mousePressed(toggleSong);
}


function draw() {
    background(0);
    var spectrum = fft.analyze();

    translate(0, screenHeigth);

    for (var i = 0; i < spectrum.length; i++) {
        var y = map(spectrum[i], 0, spectrum.length, 0, screenHeigth);
        rect(i * 6, 0, 3, -y);
    }

    if (spectrum.length > screenWidth) {
        spectrum.splice(0, 1);
    }
}