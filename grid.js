class Grid {
  constructor(x, y, horizonEdge, vertEdge) {
    this.x = x;
    this.y = y;
    this.horizonEdge = horizonEdge;
    this.vertEdge = vertEdge;
    this.rotateAngle = atan2(this.vertEdge, this.horizonEdge);
    this.diaEdge = this.vertEdge / sin(this.rotateAngle);
  }

  render(bold) {
    //pass in a string array
    let bolds = bold.split("").map((x) => parseInt(x));
    //output an array of int
     push();
      translate(this.x, this.y);
     
    for (let i = 0; i < 8; i++) {
      if (bolds.includes(i + 1)) {
        fill(0);
        stroke(0);
        strokeWeight(8);
      } else {
        stroke("#DADADA");
        // noStroke();
        strokeWeight(2);
      }
      
      if (i === 0 || i === 3 || i == 4 || i === 7) {
        rotate(this.rotateAngle);
      } else {
        rotate(PI / 2 - this.rotateAngle);
      }
      if (i % 2 === 0) {
        line(0, 0, -this.diaEdge, 0);
      } else if (i === 1 || i === 5) {
        line(0, 0, -this.vertEdge, 0);
      } else {
        line(0, 0, -this.horizonEdge, 0);
      }
    }
    pop();
  }
}
