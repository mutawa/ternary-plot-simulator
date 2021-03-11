let v1, v2, v3, b1;
let r = 600;
const axes = [];

const series = [
    {color:'red', name:'C2H2', showGrid: true, showName: true, showArrow: true, showTicks: true},
    {color:'green', name:'C2H6', showGrid: true, showName: true, showArrow: true, showTicks: true},
    {color:'blue', name:'H2S', showGrid: true, showName: true, showArrow: true, reverseText: true, showTicks:true}
];

function setup() {
    createCanvas(900, 900);
    v1 = createInput('');
    v2 = createInput('');
    v3 = createInput('');
    b1 = createButton("go");
    b1.mousePressed(graph);
    let i = 0;
    for(let a=0 - PI/2 ; a<TWO_PI - PI/2 ; a += TWO_PI /3 ) {
        const s = series[i];
        const x = width/2 + r/2 * cos(a);
        const y = height/2 + r/2 * sin(a);
        axes.push(new Axis(s, x, y, a , r ));
        i++;
    }
    
}
function mouseMoved()
{
    const l1 = axes[0].plot(map(mouseX, 0, width, 0, 100));
    stroke(0);
    strokeWeight(2);
    const x1 = l1.x1 ;
    const y1 = l1.y1 ;
    const x2 = l1.x2 ;
    const y2 = l1.y2 ;

    line(x1, y1, x2, y2);
    console.log({x1, y1, x2, y2});
    
}

function graph() {
    const vl1 = Number(v1.value());
    const vl2 = Number(v2.value());
    const vl3 = Number(v3.value());

    
    const total = vl1 + vl2 + vl3;
    const vp1 = 100 * vl1 / total;
    const vp2 = 100 * vl2 / total;
    const vp3 = 100 * vl3 / total;

    console.log( {vl1, vl2, vl3, total, vp1, vp2, vp3});
        
    
}

function draw() {
    //background(255);
    stroke(255,150);
    fill(255,10);
    //scale(1.2);
    for(axis of axes)
    {
        axis.show();
    }
    //circle(width/2,height/2,r);

}

class Axis {
    constructor(s,x,y,a,m) {
        this.s = s;
        this.x = x;
        this.y = y;
        this.a = a;
        this.m = m;
        
        this.a1 = 5*PI/6;
        this.a2 = 5*PI/6 + (2*PI/6);
        this.r = this.m*1.732 /2 ;
        this.drawn = false;
    }

    show() {
        if(!this.drawn) {
            push();
            translate(this.x, this.y);
            rotate(this.a);

            this.showName();
            this.showGrid();
            this.showArrow();
            this.showTicks();
            this.showBounds();
            
            pop();

            this.drawn = true;
        }
        

    }

    plot = pct => {
        const x1 = this.x + cos(this.a1) * this.r * pct/100;
        const y1 = this.y + sin(this.a1) * this.r * pct/100;

        const x2 = this.x + cos(this.a2) * this.r * pct/100;
        const y2 = this.y + sin(this.a2) * this.r * pct/100;
        
        return ({x1,y1,x2,y2});
        
        
        

    }

    showArrow = () => {
        if(this.s.showArrow)
        {
            const c = color(this.s.color);
            c.setAlpha(100);
            stroke(c);
            fill(this.s.color);
            const a = -4.65*PI/6;
            const x1 =  cos(a) * this.r * .7;
            const y1 =  sin(a) * this.r * .7;

            const x2 =  cos(a + PI * .17 ) * this.r * .2;
            const y2 =  sin(a + PI * .17) * this.r * .2;

            line(x1,y1,x2,y2);

            beginShape();
            vertex(x2,y2);
            vertex(x2-14,y2-18);
            vertex(x2-22,y2-2);
            
            endShape(CLOSE);
            noStroke();
            push();
            textSize(20);
            textAlign(CENTER);
            translate((x1+x2)/2, (y2+y1)/2);
            rotate(PI/6);
            let y = -10;
            if(this.s.reverseText) { 
                rotate(PI);
                y += 30;
            }
            text("percent " + this.s.name, 0 , y);
            pop();
        }
    }

    showGrid = () => {
        if(this.s.showGrid)
        {

            for(let i=0; i<=1 ; i+= 0.1)
            {
                const w = ((i > 0.9) ? 4 : 1);
                const h = ((i > 0.9) ? 100 : 150);
                const c = i > 0.9 ? color(0) : color(this.s.color);
                c.setAlpha(h);
                strokeWeight( w); 
                stroke(c);
                const x1 = cos(this.a1) * this.r * i;
                const y1 = sin(this.a1) * this.r * i;
                const x2 = cos(this.a2) * this.r * i;
                const y2 = sin(this.a2) * this.r * i;
    
                line(x1,y1,x2,y2);
            }
        }
    }

    showBounds = () => {

        stroke(0);
        strokeWeight(2);
        const x1 = cos(this.a1) * this.r ;
        const y1 = sin(this.a1) * this.r ;
        const x2 = cos(this.a2) * this.r ;
        const y2 = sin(this.a2) * this.r ;

        line(x1,y1,x2,y2);

    }

    showName = () => {
        if(this.s.showName) {

            push();
            fill(0);
            translate(50,0);
            rotate(-this.a);
            textAlign(CENTER);
            textSize(30);
            text(this.s.name,0,0);
            pop();
        }
    }

    showTicks = () => {
        if(this.s.showTicks)
        {
            stroke(this.s.color);
            strokeWeight(1);
            for(let i=0; i<100 ; i+= 10)
            {
                
                const x1 = cos(this.a2) * this.r * i/100;
                const y1 = sin(this.a2) * this.r * i/100;
                const x2 = x1 + 10;
                const y2 = y1 - 15;
                stroke(this.s.color);
                line(x1,y1,x2,y2);
                noStroke();
                if(this.s.reverseText) {
                    push();
                    translate(x2,y2);
                    rotate(PI);
                    text(floor(100 - i), -10,10);
                    pop();
                } else {
                    text(floor(100 - i), x2,y2);
                }
                
            }
        }

    }
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