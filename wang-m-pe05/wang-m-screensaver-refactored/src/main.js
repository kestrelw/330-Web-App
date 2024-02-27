let ctx;
let canvas;
let paused = false;
let createRectangles = true;
let createArcs = false;
let createLines = false;

import {getRandomInt} from "./utils.js";
import {getRandomColor} from  "./utils.js";
import {drawRectangle} from  "./canvas-utils.js";
import {drawArc} from  "./canvas-utils.js";
import {drawLine} from  "./canvas-utils.js";

const init = () => {
    console.log("page loaded!");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    drawLine(ctx,0,0,650, 500,20,getRandomColor());

    setupUI();
    update();
}

const update = () => {
    if(paused) return;

    requestAnimationFrame(update);
    if(createRectangles){
    drawRandomRect(ctx);
    }
    if(createArcs){
    drawRandomCirc(ctx);
    }
    if(createLines){
    drawRandomLine(ctx);
    }
}

const drawRandomRect = (ctx) => {
    drawRectangle(ctx,getRandomInt(10, 640), getRandomInt(10, 480), getRandomInt(10, 90), getRandomInt(10, 90),getRandomColor(),getRandomInt(1,10),getRandomColor())
}

const drawRandomCirc = (ctx) => {
    drawArc(ctx,getRandomInt(10, 640), getRandomInt(10, 480),getRandomInt(10, 80),getRandomColor(),getRandomInt(1,10),getRandomColor(), 0, Math.PI*getRandomInt(0,2));
}

const drawRandomLine = (ctx) => {
    drawLine(ctx,getRandomInt(0, 650),getRandomInt(0, 500),getRandomInt(0, 650), getRandomInt(0, 500),getRandomInt(1, 10),getRandomColor())
}

const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX,mouseY);

    for(let i = 0; i<10; i++){
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let width = getRandomInt(20, 50);
        let height = getRandomInt(20, 50);
        let color = getRandomColor();
        let radius = getRandomInt(10, 30);
        let startAngle = 0;
        let endAngle = Math.PI * getRandomInt(0,2);

        drawArc(ctx, x, y, radius, color, startAngle, endAngle);
        
    }      
}

const setupUI = () => {
    document.querySelector("#btn-pause").onclick = () => {
        paused = true;
    }

    document.querySelector("#btn-play").onclick = () => {
        if(paused){
        paused = false;
        update();
        }
    }

    document.querySelector("#btn-clear").onclick = () =>{
        drawRectangle(ctx,0,0,650,500,"white",0,"white");
    }

    canvas.onclick = canvasClicked;


    // document.querySelector("#cb-rectangles").onclick = function(e){
    // createRectangles = e.target.checked;
    // }
    // document.querySelector("#cb-arcs").onclick = function(e){
    // createArcs = e.target.checked;
    // }
    // document.querySelector("#cb-lines").onclick = function(e){
    // createLines = e.target.checked;
    // }


    document.querySelector("#cb-rectangles").onclick = (e) => {createRectangles = e.target.checked;}

    document.querySelector("#cb-arcs").onclick = (e) => {createArcs = e.target.checked;}

    document.querySelector("#cb-lines").onclick = (e) => {createLines = e.target.checked;}

}

init();