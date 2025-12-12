// Canvas Renderer - Handles all visual rendering
class CricketRenderer {
    constructor(canvasId) {
        // Initialize all properties FIRST before calling any methods
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
        
        // Now get canvas and context
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Setup canvas after everything is initialized
        this.setupCanvas();
    }

    setupCanvas() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available in setupCanvas');
            return;
        }
        
        const resize = () => {
            if (!this.canvas || !this.ctx) return;
            
            const container = this.canvas.parentElement;
            if (!container) {
                console.warn('Canvas parent element not found');
                return;
            }
            
            const width = container.clientWidth || 800;
            const height = container.clientHeight || 600;
            
            // Set canvas size
            this.canvas.width = width;
            this.canvas.height = height;
            
            console.log('Canvas resized to:', width, 'x', height);
            
            // Force a redraw
            if (this.canvas.width > 0 && this.canvas.height > 0) {
                this.draw();
            }
        };
        
        // Initial resize
        setTimeout(() => {
            resize();
        }, 100);
        
        // Resize on window resize
        window.addEventListener('resize', resize);
    }

    // Main draw function
    draw() {
        // Safety checks
        if (!this.canvas || !this.ctx) {
            console.warn('Canvas or context not available');
            return;
        }
        
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            // Canvas not sized yet
            return;
        }
        
        if (!this.particles) {
            this.particles = [];
        }
        
        try {
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
        } catch (error) {
            console.error('Error in draw:', error);
        }
    }

    drawField() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Green grass background (cricket field)
        const grassGradient = this.ctx.createLinearGradient(0, 0, 0, h);
        grassGradient.addColorStop(0, '#7CB342'); // Light green
        grassGradient.addColorStop(0.5, '#66BB6A'); // Medium green
        grassGradient.addColorStop(1, '#4CAF50'); // Dark green
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 0, w, h);
        
        // Grass texture pattern (subtle)
        this.ctx.fillStyle = 'rgba(76, 175, 80, 0.15)';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 3 + 1;
            this.ctx.fillRect(x, y, size, size * 2);
        }
        
        // Outer boundary circle (oval cricket field) - white boundary rope
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.48, h*0.42, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner shadow for boundary
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.48, h*0.42, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner circle (30-yard circle) - dashed line
        this.ctx.strokeStyle = '#81C784';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.ellipse(w/2, h/2, w*0.35, h*0.28, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Boundary rope markers (white posts)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.lineWidth = 2;
        const boundaryPositions = [
            { x: 0.08, y: 0.5, name: 'Fine Leg' },
            { x: 0.25, y: 0.15, name: 'Cover' },
            { x: 0.5, y: 0.05, name: 'Long Off' },
            { x: 0.75, y: 0.15, name: 'Long On' },
            { x: 0.92, y: 0.5, name: 'Fine Leg' },
            { x: 0.75, y: 0.85, name: 'Square Leg' },
            { x: 0.5, y: 0.95, name: 'Long On' },
            { x: 0.25, y: 0.85, name: 'Square Leg' }
        ];
        
        boundaryPositions.forEach(pos => {
            // Boundary post
            this.ctx.fillRect(w * pos.x - 3, h * pos.y - 8, 6, 16);
            this.ctx.strokeRect(w * pos.x - 3, h * pos.y - 8, 6, 16);
        });
    }

    drawPitch() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pitchW = w * 0.08; // Wider pitch
        const pitchH = h * 0.25; // Longer pitch
        const pitchX = w * 0.5 - pitchW / 2;
        const pitchY = h * 0.35;
        
        // Pitch shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(pitchX - 2, pitchY + pitchH + 2, pitchW + 4, 5);
        
        // Main pitch rectangle (brown/dirt color)
        const pitchGradient = this.ctx.createLinearGradient(pitchX, pitchY, pitchX, pitchY + pitchH);
        pitchGradient.addColorStop(0, '#9E7A5A');
        pitchGradient.addColorStop(0.5, '#8B6F47');
        pitchGradient.addColorStop(1, '#7A5F3A');
        this.ctx.fillStyle = pitchGradient;
        this.ctx.fillRect(pitchX, pitchY, pitchW, pitchH);
        
        // Pitch border
        this.ctx.strokeStyle = '#6B5D47';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(pitchX, pitchY, pitchW, pitchH);
        
        // Pitch markings (grass lines)
        this.ctx.strokeStyle = '#7A6B55';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = pitchY + (pitchH / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(pitchX, y);
            this.ctx.lineTo(pitchX + pitchW, y);
            this.ctx.stroke();
        }
        
        // Crease lines (white)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        
        // Batting crease (bottom) - wider
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 30, pitchY + pitchH);
        this.ctx.lineTo(pitchX + pitchW + 30, pitchY + pitchH);
        this.ctx.stroke();
        
        // Bowling crease (top) - wider
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 30, pitchY);
        this.ctx.lineTo(pitchX + pitchW + 30, pitchY);
        this.ctx.stroke();
        
        // Return crease lines (vertical)
        this.ctx.lineWidth = 1.5;
        // Left return crease (batting end)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 30, pitchY + pitchH - 10);
        this.ctx.lineTo(pitchX - 30, pitchY + pitchH + 10);
        this.ctx.stroke();
        // Right return crease (batting end)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX + pitchW + 30, pitchY + pitchH - 10);
        this.ctx.lineTo(pitchX + pitchW + 30, pitchY + pitchH + 10);
        this.ctx.stroke();
        // Left return crease (bowling end)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX - 30, pitchY - 10);
        this.ctx.lineTo(pitchX - 30, pitchY + 10);
        this.ctx.stroke();
        // Right return crease (bowling end)
        this.ctx.beginPath();
        this.ctx.moveTo(pitchX + pitchW + 30, pitchY - 10);
        this.ctx.lineTo(pitchX + pitchW + 30, pitchY + 10);
        this.ctx.stroke();
        
        // Stumps
        this.drawStumps(pitchX + pitchW / 2, pitchY + pitchH, true);  // Batting end
        this.drawStumps(pitchX + pitchW / 2, pitchY, false);  // Bowling end
    }

    drawStumps(x, y, isBattingEnd) {
        const stumpWidth = 4;
        const stumpHeight = 25;
        const stumpSpacing = 10;
        
        // Stump shadows
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = -1; i <= 1; i++) {
            this.ctx.fillRect(
                x + i * stumpSpacing - stumpWidth / 2 + 1,
                y - stumpHeight + 1,
                stumpWidth,
                stumpHeight
            );
        }
        
        // Stumps (wooden brown)
        this.ctx.fillStyle = '#8B4513';
        for (let i = -1; i <= 1; i++) {
            this.ctx.fillRect(
                x + i * stumpSpacing - stumpWidth / 2,
                y - stumpHeight,
                stumpWidth,
                stumpHeight
            );
        }
        
        // Stump highlights
        this.ctx.fillStyle = '#A0522D';
        for (let i = -1; i <= 1; i++) {
            this.ctx.fillRect(
                x + i * stumpSpacing - stumpWidth / 2,
                y - stumpHeight,
                1,
                stumpHeight
            );
        }
        
        // Bails (white)
        if (isBattingEnd) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.strokeStyle = '#CCCCCC';
            this.ctx.lineWidth = 1;
            // Left bail
            this.ctx.fillRect(
                x - stumpSpacing - 3,
                y - stumpHeight - 3,
                6,
                5
            );
            this.ctx.strokeRect(
                x - stumpSpacing - 3,
                y - stumpHeight - 3,
                6,
                5
            );
            // Right bail
            this.ctx.fillRect(
                x + stumpSpacing - 3,
                y - stumpHeight - 3,
                6,
                5
            );
            this.ctx.strokeRect(
                x + stumpSpacing - 3,
                y - stumpHeight - 3,
                6,
                5
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
        // Fielder shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 10, 8, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Fielder body (circle for head)
        this.ctx.fillStyle = '#FFDBAC'; // Skin color
        this.ctx.beginPath();
        this.ctx.arc(x, y - 8, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Fielder jersey (opponent team color - different from batsman)
        this.ctx.fillStyle = '#FF5722'; // Orange/red for opponent
        this.ctx.fillRect(x - 8, y - 2, 16, 12);
        this.ctx.strokeRect(x - 8, y - 2, 16, 12);
        
        // Fielder legs
        this.ctx.fillStyle = '#FFFFFF'; // White pants
        this.ctx.fillRect(x - 4, y + 10, 3, 8);
        this.ctx.fillRect(x + 1, y + 10, 3, 8);
        
        // Fielder outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    drawBatsman() {
        if (!this.batsmanPos) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = w * this.batsmanPos.x;
        const y = h * this.batsmanPos.y;
        
        // Batsman shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 20, 12, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Batsman head
        this.ctx.fillStyle = '#FFDBAC'; // Skin color
        this.ctx.beginPath();
        this.ctx.arc(x, y - 15, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Helmet
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 15, 11, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Batsman body (torso)
        this.ctx.fillStyle = '#FFFFFF'; // White jersey
        this.ctx.fillRect(x - 12, y - 5, 24, 18);
        this.ctx.strokeRect(x - 12, y - 5, 24, 18);
        
        // Legs
        this.ctx.fillStyle = '#000000'; // Black pants
        this.ctx.fillRect(x - 6, y + 13, 5, 10);
        this.ctx.fillRect(x + 1, y + 13, 5, 10);
        
        // Bat (angled)
        this.ctx.save();
        this.ctx.translate(x + 8, y);
        this.ctx.rotate(-0.3);
        // Bat handle
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -15);
        this.ctx.stroke();
        // Bat blade
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(0, -35);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Gloves
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(x - 12, y - 2, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + 12, y - 2, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBowler() {
        // Default bowler position (top of pitch - bowling end)
        if (!this.bowlerPos) {
            this.bowlerPos = { x: 0.5, y: 0.3 };
        }
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const baseX = w * this.bowlerPos.x;
        const baseY = h * this.bowlerPos.y;
        
        // Bowler running animation - runs from back to front (bowling end)
        const time = Date.now() / 1000;
        const runSpeed = 3; // Animation speed
        const runDistance = 50; // Distance to run
        const runProgress = (Math.sin(time * runSpeed) + 1) / 2; // 0 to 1
        
        // Bowler runs from behind (y - 40) to bowling crease (baseY)
        const startY = baseY - 40;
        const endY = baseY;
        const currentY = startY + (endY - startY) * runProgress;
        
        // Slight side-to-side movement while running
        const sideOffset = Math.sin(time * runSpeed * 2) * 2;
        const drawX = baseX + sideOffset;
        const drawY = currentY;
        
        // Only show bowler when running (not at start position)
        if (runProgress < 0.05) {
            return; // Bowler is at start, not visible yet
        }
        
        // Bowler shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(drawX, drawY + 18, 10, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bowler head
        this.ctx.fillStyle = '#FFDBAC'; // Skin color
        this.ctx.beginPath();
        this.ctx.arc(drawX, drawY - 10, 7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Bowler cap/helmet (opponent team color)
        this.ctx.fillStyle = '#FF5722'; // Orange/red for opponent
        this.ctx.beginPath();
        this.ctx.arc(drawX, drawY - 10, 8, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Bowler torso (jersey)
        this.ctx.fillStyle = '#FF5722'; // Opponent team color
        this.ctx.fillRect(drawX - 9, drawY - 3, 18, 14);
        this.ctx.strokeRect(drawX - 9, drawY - 3, 18, 14);
        
        // Legs (running animation - faster when running)
        const legSpeed = runSpeed * 3;
        const legAngle = Math.sin(time * legSpeed) * 0.5;
        this.ctx.fillStyle = '#FFFFFF'; // White pants
        this.ctx.save();
        this.ctx.translate(drawX - 4, drawY + 11);
        this.ctx.rotate(legAngle);
        this.ctx.fillRect(-2, 0, 4, 10);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(drawX + 4, drawY + 11);
        this.ctx.rotate(-legAngle);
        this.ctx.fillRect(-2, 0, 4, 10);
        this.ctx.restore();
        
        // Arms (running motion)
        const armAngle = Math.sin(time * legSpeed) * 0.6;
        this.ctx.strokeStyle = '#FFDBAC';
        this.ctx.lineWidth = 3;
        
        // Left arm (back)
        this.ctx.save();
        this.ctx.translate(drawX - 9, drawY + 2);
        this.ctx.rotate(-armAngle);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-15, 8);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Right arm (front - bowling arm)
        this.ctx.save();
        this.ctx.translate(drawX + 9, drawY + 2);
        this.ctx.rotate(armAngle);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(18, -12);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Ball in hand (when about to bowl - near the end of run)
        if (runProgress > 0.85 && runProgress < 0.95) {
            const ballX = drawX + 9 + Math.cos(armAngle) * 18;
            const ballY = drawY + 2 + Math.sin(armAngle) * -12;
            this.ctx.fillStyle = '#FF4500';
            this.ctx.beginPath();
            this.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    drawBall() {
        if (!this.ballPos) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = w * this.ballPos.x;
        const y = h * this.ballPos.y;
        
        // Ball trail (motion blur effect)
        if (this.ballTrail && this.ballTrail.length > 1) {
            for (let i = 0; i < this.ballTrail.length - 1; i++) {
                const alpha = (i / this.ballTrail.length) * 0.3;
                const trailX = w * this.ballTrail[i].x;
                const trailY = h * this.ballTrail[i].y;
                
                this.ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Ball shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 8, 5, 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball (red cricket ball)
        const ballGradient = this.ctx.createRadialGradient(x - 2, y - 2, 0, x, y, 8);
        ballGradient.addColorStop(0, '#FF6B35');
        ballGradient.addColorStop(1, '#CC4400');
        this.ctx.fillStyle = ballGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball outline
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Ball seam (white stitching)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        // Main seam line
        this.ctx.moveTo(x - 5, y);
        this.ctx.lineTo(x + 5, y);
        this.ctx.stroke();
        // Curved seam
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI);
        this.ctx.stroke();
        
        // Ball highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(x - 2, y - 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawParticles() {
        // Safety check
        if (!this.particles || !Array.isArray(this.particles)) {
            this.particles = [];
            return;
        }
        
        // Iterate backwards to safely remove items
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (!particle) continue;
            
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
                this.particles.splice(i, 1);
            }
        }
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
        if (this.animationId) {
            // Already animating
            return;
        }
        
        console.log('Starting renderer animation...');
        
        const animate = (currentTime) => {
            if (!this.canvas || !this.ctx) {
                console.warn('Canvas or context missing, stopping animation');
                return;
            }
            
            try {
                const deltaTime = currentTime - this.lastFrameTime;
                this.lastFrameTime = currentTime;
                
                this.draw();
                
                this.animationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Error in animation loop:', error);
                // Continue animation even if there's an error
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(animate);
        
        console.log('Renderer animation started');
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

