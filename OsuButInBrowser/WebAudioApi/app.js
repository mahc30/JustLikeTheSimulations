// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();
const offAudioContext = new OfflineAudioContext(2, 441000 * 6, 441000);
// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
const source = offAudioContext.createBufferSource();

// =======================================================================
//     Getting a buffer a few seconds into song to skip mute or nothing
// =======================================================================

// =======================================================================
//                  Initial Analysis
// =======================================================================

let analyser = audioContext.createAnalyser();
analyser.fftSize = 1024;
analyser.smoothingTimeConstant = 0;
track.connect(analyser);

let initialFrequencyData = new Uint8Array(analyser.frequencyBinCount);
let initialTimeDomainData = new Uint8Array(analyser.fftSize);
analyser.getByteFrequencyData(initialFrequencyData);
analyser.getByteTimeDomainData(initialTimeDomainData);

// =======================================================================
//                  Step 1: Lowpass filter
// =======================================================================
let biquadAllpassFilter = audioContext.createBiquadFilter();
biquadAllpassFilter.type = 'allpass';
analyser.connect(biquadAllpassFilter);

let biquadLowpassFilter = audioContext.createBiquadFilter();
biquadLowpassFilter.type = 'lowpass';

biquadAllpassFilter.connect(biquadLowpassFilter);


// =======================================================================
//                  Step 2: Smooth it
// =======================================================================
let smoothingAnalyser = audioContext.createAnalyser();
smoothingAnalyser.fftSize = 1024;
smoothingAnalyser.smoothingTimeConstant = 1;

biquadLowpassFilter.connect(smoothingAnalyser);



// =======================================================================
//                  Final analysis
// =======================================================================

let finalAnalyser = audioContext.createAnalyser();
smoothingAnalyser.connect(finalAnalyser);

let finalFrequencyData = new Uint8Array(finalAnalyser.frequencyBinCount);
let finalTimeDomainData = new Uint8Array(finalAnalyser.fftSize);
finalAnalyser.getByteFrequencyData(finalFrequencyData);
finalAnalyser.getByteTimeDomainData(finalTimeDomainData);

console.log("Frenquecy Data");
console.log(initialFrequencyData);
console.log(finalFrequencyData);

console.log("TimeDomain Data");
console.log(initialTimeDomainData);
console.log(finalTimeDomainData);

console.log("Frenquecy Data diff");
console.log(differentiate(initialFrequencyData, finalFrequencyData));

console.log("TimeDomain Data diff");
console.log(differentiate(finalTimeDomainData, finalTimeDomainData));

// =======================================================================
//                  pass it into a destination
// =======================================================================
finalAnalyser.connect(audioContext.destination);

// =========================
//        Dom Handling
// =========================
// select our play button
const playButton = document.querySelector('button');

playButton.addEventListener('click', function() {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

// HTMLMediaElement fires an ended event once it's finished playing, so we can listen for that and run code accordingly:
audioElement.addEventListener('ended', () => {
    playButton.dataset.playing = 'false';
}, false);

function differentiate(arr1, arr2) {
    let diff = [];
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] - arr2[i] != 0) diff.push(arr1[i] - arr2[i]);

    }

    return diff;
}