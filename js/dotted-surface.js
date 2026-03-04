/* dotted-surface.js — Animated 3D dotted wave using Three.js */

if (typeof THREE === 'undefined') {
  console.error('THREE.js is not loaded');
}

(function () {
  const container = document.getElementById('dotted-surface');
  if (!container) return;

  // --- Configuration (matches reference exactly) ---
  const SEPARATION = 150;
  const AMOUNTX   = 40;
  const AMOUNTY   = 60;

  // --- Scene ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0B0B0F, 2000, 10000);

  // --- Camera: eye-level perspective looking toward origin ---
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 355, 1220);
  // default lookAt is (0,0,0) — keeps the horizon look from the reference

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.display  = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top      = '0';
  canvas.style.left     = '0';
  canvas.style.width    = '100%';
  canvas.style.height   = '100%';
  container.appendChild(canvas);

  // --- Geometry ---
  const positions = [];
  const colors    = [];
  const geometry  = new THREE.BufferGeometry();

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions.push(
        ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
        0,
        iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      );
      // Soft white — slightly dimmed so it reads well on dark background
      colors.push(210, 210, 210);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));

  // --- Material ---
  const material = new THREE.PointsMaterial({
    size:            8,
    vertexColors:    true,
    transparent:     true,
    opacity:         0.8,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // --- Animation ---
  let count = 0;
  let animationId;

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    const posAttr = geometry.attributes.position;
    const pos     = posAttr.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        // Exact wave formula from the reference
        pos[i * 3 + 1] =
          Math.sin((ix + count) * 0.3) * 50 +
          Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.1;
  };

  // --- Resize ---
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  animate();

  // --- Cleanup ---
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (container && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
  });

})();
