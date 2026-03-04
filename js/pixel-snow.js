/* pixel-snow.js — Raw WebGL2 port of ReactBits PixelSnow */
(function () {

  var VERT = [
    '#version 300 es',
    'in vec2 aPos;',
    'void main() { gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    '#version 300 es',
    'precision mediump float;',
    'precision highp int;',
    'out vec4 fragColor;',

    'uniform float uTime;',
    'uniform vec2  uResolution;',
    'uniform float uFlakeSize;',
    'uniform float uMinFlakeSize;',
    'uniform float uPixelResolution;',
    'uniform float uSpeed;',
    'uniform float uDepthFade;',
    'uniform float uFarPlane;',
    'uniform vec3  uColor;',
    'uniform float uBrightness;',
    'uniform float uGamma;',
    'uniform float uDensity;',
    'uniform float uVariant;',
    'uniform float uDirection;',

    '#define PI        3.14159265',
    '#define PI_OVER_6 0.5235988',
    '#define PI_OVER_3 1.0471976',
    '#define M1        1597334677u',
    '#define M2        3812015801u',
    '#define M3        3299493293u',
    '#define F0        2.3283064e-10',

    'uint hfn(uint n) { return n * (n ^ (n >> 15u)); }',
    'uint c3(uvec3 p) { return p.x * M1 ^ p.y * M2 ^ p.z * M3; }',

    'vec3 hash3(uint n) {',
    '  uvec3 h = hfn(n) * uvec3(1u, 511u, 262143u);',
    '  return vec3(h) * float(F0);',
    '}',

    'const vec3 camK = vec3( 0.57735027,  0.57735027,  0.57735027);',
    'const vec3 camI = vec3( 0.70710678,  0.0,        -0.70710678);',
    'const vec3 camJ = vec3(-0.40824829,  0.81649658, -0.40824829);',
    'const vec2 b1d  = vec2(0.574, 0.819);',

    'float snowflakeDist(vec2 p) {',
    '  float r = length(p);',
    '  float a = atan(p.y, p.x);',
    '  a = abs(mod(a + PI_OVER_6, PI_OVER_3) - PI_OVER_6);',
    '  vec2  q     = r * vec2(cos(a), sin(a));',
    '  float dMain = max(abs(q.y), max(-q.x, q.x - 1.0));',
    '  float b1t   = clamp(dot(q - vec2(0.4,0.0), b1d), 0.0, 0.4);',
    '  float dB1   = length(q - vec2(0.4,0.0) - b1t*b1d);',
    '  float b2t   = clamp(dot(q - vec2(0.7,0.0), b1d), 0.0, 0.25);',
    '  float dB2   = length(q - vec2(0.7,0.0) - b2t*b1d);',
    '  return min(dMain, min(dB1, dB2)) * 10.0;',
    '}',

    'void main() {',
    '  float invPixelRes = 1.0 / uPixelResolution;',
    '  float pixelSize   = max(1.0, floor(0.5 + uResolution.x * invPixelRes));',
    '  float invPixelSize = 1.0 / pixelSize;',

    '  vec2  fragCoord = floor(gl_FragCoord.xy * invPixelSize);',
    '  vec2  res       = uResolution * invPixelSize;',
    '  float invResX   = 1.0 / res.x;',

    '  vec3 ray = normalize(vec3((fragCoord - res*0.5)*invResX, 1.0));',
    '  ray = ray.x*camI + ray.y*camJ + ray.z*camK;',

    '  float timeSpeed = uTime * uSpeed;',
    '  float windX = cos(uDirection)*0.4;',
    '  float windY = sin(uDirection)*0.4;',
    '  vec3 camPos = (windX*camI + windY*camJ + 0.1*camK)*timeSpeed;',
    '  vec3 pos    = camPos;',

    '  vec3 absRay  = max(abs(ray), vec3(0.001));',
    '  vec3 strides = 1.0/absRay;',
    '  vec3 raySign = step(ray, vec3(0.0));',
    '  vec3 phase   = fract(pos)*strides;',
    '  phase = mix(strides-phase, phase, raySign);',

    '  float rayDotCamK    = dot(ray, camK);',
    '  float invRayDotCamK = 1.0/rayDotCamK;',
    '  float invDepthFade  = 1.0/uDepthFade;',
    '  float halfInvResX   = 0.5*invResX;',
    '  vec3  timeAnim      = timeSpeed*0.1*vec3(7.0,8.0,5.0);',

    '  float t = 0.0;',
    '  for (int i = 0; i < 128; i++) {',
    '    if (t >= uFarPlane) break;',

    '    vec3  fpos    = floor(pos);',
    '    uvec3 upos    = uvec3(fpos + vec3(1000.0));',
    '    uint  cellKey = c3(upos);',
    '    float cellH   = hash3(cellKey).x;',

    '    if (cellH < uDensity) {',
    '      vec3 h  = hash3(cellKey);',
    '      vec3 s1 = fpos.yzx * 0.073;',
    '      vec3 s2 = fpos.zxy * 0.27;',
    '      vec3 fp = 0.5 - 0.5*cos(4.0*sin(s1)+4.0*sin(s2)+2.0*h+timeAnim);',
    '      fp = fp*0.8 + 0.1 + fpos;',

    '      float toI = dot(fp - pos, camK) * invRayDotCamK;',
    '      if (toI > 0.0) {',
    '        vec3  tp  = pos + ray*toI - fp;',
    '        float tX  = dot(tp, camI);',
    '        float tY  = dot(tp, camJ);',
    '        vec2  tUV = abs(vec2(tX, tY));',

    '        float depth = dot(fp - camPos, camK);',
    '        float fs    = max(uFlakeSize, uMinFlakeSize*depth*halfInvResX);',

    '        float dist;',
    '        if (uVariant < 0.5) {',
    '          dist = max(tUV.x, tUV.y);',
    '        } else if (uVariant < 1.5) {',
    '          dist = length(tUV);',
    '        } else {',
    '          dist = snowflakeDist(vec2(tX,tY)/fs)*fs;',
    '        }',

    '        if (dist < fs) {',
    '          float ratio     = uFlakeSize/fs;',
    '          float intensity = exp2(-(t+toI)*invDepthFade)*min(1.0,ratio*ratio)*uBrightness;',
    '          fragColor = vec4(uColor * pow(vec3(intensity), vec3(uGamma)), 1.0);',
    '          return;',
    '        }',
    '      }',
    '    }',

    '    float ns  = min(min(phase.x, phase.y), phase.z);',
    '    vec3  sel = step(phase, vec3(ns));',
    '    phase = phase - ns + strides*sel;',
    '    t    += ns;',
    '    pos   = mix(pos + ray*ns, floor(pos + ray*ns + 0.5), sel);',
    '  }',

    '  fragColor = vec4(0.0);',
    '}'
  ].join('\n');

  /* ─── helpers ────────────────────────────────────────────────────── */
  function compileShader(gl, src, type) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[PixelSnow] Shader compile error:', gl.getShaderInfoLog(s));
      console.error('[PixelSnow] Source:\n', src);
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  /* ─── init ───────────────────────────────────────────────────────── */
  function init() {
    var container = document.getElementById('pixel-snow');
    if (!container) return;

    var hero = container.parentElement;

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;pointer-events:none;';
    container.appendChild(canvas);

    var dpr = 1; // Force 1x DPR for performance
    var w   = (hero ? hero.offsetWidth  : window.innerWidth)  || window.innerWidth;
    var h   = (hero ? hero.offsetHeight : window.innerHeight) || window.innerHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var gl = canvas.getContext('webgl2', {
      alpha: true, antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
      depth: false, stencil: false
    });
    if (!gl) return;

    var vert = compileShader(gl, VERT, gl.VERTEX_SHADER);
    var frag = compileShader(gl, FRAG, gl.FRAGMENT_SHADER);
    if (!vert || !frag) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[PixelSnow] Link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    /* full-screen quad */
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1, 1,
       1,-1,  1, 1,  -1, 1
    ]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* uniforms */
    var U = {};
    ['uTime','uResolution','uFlakeSize','uMinFlakeSize','uPixelResolution',
     'uSpeed','uDepthFade','uFarPlane','uColor','uBrightness','uGamma',
     'uDensity','uVariant','uDirection'].forEach(function(n) {
      U[n] = gl.getUniformLocation(prog, n);
    });

    gl.uniform1f(U.uFlakeSize,        0.020); // Round pixels with good visibility
    gl.uniform1f(U.uMinFlakeSize,     1.5);
    gl.uniform1f(U.uPixelResolution,  220.0); // Higher resolution for ultra-smooth appearance
    gl.uniform1f(U.uSpeed,            1.5);   // Slower speed for gentle, smooth falling
    gl.uniform1f(U.uDepthFade,        15.0);  // Softer fade for smoother transition
    gl.uniform1f(U.uFarPlane,         28.0);
    gl.uniform3f(U.uColor,            1.0, 1.0, 1.0);
    gl.uniform1f(U.uBrightness,       0.9);  // Slightly brighter for round pixels
    gl.uniform1f(U.uGamma,            0.4545);
    gl.uniform1f(U.uDensity,          0.065); // Balanced density
    gl.uniform1f(U.uVariant,          1.0);   // Round/circular pixels
    gl.uniform1f(U.uDirection,        100.0 * Math.PI / 180.0); // More downward direction

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.uResolution, w, h);

    /* pause off-screen */
    var isVisible = true;
    new IntersectionObserver(function(e) {
      isVisible = e[0].isIntersecting;
    }, { threshold: 0 }).observe(container);

    /* resize */
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        var nw = (hero ? hero.offsetWidth  : window.innerWidth)  || window.innerWidth;
        var nh = (hero ? hero.offsetHeight : window.innerHeight) || window.innerHeight;
        canvas.width  = Math.round(nw * dpr);
        canvas.height = Math.round(nh * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(U.uResolution, nw, nh);
      }, 100);
    });

    /* render loop */
    var start = performance.now();
    (function loop() {
      requestAnimationFrame(loop);
      if (!isVisible) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uTime, (performance.now() - start) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    })();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
