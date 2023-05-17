var Snake = function (width, height) {
  this.x = 1;
  this.y = 0;
  this.velx = 1;
  this.vely = 0;
  this._velx = 1;
  this._vely = 0;

  this.tail = [
    {
      x: 0,
      y: 0,
    },
  ];

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.tail.length - 1] = {
      x: this.x,
      y: this.y,
    };

    this.velx = this._velx;
    this.vely = this._vely;

    this.x += this.velx;
    this.y += this.vely;

    if (this.x > width - 1) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = width - 1;
    }
    if (this.y > height - 1) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = height - 1;
    }
  };

  this.dir = function (key) {
    if (this.velx === 0) {
      if (key === 'ArrowLeft') {
        this._velx = -1;
        this._vely = 0;
      } else if (key === 'ArrowRight') {
        this._velx = 1;
        this._vely = 0;
      }
    } else {
      if (key === 'ArrowUp') {
        this._velx = 0;
        this._vely = -1;
      } else if (key === 'ArrowDown') {
        this._velx = 0;
        this._vely = 1;
      }
    }
  };

  this.eat = function (pos) {
    return Math.abs(this.x - pos.x) < 1 && Math.abs(this.y - pos.y) < 1;
  };

  this.grow = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.tail.length > 0) this.tail.unshift(this.tail[0]);
    else
      this.tail[0] = {
        x: this.x - this.velx,
        y: this.y - this.vely,
      };
  };

  this.collide = function (pos) {
    let x = this.x;
    let y = this.y;
    if (pos) {
      x = pos.x;
      y = pos.y;
    }
    for (let i = 0; i < this.tail.length; i++) {
      if (this.tail[i].x === x && this.tail[i].y === y) {
        return true;
      }
    }
    return false;
  };

  this.reset = function () {
    this.x = 1;
    this.y = 0;
    this._velx = 1;
    this._vely = 0;
    this.tail = [
      {
        x: 0,
        y: 0,
      },
    ];
  };
};

window.onload = function () {
  var punteggio = document.getElementById('score');
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var scale = 15;
  var fruit = null;
  var punti = 0;
  var w = (h = 20);
  canvas.width = w * scale;
  canvas.height = h * scale;

  var sn = new Snake(w, h);
  fruit = newFruit();

  document.onkeydown = function (e) {
    sn.dir(e.key);
  };

  document.addEventListener('click', function (e) {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    e.preventDefault();
    console.log(x, y);
    if (sn.velx === 0) {
      if (x + Math.floor(scale / 2) > sn.x * scale) sn.dir('ArrowRight');
      else sn.dir('ArrowLeft');
    } else {
      if (y + Math.floor(scale / 2) > sn.y * scale) sn.dir('ArrowDown');
      else sn.dir('ArrowUp');
    }
  });

  function newFruit() {
    let ret = null;
    while (!ret || sn.collide(ret) || sn.eat(ret)) {
      ret = {
        x: Math.floor(Math.random() * w),
        y: Math.floor(Math.random() * h),
      };
    }
    return ret;
  }

  function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f44336';
    ctx.fillRect(fruit.x * scale, fruit.y * scale, scale - 2, scale - 2);
    ctx.fillStyle = 'lime';
    for (let i = 0; i < sn.tail.length; i++) {
      ctx.fillRect(
        sn.tail[i].x * scale,
        sn.tail[i].y * scale,
        scale - 2,
        scale - 2
      );
    }
    ctx.fillRect(sn.x * scale, sn.y * scale, scale - 2, scale - 2);

    if (sn.collide()) {
      punti = 0;
      punteggio.textContent = punti.toString();
      sn.reset();
      fruit = newFruit();
    }
    if (sn.eat(fruit)) {
      sn.grow();
      fruit = newFruit();
      punti += 10;
      punteggio.textContent = punti.toString();
    }

    sn.update();
  }
  setInterval(draw, 1000 / 15);
};
