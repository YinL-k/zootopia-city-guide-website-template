<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - Drew Zootopia's Watch Night</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
        }

        canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        h1 {
            font-size: 64px;
            font-weight: 700;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f7b731);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 5s ease infinite;
            text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .subtitle {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 50px;
            letter-spacing: 2px;
        }

        
.enter-button {
    background: none;
    color: #ffffff;
    border: 2px solid #ffffff;
    padding: 15px 30px;
    font-size: 1.1em;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.enter-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #1a73e8;
    border-color: #1a73e8;
    box-shadow: 0 0 25px rgba(26, 115, 232, 0.7);
    transform: scale(1.05);
}

.glow {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent);
            border-radius: 50%;
            filter: blur(60px);
            animation: pulse 3s ease-in-out infinite;
            z-index: 0;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }
    </style>
</head>
<body>
    <?php echo "<h1 style='display:none'>Welcome! Logged in successfully.</h1>"; ?>
    
    <canvas id="fluidCanvas"></canvas>
    <div class="glow" style="top: 20%; left: 10%;"></div>
    <div class="glow" style="bottom: 20%; right: 10%;"></div>
    
    <div class="content">
        <h1>Welcome! Logged in successfully.</h1>
        <p class="subtitle">Ready for an amazing experience</p>
        <button class="enter-button" onclick="enterWatchNight()">ENTER DREW ZOOTOPIA WATCH NIGHT</button>
    </div>

    <script>
        const canvas = document.getElementById('fluidCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.life = Math.random() * 100 + 100;
                this.maxLife = this.life;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;

                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                const opacity = this.life / this.maxLife;
                const hue = (Date.now() / 50 + this.x / 10) % 360;
                ctx.fillStyle = 'hsla(' + hue + ', 70%, 60%, ' + (opacity * 0.6) + ')';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 150 }, () => new Particle());

        function animate() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.3;
                        const hue = (Date.now() / 50 + (p1.x + p2.x) / 20) % 360;
                        ctx.strokeStyle = 'hsla(' + hue + ', 70%, 60%, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        function enterWatchNight() {
            window.location.href = 'http://ari.sytes.net/';
        }
    </script>
</body>
</html>
