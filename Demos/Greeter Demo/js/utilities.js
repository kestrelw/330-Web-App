	// http://paulbourke.net/miscellaneous/interpolation/
	
	// we use this to interpolate the ship towards the mouse position
	function lerp(start, end, amt){
  		return start * (1-amt) + amt * end;
	}
	
	//keeps the turtle in mouse mode on the screen
	function clamp(val, min, max){
        return val < min ? min : (val > max ? max : val);
    }
    
    // bounding box collision detection - it compares PIXI.Rectangles
	function rectsIntersect(a,b){
		var ab = a.getBounds();
		var bb = b.getBounds();
		return ab.x + ab.width > bb.x+bb.width/2 && ab.x < bb.x + bb.width/2 && ab.y + ab.height > bb.y+bb.height/2 && ab.y < bb.y + bb.height/2;
		//trash.x + trash.width > turtle.x //past turtle x
		//trash.x < turtle.x + turtle.width // in turtle x
		//trash.y + trash.height > turtle.y //past turtle y
		//trash.y < turtle.y + turtle.height;//in turtle y
	}
	
	// these 2 helpers are used by classes.js
	function getRandomUnitVector(){
		let x = getRandom(-1,1);
		let y = getRandom(-1,1);
		let length = Math.sqrt(x*x + y*y);
		if(length == 0){ // very unlikely
			x=1; // point right
			y=0;
			length = 1;
		} else{
			x /= length;
			y /= length;
		}
	
		return {x:x, y:y};
	}

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}