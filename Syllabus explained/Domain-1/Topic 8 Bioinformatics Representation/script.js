

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

// --- 5. Three.js Background (Grid Cylinder with Flow) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
// Fog to blend into dark background
scene.fog = new THREE.Fog('#030409', 5, 25);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Grid Cylinder
const radialSegments = 36;
const heightSegments = 60;
const particleCount = radialSegments * heightSegments; // 2160
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const initialY = new Float32Array(particleCount); // To store initial positions for animation
const speeds = new Float32Array(particleCount);

const color1 = new THREE.Color('#ff007f'); // Module 2 color (Pink)
const color2 = new THREE.Color('#ff4da6'); // Lighter Pink/Reddish

const radius = 7;
const height = 50;

let idx = 0;
for(let i = 0; i < radialSegments; i++) {
    for(let j = 0; j < heightSegments; j++) {
        // Structured Grid Cylinder
        const t = (i / radialSegments) * Math.PI * 2;
        const h = (j / heightSegments - 0.5) * height;
        
        const x = Math.cos(t) * radius;
        const y = h;
        const z = Math.sin(t) * radius;
        
        positions[idx*3] = x;
        positions[idx*3 + 1] = y;
        positions[idx*3 + 2] = z;
        
        initialY[idx] = y;
        speeds[idx] = 0.05 + Math.random() * 0.05; // Particles move at slightly different speeds
        
        // Color gradient around the cylinder
        const mixRatio = (Math.sin(t * 2) * 0.5) + 0.5;
        colors[idx*3] = color1.r * mixRatio + color2.r * (1 - mixRatio);
        colors[idx*3+1] = color1.g * mixRatio + color2.g * (1 - mixRatio);
        colors[idx*3+2] = color1.b * mixRatio + color2.b * (1 - mixRatio);
        
        idx++;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Connect points with lines to form the grid mesh
const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0xff007f, 
    transparent: true, 
    opacity: 0.1, // Very subtle grid
    blending: THREE.AdditiveBlending
});
const lineGeometry = new THREE.BufferGeometry();
// Connect vertical segments to form the grid lines
const linePositions = [];
for(let i = 0; i < radialSegments; i++) {
    for(let j = 0; j < heightSegments - 1; j++) {
        const index1 = (i * heightSegments) + j;
        const index2 = (i * heightSegments) + j + 1;
        linePositions.push(
            positions[index1*3], positions[index1*3+1], positions[index1*3+2],
            positions[index2*3], positions[index2*3+1], positions[index2*3+2]
        );
    }
}
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(networkLines);

const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);

const dataGroup = new THREE.Group();
dataGroup.add(particles);
dataGroup.add(networkLines);
scene.add(dataGroup);

// Initial slight tilt
dataGroup.rotation.x = 0.2;

// Scroll & Mouse Interaction for Data Flow
let targetRotationY = 0;
let targetPositionY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.001;
    targetPositionY = scrollY * 0.005;
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
    
    // Animate particles flowing through the cylinder
    const positionsAttr = geometry.attributes.position;
    for(let i = 0; i < particleCount; i++) {
        let currentY = positionsAttr.array[i*3 + 1];
        currentY += speeds[i]; // move up
        
        if (currentY > height / 2) {
            currentY = -height / 2; // wrap around to bottom
        }
        positionsAttr.array[i*3 + 1] = currentY;
    }
    positionsAttr.needsUpdate = true;
    
    // Auto rotation + scroll rotation + mouse interaction
    dataGroup.rotation.y = elapsedTime * 0.1 + targetRotationY + (mouseX * 0.2);
    dataGroup.rotation.x = 0.2 + (mouseY * 0.1); // Keep the base tilt
    dataGroup.position.y = targetPositionY;
    
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
