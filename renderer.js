// Canvas Renderer - Handles all visual rendering
class CricketRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Animation state
        this.animations = [];
        this.particles = [];
        this.fielders = [];
        
        // Camera/View
        this.camera = { x: 0, y: 0, zoom: 1 };
        
        // Field dimensions (normalized 0-1)
        this.fieldCenter = { x: 0.5, y: 0.5 };
        this.pitchLength = 0.15;
        this.pitchWidth = 0.05;
        
        // Player positions
        this.batsmanPos = { x: 0.5, y: 0.6 };
        this.bowlerPos = { x: 0.5, y: 0.3 };
        this.ballPos = null;
        this.ballTrail = [];
        
        // Animation frame
        this.lastFrameTime = 0;
        this.animationId = null;
    }

    setupCanvas() {
        const resize = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            this.draw();
        };
        
        resize();
        window.addEventListener('resize', resize);
    }

    // Main draw function
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field
        this.drawField();
        
        // Draw pitch
        this.drawPitch();
        
        // Draw fielders
        this.drawFielders();
        
        // Draw batsman
        this.drawBatsman();
        
        // Draw bowler
        this.drawBowler();
        
        // Draw ball
        this.drawBall();
        
        // Draw particles
        this.drawParticles();
        
        // Draw UI overlays
        this.drawOverlays();
    }

    drawField() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Outer boundary (oval)
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, w, h);
        
        // Field circle
        this.ctx.strokeStyle = '#5F9EA0';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.45, h*0.4, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner circle
        this.ctx.strokeStyle = '#4682B4';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.3, h*0.25, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 30-yard circle
        this.ctx.strokeStyle = '#87CEEB';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.2, h*0.15, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Boundary markers
        this.ctx.fillStyle = '#FFD700';
        const boundaryPositions = [
            { x: 0.1, y: 0.5 },   // Fine leg
            { x: 0.3, y: 0.2 },   // Cover
            { x: 0.5, y: 0.1 },   // Long off
            { x: 0.7, y: 0.2 },   // Long on
            { x: 0.9, y: 0.5 },   // Fine leg
            { x: 0.7, y: 0.8 },   // Square leg
            { x: 0.5, y: 0.9 },   // Long on
            { x: 0.3, y: 0.8 }    // Square leg
        ];
        
        boundaryPositions.forEach(pos => {
            this.ctx.beginPath();
            this.ctx.arc(w * pos.x, h * pos.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawPitch() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pitchW = w * this.pitchWidth;
        const pitchH = h * this.pitchLength;
        const pitchX = w * 0.5 - pitchW / 2;
        const pitchY = h * 0.4;
        
        // Pitch rectangle
        this.ctx.fillStyle = '#8B7355';
        this.ctx.fillRect(pitchX, pitchY, pitchW, pitchH);
        
        // Pitch lines
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(pitchX, pitchY, pitchW, pitchH);
        
        // Crease lines
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        
        // Batting crease (bottom)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 20, pitchY + pitchH);
        this.ctx.lineTo(pitchX + pitchW + 20, pitchY + pitchH);
        this.ctx.stroke();
        
        // Bowling crease (top)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 20, pitchY);
        this.ctx.lineTo(pitchX + pitchW + 20, pitchY);
        this.ctx.stroke();
        
        // Stumps
        this.drawStumps(pitchX + pitchW / 2, pitchY + pitchH, true);  // Batting end
        this.drawStumps(pitchX + pitchW / 2, pitchY, false);  // Bowling end
    }

    drawStumps(x, y, isBattingEnd) {
        const stumpWidth = 3;
        const stumpHeight = 20;
        const stumpSpacing = 8;
        
        this.ctx.fillStyle = '#8B4513';
        for (let i = -1; i <= 1; i++) {
            this.ctx.fillRect(
                x + i * stumpSpacing - stumpWidth / 2,
                y - stumpHeight,
                stumpWidth,
                stumpHeight
            );
        }
        
        // Bails
        if (isBattingEnd) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(
                x - stumpSpacing - 2,
                y - stumpHeight - 2,
                stumpSpacing * 2 + 4,
                4
            );
        }
    }

    drawFielders() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Draw fielders at various positions
        const positions = [
            { x: 0.25, y: 0.2, name: 'Cover' },
            { x: 0.3, y: 0.25, name: 'Mid-off' },
            { x: 0.7, y: 0.25, name: 'Mid-on' },
            { x: 0.75, y: 0.2, name: 'Long-on' },
            { x: 0.2, y: 0.5, name: 'Point' },
            { x: 0.8, y: 0.5, name: 'Square Leg' },
            { x: 0.25, y: 0.7, name: 'Fine Leg' },
            { x: 0.75, y: 0.7, name: 'Third Man' }
        ];
        
        positions.forEach(pos => {
            this.drawFielder(w * pos.x, h * pos.y, pos.name);
        });
    }

    drawFielder(x, y, name) {
        // Fielder circle
        this.ctx.fillStyle = '#4169E1';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Fielder outline
        this.ctx.strokeStyle = '#000080';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Name label (optional, can be toggled)
        // this.ctx.fillStyle = '#000';
        // this.ctx.font = '10px Arial';
        // this.ctx.fillText(name, x - 15, y - 15);
    }

    drawBatsman() {
        if (!this.batsmanPos) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = w * this.batsmanPos.x;
        const y = h * this.batsmanPos.y;
        
        // Batsman body
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Batsman outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Bat
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10, y - 5);
        this.ctx.lineTo(x + 25, y - 20);
        this.ctx.stroke();
    }

    drawBowler() {
        if (!this.bowlerPos) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = w * this.bowlerPos.x;
        const y = h * this.bowlerPos.y;
        
        // Bowler body
        this.ctx.fillStyle = '#FF6347';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bowler outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Bowling arm animation
        const time = Date.now() / 1000;
        const armAngle = Math.sin(time * 3) * 0.3;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(armAngle);
        this.ctx.strokeStyle = '#FF6347';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(20, -15);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBall() {
        if (!this.ballPos) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = w * this.ballPos.x;
        const y = h * this.ballPos.y;
        
        // Ball trail
        if (this.ballTrail.length > 1) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(w * this.ballTrail[0].x, h * this.ballTrail[0].y);
            for (let i = 1; i < this.ballTrail.length; i++) {
                this.ctx.lineTo(w * this.ballTrail[i].x, h * this.ballTrail[i].y);
            }
            this.ctx.stroke();
        }
        
        // Ball
        this.ctx.fillStyle = '#FF4500';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball seam
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 4, y);
        this.ctx.lineTo(x + 4, y);
        this.ctx.stroke();
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();
            
            // Update particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.02;
            particle.size *= 0.98;
            
            // Remove dead particles
            if (particle.alpha <= 0 || particle.size <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    drawOverlays() {
        // Draw any UI overlays on canvas if needed
    }

    // Animation methods
    animateBallDelivery(fromPos, toPos, duration = 1000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const startX = fromPos.x;
            const startY = fromPos.y;
            const deltaX = toPos.x - startX;
            const deltaY = toPos.y - startY;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const ease = 1 - Math.pow(1 - progress, 3);
                
                this.ballPos = {
                    x: startX + deltaX * ease,
                    y: startY + deltaY * ease
                };
                
                // Add to trail
                this.ballTrail.push({ ...this.ballPos });
                if (this.ballTrail.length > 10) {
                    this.ballTrail.shift();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.ballPos = null;
                    this.ballTrail = [];
                    resolve();
                }
            };
            
            animate();
        });
    }

    createParticles(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 5 + 2,
                color: color,
                alpha: 1
            });
        }
    }

    animateBoundary(x, y) {
        this.createParticles(x, y, '#FFD700', 30);
    }

    animateWicket(x, y) {
        this.createParticles(x, y, '#FF0000', 15);
        // Animate stumps falling
        // (simplified - could add more complex animation)
    }

    startAnimation() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            this.draw();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(animate);
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    updateBatsmanPosition(x, y) {
        this.batsmanPos = { x, y };
    }

    updateBowlerPosition(x, y) {
        this.bowlerPos = { x, y };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketRenderer;
}

