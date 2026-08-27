

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

// --- 5. Three.js Background (Statistical Inference Probability Surface) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

// Subtle fog for depth
scene.fog = new THREE.Fog('#030409', 20, 60);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 30;
camera.position.y = 8;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a Gaussian Bell Curve (Probability Distribution) to represent "Inference"
const geometry = new THREE.PlaneGeometry(100, 100, 60, 60);
const material = new THREE.MeshBasicMaterial({
    color: '#ff007f', // Module 2 color (Pink)
    wireframe: true,
    transparent: true,
    opacity: 0.35, // Increased brightness
    blending: THREE.AdditiveBlending
});

const probabilityMesh = new THREE.Mesh(geometry, material);
probabilityMesh.rotation.x = -Math.PI / 2 + 0.2;
scene.add(probabilityMesh);

// Scroll & Mouse Interaction
let targetRotationY = 0;
let targetPositionY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.0002; 
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
    
    // Very slow "breathing" of the statistical variance (width of the bell curve)
    // Increased base variance so the curve is much wider and bigger overall
    const variance = 350 + Math.sin(elapsedTime * 0.5) * 100; 
    
    for(let i = 0; i < positionsAttr.count; i++) {
        const x = positionsAttr.getX(i);
        const y = positionsAttr.getY(i);
        
        // 2D Gaussian function: e^(-(x^2 + y^2) / 2*sigma^2)
        const distSq = x*x + y*y;
        const z = Math.exp(-distSq / variance) * 20; // Max height increased to 20
        
        positionsAttr.setZ(i, z);
    }
    positionsAttr.needsUpdate = true;
    
    // Subtle auto rotation + mouse interaction
    probabilityMesh.rotation.z = (elapsedTime * 0.05) + targetRotationY + (mouseX * 0.05);
    probabilityMesh.position.y = -6 + targetPositionY + (mouseY * 1.0);
    
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
