//When the AudioInput changes
document.querySelector('input').onchange = function() {
    var fileReader = new FileReader;

    //Read document file
    fileReader.onload = async function() {
        var buffer = this.result;

        //Create OFFLINE context to get entire buffer
        var offlineCtx = new OfflineAudioContext(2, buffer.byteLength, 44100);
        var source = offlineCtx.createBufferSource()

        //Decode arrayBuffer into audioBuffer
        var audioBuffer = await offlineCtx.decodeAudioData(buffer);

        source.buffer = audioBuffer;

        source.connect(offlineCtx.destination);

        //The next line are necessary otherwise offlineCtx doesn't do anything
        source.start();

        //Convert it into something onlineCtx can work with
        var renderedBuffer = await offlineCtx.startRendering();
        console.log("Render Completed");

        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var song = audioCtx.createBufferSource();
        song.buffer = renderedBuffer;

        song.connect(audioCtx.destination);
        song.start();
    }

    fileReader.readAsArrayBuffer(this.files[0])
    var url = URL.createObjectURL(this.files[0]);
};