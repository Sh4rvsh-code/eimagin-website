/* dotted-surface.js — Animated 3D dotted wave using Three.js */
/* An animated 3D dotted wave background built with Three.js that flows like water. */
/* Theme-aware and lightweight, perfect for adding subtle motion depth to your UI. */

// Wait for DOM and Three.js to be ready
if (typeof THREE === 'undefined') {
  console.error('THREE.js is not loaded');
}

(function () {
  const container = document.getElementById('dotted-surface');
  if (!container) {
    console.error('Dotted surface container not found');
    return;
  }
  
  console.log('Initializing dotted surface...');

  // --- Configuration ---
  const SEPARATION = 60;
  const AMOUNTX = 70;
  const AMOUNTY = 50;

  // --- Scene setup ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0B0B0F, 1500, 4000);

  // Use window dimensions for proper sizing
  const width = window.innerWidth;
  const height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
    75,
    width / height,
    1,
    10000
  );
  // Position camera higher and angle it down to show dots at bottom
  camera.position.set(0, 600, 1000);
  camera.lookAt(0, -200, 0);

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  
  // Ensure canvas styling
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  
  container.appendChild(canvas);

  // --- Create particles ---
  const positions = [];
  const colors = [];

  // Create geometry for all particles
  const geometry = new THREE.BufferGeometry();

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const y = 0; // Will be animated
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

      positions.push(x, y, z);
      // Bright white dots for better visibility
      colors.push(255, 255, 255);
    }
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Create material
  const material = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  // Create points object
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;
  let animationId;

  // --- Animation function ---
  const animate = () => {
    animationId = requestAnimationFrame(animate);

    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;

        // Animate Y position with sine waves - creates water-like flow
        positions[index + 1] =
          Math.sin((ix + count) * 0.3) * 30 +
          Math.sin((iy + count) * 0.5) * 30;

        i++;
      }
    }

    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.1;
  };

  // --- Handle window resize ---
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener('resize', handleResize);

  // Start animation
  console.log('Dotted surface animation started');
  animate();

  // --- Cleanup on page unload ---
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
  });

})();
