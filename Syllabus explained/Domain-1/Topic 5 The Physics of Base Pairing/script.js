

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

// Parallax Glide Effect for Glass Cards (Very Noticeable)
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

// (3D Tilt effect removed as requested)

// --- 5. Three.js Background (DNA Helix) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
// Fog to blend into dark background
scene.fog = new THREE.Fog('#030409', 10, 45);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 18; // Moved closer to make it bigger

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particle DNA Double Helix
const particleCount = 1000; // Increased density
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const radius = 5.0; // Increased diameter
const heightStr = 45;

const color1 = new THREE.Color('#00e5ff'); // Bright Cyan
const color2 = new THREE.Color('#ff007f'); // Bright Neon Pink

for(let i = 0; i < particleCount; i++) {
    const strand = i % 2;
    const t = i / particleCount;
    const angle = t * Math.PI * 24 + (strand * Math.PI); // 12 full turns
    
    const x = Math.cos(angle) * radius;
    const y = (t - 0.5) * heightStr;
    const z = Math.sin(angle) * radius;
    
    positions[i*3] = x;
    positions[i*3 + 1] = y;
    positions[i*3 + 2] = z;
    
    if(strand === 0) {
        colors[i*3] = color1.r;
        colors[i*3+1] = color1.g;
        colors[i*3+2] = color1.b;
    } else {
        colors[i*3] = color2.r;
        colors[i*3+1] = color2.g;
        colors[i*3+2] = color2.b;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Add connecting lines (rungs)
const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x888888, 
    transparent: true, 
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(particleCount * 3);

let lineIndex = 0;
for(let i = 0; i < particleCount-1; i+=2) {
    linePositions[lineIndex++] = positions[i*3];
    linePositions[lineIndex++] = positions[i*3+1];
    linePositions[lineIndex++] = positions[i*3+2];
    
    linePositions[lineIndex++] = positions[(i+1)*3];
    linePositions[lineIndex++] = positions[(i+1)*3+1];
    linePositions[lineIndex++] = positions[(i+1)*3+2];
}
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const rungs = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(rungs);

const material = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.35, // reduced opacity for more translucency
    blending: THREE.AdditiveBlending // Creates a beautiful glow effect
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// DNA Container Group for easy rotation
const dnaGroup = new THREE.Group();
dnaGroup.add(particles);
dnaGroup.add(rungs);
scene.add(dnaGroup);

// Initial slight tilt
dnaGroup.rotation.z = 0.2;
dnaGroup.rotation.x = 0.2;

// Scroll & Mouse Interaction for DNA
let targetRotationY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.002;
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
    dnaGroup.rotation.y = elapsedTime * 0.2 + targetRotationY + (mouseX * 0.3);
    dnaGroup.rotation.x = 0.2 + (mouseY * 0.1); // Keep the base tilt
    
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
