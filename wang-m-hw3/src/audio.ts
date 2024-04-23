import {DEFAULTS} from './enums/audio-defaults.enum'

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx:AudioContext;

let highshelf = false;
let lowshelf = false;
let biquadFilter;
let lowShelfBiquadFilter;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element:HTMLAudioElement, sourceNode: MediaElementAudioSourceNode, analyserNode: AnalyserNode, gainNode: GainNode;

// 3 - here we are faking an enumeration
// const DEFAULTS = Object.freeze({
//     gain: .5,
//     numSamples: 256
// })

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
// let audioData = new Uint8Array(DEFAULTS.numSamples/2)//delete

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (filePath: string) => {
// 1 - The || is because WebAudio has not been standardized across browsers yet
     const AudioContext = window.AudioContext;
     audioCtx = new AudioContext();

// 2 - this creates an <audio> element
    element = new Audio();

// 3 - have it point at a sound file
    loadSoundFile(filePath);

// 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    biquadFilter = audioCtx.createBiquadFilter();//ADDED STUFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
	biquadFilter.type = "highshelf";
	// biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
	// biquadFilter.gain.setValueAtTime(20,audioCtx.currentTime);
	lowShelfBiquadFilter = audioCtx.createBiquadFilter();
	lowShelfBiquadFilter.type = "lowshelf";

// 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser();// note the UK spelling of "Analyser"
    
/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.

If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

// 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

// 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter);
	biquadFilter.connect(lowShelfBiquadFilter);
	lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);

    gainNode.connect(audioCtx.destination);
}

const toggleHighshelf = () => {
    const highshelf = document.querySelector('#cb-highshelf') as HTMLInputElement;

    if(highshelf.checked){
        biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    }else{
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleLowshelf = () => {
    const lowshelf = document.querySelector('#cb-lowshelf') as HTMLInputElement;
    if(lowshelf.checked){
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    }else{
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const loadSoundFile = (filePath: string) => {
    element.src = filePath;
}

const playCurrentSound = () => {
    element.play();
}

const pauseCurrentSound = () => {
    element.pause();
}

const setVolume = (value: string | number) => {
    value = Number(value);// make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}



export{audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleHighshelf, toggleLowshelf, highshelf, lowshelf};
