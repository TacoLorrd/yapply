(function () {
  'use strict';

  var STARS = 160;
  var SQUARES = 38;
  // Palette A colors: deep navy, burnt orange, soft secondary
  var PALETTE = ['#1F3A5F', '#E85D04', '#D6D0C4'];

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canvas, ctx, W, H, stars, squares, raf;
  var t = 0;
  var mouseX = 0.5, mouseY = 0.5;
  var tgtX = 0.5, tgtY = 0.5;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function Star() {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.r = rand(0.5, 1.6);
    this.color = pick(PALETTE);
    this.peak = rand(0.07, 0.32);
    this.alpha = rand(0, this.peak);
    this.tspd = rand(0.002, 0.009);
    this.toff = rand(0, 6.2832);
    this.px = rand(0.005, 0.02);
    this.isGlow = Math.random() < 0.08;
    this.gspd = rand(0.001, 0.004);
    this.goff = rand(0, 6.2832);
  }

  Star.prototype.update = function () {
    this.alpha = this.peak * (0.38 + 0.62 * Math.sin(t * this.tspd + this.toff));
  };

  Star.prototype.draw = function () {
    var ox = (mouseX - 0.5) * -this.px * 58;
    var oy = (mouseY - 0.5) * -this.px * 58;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    if (this.isGlow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2 + 3 * (0.5 + 0.5 * Math.sin(t * this.gspd + this.goff));
    }
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + ox, this.y + oy, this.r, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  };

  function Square() {
    this.x = rand(-20, W + 20);
    this.y = rand(-20, H + 20);
    this.s = rand(1.5, 4.0);
    this.color = pick(PALETTE);
    this.peak = rand(0.02, 0.1);
    this.alpha = rand(0, this.peak);
    this.vx = rand(0.045, 0.13) * (Math.random() < 0.5 ? 1 : -1);
    this.vy = rand(0.02, 0.09) * (Math.random() < 0.5 ? 1 : -1);
    this.rot = rand(0, 6.2832);
    this.rspd = rand(-0.0009, 0.0009);
    this.px = rand(0.008, 0.028);
    this.isGlow = Math.random() < 0.06;
    this.gspd = rand(0.0008, 0.003);
    this.goff = rand(0, 6.2832);
    this.bspd = rand(0.0009, 0.0032);
    this.boff = rand(0, 6.2832);
  }

  Square.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rspd;
    this.alpha = this.peak * (0.5 + 0.5 * Math.sin(t * this.bspd + this.boff));
    if (this.x < -32) this.x = W + 32;
    if (this.x > W + 32) this.x = -32;
    if (this.y < -32) this.y = H + 32;
    if (this.y > H + 32) this.y = -32;
  };

  Square.prototype.draw = function () {
    var ox = (mouseX - 0.5) * -this.px * 105;
    var oy = (mouseY - 0.5) * -this.px * 105;
    ctx.save();
    ctx.translate(this.x + ox, this.y + oy);
    ctx.rotate(this.rot);
    ctx.globalAlpha = Math.max(0, this.alpha);
    if (this.isGlow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 3 + 4 * (0.5 + 0.5 * Math.sin(t * this.gspd + this.goff));
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.s / 2, -this.s / 2, this.s, this.s);
    ctx.restore();
  };

  function build() {
    var i;
    stars = [];
    squares = [];
    for (i = 0; i < STARS; i++) stars.push(new Star());
    for (i = 0; i < SQUARES; i++) squares.push(new Square());
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function drawStatic() {
    var i;
    ctx.clearRect(0, 0, W, H);
    for (i = 0; i < stars.length; i++) {
      stars[i].alpha = stars[i].peak * 0.7;
      stars[i].draw();
    }
    for (i = 0; i < squares.length; i++) {
      squares[i].alpha = squares[i].peak * 0.6;
      squares[i].draw();
    }
  }

  function frame() {
    var i;
    t++;
    mouseX += (tgtX - mouseX) * 0.04;
    mouseY += (tgtY - mouseY) * 0.04;
    ctx.clearRect(0, 0, W, H);
    for (i = 0; i < stars.length; i++) { stars[i].update(); stars[i].draw(); }
    for (i = 0; i < squares.length; i++) { squares[i].update(); squares[i].draw(); }
    raf = requestAnimationFrame(frame);
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'nebula-bg';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block;';
    ctx = canvas.getContext('2d');
    document.body.prepend(canvas);

    resize();

    window.addEventListener('resize', function () {
      resize();
      if (mq.matches) drawStatic();
    }, { passive: true });

    document.addEventListener('mousemove', function (e) {
      tgtX = e.clientX / W;
      tgtY = e.clientY / H;
    }, { passive: true });

    if (mq.matches) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    mq.addEventListener('change', function (e) {
      if (e.matches) { cancelAnimationFrame(raf); drawStatic(); }
      else { raf = requestAnimationFrame(frame); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
