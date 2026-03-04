/* Animated React-style background for mockup projects section */
(function () {

  function init() {
    var container = document.getElementById('mockup-react-bg');
    if (!container) { console.warn('[MockupReactBg] #mockup-react-bg not found'); return; }

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    var parent = container.parentElement;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = parent.offsetWidth || 300;
    var h = parent.offsetHeight || 400;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) { console.warn('[MockupReactBg] WebGL not supported'); return; }

    var VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    var FRAG = `precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  
  // Animated gradient base
  float gradientAngle = uTime * 0.1;
  vec2 gradDir = vec2(cos(gradientAngle), sin(gradientAngle));
  float gradient = dot(uv - 0.5, gradDir) * 0.5 + 0.5;
  
  // Noise layers
  float n1 = noise(uv * 3.0 + uTime * 0.1);
  float n2 = noise(uv * 5.0 - uTime * 0.15);
  float n3 = noise(uv * 8.0 + uTime * 0.08);
  
  // Combine noise
  float combinedNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
  
  // Purple to blue gradient with noise
  vec3 color1 = vec3(0.545, 0.361, 0.965); // #8B5CF6 purple
  vec3 color2 = vec3(0.486, 0.227, 0.929); // #7C3AED purple-secondary
  vec3 color3 = vec3(0.302, 0.486, 0.961); // blue accent
  
  vec3 baseColor = mix(color1, color2, gradient);
  baseColor = mix(baseColor, color3, combinedNoise * 0.3);
  
  // Subtle moving particles
  float particles = 0.0;
  for(float i = 0.0; i < 5.0; i++) {
    vec2 particlePos = vec2(
      fract(i * 0.3 + uTime * 0.05),
      fract(i * 0.7 - uTime * 0.08)
    );
    float dist = length(uv - particlePos);
    particles += smoothstep(0.05, 0.0, dist) * 0.1;
  }
  
  baseColor += particles;
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  baseColor *= vignette;
  
  // Opacity
  gl_FragColor = vec4(baseColor, 0.15);
}`;

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

    var uTime = gl.getUniformLocation(program, 'uTime');
    var uResolution = gl.getUniformLocation(program, 'uResolution');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var updateSize = function() {
      var nw = parent.offsetWidth || 300;
      var nh = parent.offsetHeight || 400;
      canvas.width = Math.round(nw * dpr);
      canvas.height = Math.round(nh * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    var start = performance.now();
    (function loop() {
      requestAnimationFrame(loop);
      gl.uniform1f(uTime, (performance.now() - start) * 0.001);
      gl.clear(gl.CLEAR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })();

  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
