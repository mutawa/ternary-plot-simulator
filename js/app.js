"use strict";
let v1, v2, v3, b;
const radius = 500;
let ternary;
const funcs = [star, tri];
const points = [];

let areas = [];

const plotData = {
    arrowsColor: "rgba(0,0,0,0.1)",
    arrowStrokeWeight: 4,
    gridHue: 10,
    gridLineWeight: 1.5,
    areas: [
            {name:"PD", nameOffset: {x:0, y:-10}, color: "darkgreen", coordinates:[[0.98, 0.02, 0],[1,0,0],[0.98,0,0.02]]},
            {name: "T1", nameOffset: {x:-5, y:0}, color:"blue", coordinates:[[0.76, 0.2, 0.04], [0.8, 0.2, 0], [0.98, 0.02,0],[0.98,0,0.02],[0.96,0,0.04]]},
            {name: "T2", nameOffset: {x:-5, y:0}, color:"cyan", coordinates:[[0.46, 0.5, 0.04],[0.5,0.5,0],[0.8,0.2,0],[0.76,0.2,0.04]]},
            {name: "T3", nameOffset: {x:-5, y:0}, color:"steelblue", coordinates:[[0,0.85,0.15],[0,1,0],[0.5,0.5,0],[0.35,0.5,.15]]},

            {name:"D1", nameOffset: {x:0, y:0},   color: "red", coordinates:[[0,0,1], [0,0.23,0.77],[0.64,0.23,0.13],[0.87,0,0.13]]},
            {name:"D2", nameOffset: {x:0, y:-10},   color: "green", coordinates:[[0,0.23,.77], [0,0.71,0.29],[0.31,0.4,0.29],[0.47,0.4,0.13],[0.64, 0.23, 0.13]]},
            {name:"DT", nameOffset: {x:5, y:0},   color: "gold", coordinates:[[0,0.71,0.29], [0,0.85,0.15],[0.35, 0.5, 0.15],[0.46,0.5,0.04],[0.96,0,0.04],[0.87,0,0.13],[0.47,0.4,0.13],[0.31,0.4,0.29]]},

            
        ],
    series:[
    {color: "red", name:"C2H4", nameSize: 25, showArrow: true, arrowText: "percent C2H4 %", arrowTextSize: 15, arrowTextRotation: 0, labelRotation: 0, labelSize:15, tickStepSize: 20},
    {color: "blue", name:"C2H2", nameSize: 25, showArrow: true, arrowText: "percent C2H2 %", arrowTextSize: 15, arrowTextRotation: 180, labelRotation: 0, labelSize: 15, tickStepSize: 20},
    {color: "green", name:"CH4", nameSize: 25, showArrow: true, arrowText: "percent CH4 %", arrowTextSize: 15, arrowTextRotation: 0, labelRotation: 180, labelSize: 15, tickStepSize: 20}
]};



function setup()
{
    createCanvas(500,600);
    angleMode(DEGREES);

    
    
    textAlign(CENTER);
    v3 = select("#c2h2");
    v1 = select("#ch4");
    v2 = select("#c2h4");
    
    b = select('#submit');
    
    b.mousePressed(plot_data);
    
    translate(width/2, height/2);
    ternary = new Ternary(plotData);
    ternary.show();

    noLoop();

}

function plot_data(){
    let classification = "";

    const p = ternary.plot(v1.value(), v2.value(), v3.value());
    const fn = random(funcs);
    
    
    plotData.areas.forEach(a => {
        if( relationPP(p, a.points) >= 0) {
            classification = a.name;
            return;
        }
    });
    fn(p,"red");
    addData(classification, fn , p,"red");

}

let cnt = 0;
function addData(c,fn, p, color) {
    cnt++;
    var newRow = document.createElement("tr");
    var newCell1 = document.createElement("td");
    var newCell2 = document.createElement("td");
    var newCell3 = document.createElement("td");
    var newCell4 = document.createElement("td");
    var newCell5 = document.createElement("td");
    var cnv = document.createElement("canvas");
    
    cnv.width = 20;
    cnv.height = 20;
    //cnv.style.border = "1px solid black";

    newCell1.innerHTML = document.getElementById("c2h2").value;
    newCell2.innerHTML = document.getElementById("ch4").value;
    newCell3.innerHTML = document.getElementById("c2h4").value;
    newCell4.innerHTML = c;
    newCell5.appendChild(cnv);
    var ctx = cnv.getContext("2d");
    fn(p,color,ctx);
    
    
    newRow.append(newCell1);
    newRow.append(newCell2);
    newRow.append(newCell3);
    newRow.append(newCell4);
    newRow.append(newCell5);
    document.getElementById("rows").appendChild(newRow);
    
}

function mousePressed()
{
    const p = {x:mouseX - width/2, y:mouseY-height/2};
    //return;

    tri(p, "red");
    plotData.areas.forEach(a => {
        if( relationPP(p, a.points) >= 0) {
            console.log(a.name);
            //return;
        }
        
    });

}


class Ternary
{
    constructor(data)
    {
        this.data = data;
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

        this.calculateAreas();
        
    }

    calculateAreas()
    {
        this.data.areas.forEach(a => {
            a.points = [];
            a.coordinates.forEach(p => {
                a.points.push(this.plot(p[0], p[1], p[2]));
            });
            a.centeroid = get_polygon_centroid(a.points);
        });
    
    }
    plot()
    {
        
        const values = [];
        const lines = [];
        let point;

        for(let i=0; i<arguments.length; i++) { values.push( Number(arguments[i]));  }
        const total = values.reduce((x,r)=>r+=x, 0);
        const numOfZeros = values.filter(x => x===0).length;
    
        
        if(total>0) {
            for(let i=0; i<this.axes.length; i++) {
                const v = values[i];
                lines.push(this.axes[(i+2)%this.axes.length].getLineAtValue(100 * v/total));
            }

            if(numOfZeros===2) 
            {
                
                let pointAdded = false;
                const l1 = lines[0];
                const l2 = lines[1];
                const l3 = lines[2];
                if(         (l1.x1 === l1.x2 && l1.y1 === l1.y2 ) 
                        ||  (l2.x1 === l2.x2 && l2.y1 === l2.y2 ) 
                        ||  (l3.x1 === l3.x2 && l3.y1 === l3.y2 ))
                {
                    if(l1.x1 === l2.x1) { point = {x:l1.x1,  y: l1.y1}; }
                    else if(l2.x1 == l3.x1) { point = {x:l2.x1,  y: l2.y1};}
                    else if(l3.x1 == l1.x1) { point = {x:l3.x1,  y: l3.y1};}

                }
                
    
            }
            else {
                let added = false;

                for(let i=0; i<lines.length-1; i++) 
                {
                    const l1 = lines[i];
                    const l2 = lines[i+1];
                    const p = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
                    if(p !== null) {
                        
                        point = p;
                        added = true;
                        break;
                    } else {
                        
                        if((l1.x1 === l2.x2 && l1.y1 === l2.y2)) { point = {x: l1.x1, y: l1.y1}; added = true; break; } 
                        else if(l1.x2 === l2.x1 && l1.y2 === l2.y1) { point  = {x: l1.x2, y: l1.y2}; added = true; break; }
                    }
                }
                if(!added) {
                    const l1 = lines[0];
                    const l2 = lines[2];
                    const p = line_intersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
                    if(p !== null) {
                        point = p;
                    } else {
                        
                        if((l1.x1 === l2.x2 && l1.y1 === l2.y2)) { point = {x: l1.x1, y: l1.y1}; added = true;  } 
                        else if(l1.x2 === l2.x1 && l1.y2 === l2.y1) { point = {x: l1.x2, y: l1.y2}; added = true;  }
                    }
                }
                
            }
            return point;
            
        }
        
    }

    show() {
        
        
        for(let a in this.axes) {  this.axes[a].show(); }

        this.showAreas();
        
    }

    showAreas() {
        this.data.areas.forEach(a => {
            stroke(0,100);
            const c = color(a.color);
            c.setAlpha(50);
            fill(c);
            textAlign(CENTER,BOTTOM);
            if(a.points) {
                beginShape();
                for(let p of a.points) { if(p) {  vertex(p.x, p.y);} }
                endShape();

                fill(0);
                textSize(15);
                text(a.name, a.centeroid.x + (a.nameOffset ? a.nameOffset.x : 0), a.centeroid.y + (a.nameOffset ? a.nameOffset.y : 0));
            }
            
            
        });
    }
}

class Axis
{
    constructor(data, x1,y1,x2,y2)
    {
        this.data = data;
        this.base = createVector(x1 , y1 );
        this.end = createVector(x2, y2);
        this.line = p5.Vector.sub(this.end, this.base);
        this.c = data.color;
        this.labelRotation = data.labelRotation;

    }

    drawTicks() 
    {
        for(let i=0; i<=100 ; i += this.data.tickStepSize)
        {
            if(i===0) continue;
           this.tickAt(i);
        
        }
    }

    drawArrow() {
        stroke(this.data.color);
        textAlign(CENTER,CENTER);
        const arrowStart = this.base.copy().mult(0.8).rotate(135);
        arrowStart.add(this.base);
        const arrowEnd = this.line.copy().mult(0.465);
        drawArrow( arrowStart, arrowEnd, this.data.color);
        arrowEnd.rotate(-70);
        push();
        noStroke();
        translate(arrowEnd.x, arrowEnd.y);
        rotate(arrowEnd.heading() + 70 + this.data.arrowTextRotation );
        textSize(this.data.arrowTextSize);
        text(this.data.arrowText, 0,0);
        pop();
    }

    drawName() 
    {
        
        noStroke();
        const name = this.end.copy().mult(1.15);
        textSize(this.data.nameSize);
        text(this.data.name,name.x, name.y);
    }
    show()
    {
        
        stroke(this.c);
        drawArrow(this.base, this.line, plotData.arrowsColor === "series" ? this.data.color : plotData.arrowsColor, false);

        this.drawTicks();
        
        this.drawArrow();

        this.drawName();
        
        
    }


    tickAt = pct => {
        
        
        //drawArrow(this.base, this.line, this.c, true, plotData.arrowStrokeWeight);
        const val = this.line.copy();
        val.mult(pct/100);

        const tick = this.base.copy();
        tick.rotate(30).mult(0.1);

        push();
        textAlign(CENTER,CENTER);
        translate(val.x + this.base.x, val.y + this.base.y);
        const c2 = color(this.data.color);
        c2.setAlpha(50);
        stroke(c2);
        const textX = tick.x;
        const textY = tick.y;
        tick.mult(0.6);
        
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

    getLineAtValue = pct => {
        
        const val = this.line.copy();
        val.mult( pct/100 );
    
        
        
        const valp = val.copy();
        valp.setMag(this.line.mag() - val.mag() );
        valp.rotate(60);
        const t = p5.Vector.add(val, this.base);
        const x1 = (round(this.base.x + val.x ,0) || 0) ;
        const y1 = (round(this.base.y + val.y ,0) || 0) ;
        const x2 = (round(t.x + valp.x,0) || 0) ;
        const y2 = (round(t.y + valp.y,0) || 0) ;
        
        //line(this.base.x + val.x  , this.base.y + val.y , t.x+valp.x, t.y+valp.y);

        
        
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
        let arrowSize = 10;
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

 function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    

    var x = point.x, y = point.y;
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};


function checkcheck (p, corners)  {

    var i, j=corners.length-1 ;
    var odd = false;

    

    for (i=0; i<corners.length; i++) {
        let ci = corners[i];
        let cj = corners[j];
        if ((ci.y< p.y && cj.y>=p.y ||  cj.y< p.y && ci.y>=p.y)
            && (ci.x<=p.x || cj.x<=p.x)) {
              odd ^= (ci.x + (p.y-ci.y)*(cj.x-ci.x)/(cj.y- ci.y)) < p.x; 
        }

        j=i; 
    }

return odd;
}


function pointIsInPoly(p, polygon) {
    var isInside = false;
    var minX = polygon[0].x, maxX = polygon[0].x;
    var minY = polygon[0].y, maxY = polygon[0].y;
    for (var n = 1; n < polygon.length; n++) {
        var q = polygon[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
    }

    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
    }

    var i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ( (polygon[i].y > p.y) != (polygon[j].y > p.y) &&
                p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x ) {
            isInside = !isInside;
        }
    }

    return isInside;
}

function insidePoly(p, poly) {
    let pointx = p.x;
    let pointy = p.y;
    var i, j;
    var inside = false;
    for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        if(((poly[i].y > pointy) != (poly[j].y > pointy)) && (pointx < (poly[j].x-poly[i].x) * (pointy-poly[i].y) / (poly[j].y-poly[i].y) + poly[i].x) ) inside = !inside;
    }
    return inside;
}

function relationPP(P, polygon) {
    if(!P){ return; }
    const between = (p, a, b) => p >= a && p <= b || p <= a && p >= b
    let inside = false
    for (let i = polygon.length-1, j = 0; j < polygon.length; i = j, j++) {
        const A = polygon[i]
        const B = polygon[j]
        // corner cases
        if (P.x == A.x && P.y == A.y || P.x == B.x && P.y == B.y) return 0
        if (A.y == B.y && P.y == A.y && between(P.x, A.x, B.x)) return 0

        if (between(P.y, A.y, B.y)) { // if P inside the vertical range
            // filter out "ray pass vertex" problem by treating the line a little lower
            if (P.y == A.y && B.y >= A.y || P.y == B.y && A.y >= B.y) continue
            // calc cross product `PA X PB`, P lays on left side of AB if c > 0 
            const c = (A.x - P.x) * (B.y - P.y) - (B.x - P.x) * (A.y - P.y)
            if (c == 0) return 0
            if ((A.y < B.y) == (c > 0)) inside = !inside
        }
    }

    return inside? 1 : -1
}

function star(p, c, ctx) {
    
    if(!p) return;
    if(!ctx) {
        c = color(c);
        c.setAlpha(100);
        fill(c);
        noStroke();
        circle(p.x, p.y, 5);
    } else {
        ctx.arc(10,10,8,0,TWO_PI);
        ctx.stroke();
    }

    
}


function tri(p, c, ctx) {
    if(!p) return;
    if(!ctx) { ctx = document.getElementById("defaultCanvas0").getContext("2d"); }
    else { p.x = 10; p.y = 10; }

    if(!ctx) {

        c = color(c);
        c.setAlpha(100);
        const height = 10;
        push();
        translate(p.x, p.y);
        fill(c);
        noStroke();
        triangle(-height/2, height/2, 0, -height/2, height/2, height/2);
        pop();
    } else {
        ctx.beginPath();
        ctx.arc(p.x,p.y,8,0,TWO_PI);
        
        ctx.stroke();
    }
}