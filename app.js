let body = document.querySelector("body");
let style = body.style;
let model; // model is global
checkModel();
let modelLoader = setInterval(trainModel, 300);

function checkModel() {
    let mode = localStorage.getItem('model');

    if (model) {
        alert('model found!');
        console.log(JSON.parse(model));
    } else {
        alert('no model found');
    }
}

function trainModel() {
    if (brain) {
        model = new brain.NeuralNetwork({
            activation: 'sigmoid', // activation function
            hiddenLayers: [4], // 1 hidden by default
            learningRate: 0.6 // global learning rate, useful when training using streams
        });

        model.trainAsync(trainingData)
            .then(function (model) {
                localStorage.setItem('model', JSON.stringify(model));
                alert("Training done! You are ready to test!")
            });
        clearInterval(modelLoader);
    }
}


function audioError(err) {
    console.log("audio err: ", err);
}


function receiveAudio(stream) {
    const display = document.getElementById("display");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    const microphone = context.createMediaStreamSource(stream);
    const filter = context.createBiquadFilter();
    const processor = context.createScriptProcessor(2048, 1, 1);
    filter.frequency = 400;
    microphone.connect(filter);
    filter.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {

        var fft = new FFT(2048, 44100);
        fft.forward(e.inputBuffer.getChannelData(0));
        var spectrum = fft.spectrum;

        console.log(model.run(spectrum));
        display.textContent = brain.likely(spectrum, model);
    };

    function changeFreq() {
        let num = event.target.value;
        filter.frequency.value = num;
    }

    document.querySelector("#freqChanger").addEventListener("change", changeFreq);
    // TODO: Fix stop button. 
    document.getElementById("stopAudio").addEventListener("click", function () {
        filter.disconnect(processor);
        processor.disconnect(context.destination);
    });
}

// look for different get media sources
function getUserMedia() {
    (navigator.getUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        function () {
            alert("getUserMedia missing");
        })
        .apply(navigator, arguments);
}

function getAudio() {
    getUserMedia({ audio: true }, receiveAudio, audioError);
  }