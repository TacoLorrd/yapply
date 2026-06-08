/**
 * Animated shimmer background (adapted from https://codepen.io/jshmllr/pen/ogNENjE)
 * Uses site color palette: primary navy, accent orange, muted tones on cream base.
 */
(function () {
  const settings = {
    shapeType: 'Circle',
    size: 4,
    gap: 11,
    colors: ['rgb(31, 58, 95)', 'rgb(232, 93, 4)', 'rgb(75, 84, 105)'],
    contrast: 2.4,
    speed: 18,
    animate: true,
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class PerlinNoise {
    constructor() {
      this.p = new Array(512);
      this.init();
    }

    init() {
      for (let i = 0; i < 256; i++) {
        this.p[i] = this.p[i + 256] = Math.floor(Math.random() * 256);
      }
    }

    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
      return a + t * (b - a);
    }

    grad(hash, x, y) {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      const u = this.fade(x);
      const v = this.fade(y);
      const A = this.p[X] + Y;
      const B = this.p[X + 1] + Y;
      return this.lerp(
        v,
        this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
        this.lerp(
          u,
          this.grad(this.p[A + 1], x, y - 1),
          this.grad(this.p[B + 1], x - 1, y - 1)
        )
      );
    }

    generatePerlinNoise(width, height, cellSize) {
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = width;
      noiseCanvas.height = height;
      const noiseCtx = noiseCanvas.getContext('2d');
      const imageData = noiseCtx.createImageData(width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const value = ((this.noise(x / cellSize, y / cellSize) + 1) / 2) * 255;
          const cell = (x + y * width) * 4;
          data[cell] = data[cell + 1] = data[cell + 2] = value;
          data[cell + 3] = 255;
        }
      }

      noiseCtx.putImageData(imageData, 0, 0);
      return noiseCanvas;
    }

    createSeamlessPerlinNoise(width, height, cellSize) {
      const singleNoise = this.generatePerlinNoise(width, height, cellSize);
      const seamlessCanvas = document.createElement('canvas');
      seamlessCanvas.width = width * 4;
      seamlessCanvas.height = height;
      const seamlessCtx = seamlessCanvas.getContext('2d');

      seamlessCtx.drawImage(singleNoise, 0, 0);

      seamlessCtx.save();
      seamlessCtx.translate(width * 2, 0);
      seamlessCtx.scale(-1, 1);
      seamlessCtx.drawImage(singleNoise, 0, 0);
      seamlessCtx.restore();

      seamlessCtx.drawImage(singleNoise, width * 2, 0);

      seamlessCtx.save();
      seamlessCtx.translate(width * 4, 0);
      seamlessCtx.scale(-1, 1);
      seamlessCtx.drawImage(singleNoise, 0, 0);
      seamlessCtx.restore();

      return seamlessCanvas.toDataURL();
    }
  }

  function mountShimmer() {
    const wrap = document.createElement('div');
    wrap.id = 'shimmer-bg';
    wrap.className = 'shimmer-bg';
    wrap.setAttribute('aria-hidden', 'true');

    const canvas = document.createElement('canvas');
    canvas.id = 'shimmer-canvas';

    const overlay = document.createElement('div');
    overlay.className = 'shimmer-overlay';

    wrap.appendChild(canvas);
    wrap.appendChild(overlay);
    document.body.prepend(wrap);

    return { wrap, canvas };
  }

  function init() {
    const { wrap: shimmerContainer, canvas } = mountShimmer();
    const ctx = canvas.getContext('2d');
    const perlin = new PerlinNoise();

    if (prefersReducedMotion) {
      settings.animate = false;
    }

    function getRandomOpacity() {
      let opacity = Math.random();
      if (settings.contrast > 0) {
        opacity = Math.pow(opacity, 1 + settings.contrast / 5);
      } else if (settings.contrast < 0) {
        opacity = 1 - Math.pow(1 - opacity, 1 - settings.contrast / 5);
      }
      return opacity * 0.72;
    }

    function drawShapes() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colorBatch = settings.colors.length > 0 ? settings.colors : ['rgb(31, 58, 95)'];

      for (let y = 0; y < canvas.height; y += settings.size + settings.gap) {
        for (let x = 0; x < canvas.width; x += settings.size + settings.gap) {
          const color = colorBatch[Math.floor(Math.random() * colorBatch.length)];
          const opacity = getRandomOpacity();
          ctx.fillStyle = color.replace(')', `,${opacity})`).replace('rgb', 'rgba');

          if (settings.shapeType === 'Square') {
            ctx.fillRect(x, y, settings.size, settings.size);
          } else {
            ctx.beginPath();
            ctx.arc(
              x + settings.size / 2,
              y + settings.size / 2,
              settings.size / 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
      }
    }

    function updateMask() {
      if (settings.animate) {
        const width = canvas.width;
        const cellSize = Math.max(25, settings.size * 2);
        const perlinNoiseDataUrl = perlin.createSeamlessPerlinNoise(width, canvas.height, cellSize);

        const sizeFactor = Math.max(1, settings.size / 3);
        const baseValue = width * 2250 * sizeFactor;
        const maxSpeed = 100;
        const powerFactor = Math.log(baseValue / (baseValue / 100)) / Math.log(maxSpeed);
        const animationDuration = Math.round(baseValue / Math.pow(settings.speed, powerFactor));
        const maskTravelDistance = 300 * (settings.size / 10);

        let style = document.getElementById('shimmer-mask-animation');
        if (!style) {
          style = document.createElement('style');
          style.id = 'shimmer-mask-animation';
          document.head.appendChild(style);
        }

        style.textContent = `
          @keyframes shimmerMoveMask {
            0% {
              mask-position: 0% 0%;
              -webkit-mask-position: 0% 0%;
            }
            100% {
              mask-position: -${maskTravelDistance}% 0%;
              -webkit-mask-position: -${maskTravelDistance}% 0%;
            }
          }
        `;

        canvas.style.maskImage = `url(${perlinNoiseDataUrl})`;
        canvas.style.webkitMaskImage = `url(${perlinNoiseDataUrl})`;
        canvas.style.maskMode = 'luminance';
        canvas.style.webkitMaskMode = 'luminance';
        canvas.style.maskSize = `${300 * sizeFactor}% 100%`;
        canvas.style.webkitMaskSize = `${300 * sizeFactor}% 100%`;
        canvas.style.maskRepeat = 'repeat-x';
        canvas.style.webkitMaskRepeat = 'repeat-x';
        canvas.style.animation = `shimmerMoveMask ${animationDuration}ms linear infinite`;
        canvas.style.willChange = 'mask-position';
      } else {
        canvas.style.animation = 'none';
        canvas.style.webkitAnimation = 'none';
        canvas.style.maskImage = 'none';
        canvas.style.webkitMaskImage = 'none';
      }
    }

    function resizeCanvas() {
      canvas.width = shimmerContainer.offsetWidth;
      canvas.height = shimmerContainer.offsetHeight;
      drawShapes();
      updateMask();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
