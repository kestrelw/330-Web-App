/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils';
import * as main from './main';
import * as audio from './audio';
import CircleSprites from './classes/CircleSprite'
import {DrawParams} from './interfaces/drawParams.interface'

let ctx: CanvasRenderingContext2D, canvasWidth: number,canvasHeight: number,/*gradient,*/analyserNode: AnalyserNode,audioData;


const BAR_WIDTH = 18;
const MAX_BAR_HEIGHT = 60;
const PADDING = 4;
let MIDDLE_Y: number;

const div = document.querySelector('controls')

const setupCanvas = (canvasElement: HTMLCanvasElement,analyserNodeRef: AnalyserNode) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

    MIDDLE_Y = canvasHeight/2;

	// create a gradient that runs top to bottom
	//gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#489EDB"},{percent:.25,color:"#2DCBDC"},{percent:.5,color:"#8048DB"},{percent:.75,color:"#4870DB"},{percent:1,color:"#25DBA1"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}



const drawArc = (ctx: CanvasRenderingContext2D,x: number,y: number,radius: number,fillStyle: any,lineWidth: number,strokeStyle: string | CanvasGradient | CanvasPattern,startAngle = 0,endAngle = Math.PI * 2) => {
    ctx.save();
    //ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    if(lineWidth >0){
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

const circSprite = new CircleSprites(50, 50, 50);
const circSprite2 = new CircleSprites(800-50, 50, 50);
    //console.log("circles generated");

const draw = (params:DrawParams) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode//
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	 
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.restore();

    
	
    if(main.visualization){
        //div.style.visibility = 'visible';
        // 3 - draw gradient
        // if(params.showGradient){
        //     // ctx.save();
        //     // ctx.fillStyle = gradient;
        //     // ctx.globalApha = .3;
        //     // ctx.fillRect(0,0,canvasWidth, canvasHeight);
        //     // ctx.restore();
        // }
        // 4 - draw bars
        if(params.showBars){
            let barSpacing = 4;
            let margin = 5;
            let screenWidthForBars = canvasWidth - (audioData.length*barSpacing) - margin * 2;
            let barWidth = screenWidthForBars / audioData.length;
            let barHeight = 200;
            let topSpacing = 100;

            ctx.save()
            
            ctx.strokeStyle = `rgba(0, 0, 0, 0, .5)`;
            //loop through data and draw
            for(let i = 0; i<audioData.length; i++){

                ctx.fillStyle = utils.makeColor(156-audioData[i], 256-Math.round(audioData[i]/2), 256-audioData[i], .5);
                ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
                ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            }
            ctx.restore();
        }
        // 5 - draw circles
        if(params.showCircles){
            let maxRadius = canvasHeight/4;
            ctx.save()
            ctx.globalAlpha = .5;

            for(let i = 0; i<audioData.length; i++){
                //red  
                let percent = audioData[i] / 255;
                ctx.strokeStyle = "teal";

                let circleRadius = percent * maxRadius;
                ctx.beginPath();
                ctx.strokeStyle = utils.makeColor(124, 223, circleRadius*4, .34 - percent/3.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2*Math.PI, false);
                //ctx.fill();
                ctx.stroke();
                ctx.closePath();
                //blue, bigger, transparent
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(87, 41, circleRadius*5 , .1 - percent/10.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2*Math.PI, false);
                //ctx.fill();
                ctx.stroke();
                ctx.closePath();
                //yelow smaller
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(13, 156, circleRadius*.5, .5 - percent/5.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .50, 0, 2*Math.PI, false);
                //ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            ctx.restore();
        }

        // 6 - bitmap manipulation
        // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
        // regardless of whether or not we are applying a pixel effect
        // At some point, refactor this code so that we are looping though the image data only if
        // it is necessary

        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0,0,canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;
        // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for(let i = 0; i < length; i += 4){

        
            // C) randomly change every 20th pixel to red
            if(params.showNoise && Math.random() < .05){
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
                data[i+2] = 255// make the red channel 100% red
            } // end if

            //invert
            if(params.showInvert){
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255-red;
                data[i] = 255-green;
                data[i] = 255-blue;
                //leaving alpha alone
            }
        } // end for


        if(params.showEmboss){
            for(let i = 0; i<length; i++){
                if(i%4 ==3) continue;//skip alpha
                data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
            }
        }

        // D) copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);

        for(let b of audioData){
            ctx.save();
            ctx.fillStyle = `rgb(${b/12}, ${82-b}, ${b})`;
            circSprite.update();
            circSprite.draw(ctx);
            circSprite2.update();
            circSprite2.draw(ctx);
            ctx.restore();
        }
    }
    else{
        //div.style.visibility = 'hidden';

        ctx.fillStyle = "rgba(0,0,0,.1)";
		ctx.fillRect(0,0,canvasWidth, canvasHeight);
		
		//bars
		ctx.fillStyle = "red";
		ctx.save();
		ctx.translate(360, MIDDLE_Y-100);
		for(let b of audioData){
			let percent = b/225;
			if(percent<.02) percent = .02;
			ctx.translate(BAR_WIDTH, 0)
			ctx.rotate(Math.PI * 2/32);
			ctx.save();
			ctx.scale(1,-1);
			ctx.fillStyle = `rgb(${b}, ${b-128}, ${255-b})`;
			ctx.fillRect(0,0,BAR_WIDTH, MAX_BAR_HEIGHT  * percent);
			ctx.restore();
			ctx.translate(PADDING,0);//space between bars
		}
		ctx.restore();

		//line
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 3;
		let x = -(canvasWidth/audioData.length);
		let y = MIDDLE_Y+180;
		ctx.beginPath();
		ctx.moveTo(x, y);
		for(let b of audioData){
			ctx.lineTo(x,y-b);
			x += (canvasWidth/(audioData.length-10));
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

        for(let b of audioData){
            ctx.save();
            ctx.fillStyle = `rgb(${b}, ${b-128}, ${255-b})`;
            circSprite.update();
            circSprite.draw(ctx);
            circSprite2.update();
            circSprite2.draw(ctx);
            ctx.restore();
        }
    }

}

export {setupCanvas,draw, drawArc};