

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

// --- 5. Three.js Background (Cohesive Data Wave) ---
const canvasColumn = document.querySelector('.canvas-column');
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

// Subtle fog for depth
scene.fog = new THREE.Fog('#030409', 15, 50);

const camera = new THREE.PerspectiveCamera(45, canvasColumn.clientWidth / canvasColumn.clientHeight, 0.1, 100);
camera.position.z = 25;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvasColumn.clientWidth, canvasColumn.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a single, cohesive, slow-moving structural wave (Not dispersed, not fast)
const geometry = new THREE.PlaneGeometry(80, 40, 60, 30);
const material = new THREE.MeshBasicMaterial({
    color: '#ff007f', // Module 2 color (Pink)
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});

const waveMesh = new THREE.Mesh(geometry, material);
// Lay the plane down so it looks like a landscape/ribbon
waveMesh.rotation.x = -Math.PI / 2 + 0.3;
scene.add(waveMesh);

// Scroll & Mouse Interaction
let targetRotationY = 0;
let targetPositionY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetRotationY = scrollY * 0.0002; // Very subtle scroll effect
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
    
    // Very slow, gentle wave undulation (cohesive structure, no flying particles)
    for(let i = 0; i < positionsAttr.count; i++) {
        const x = positionsAttr.getX(i);
        const y = positionsAttr.getY(i);
        
        // Gentle math wave: slow speed (0.3), large wavelength
        const z = Math.sin(x * 0.1 + elapsedTime * 0.3) * 1.5 + 
                  Math.cos(y * 0.1 + elapsedTime * 0.2) * 1.5;
        
        positionsAttr.setZ(i, z);
    }
    positionsAttr.needsUpdate = true;
    
    // Subtle auto rotation + mouse interaction
    waveMesh.rotation.z = (elapsedTime * 0.02) + targetRotationY + (mouseX * 0.05);
    waveMesh.position.y = -5 + targetPositionY + (mouseY * 1.0);
    
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
