var song;
var amp;
var volHist = [];
var peak;
var peakThreshold;

var screenWidth = screen.width / 2;
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
    amp = new p5.Amplitude();
    button = createButton('toggle');
    button.mousePressed(toggleSong);
}


function draw() {
    background(0);
    var vol = amp.getLevel();
    volHist.push(vol);
    translate(0, screenHeigth);
    peak = analyzeArrayForPeak(volHist);
    peakThreshold = setPeakThreshold(peak);

    for (var i = 0; i < volHist.length; i++) {
        volHist[i] > peakThreshold ? fill(255, 0, 0) : fill(255);
        var y = map(volHist[i], 0, 1, 0, screenHeigth);
        rect(i, 0, 1, -y);
    }


    if (volHist.length > screenWidth) {
        volHist.splice(0, 1);
        beatHist.splice(0, 1);
    }
}


/*
    Very naive attempt
    So the idea would be to reduce the array to its peaks
    I will get a threshold, let's say everything .10 less than the peak of the array
*/

function analyzeArrayForPeak(arr) {
    let peak = arr[0];

    for (var i = 0; i < arr.length; i++) {
        if (peak < arr[i]) peak = arr[i];
    }

    return peak;
}

function setPeakThreshold(peak) {
    return peak - 0.07; //Arbitrary value 
}

function createBeatArray(arr, threshold) {
    //Not using a map so i can return a mutated array without losing the draw data
    let beatArr = [arr.length];

    for (var i = 0; i < arr.length; i++) {
        arr[i] > threshold ? beatArr[i] = 1 : beatArr[i] = 0;
    }


    return beatArr;
}