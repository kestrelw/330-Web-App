class Background extends PIXI.Sprite{
    constructor (x=0, y=0){
        super(app.loader.resources["images/background.jpg"].texture);
        this.scale.set(.65);
        this.x=x;
        this.y=y;
    }
}

class Food extends PIXI.Sprite{
    constructor (radius, color=0xFF0000, x=0, y=0){
        super(app.loader.resources["images/food.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(.08);
        this.x = x;
        this.y = y;
        this.radius = radius;
        // variables
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        // this.isAlive = true;
    }
    move (dt=1/60){ 
        this.x += this.fwd.x * this.speed * dt;
        this.y += this. fwd.y * this.speed* dt;
    }
    reflectX(){ 
        this.fwd.x *= -1;
    }
    reflectY(){ 
        this.fwd.y *= -1;
    }
}

class Trash extends PIXI.Sprite{
    constructor (radius, color=0xFF0000, x=0, y=0){
        super(app.loader.resources["images/trash.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(.09);
        this.x = x;
        this.y = y;
        this.radius = radius;
        // variables
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        // this.isAlive = true;
    }
    move (dt=1/60){ 
        this.x += this.fwd.x * this.speed * dt;
        this.y += this. fwd.y * this.speed* dt;
    }
    reflectX(){ 
        this.fwd.x *= -1;
    }
    reflectY(){ 
        this.fwd.y *= -1;
    }
}

class Turtle extends PIXI.Sprite{
    constructor (x=0, y=0){
        super(app.loader.resources["images/turtles/sprite_turtle_right_1.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(1);
        this.x=x;
        this.y=y;
        this.direction = 'right';
        this.speedX = 0;
        this.speedY = 0;
    }
}
