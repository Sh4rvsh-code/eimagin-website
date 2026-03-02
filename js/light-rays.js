/* light-rays.js — Vanilla JS port of ReactBits LightRays */
(function () {

  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };

  const getAnchorAndDir = (origin, w, h) => {
    const outside = 0.2;
    switch (origin) {
      case 'top-left':
        return { anchor: [0, -outside * h], dir: [0, 1] };
      case 'top-right':
        return { anchor: [w, -outside * h], dir: [0, 1] };
      case 'left':
        return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case 'right':
        return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left':
        return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-center':
        return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-right':
        return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      default: // "top-center"
        return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  };

  const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAG = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

  function init() {
    var container = document.getElementById('light-rays');
    if (!container) { console.warn('[LightRays] #light-rays not found'); return; }

    var hero = container.parentElement;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;pointer-events:none;';
    container.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = (hero ? hero.offsetWidth : window.innerWidth) || window.innerWidth;
    var h = (hero ? hero.offsetHeight : window.innerHeight) || window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) { console.warn('[LightRays] WebGL not supported'); return; }

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, VERT);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, FRAG);
    gl.compileShader(fragShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var aPosition = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['iTime', 'iResolution', 'rayPos', 'rayDir', 'raysColor', 'raysSpeed', 'lightSpread',
     'rayLength', 'pulsating', 'fadeDistance', 'saturation', 'mousePos', 'mouseInfluence',
     'noiseAmount', 'distortion'].forEach(function(n) {
      U[n] = gl.getUniformLocation(program, n);
    });

    var config = {
      raysOrigin: 'top-center',
      raysColor: '#8B5CF6',
      raysSpeed: 0.3,
      lightSpread: 1.5,
      rayLength: 4,
      pulsating: false,
      fadeDistance: 1.2,
      saturation: 1.0,
      followMouse: false,
      mouseInfluence: 0,
      noiseAmount: 0,
      distortion: 0
    };

    gl.uniform3f(U.raysColor, ...hexToRgb(config.raysColor));
    gl.uniform1f(U.raysSpeed, config.raysSpeed);
    gl.uniform1f(U.lightSpread, config.lightSpread);
    gl.uniform1f(U.rayLength, config.rayLength);
    gl.uniform1f(U.pulsating, config.pulsating ? 1.0 : 0.0);
    gl.uniform1f(U.fadeDistance, config.fadeDistance);
    gl.uniform1f(U.saturation, config.saturation);
    gl.uniform1f(U.mouseInfluence, config.mouseInfluence);
    gl.uniform1f(U.noiseAmount, config.noiseAmount);
    gl.uniform1f(U.distortion, config.distortion);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var mouse = { x: 0.5, y: 0.5 };
    var smoothMouse = { x: 0.5, y: 0.5 };

    var updatePlacement = function() {
      var nw = (hero ? hero.offsetWidth : window.innerWidth) || window.innerWidth;
      var nh = (hero ? hero.offsetHeight : window.innerHeight) || window.innerHeight;
      canvas.width = Math.round(nw * dpr);
      canvas.height = Math.round(nh * dpr);
      
      var pw = canvas.width;
      var ph = canvas.height;
      gl.viewport(0, 0, pw, ph);
      gl.uniform2f(U.iResolution, pw, ph);

      var result = getAnchorAndDir(config.raysOrigin, pw, ph);
      gl.uniform2f(U.rayPos, result.anchor[0], result.anchor[1]);
      gl.uniform2f(U.rayDir, result.dir[0], result.dir[1]);
    };

    updatePlacement();

    var isVisible = true;
    new IntersectionObserver(function(e) {
      isVisible = e[0].isIntersecting;
    }, { threshold: 0 }).observe(container);

    window.addEventListener('resize', updatePlacement);

    var start = performance.now();
    (function loop() {
      requestAnimationFrame(loop);
      if (!isVisible) return;

      gl.uniform1f(U.iTime, (performance.now() - start) * 0.001);

      if (config.followMouse && config.mouseInfluence > 0) {
        var smoothing = 0.92;
        smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
        smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
        gl.uniform2f(U.mousePos, smoothMouse.x, smoothMouse.y);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })();

    console.log('[LightRays] Initialized successfully');
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
