let body = document.querySelector("body");
let style = body.style;

function audioError(err) {
  console.log("audio err: ", err);
}
// let data = new Float32Array();

function receiveAudio(stream) {
  const display = document.getElementById("display");
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  // let audioBuffer = context.createBufferSource(stream);

  const microphone = context.createMediaStreamSource(stream);
  const filter = context.createBiquadFilter();
  // const processor = context.createScriptProcessor(1024, 1, 1);
  const processor = context.createScriptProcessor(2048, 1, 1);
  // const oscillator = context.createOscillator();
  filter.frequency = 400;
  // oscillator.type = "sine";
  // microphone -> filter -> destination.
  // microphone.connect(processor);
  // processor.connect(filter);
  microphone.connect(filter);
  filter.connect(processor);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    // console.log(e.inputBuffer.getChannelData(0));
    // var dft = new DFT(1024, 44100);
    // dft.forward(e.inputBuffer.getChannelData(0));
    // var spectrum = dft.spectrum;
    // var specArry = Array.from(spectrum);

    var fft = new FFT(2048, 44100);
    fft.forward(e.inputBuffer.getChannelData(0));
    var spectrum = fft.spectrum;

    if (spectrum[0] < 0.001) {
      style.backgroundColor = "red";
    } else {
      style.backgroundColor = "white";
    }
    display.textContent = JSON.stringify(spectrum);
    console.log("spectrum: ", spectrum);
  };

  function changeFreq() {
    let num = event.target.value;
    filter.frequency.value = num;
  }

  document.querySelector("#freqChanger").addEventListener("change", changeFreq);

  document.getElementById("stopAudio").addEventListener("click", function() {
    filter.disconnect(processor);
    processor.disconnect(context.destination);
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
