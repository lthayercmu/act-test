class bomb {

  constructor(i, j, x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.i = i;
    this.j = j;
    this.thebomb = false;
    this.revealed = false;
    this.keypressed = false;
    this.allBombs = "";
    this.flagged = false;
    this.Rkey = false;
    this.game = false;
  }

  showBomb() {
    let canvas = document.getElementById("GameBoard");
    let ctx = canvas.getContext("2d");
    ctx.rect(this.x, this.y, this.w, this.w);
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.w);
    ctx.strokeStyle = "#336dff";
    ctx.stroke();

    if (this.flagged) {
      ctx.rect(this.x, this.y, this.w, this.w);
      ctx.fillStyle = "#33ff68";
      ctx.fillRect(this.x, this.y, this.w, this.w);
      let img = document.getElementById("RacingFlag2");
      ctx.drawImage(img, this.x + this.w * 0.0025, this.y + this.w * 0.0025, w, w);
    }

    if (this.revealed) {
      if (this.thebomb) {
        if (this.flagged == false) {
          ctx.fillStyle = "red";
        } else if (this.flagged == true) {
          ctx.fillStyle = "#33ff68";
        }
        ctx.fillRect(this.x, this.y, this.w, this.w);
        let img = document.getElementById("bombpic");
        ctx.drawImage(img, this.x + this.w * 0.0025, this.y + this.w * 0.0025, w, w);
      } else {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.w);
        if(this.allBombs == 1){
          ctx.fillStyle = "blue";
        }else if(this.allBombs == 2){
          ctx.fillStyle = "green";
        }else if(this.allBombs == 3){
          ctx.fillStyle = "red";
        }else if(this.allBombs == 4){
          ctx.fillStyle = "#000066";
        }else if(this.allBombs == 5){
          ctx.fillStyle = "#993300";
        }else if(this.allBombs == 6){
          ctx.fillStyle = "#00cc99";
        }else if(this.allBombs == 7){
          ctx.fillStyle = "black";
        }else if(this.allBombs == 8){
          ctx.fillStyle = "gray";
        }
        ctx.globalAlpha = 1.0;
        ctx.font = "30px Arial";
        ctx.textAllign = "center";
        ctx.fillText(this.allBombs, this.x + this.w * 0.25, this.y + this.w * 0.85);
      }
    }
    return ctx;
  }

  bombCount() {
    if (this.thebomb == false) {
      let totalBombs = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if ((x + this.i) > -1 && (x + this.i) < c && (y + this.j) > -1 && (y + this.j) < r) {
            if (grid[this.i + x][this.j + y].thebomb == true) {
              totalBombs++;
            }
          }
        }
      }
      if (totalBombs > 0) {
        return this.allBombs = totalBombs;
      }
      return this.allBombs = "";
    }
  }

  zeroCalc() {
    this.revealed = true;
    this.keypressed == true;
    if (this.allBombs == 0) {
      clearSpace(this.i, this.j);
    }
  }

}
