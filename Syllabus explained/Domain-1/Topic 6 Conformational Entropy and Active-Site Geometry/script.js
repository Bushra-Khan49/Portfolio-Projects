// --- 2. Smooth Scrolling (Lenis) ---
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 3. GSAP & ScrollTrigger Animations ---
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with ScrollTrigger for buttery smooth parallax
lenis.on('scroll', ScrollTrigger.update);

// Wrap diagram images to protect borders from the CSS invert filter
document.querySelectorAll('.glass-figure img').forEach(img => {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-border-wrapper';
    // Copy the width from inline style if it exists so the wrapper scales correctly
    if (img.style.width) wrapper.style.width = img.style.width;
    if (img.style.display) wrapper.style.display = img.style.display;
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    // Reset img width to 100% since wrapper handles it
    img.style.width = '100%';
});
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Alternating Side-Reveal for Cards
const sections = document.querySelectorAll('.fade-up');
sections.forEach(sec => {
    // Select all cards within this section
    const cards = sec.querySelectorAll('.glass-card');
    
    if(cards.length > 0) {
        cards.forEach((card, index) => {
            let startX = index % 2 === 0 ? -150 : 150;
            if (card.dataset.from === 'right') startX = 150;
            if (card.dataset.from === 'left') startX = -150;

            gsap.fromTo(card, {
                x: startX, // Use calculated startX
                opacity: 0,   // Fade in
                scale: 0.95
            }, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1.5,
                delay: index * 0.2, // Manual stagger
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sec, // Trigger on the parent section so they start together
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    } else {
        // Fallback for sections without cards
        gsap.fromTo(sec, {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }
});

// Parallax Glide Effect for Glass Cards
const glassCards = document.querySelectorAll('.glass-card');
glassCards.forEach(card => {
    gsap.to(card, {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
});

// Hero Section Parallax
gsap.to('.hero-section h1', {
    y: -150,
    opacity: 0,
    scale: 0.9,
    ease: "none",
    scrollTrigger: {
        trigger: '.hero-section',
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});


// --- 5. Three.js Background (Breathing Polymerase) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#030409', 10, 45);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 25; 

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Central DNA Core
const coreGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.1, wireframe: true });
const dnaCore = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(dnaCore);

// Polymerase "Fingers" (Particle Cloud)
const particleCount = 2500;
const geometry = new THREE.BufferGeometry();
const basePositions = new Float32Array(particleCount * 3);
const currentPositions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const color1 = new THREE.Color('#b388ff'); // Purple
const color2 = new THREE.Color('#ff007f'); // Neon Pink

// Create a hollow sphere of particles around the core
for(let i = 0; i < particleCount; i++) {
    // Random spherical coordinates
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radius = 6 + Math.random() * 4; // Spread out between 6 and 10 initially
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    basePositions[i*3] = x;
    basePositions[i*3 + 1] = y;
    basePositions[i*3 + 2] = z;
    
    currentPositions[i*3] = x;
    currentPositions[i*3 + 1] = y;
    currentPositions[i*3 + 2] = z;
    
    // Mix colors based on position
    const mixRatio = (y + 10) / 20; // 0 to 1 mapping roughly
    const mixedColor = color1.clone().lerp(color2, Math.max(0, Math.min(1, mixRatio)));
    
    colors[i*3] = mixedColor.r;
    colors[i*3+1] = mixedColor.g;
    colors[i*3+2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const polymeraseCloud = new THREE.Points(geometry, material);
scene.add(polymeraseCloud);

// Scroll & Mouse Interaction
let targetRotationY = 0;
let mouseX = 0;
let mouseY = 0;
let closureFactor = 0; // 0 = open (high entropy), 1 = closed (induced fit)

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.002;
    
    // Map scroll position to the closure factor (e.g. from 1000px to 3000px)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.max(0, Math.min(1, scrollY / docHeight));
    
    // Smooth transition: close the fingers around 40% scroll, open them back up at the end (mismatch/exonuclease)
    if (scrollPercent < 0.4) {
        closureFactor = scrollPercent / 0.4; // 0 to 1
    } else if (scrollPercent < 0.7) {
        closureFactor = 1; // Stay closed for Activation Energy
    } else {
        closureFactor = 1 - ((scrollPercent - 0.7) / 0.3); // Open back up for Exonuclease
    }
});

// only track mouse inside canvas column
canvasColumn.addEventListener('mousemove', (e) => {
    const rect = canvasColumn.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

// Animation Loop
const clock = new THREE.Clock();
function animate3D() {
    requestAnimationFrame(animate3D);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Auto rotation + scroll rotation + mouse interaction
    polymeraseCloud.rotation.y = elapsedTime * 0.1 + targetRotationY + (mouseX * 0.3);
    polymeraseCloud.rotation.x = (mouseY * 0.1); 
    dnaCore.rotation.y = -(elapsedTime * 0.2 + targetRotationY);

    // Update particle positions based on "Breathing" (Conformational Entropy) and "Closure" (Induced Fit)
    const positionsAttribute = geometry.attributes.position;
    const posArray = positionsAttribute.array;
    
    const breatheAmount = (1 - closureFactor) * 1.5; // High entropy = high breathing
    const baseScale = 1 - (closureFactor * 0.5); // Shrink the radius by up to 50% when closed

    for(let i = 0; i < particleCount; i++) {
        // Base coordinate
        const bx = basePositions[i*3];
        const by = basePositions[i*3 + 1];
        const bz = basePositions[i*3 + 2];
        
        // Calculate dynamic offset (noise/breathing)
        const offset = Math.sin(elapsedTime * 3 + i) * breatheAmount;
        
        // Direction vector from center (normalized roughly)
        const len = Math.sqrt(bx*bx + by*by + bz*bz);
        const nx = bx / len;
        const ny = by / len;
        const nz = bz / len;
        
        // Apply closure scale and breathing offset
        posArray[i*3] = (bx * baseScale) + (nx * offset);
        posArray[i*3 + 1] = (by * baseScale) + (ny * offset);
        posArray[i*3 + 2] = (bz * baseScale) + (nz * offset);
    }
    
    positionsAttribute.needsUpdate = true;
    
    renderer.render(scene, camera);
}
animate3D();

// Resize handler targeting specifically the canvas column
window.addEventListener('resize', () => {
    const width = canvasColumn.clientWidth;
    const height = canvasColumn.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
