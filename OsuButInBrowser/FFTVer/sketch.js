var song;
var fft;
var spectrum = [];

var screenWidth = 1024;
var screenHeigth = screen.height / 2;

var waveForm = [];
var peaks = [];
var avgPeaks = [];

var debugCount = 0;

function preload() {
    song = loadSound('../sounds/stm.mp3');
}

function toggleSong() {
    song.isPlaying() ? song.pause() : song.play();
}

function setup() {
    peaks = song.getPeaks();


    createCanvas(screenWidth, screenHeigth);
    song.play();
    fft = new p5.FFT(0.5, 256);
    strokeWeight(3);

    button = createButton('toggle');
    button.mousePressed(toggleSong);
}


function draw() {
    background(0);
    var spectrum = fft.analyze();
    waveForm = fft.waveform();
    avgPeaks = fft.linAverages();

    translate(0, screenHeigth);
    /*
        stroke(255, 0, 0)
        beginShape(LINES);
        for (let i = 0; i < waveForm.length; i++) {
            let y = map(waveForm[i], -1, 1, 0, screenHeigth);
            vertex(i * 6, -y);
        }
        endShape();

        stroke(0, 255, 0)
        beginShape(LINES);
        for (let i = 0; i < peaks.length; i++) {
            let y = map(peaks[i], -1, 1, 0, screenHeigth);
            vertex(i * 6, -y);
        }
        endShape();

        stroke(0, 0, 255)
        beginShape(LINES);
        for (let i = 0; i < avgPeaks.length; i++) {
            let y = map(avgPeaks[i], -1, 1, 0, screenHeigth);
            vertex(i * 6, -y);
        }
        endShape();
    */
    noStroke();
    fill(255);
    for (let i = 0; i < spectrum.length; i++) {
        let y = map(spectrum[i], 0, spectrum.length, 0, screenHeigth);
        rect(i * 6, 0, 3, -y);
    }

    if (spectrum.length > screenWidth) {
        spectrum.splice(0, 1);
    }
}