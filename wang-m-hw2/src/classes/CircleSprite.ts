import * as utils from '../utils';
import * as canvas from '../canvas';

export default class CircleSprites{
    static type = "arc"; // demoing a static (class) variable here

    private x: number;
    private y: number;
    private range: number;
    private radius: number;
    private startAngle: number;
    private endAngle: number;
    private xDraw: number;
    private yDraw: number;
    private color: any;
    




    constructor(x: number, y: number, range: number){
        this.x = x;
        this.y = y;
        this.range = range;
        //this.color = `rgb(${0}, ${0-128}, ${255-0})`;;
        this.radius = utils.getRandom(2, 6);
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
    }
    
    update(){
        this.xDraw = utils.getRandom(this.x-this.range/2, this.x+this.range/2);
        this.yDraw = utils.getRandom(this.y-this.range/2, this.y+this.range/2);
        this.radius = utils.getRandom(2, 6);

    }
    
    draw(ctx: CanvasRenderingContext2D){
        canvas.drawArc(ctx, this.xDraw, this.yDraw, this.radius, this.color, this.startAngle, String(this.endAngle));

    }
}

//export {CircleSprites};