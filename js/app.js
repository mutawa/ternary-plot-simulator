let v1, v2, v3;
let r = 600;
const axes = [];
const colors = ['red' , 'gold', 'green'];
function setup() {
    createCanvas(900, 900);
    v1 = createInput('');
    v2 = createInput('');
    v3 = createInput('');
    let i = 0;
    for(let a=0 - PI/2 ; a<TWO_PI - PI/2 ; a += TWO_PI /3 ) {
        const x = width/2 + r/2 * cos(a);
        const y = height/2 + r/2 * sin(a);
        axes.push(new Axis(colors[i], x, y, a , r , colors[i]));
        i++;
    }
    
    

    
}

function draw() {
    background(52);
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
    constructor(n,x,y,a,m,c) {
        this.n = n;
        this.x = x;
        this.y = y;
        this.a = a;
        this.m = m;
        this.c = c;
        this.a1 = 5*PI/6;
        this.a2 = 5*PI/6 + (2*PI/6);
        this.r = this.m*1.732 /2 ;
    }

    show() {
        push();
        translate(this.x, this.y);
        rotate(this.a);
        stroke(this.c);
        circle(0,0,10);
        //noFill();
        

        for(let i=0; i<=1 ; i+= 0.1)
        {
            strokeWeight( ((i > 0.9) ? 7 : 1)); 
            const x1 = cos(this.a1) * this.r * i;
            const y1 = sin(this.a1) * this.r * i;
            const x2 = cos(this.a2) * this.r * i;
            const y2 = sin(this.a2) * this.r * i;

            line(x1,y1,x2,y2);
        }

        
        //fill(this.c);
        
        //circle(0,0,this.m*1.732);
        
        pop();

    }
}