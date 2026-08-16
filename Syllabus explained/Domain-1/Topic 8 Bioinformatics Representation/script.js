

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

// --- 5. Three.js Background (Minimalist Constellation / Gene Network) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

// Subtle fog for depth
scene.fog = new THREE.Fog('#030409', 10, 40);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a sparse, elegant constellation of nodes
const particleCount = 120;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = [];

const color1 = new THREE.Color('#ff007f'); // Module 2 color (Pink)
const color2 = new THREE.Color('#ff4da6'); // Lighter Pink

// Initialize particles randomly in a large volume
for(let i = 0; i < particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 40;
    positions[i*3+1] = (Math.random() - 0.5) * 40;
    positions[i*3+2] = (Math.random() - 0.5) * 20;
    
    // Very slow random drift velocities
    velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    });
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Subtle points
const material = new THREE.PointsMaterial({
    size: 0.12,
    color: color1,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);

// Lines for the dynamic network
const lineMaterial = new THREE.LineBasicMaterial({
    color: color2,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});
// We will update line geometry every frame
const lineGeometry = new THREE.BufferGeometry();
const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);

const dataGroup = new THREE.Group();
dataGroup.add(particles);
dataGroup.add(networkLines);
scene.add(dataGroup);

// Scroll & Mouse Interaction
let targetRotationY = 0;
let targetPositionY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.0005; // Very slow scroll rotation
    targetPositionY = scrollY * 0.002;
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
    const positionsAttr = geometry.attributes.position;
    
    // Update particle positions
    for(let i = 0; i < particleCount; i++) {
        positionsAttr.array[i*3] += velocities[i].x;
        positionsAttr.array[i*3+1] += velocities[i].y;
        positionsAttr.array[i*3+2] += velocities[i].z;
        
        // Bounce off bounds softly
        if(Math.abs(positionsAttr.array[i*3]) > 20) velocities[i].x *= -1;
        if(Math.abs(positionsAttr.array[i*3+1]) > 20) velocities[i].y *= -1;
        if(Math.abs(positionsAttr.array[i*3+2]) > 10) velocities[i].z *= -1;
    }
    positionsAttr.needsUpdate = true;
    
    // Dynamically connect nodes that are close to each other
    const linePositions = [];
    const connectDistance = 6.0;
    
    for(let i = 0; i < particleCount; i++) {
        for(let j = i + 1; j < particleCount; j++) {
            const dx = positionsAttr.array[i*3] - positionsAttr.array[j*3];
            const dy = positionsAttr.array[i*3+1] - positionsAttr.array[j*3+1];
            const dz = positionsAttr.array[i*3+2] - positionsAttr.array[j*3+2];
            const distSq = dx*dx + dy*dy + dz*dz;
            
            if(distSq < connectDistance * connectDistance) {
                linePositions.push(
                    positionsAttr.array[i*3], positionsAttr.array[i*3+1], positionsAttr.array[i*3+2],
                    positionsAttr.array[j*3], positionsAttr.array[j*3+1], positionsAttr.array[j*3+2]
                );
            }
        }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // Very subtle auto rotation + scroll + mouse
    dataGroup.rotation.y = elapsedTime * 0.05 + targetRotationY + (mouseX * 0.1);
    dataGroup.rotation.x = (mouseY * 0.05); 
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
