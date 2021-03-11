let v1, v2, v3;
let r = 600;
const axes = [];

const series = [
    {color:'red', name:'C2H2', showName: true, showArrow: true, showTicks: true},
    {color:'green', name:'C2H6', showName: true, showArrow: true},
    {color:'blue', name:'H2S', showName: true, showArrow: true, reverseText: true}
];

function setup() {
    createCanvas(900, 900);
    v1 = createInput('');
    v2 = createInput('');
    v3 = createInput('');
    let i = 0;
    for(let a=0 - PI/2 ; a<TWO_PI - PI/2 ; a += TWO_PI /3 ) {
        const s = series[i];
        const x = width/2 + r/2 * cos(a);
        const y = height/2 + r/2 * sin(a);
        axes.push(new Axis(s, x, y, a , r ));
        i++;
    }
    
    

    
}

function draw() {
    background(255);
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
    }

    show() {
        push();
        translate(this.x, this.y);
        rotate(this.a);
        
        this.showName();
        this.showGrid();
        this.showArrow();
        
        pop();

    }

    showArrow = () => {
        if(this.s.showArrow)
        {
            //stroke(0);
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
            //vertex(x2-15,y2+5);
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
        for(let i=0; i<=1 ; i+= 0.1)
        {
            const w = ((i > 0.9) ? 4 : 1);
            const h = ((i > 0.9) ? 100 : 150);
            const c = color(this.s.color);
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
}