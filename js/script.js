const particleCanvas = document.getElementById('particleCanvas');
const gridCanvas = document.getElementById('gridCanvas');
const particleCtx = particleCanvas.getContext('2d');
const gridCtx = gridCanvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 30 : 100;

function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const force = (150 - distance) / 150;
            this.vx -= (dx / distance) * force * 0.2;
            this.vy -= (dy / distance) * force * 0.2;
        }

        this.vx *= 0.99;
        this.vy *= 0.99;

        if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;

        this.x = Math.max(0, Math.min(particleCanvas.width, this.x));
        this.y = Math.max(0, Math.min(particleCanvas.height, this.y));
    }

    draw() {
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        particleCtx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        particleCtx.fill();

        const gradient = particleCtx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(0, 240, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        particleCtx.fillStyle = gradient;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        particleCtx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.2;
                particleCtx.beginPath();
                particleCtx.moveTo(particles[i].x, particles[i].y);
                particleCtx.lineTo(particles[j].x, particles[j].y);
                particleCtx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                particleCtx.lineWidth = 1;
                particleCtx.stroke();
            }
        }
    }
}

let gridOffset = 0;

function drawGrid() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    const gridSize = isMobile ? 60 : 40;
    const scrollOffset = window.pageYOffset * 0.3;

    gridCtx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    gridCtx.lineWidth = 1;

    for (let x = -gridSize; x < gridCanvas.width + gridSize; x += gridSize) {
        gridCtx.beginPath();
        const xPos = x + (gridOffset % gridSize);
        gridCtx.moveTo(xPos, 0);
        gridCtx.lineTo(xPos, gridCanvas.height);
        gridCtx.stroke();
    }

    for (let y = -gridSize; y < gridCanvas.height + gridSize; y += gridSize) {
        gridCtx.beginPath();
        const yPos = y + (gridOffset % gridSize) - scrollOffset;
        gridCtx.moveTo(0, yPos);
        gridCtx.lineTo(gridCanvas.width, yPos);
        gridCtx.stroke();
    }

    gridOffset += 0.2;
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    drawGrid();

    requestAnimationFrame(animateParticles);
}

animateParticles();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const revealElements = document.querySelectorAll('.reveal');

function reveal() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();

const navLinks = document.querySelectorAll('.nav-item');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        const glow = this.querySelector('.button-glow');
        if (glow) {
            glow.style.width = '300%';
            glow.style.height = '300%';
            glow.style.opacity = '0.3';
        }
    });

    button.addEventListener('mouseleave', function() {
        const glow = this.querySelector('.button-glow');
        if (glow) {
            glow.style.width = '0';
            glow.style.height = '0';
            glow.style.opacity = '0';
        }
    });
});

const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

let scrollPosition = 0;
let ticking = false;

function updateParallax() {
    scrollPosition = window.pageYOffset;

    const heroContent = document.querySelector('.hero-content-wrapper');
    if (heroContent) {
        const offset = scrollPosition * 0.5;
        heroContent.style.transform = `translateY(${offset}px)`;
        heroContent.style.opacity = Math.max(0, 1 - scrollPosition / 600);
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 #00f0ff,
            ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 #ff00ff,
            0 0 ${Math.random() * 40 + 20}px #00f0ff
        `;
    }, 100);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .discord-container').forEach(el => {
    observer.observe(el);
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

const logoHero = document.querySelector('.logo-hero');
if (logoHero) {
    let rotation = 0;
    setInterval(() => {
        rotation += 0.1;
        logoHero.style.transform = `perspective(1000px) rotateY(${Math.sin(rotation) * 5}deg)`;
    }, 16);
}

const iconHexagons = document.querySelectorAll('.icon-hexagon');
iconHexagons.forEach(hex => {
    hex.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(180deg) scale(1.2)';
        this.style.boxShadow = '0 0 60px #00f0ff';
    });

    hex.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0deg) scale(1)';
        this.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.5)';
    });
});

let cursorGlow = document.createElement('div');
cursorGlow.style.position = 'fixed';
cursorGlow.style.width = '300px';
cursorGlow.style.height = '300px';
cursorGlow.style.borderRadius = '50%';
cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)';
cursorGlow.style.pointerEvents = 'none';
cursorGlow.style.transform = 'translate(-50%, -50%)';
cursorGlow.style.zIndex = '9999';
cursorGlow.style.transition = 'opacity 0.3s ease';
document.body.appendChild(cursorGlow);

let cursorX = 0;
let cursorY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    currentX += (cursorX - currentX) * 0.1;
    currentY += (cursorY - currentY) * 0.1;

    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

const discordButton = document.querySelector('.discord-button');
if (discordButton) {
    discordButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05) rotate(-1deg)';
    });

    discordButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
}

setInterval(() => {
    const randomParticle = particles[Math.floor(Math.random() * particles.length)];
    randomParticle.opacity = Math.random() * 0.8 + 0.2;
}, 200);
