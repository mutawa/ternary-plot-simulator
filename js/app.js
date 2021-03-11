let v1, v2, v3, b;
const radius = 400;
let ternary;
let center;
const points = [];
function setup()
{
    createCanvas(900,900);
    angleMode(DEGREES);

    ternary = new Ternary(3);
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
    rotate(150);
    stroke("gold");
    circle(0,0, radius);
    ternary.show();
    //ternary.axes[0].plot(map(mouseX,0,width,0,100));
    //ternary.axes[1].plot(map(mouseX,0,width,0,1));
    //ternary.axes[2].plot(map(mouseX,0,width,0,1));
}
function mousePressed()
{
    const r = 13;
    const b = 25;
    const g = 8;

    //ternary.plot(r,g,b);

    

    
}
const colors = ["red", "blue", "green"];
let k = 0;
class Ternary
{
    constructor(n)
    {
        this.n = n;
        this.axes = [];
        for(let i=0; i<n; i++) {
            const angle1 = 360/n * i;
            const angle2 = angle1 + 360/n;

            const x1 = cos(angle1) * radius/2;
            const y1 = sin(angle1) * radius/2;

            const x2 = cos(angle2) * radius/2;
            const y2 = sin(angle2) * radius/2;
          
            const axis = new Axis(x1, y1, x2, y2, colors[k], 30);
            k++;
            this.axes.push(axis);
        }
        
    }

    plot(a,b,c)
    {
        const total = Number(a)+Number(b)+Number(c);
        const l1 = this.axes[0].get(100 * a/total);
        const l2 = this.axes[1].get(100 * b/total);
        const l3 = this.axes[2].get(100 * c/total );
        
        const nt = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
        points.push(nt);
        //console.log(nt);
    }

    show() {
        for(let a in this.axes) {  this.axes[a].show(); }
        for(let p of points) { circle(p.x, p.y, 4); }
    }
}

class Axis
{
    constructor(x1,y1,x2,y2,c,r)
    {
        this.base = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.line = p5.Vector.sub(this.end, this.base);
        this.c = c;
        this.r = r;

    }

    show()
    {
        stroke(this.c);
        //line(0,0, this.base.x, this.base.y);
        //line(0,0, this.end.x, this.end.y);

        
        //noFill();
        //circle(this.base.x, this.base.y, 10);
        //fill(this.c);
        
        //circle(this.end.x, this.end.y, 10);
        //drawArrow(this.base, this.end,  "gold");
        drawArrow(this.base, this.line, this.c);

        for(let i=10; i<=100 ; i += 10)
        {
           this.plot(i);
        }
        
    }


    plot = pct => {
        
        
        drawArrow(this.base, this.line, this.c);
        const val = this.line.copy();
        val.mult(pct/100);
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
        c.setAlpha(30);
        
        //t.rotate(map(pct,0,1,200,330));
        noStroke();
        fill(this.c);
        drawArrow(t, valp, c, false);
        t.mult(1.0);

        push();
        translate(t.x, t.y);
        rotate(valp.heading() + this.r );
        text(pct, 
            -15 , 
            5 );
        pop();
        //line(0,0,t.x,t.y);

        /*
        stroke("purple");
        line(0,0,val.x,val.y);
        stroke("magenta")
        line(0,0,valp.x,valp.y);
        stroke("cyan");
        line(val.x,val.y, valp.x, valp.y);
        */
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

function drawArrow(base, vec, myColor, withPoint = true) {
    push();
    stroke(myColor);
    strokeWeight(2);
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