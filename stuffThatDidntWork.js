function audioError(err) {
  console.log("audio err: ", err);
}
let data = new Float32Array();
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
function receiveAudio(stream) {
  var microphone = context.createMediaStreamSource(stream);
  var filter = context.createBiquadFilter();
  let processor = context.createScriptProcessor(1024, 1, 1);

  // microphone -> filter -> destination.
  microphone.connect(processor);
  processor.connect(filter);
  filter.connect(context.destination);

  processor.onaudioprocess = function(e) {
    console.log(e.inputBuffer.getChannelData(0));
  };
  // var context = new (window.AudioContext || window.webkitAudioContext)();
  // let analyser = context.createAnalyser();
  // let input = context.createMediaStreamSource(stream);
  // var frameCount = context.sampleRate * 2.0;
  // var myArrayBuffer = context.createBuffer(1, frameCount, context.sampleRate);
  // var nowBuffering = myArrayBuffer.getChannelData(0);
  // nowBuffering.onaudioprocess = function(e) {
  //   console.log(e.inputBuffer.getChannelData(0));

  // };
  // var source = context.createBufferSource();
  // let processor = context.createScriptProcessor(1024, 1, 1);
  // let destinationNode = context.createMediaStreamDestination();
  // processor.connect(source);
  // processor.connect(context.destination);

  // processor.connect(stream);

  //   processor.onaudioprocess = function(e) {
  //     console.log(analyser);
  //     // console.log(e.inputBuffer.getChannelData(0));
  //   };
  // }

  // function receiveAudio(stream) {
  //   let context = new AudioContext();
  //   let input = context.createMediaStreamSource(stream);
  //   let processor = context.createScriptProcessor(1024, 1, 1);

  //   // source.connect(processor);
  //   processor.connect(context.destination);

  //   processor.onaudioprocess = function(e) {
  //     console.log(e.inputBuffer.getChannelData(0));
  //   };
}

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
getAudio();
