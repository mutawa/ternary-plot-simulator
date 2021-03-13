let v1, v2, v3, b;
const radius = 400;
let ternary;
let center;
const points = [];

const plotData = {
    arrowsColor:"black",
    arrowStrokeWeight: 4,
    gridHue: 100,
    gridLineWeight: 1,
    
    series:[
    {color: "red", name:"C2H6", nameSize: 25, showArrow: true, arrowText: "percent C2H6 %", arrowTextSize: 20, arrowTextRotation: 0, labelRotation: 0, labelSize:10},
    {color: "blue", name:"H2O", nameSize: 25, showArrow: true, arrowText: "percent Water %", arrowTextSize: 20, arrowTextRotation: 180, labelRotation: 0, labelSize: 10},
    {color: "green", name:"NaCL", nameSize: 25, showArrow: true, arrowText: "percent NaCl %", arrowTextSize: 20, arrowTextRotation: 0, labelRotation: 180, labelSize: 10}
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
    b = createButton();
    b.mousePressed(function(){
        ternary.plot(v1.value(), v2.value(), v3.value());

    });

}

function draw()
{
    background(255);

    fill("whitesmoke");
    translate(width/2, height/2);
    rotate(0);
    stroke("gold");
    circle(0,0, radius);
    ternary.show();
    //ternary.axes[0].plot(map(mouseX,0,width,0,100));
    //ternary.axes[1].plot(map(mouseX,0,width,0,1));
    //ternary.axes[2].plot(map(mouseX,0,width,0,1));
}
function mousePressed()
{

    points.push({x:mouseX - width/2, y:mouseY-height/2});

    

    
}

let k = 0;
class Ternary
{
    constructor(data)
    {
        const n = data.series.length;
        this.n = n;
        this.axes = [];
        for(let i=0; i<n; i++) {
            const angle1 = 360/n * i - 90;
            const angle2 = angle1 + 360/n;

            const x1 = cos(angle1) * radius/2;
            const y1 = sin(angle1) * radius/2;

            const x2 = cos(angle2) * radius/2;
            const y2 = sin(angle2) * radius/2;
          
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


        console.log({numOfZeros});

        
        if(total>0) {
            for(let i=0; i<this.axes.length; i++) {
                const v = Number(arguments[i]);
                lines.push(this.axes[i].get(100 * v/total));
            }

            if(numOfZeros===2) 
            {
                
                let pointAdded = false;
                lines.forEach(l=>{
                    if(l.x1 === l.x2 && l.y1 === l.y2 && !pointAdded ) { points.push({x:l.x1, y:l.y1}); pointAdded = true;  }
                });
    
            }
            else {
                console.log(lines);
                for(let i=0; i<lines.length-1; i++) 
                {
                    const l1 = lines[i];
                    const l2 = lines[i+1];
                    const p = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
                    if(p !== null) {
                        
                        points.push(p);
                        break;
                    }
                }
            }
            
           

            
        }
        
        //console.log(nt);
    }

    show() {
        for(let a in this.axes) {  this.axes[a].show(); }
        for(let p of points) { if(p) circle(p.x, p.y, 9); }
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
        val.mult( pct/100);
        const valp = val.copy();
        valp.setMag(this.line.mag() - val.mag());
        valp.rotate(60);
        
        //drawArrow(this.end, valp, "black");

        //valp.setMag( 50 );
        const t = p5.Vector.add(val, this.base);
        //noLoop();
        stroke(0, 7);
        //circle(t.x, t.y, 20);
        
        //circle(t.x+valp.x, valp.y+t.y, 20);
        line(t.x, t.y, t.x + valp.x, t.y + valp.y);

        return {x1: t.x, y1: t.y, x2: t.x + valp.x , y2: t.y + valp.y};
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