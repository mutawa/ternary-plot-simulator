let v1, v2, v3, b;
const radius = 600;
let ternary;
let center;
const points = [];

let areas = [];

const plotData = {
    arrowsColor:"black",
    arrowStrokeWeight: 4,
    gridHue: 10,
    gridLineWeight: 1.5,
    areas: [
            {name:"PD", nameOffset: {x:0, y:-10}, color: "darkgreen", coordinates:[[0.98, 0.02, 0],[1,0,0],[0.98,0,0.02]]},
            {name: "T1", nameOffset: {x:-5, y:0}, color:"blue", coordinates:[[0.76, 0.2, 0.04], [0.8, 0.2, 0], [0.98, 0.02,0],[0.98,0,0.02],[0.96,0,0.04]]},
            {name:"D1", nameOffset: {x:0, y:0},   color: "red", coordinates:[[0,0,1], [0,0.23,0.77],[0.64,0.23,0.13],[0.87,0,0.13]]},
            {name:"D2", nameOffset: {x:0, y:-10},   color: "green", coordinates:[[0,0.23,.77], [0,0.71,0.29],[0.31,0.4,0.29],[0.47,0.4,0.13],[0.64, 0.23, 0.13]]},
            {name:"DT", nameOffset: {x:5, y:0},   color: "gold", coordinates:[[0,0.71,0.29], [0,0.85,0.15],[0.35, 0.5, 0.15],[0.46,0.5,0.04],[0.96,0,0.04],[0.87,0,0.13],[0.47,0.4,0.13],[0.31,0.4,0.29]]},

            
        ],
    series:[
    {color: "red", name:"C2H6", nameSize: 25, showArrow: true, arrowText: "percent C2H6 %", arrowTextSize: 15, arrowTextRotation: 0, labelRotation: 0, labelSize:10},
    {color: "blue", name:"H2O", nameSize: 25, showArrow: true, arrowText: "percent Water %", arrowTextSize: 15, arrowTextRotation: 180, labelRotation: 0, labelSize: 10},
    {color: "green", name:"NaCL", nameSize: 25, showArrow: true, arrowText: "percent NaCl %", arrowTextSize: 15, arrowTextRotation: 0, labelRotation: 180, labelSize: 10}
]};

function setup()
{
    createCanvas(900,900);
    angleMode(DEGREES);

    ternary = new Ternary(plotData);
    center = createVector(0,0);
    textAlign(CENTER);
    v1 = createInput();
    v2 = createInput();
    v3 = createInput();
    b = createButton('submit');
    
    b.mousePressed(function(){
        ternary.plot(v1.value(), v2.value(), v3.value());

    });
    
    plotData.areas.forEach(a => {
        a.points = [];
        a.coordinates.forEach(p => {
            a.points.push(ternary.plot(p[0], p[1], p[2]));
        });
        a.centeroid = get_polygon_centroid(a.points);
    });

}

function draw()
{
    background(255);

    fill("whitesmoke");
    translate(width/2, height/2);
    rotate(0);
    
    ternary.show();
    
}
function mousePressed()
{

    //points.push({x:mouseX - width/2, y:mouseY-height/2});

}


class Ternary
{
    constructor(data)
    {
        const n = data.series.length;
        let k = 0;
        this.n = n;
        this.axes = [];
        for(let i=0; i<n; i++) {
            const angle1 = 360/n * i - 90;
            const angle2 = angle1 + 360/n;

            const x1 = cos(angle1) * radius/2;
            const y1 = sin(angle1) * radius/2;

            const x2 = cos(angle2) * radius/2;
            const y2 = sin(angle2) * radius/2;
            data.series[k].angle1 = angle1;
            data.series[k].angle2 = angle2;

            const axis = new Axis(data.series[k], x1, y1, x2, y2);
            k++;
            this.axes.push(axis);
        }
        
    }

    plot(a,b,c)
    {
        
        const values = [];
        const lines = [];

        for(let i=0; i<arguments.length; i++) { values.push( Number(arguments[i]));  }
        const total = values.reduce((x,r)=>r+=x, 0);
        const numOfZeros = values.filter(x => x===0).length;

        
        if(total>0) {
            for(let i=0; i<this.axes.length; i++) {
                const v = Number(arguments[i]);
                lines.push(this.axes[(i+2)%this.axes.length].get(100 * v/total));
            }

            if(numOfZeros===2) 
            {
                
                let pointAdded = false;
                lines.forEach(l=>{
                    if(l.x1 === l.x2 && l.y1 === l.y2 && !pointAdded ) { points.push({x:l.x1, y:l.y1}); pointAdded = true;  }
                });
    
            }
            else {
                let added = false;

                for(let i=0; i<lines.length-1; i++) 
                {
                    const l1 = lines[i];
                    const l2 = lines[i+1];
                    const p = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
                    if(p !== null) {
                        
                        points.push(p);
                        added = true;
                        break;
                    } else {
                        
                        if((l1.x1 === l2.x2 && l1.y1 === l2.y2)) { points.push({x: l1.x1, y: l1.y1}); added = true; break; } 
                        else if(l1.x2 === l2.x1 && l1.y2 === l2.y1) { points.push({x: l1.x2, y: l1.y2}); added = true; break; }
                    }
                }
                if(!added) {
                    const l1 = lines[0];
                    const l2 = lines[2];
                    const p = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
                    if(p !== null) {
                        points.push(p);
                    } else {
                        
                        if((l1.x1 === l2.x2 && l1.y1 === l2.y2)) { points.push({x: l1.x1, y: l1.y1}); added = true;  } 
                        else if(l1.x2 === l2.x1 && l1.y2 === l2.y1) { points.push({x: l1.x2, y: l1.y2}); added = true;  }
                    }
                }
                
            }
            return points.splice(0,1)[0];
            
        }
        
        //console.log(nt);
    }

    show() {
        for(let a in this.axes) {  this.axes[a].show(); }


        plotData.areas.forEach(a => {
            stroke(0,100);
            const c = color(a.color);
            c.setAlpha(50);
            fill(c);
            textAlign(CENTER,BOTTOM);
            beginShape();
            for(let p of a.points) { if(p) {  vertex(p.x, p.y);} }
            endShape();
            fill(0);
            textSize(15);
            text(a.name, a.centeroid.x + (a.nameOffset ? a.nameOffset.x : 0), a.centeroid.y + (a.nameOffset ? a.nameOffset.y : 0));
        });
        

        
    }
}

class Axis
{
    constructor(data, x1,y1,x2,y2)
    {
        this.data = data;
        this.base = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.line = p5.Vector.sub(this.end, this.base);
        this.c = data.color;
        this.labelRotation = data.labelRotation;

    }

    show()
    {
        stroke(this.c);
        
        drawArrow(this.base, this.line, plotData.arrowsColor === "series" ? this.data.color : plotData.arrowsColor, false);

        for(let i=10; i<=100 ; i += 10)
        {
           this.plot(i);
        
        }

        //const arrow = this.line.copy();
        //arrow.mult(0.5);
        stroke(this.data.color);
        
        const arrowStart = this.base.copy().mult(0.5).rotate(120);
        arrowStart.add(this.base);
        const arrowEnd = this.line.copy().mult(0.5);
        drawArrow( arrowStart, arrowEnd, this.data.color);
        arrowEnd.rotate(-90);
        push();
        translate(arrowEnd.x, arrowEnd.y);
        rotate(arrowEnd.heading() + 90 + this.data.arrowTextRotation );
        textSize(this.data.arrowTextSize);
        text(this.data.arrowText, 0,0);
        pop();

        noStroke();
        const name = this.end.copy().mult(1.15);
        textSize(this.data.nameSize);
        text(this.data.name,name.x, name.y);
        
    }


    plot = pct => {
        
        
        //drawArrow(this.base, this.line, this.c, true, plotData.arrowStrokeWeight);
        const val = this.line.copy();
        val.mult(pct/100);

        const tick = this.base.copy();
        tick.rotate(30).mult(0.2);

        push();
        textAlign(CENTER,CENTER);
        translate(val.x + this.base.x, val.y + this.base.y);
        const c2 = color(this.data.color);
        c2.setAlpha(50);
        stroke(c2);
        const textX = tick.x;
        const textY = tick.y;
        tick.mult(0.7);
        
        line(0,0,tick.x, tick.y);
        translate(textX, textY );
        rotate(tick.heading()+ this.data.labelRotation);
        noStroke();
        fill(this.data.color);
        textSize(this.data.labelSize);
        text(pct, 0,0);
        //text(pct, 0,0);
        //console.log(tick.x, tick.y);
        pop();
        //const tick = val.copy().mult(0.1);
        
        //tick.rotate(270);
        //line(val.x,val.y,tick.x,tick.y);

        //drawArrow(this.base, val, "orange");
        //drawArrow(center, val, "darkseagreen");
        
        const valp = val.copy();
        valp.setMag(this.line.mag() - val.mag());
        valp.rotate(60);
        
        //drawArrow(this.end, valp, "black");

        //valp.setMag( 50 );
        const t = p5.Vector.add(val, this.base);
        //stroke("cyan");
        //line(0,0,t.x,t.y);
        //line(0,0,valp.x,valp.y);
        const c = color(this.c);
        c.setAlpha(plotData.gridHue);
        
        //t.rotate(map(pct,0,1,200,330));
        noStroke();
        fill(this.c);
        drawArrow(t, valp, c, false, plotData.gridLineWeight);

        
        

        
        

        
    }

    get = pct => {
        
        const val = this.line.copy();
        val.mult( pct/100 );
        //stroke(this.data.color);
        //strokeWeight(5);
    
        
        
        const valp = val.copy();
        valp.setMag(this.line.mag() - val.mag() );
        valp.rotate(60);
        const t = p5.Vector.add(val, this.base);
        const x1 = round(this.base.x + val.x ,4) || 0;
        const y1 = round(this.base.y + val.y ,4) || 0;
        const x2 = round(t.x + valp.x,4) || 0;
        const y2 = round(t.y + valp.y,4) || 0;

        line(this.base.x + val.x  , this.base.y + val.y     , t.x+valp.x, t.y+valp.y);

        
        return {x1, y1,  x2, y2, c: this.data.color};
        
        
    }
}

function drawArrow(base, vec, myColor, withPoint = true, weight = 2) {
    push();
    stroke(myColor);
    strokeWeight(weight);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    if(withPoint) {

        rotate(vec.heading());
        let arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        //stroke(0);
        //circle(arrowSize,0,3);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    }
    pop();
  }


  
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}

function get_polygon_centroid(pts) {
    
    var first = pts[0], last = pts[pts.length-1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    var twicearea=0,
    x=0, y=0,
    nPts = pts.length,
    p1, p2, f;
    for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
       p1 = pts[i]; p2 = pts[j];
       f = p1.x*p2.y - p2.x*p1.y;
       twicearea += f;          
       x += ( p1.x + p2.x ) * f;
       y += ( p1.y + p2.y ) * f;
    }
    f = twicearea * 3;
    return { x:x/f, y:y/f };
 }