// No longer being used
let Mic = require("node-microphone");
const stream = require("stream");
const fs = require("fs");
const path = require("path");
let mic = new Mic();
let micStream = mic.startRecording();
let myWritableStream = fs.createWriteStream();

let myPath = path.join("./demo.txt", {
  flags: "w",
  defaultEncoding: "utf8",
  fd: null,
  mode: 0o666,
  autoClose: true
});

micStream.pipe(myWritableStream(myPath));

setTimeout(() => {
  logger.info("stopped recording");
  mic.stopRecording();
}, 3000);
mic.on("info", info => {
  console.log(info);
});
mic.on("error", error => {
  console.log(error);
});
