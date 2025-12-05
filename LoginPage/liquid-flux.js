/*
 * Liquid Flux Simulation (Simplified Canvas Particle System)
 * Designed to create an artistic, fluid, and high-end background effect.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('liquid-canvas');
    if (!canvas) return; // Only run on welcome.php
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const maxParticles = 100;
    const particleRadius = 1;
    let colorPalette = [
        'rgba(26, 115, 232, 0.8)',   // Blue (Accent)
        'rgba(170, 100, 255, 0.8)',  // Purple
        'rgba(40, 44, 52, 0.8)',     // Dark Grey
        'rgba(255, 255, 255, 0.1)'   // Very faint White
    ];

    // --- Particle Class ---
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.radius = particleRadius;
            this.color = color;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.life = Math.random() * 60 + 30; // Random life span
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Move based on velocity
            this.x += this.speedX;
            this.y += this.speedY;

            // Simple boundary reflection for "flux"
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;

            // Adjust size over time
            this.radius *= 0.995;
            this.life--;
        }
    }
    
    // --- Core Functions ---
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        particles.push(new Particle(x, y, color));
    }

    function animate() {
        // Create a faint trail effect (simulating liquid blur/flux)
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'; // Very subtle dark overlay
        ctx.fillRect(0, 0, width, height);
        
        // Update and Draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Check for dead particles
            if (particles[i].life <= 0 || particles[i].radius < 0.1) {
                particles.splice(i, 1);
                i--;
            }
        }

        // Maintain particle count by adding new ones
        while (particles.length < maxParticles) {
            createParticle();
        }

        requestAnimationFrame(animate);
    }

    // --- Start ---
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();
});