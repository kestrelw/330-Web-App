//DOCUMENTATION - https://people.rit.edu/myw4072/Projects/Project3/doc.html


// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 1248,
    height: 702,
    backgroundColor: 0x0D98BA
    
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images (this code works with PIXI v6)
app.loader.
    add([
        "images/rightSheet.png",
        "images/leftSheet.png",
        "images/frontSheet.png",
        "images/background.jpg",
        "images/turtles/sprite_turtle_right_1.png",
        "images/turtles/sprite_turtle_left_1.png",
        "images/turtles/sprite_turtle_to_left_1.png",
        "images/food.png",
        "images/trash.png"
        //"images/space.png"//find and add--------------------------------------------
    ]);
//app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();






// aliases
let stage;
// game variables
let startScene;
let gameScene;
let scoreLabel;
let nomSound;//SOUNDS
let gameOverScene;
let instructions;

let turtle;
let food = [];
let trash = [];//trash?
let turtleMove = [];
let turtleRightTextures;
let turtleLeftTextures;
let turtleFrontTextures;

let turtleRight = PIXI.Texture.from('images/turtles/sprite_turtle_right_1.png');
let turtleLeft = PIXI.Texture.from('images/turtles/sprite_turtle_left_1.png');
let turtleFront = PIXI.Texture.from('images/turtles/sprite_turtle_to_left_1.png');
//PIXI﻿.utils.clearTextureCache();

let score = 0;
let timer = 0;
let paused = true;

let gameOverScoreLabel;

let controlSwitch;
let controls = "keyboard"//mouse or alt keyboard - make buttons to select

function setup() {
    stage = app.stage;

    //creating scenes
    gameScene = new PIXI.Container();
    gameScene.visible = true;
    stage.addChild(gameScene);
    //set background img
    let background = new Background();
    gameScene.addChild(background);


    startScene = new PIXI.Container();
    stage.addChild(startScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    createLabelsAndButtons();

    //create character
    turtle = new Turtle();
    gameScene.addChild(turtle);
    turtle.x = 300;
    turtle.y = 450;



    //Load Sounds
	nomSound = new Howl({
        src: ['sound/nom.mp3]']
    })
    // hitSound = new Howl({
    //     src: ['sound/hit.mp3]']
    // })
    // fireballSound = new Howl({
    //     src: ['sound/fireball.mp3]']
    // })

    //create character
    //Load sprite sheet
    //turtleRightTextures = loadSpriteSheet();

    app.ticker.add(gameLoop);
	//Start listening for keypress events on the canvas
    //space to eat, wasd to move

    //starts game
    document.addEventListener('keypress', function (e) //enter key works
    {
        if (e.code == "Enter" && startScene.visible == true) 
        {
            //console.log("starting game")
            startGame();//ONLY ONCE
        }
    });

    
    
}

function createLabelsAndButtons() {
    let instructionsBackground = new PIXI.Graphics();
    instructionsBackground.beginFill(0x22222220);
    instructionsBackground.drawRect (0, 100, sceneWidth, sceneHeight-200);
    instructionsBackground.endFill();
    instructionsBackground.fillStyle = .5;

    startScene.addChild(instructionsBackground);

    //move keys picture
    let moveKeys = new PIXI.Graphics();
    moveKeys.beginFill(0x44444490);
    moveKeys.drawRoundedRect (160, 160, 60, 60, 5);
    moveKeys.drawRoundedRect (90, 230, 60, 60, 5);
    moveKeys.drawRoundedRect (160, 230, 60, 60, 5);
    moveKeys.drawRoundedRect (230, 230, 60, 60, 5);
    moveKeys.endFill();
    startScene.addChild(moveKeys);
    let spaceKey = new PIXI.Graphics();
    spaceKey.drawRect (0, 100, sceneWidth, sceneHeight-200);

    instructions = new PIXI.Text('Use the W, A, S, D keys to move. Use the Space key to eat food.\n You will earn points for each food captured.\n\n But beware the trash in the ocean. Try not to mistakenly eat it.\n\nIf you would prefer to use the mouse for movement click below.\n\n\n\nHit Enter to start.',//
    {//avoid trash or whatever sprite i use. 
      font : '15px Arial',
      fill : 0xFFFFFF95,
      align : 'center',
      cacheAsBitmap: true,
    });
    instructions.x = 380;
    instructions.y =  220;
    startScene.addChild(instructions);

    //allow switch between keyboard or mouse
    controlSwitch = new PIXI.Text('Controls: keyboard',{
        font : '15px Arial',
        fill : 0x00008895,
        align : 'center',
        cacheAsBitmap: true,
    });
    controlSwitch.x = 640;
    controlSwitch.y =  430;
    controlSwitch.interactive = true;
    controlSwitch.buttonMode = true;
    controlSwitch.on("pointerup", switchControls); // openLevelSelect is a function reference 
    controlSwitch.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets 
    controlSwitch.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto 
    startScene.addChild(controlSwitch);

    scoreLabel = new PIXI.Text(`Score: ${score}`,{
        font : '18px Arial',
        fill : 0xFFFFFF,
        cacheAsBitmap: true,
    });
    // scoreLabel.style = textStyle;
    scoreLabel.x=10;
    scoreLabel.y=10;
    gameScene.addChild(scoreLabel);
    //increaseScore();

    
    //originally for animated sprite
    turtleRightTextures = loadTurtleRightSheet();
    turtleLeftTextures = loadTurtleLeftSheet();
    turtleFrontTextures = loadTurtleFrontSheet();

}

function switchControls(){
    //console.log("controls being switched");
    if(controls == "keyboard"){
        instructions.text = 'Use the mouse cursor to move. Use the left click to eat food.\n You will earn points for each food captured.\n\n But beware the trash in the ocean. Try not to mistakenly eat it.\n\nIf you would prefer to use the keyboard for movement click below.\n\n\n\nHit Enter to start.';
        controlSwitch.text = 'Controls: mouse';
        controls = "mouse"
    }
    else if(controls == "mouse"){
        instructions.text = 'Use the W, A, S, D keys to move. Use the Space key to eat food.\n You will earn points for each food captured.\n\n But beware the trash in the ocean. Try not to mistakenly eat it.\n\nIf you would prefer to use the mouse for movement click below.\n\n\n\nHit Enter to start.'
        controlSwitch.text = 'Controls: keyboard';
        controls = "keyboard"
    }
    //console.log(controls);
    
}

function startGame(){
    //keyboard movement with arrows. prevent going out of bounds
    if(controls == "keyboard"){
        document.addEventListener('keydown', function (e) //enter key works
        {           
            if (e.key == "w") 
            {
                turtle.texture = turtleFront;
                if(turtle.y>(0+turtle.height/2)){
                    turtle.speedY = -5;
                }else{
                    turtle.speedY = 0;
                } 
            }   
            if (e.key == "s")
            {
                turtle.texture = turtleFront;
                if(turtle.y<(sceneHeight-turtle.height/2)){
                    turtle.speedY = 5;
                }else{
                    turtle.speedY = 0;
                } 
            }  
            if (e.key == "d") 
            {
                turtle.texture = turtleRight;
                if(turtle.x<(sceneWidth-turtle.width/2)){
                    turtle.speedX = 5;
                }else{
                    turtle.speedX = 0;
                } 
            }
            if (e.key == "a") 
            {
                turtle.texture = turtleLeft;
                if(turtle.x>(0+turtle.width/2)){
                    turtle.speedX = -5;
                }else{
                    turtle.speedX = 0;
                } 
            } 
        });
        document.addEventListener('keyup', function (e) //when stop turtle stops
        {
            turtle.speedX = 0;
            turtle.speedY = 0;
        });

        document.addEventListener('keypress', function (e) //attempt to eat object
        {
            if (e.code == "Space") 
            {
                Eat();//may or may not be food
            }
        });
    }
    if(controls == "mouse"){
        app.view.onclick = Eat;//may or may not be food
    }
    
    
    


    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    score = 0;
    scoreLabel.text = `Score: ${score}`;
    loadLevel();

    

}

function increaseScore(){
    score+= 1;
    scoreLabel.text = `Score: ${score}`;
}

function gameLoop(){
	if (paused) return; 
	
	//Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    
    if(controls == "mouse"){
        //mouse movement (utelized original code)
        let mousePosition = app.renderer.plugins.interaction.mouse.global;
        let amt = 6 * dt; // at 60 FPS would move about 10% of distance per update
        // lerp (linear interpolate) the x & y values with lerp()
        let newX = lerp (turtle.x, mousePosition.x, amt);
        let newY = lerp(turtle.y, mousePosition.y, amt);
        // keep the turtle on the screen with clamp() in mouse mode
        let w2 = turtle.width/2;
        let h2 = turtle.height/2;
        turtle.x = clamp (newX, 0+w2, sceneWidth-w2);
        turtle.y = clamp (newY, 0+h2, sceneHeight-h2);
    }
    if(controls == "keyboard"){
        //speed set for smoother movement
        turtle.x+=turtle.speedX;
        turtle.y+=turtle.speedY;
    }
    
    //TurtleSwim()

    //Moves food and trash
    for(let f of food){
        f.move(dt);
        if(f.x <= f.radius||f.x>= sceneWidth-f.radius){
            f.reflectX();
            f.move(dt);
        }
        if(f.y <= f.radius||f.y>= sceneWidth-f.radius){
            f.reflectY();
            f.move(dt);
        }
    }
    for(let t of trash){
        t.move(dt);
        if(t.x <= t.radius||t.x>= sceneWidth-t.radius){
            t.reflectX();
            t.move(dt);
        }
        if(t.y <= t.radius||t.y>= sceneWidth-t.radius){
            t.reflectY();
            t.move(dt);
        }
    }

    //if touch die
    for(let t of trash){
        if (rectsIntersect(t,turtle)){
            gameScene.removeChild(t);
            end();
            
            
        }
    }

}

function Eat(){
    for(let f of food){
        //food eats
        if (rectsIntersect(f,turtle)){
            nomSound.play();//EAT SOUND------------------------------------------
            gameScene.removeChild(f);
            // f.isAlive = false;
            increaseScore();

            createFood(1);

            if(score%4 == 0){
                createTrash(1);
            }
        }
    }
}


function loadLevel(){
    startScene.visible = false;
    gameOverScene.visible = false;
	createFood(15);
    createTrash(3)
    paused = false;
}

function createFood(numFoods){//create FOODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
    for(let i=0;i<numFoods;i++){
        let f = new Food(10,0xFFFF00);
        f.x = Math.random()*(sceneWidth - 50) +25;
        f.y = Math.random()*(sceneHeight - 50) +25;
        food.push(f);
        gameScene.addChild(f);
    }
}
function createTrash(numFoods){//create trash
    for(let i=0;i<numFoods;i++){
        let t = new Trash(10,0xFFFF00);
        t.x = Math.random()*(sceneWidth - 50) +25;
        t.y = Math.random()*(sceneHeight - 50) +25;
        trash.push(t);
        gameScene.addChild(t);
    }
}

function end() {
    paused = true;
    startScene.visible = false;
    gameOverScene.visible = true;
    // gameScene.visible = false;

    let gameOverBackground = new PIXI.Graphics();
    gameOverBackground.beginFill(0x22222220);
    gameOverBackground.drawRect (0, 100, sceneWidth, sceneHeight-200);
    gameOverBackground.endFill();
    gameOverBackground.fillStyle = .5;
    gameOverScene.addChild(gameOverBackground);

    gameOverScoreLabel = new PIXI.Text(`  Your final score: ${score}`,{//\n\nWould you like to play again?
        font : '48px Arial',
        fill : 0xFFFFFF,
        align : 'center',
        cacheAsBitmap: true,
    });
    gameOverScoreLabel.x = sceneWidth/2-120;
    gameOverScoreLabel.y = sceneHeight/2-100;
    gameOverScene.addChild(gameOverScoreLabel);

    //let docLink = new

    //caused score problems
    // let playAgainYes = new PIXI.Text('Yes',{
    //     font : '48px Arial',
    //     fill : 0x2E8B57,
    //     align : 'center',
    //     cacheAsBitmap: true,
    // });
    // playAgainYes.x = 640;
    // playAgainYes.y =  400;
    // playAgainYes.interactive = true;
    // playAgainYes.buttonMode = true;
    // playAgainYes.on("pointerup", startGame); // openLevelSelect is a function reference 
    // playAgainYes.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets 
    // playAgainYes.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto 
    // gameOverScene.addChild(playAgainYes);

    paused = true;


    // clear out level
    food.forEach(c=>gameScene.removeChild(c)); // concise arrow function with no brackets and no return 
    food = [];
    trash.forEach(b=>gameScene.removeChild(b)); // ditto 
    trash = [];
    // explosions.forEach(e=>gameScene.removeChild(e)); // ditto 
    // explosions = [];
}



function loadTurtleRightSheet(){
    let spriteSheet = PIXI.BaseTexture.from("images/rightSheet.png");
    
    let width = 85;
    let height = 70;
    let numFrames = 3;
    let textures = [];
    for(let i = 0; i<numFrames;i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 0, width, height));
        textures.push(frame);
    }
    //console.log("sprites loading")
    return textures
}
function loadTurtleLeftSheet(){
    
    let spriteSheet = PIXI.BaseTexture.from("images/rightSheet.png");
    
    let width = 85;
    let height = 70;
    let numFrames = 3;
    let textures = [];
    for(let i = 0; i<numFrames;i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 0, width, height));
        textures.push(frame);
    }
    //console.log("sprites loading")
    return textures
}
function loadTurtleFrontSheet(){
    
    let spriteSheet = PIXI.BaseTexture.from("images/rightSheet.png");
    
    let width = 85;
    let height = 70;
    let numFrames = 3;
    let textures = [];
    for(let i = 0; i<numFrames;i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 0, width, height));
        textures.push(frame);
    }
    //console.log("sprites loading")
    return textures
}

// function TurtleSwim(){//------------------------------------------ANIMATION  
//     //let w2 = frameWidth / 2;
//     //let h2= frameHeight / 2;
//     let expl = new PIXI.AnimatedSprite(a);
//     expl.x = 50;//turtle.x// - w2; // we want the explosions to appear at the center of the circle
//     expl.y = 50;//turtle.y// - h2; // ditto
//     expl.animationSpeed = 1 / 7;
//     expl.loop= false;
//     expl.onComplete = e => gameScene.removeChild(expl);
//     turtleMove.push(expl)
//     gameScene.addChild(expl);
//     expl.play();
// }



//set turtle collider to only head.
//write collider with shark/enemy
//write on hit space check food and turtle head collider
