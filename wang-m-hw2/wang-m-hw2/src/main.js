/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

let drawParams = {
  showGradient : false,
  showBars : false,
  showCircles : false,
  showNoise : false,
  showInvert : false,
  showEmboss : false
};

let visualization = true;
const fps = 60;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});


const loadJSON = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = callback;
  xhr.onerror = e => console.log(`In onerror = HTTP Status Code = ${e.target.status}`);
  xhr.open("GET",url);
  xhr.send();
}

const JSONLoaded = (e) => {
  //console.log(`In onload = HTTP Status Code = ${e.target.status}`);
  const xml = e.target.responseText;
  const json = JSON.parse(xml);
  
  //words1 = json.words1;

  //drawParams.showGradient = json.uiInitialState.showGradient;
  drawParams.showBars = json.uiInitialState.showBars;
  drawParams.showCircles = json.uiInitialState.showCircles;
  drawParams.showNoise = json.uiInitialState.showNoise;
  drawParams.showInvert = json.uiInitialState.showInvert;
  drawParams.showEmboss = json.uiInitialState.showEmboss;

}

const init = () => {
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	canvas.setupCanvas(canvasElement,audio.analyserNode);
  

  loadJSON("data/ac-data.json", JSONLoaded);
  setupUI(canvasElement);
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");

  //set the initial state of the high shelf checkbox
  document.querySelector('#cb-highshelf').checked = audio.highshelf; // `highshelf` is a boolean we will declare in a second
	document.querySelector('#cb-lowshelf').checked = audio.lowshelf;
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  const playButton = document.querySelector("#play-button");

  //onclick play button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //context suspended state?  
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
      //if paused play
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"
    //if paying, pause
    }
    else{
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"
    }

    //document.querySelector("#gradient-cb").onclick = (e) => {drawParams.showGradient = e.target.checked;}

    document.querySelector("#bars-cb").onclick = (e) => {drawParams.showBars = e.target.checked;}

    document.querySelector("#circles-cb").onclick = (e) => {drawParams.showCircles = e.target.checked;}

    document.querySelector("#noise-cb").onclick = (e) => {drawParams.showNoise = e.target.checked;}

    document.querySelector("#invert-cb").onclick = (e) => {drawParams.showInvert = e.target.checked;}

    document.querySelector("#emboss-cb").onclick = (e) => {drawParams.showEmboss = e.target.checked;}

    document.querySelector('#cb-highshelf').onclick = (e) => {audio.toggleHighshelf();};

		document.querySelector('#cb-lowshelf').onclick = (e) => {audio.toggleLowshelf();};

    audio.toggleHighshelf(); // when the app starts up, turn on or turn off the filter, depending on the value of `highshelf`!
		audio.toggleLowshelf();

  };

  //C - vol sider and label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");

  //add .oninput
  volumeSlider.oninput = e => {
    //set gaom
    audio.setVolume(e.target.value);
    //update label val to match sider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  //set label to match initial sider val
  volumeSlider.dispatchEvent(new Event("input"));


  //D - hookup track <select>
  let trackSelect= document.querySelector("#track-select");
  //add .onchange
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //puase the current track if playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent (new MouseEvent("click"));
    }
  };

  let visualSelect= document.querySelector("#visual-select");
  //add .onchange
  visualSelect.onchange = e => {
    visualization = !visualization;
    console.log(visualization);
  };

  
  
  loop();
} // end setupUI

const loop = () => {
  // /* NOTE: This is temporary testing code that we will delete in Part II */
  setTimeout(loop, 1000/fps);


  canvas.draw(drawParams);
}


export {init, visualization};