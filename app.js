function audioError(err) {
  console.log("audio err: ", err);
}
// let data = new Float32Array();

function receiveAudio(stream) {
  const display = document.getElementById("display");
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  const microphone = context.createMediaStreamSource(stream);
  const filter = context.createBiquadFilter();
  const processor = context.createScriptProcessor(1024, 1, 1);

  // microphone -> filter -> destination.
  microphone.connect(processor);
  processor.connect(filter);
  filter.connect(context.destination);

  processor.onaudioprocess = function(e) {
    // console.log(e.inputBuffer.getChannelData(0));
    var dft = new DFT(1024, 44100);
    dft.forward(e.inputBuffer.getChannelData(0));
    var spectrum = dft.spectrum;
    display.textContent = JSON.stringify(spectrum);
    console.log("spectrum: ", spectrum);
  };

  document.getElementById("stopAudio").addEventListener("click", function() {
    microphone.disconnect(processor);
    processor.disconnect(filter);
  });
}

// look for different get media sources
function getUserMedia() {
  (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia ||
    function() {
      alert("getUserMedia missing");
    })
    .apply(navigator, arguments);
}

function getAudio() {
  getUserMedia({ audio: true }, receiveAudio, audioError);
}

// getAudio();
