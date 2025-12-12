// Main Game Controller
let gameEngine;
let renderer;
let gameLoop;

// Wait for all scripts to load
function waitForScripts(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkScripts = () => {
        attempts++;
        const hasGameData = typeof cricketTeams !== 'undefined';
        const hasGameEngine = typeof CricketGameEngine !== 'undefined';
        const hasRenderer = typeof CricketRenderer !== 'undefined';
        
        console.log(`Attempt ${attempts}: gameData=${hasGameData}, gameEngine=${hasGameEngine}, renderer=${hasRenderer}`);
        
        if (hasGameData && hasGameEngine && hasRenderer) {
            console.log('All scripts loaded!');
            callback();
        } else if (attempts < maxAttempts) {
            setTimeout(checkScripts, 100);
        } else {
            console.error('Scripts failed to load after', maxAttempts, 'attempts');
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 50px; text-align: center; color: red; background: white; margin: 20px; border-radius: 10px;';
            errorDiv.innerHTML = `
                <h1>Error Loading Game</h1>
                <p>Some scripts failed to load. Please check:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>gameData.js: ${hasGameData ? '✓' : '✗'}</li>
                    <li>gameEngine.js: ${hasGameEngine ? '✓' : '✗'}</li>
                    <li>renderer.js: ${hasRenderer ? '✓' : '✗'}</li>
                </ul>
                <p>Make sure all files are in the same folder and refresh the page.</p>
            `;
            document.body.appendChild(errorDiv);
        }
    };
    checkScripts();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, waiting for scripts...');
    
    waitForScripts(() => {
        try {
            console.log('Initializing game components...');
            
            gameEngine = new CricketGameEngine();
            renderer = new CricketRenderer('gameCanvas');
            
            console.log('Game engine and renderer created');
            
            initializeSetupScreen();
            initializeGameScreen();
            
            // Start renderer animation
            if (renderer) {
                // Wait a bit for canvas to be ready
                setTimeout(() => {
                    if (renderer && renderer.canvas) {
                        renderer.startAnimation();
                        console.log('Renderer animation started');
                    }
                }, 200);
            }
            
            // Start game loop
            startGameLoop();
            
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Error initializing game:', error);
            console.error('Error stack:', error.stack);
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 50px; text-align: center; color: red; background: white; margin: 20px; border-radius: 10px;';
            errorDiv.innerHTML = `
                <h1>Error Loading Game</h1>
                <p><strong>${error.message}</strong></p>
                <p>Please check the browser console (F12) for details.</p>
                <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">${error.stack}</pre>
            `;
            document.body.appendChild(errorDiv);
        }
    });
});

function initializeSetupScreen() {
    try {
        // Load teams
        const teamSelector = document.getElementById('teamSelector');
        const opponentSelector = document.getElementById('opponentSelector');
        
        // Check if elements exist
        if (!teamSelector || !opponentSelector) {
            console.error('Team selector elements not found!');
            setTimeout(initializeSetupScreen, 100);
            return;
        }
        
        // Check if cricketTeams is defined
        if (typeof cricketTeams === 'undefined' || cricketTeams === null) {
            console.error('cricketTeams not loaded! Make sure gameData.js is loaded before main.js');
            teamSelector.innerHTML = '<p style="color: red; padding: 20px;">Error: Teams data not loaded. Please refresh the page.</p>';
            opponentSelector.innerHTML = '<p style="color: red; padding: 20px;">Error: Teams data not loaded.</p>';
            return;
        }
        
        // Clear any existing content (including loading message)
        teamSelector.innerHTML = '';
        opponentSelector.innerHTML = '';
        
        // Safely get team names
        let teamNames = [];
        try {
            teamNames = Object.keys(cricketTeams);
        } catch (e) {
            console.error('Error getting team keys:', e);
            teamSelector.innerHTML = '<p style="color: red; padding: 20px;">Error reading teams data: ' + e.message + '</p>';
            return;
        }
        
        console.log('Loading teams:', teamNames);
        console.log('Total teams found:', teamNames.length);
        console.log('cricketTeams type:', typeof cricketTeams);
        console.log('cricketTeams is array?', Array.isArray(cricketTeams));
        
        if (!Array.isArray(teamNames) || teamNames.length === 0) {
            teamSelector.innerHTML = '<p style="color: red; padding: 20px;">No teams found! Please check gameData.js</p>';
            opponentSelector.innerHTML = '<p style="color: red; padding: 20px;">No teams found!</p>';
            return;
        }
        
        // Create team cards
        teamNames.forEach(teamName => {
            try {
                const team = cricketTeams[teamName];
                
                if (!team || !team.name) {
                    console.warn('Invalid team data for:', teamName);
                    return;
                }
                
                // Player team selector
                const teamCard = createTeamCard(team);
                if (teamCard) {
                    teamCard.onclick = () => selectTeam(teamName, teamCard, 'player');
                    teamSelector.appendChild(teamCard);
                }
                
                // Opponent team selector
                const opponentCard = createTeamCard(team);
                if (opponentCard) {
                    opponentCard.onclick = () => selectTeam(teamName, opponentCard, 'opponent');
                    opponentSelector.appendChild(opponentCard);
                }
            } catch (e) {
                console.error('Error creating card for team:', teamName, e);
            }
        });
        
        console.log('Teams loaded successfully. Total teams:', teamNames.length);
        console.log('Team cards created:', teamSelector.children.length, 'for player,', opponentSelector.children.length, 'for opponent');
    } catch (error) {
        console.error('Error in initializeSetupScreen:', error);
        console.error('Error stack:', error.stack);
        const teamSelector = document.getElementById('teamSelector');
        const opponentSelector = document.getElementById('opponentSelector');
        if (teamSelector) {
            teamSelector.innerHTML = '<p style="color: red; padding: 20px;">Error: ' + error.message + '</p>';
        }
        if (opponentSelector) {
            opponentSelector.innerHTML = '<p style="color: red; padding: 20px;">Error loading teams.</p>';
        }
    }
    
    // Format selection
    const formatButtons = document.querySelectorAll('.format-btn[data-format]');
    if (formatButtons && formatButtons.length > 0) {
        formatButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.format-btn[data-format]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                checkStartButton();
            });
        });
    }
    
    // Difficulty selection
    const difficultyButtons = document.querySelectorAll('.format-btn[data-difficulty]');
    if (difficultyButtons && difficultyButtons.length > 0) {
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.format-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                checkStartButton();
            });
        });
    }
    
    // Start match button
    document.getElementById('startMatchBtn').addEventListener('click', startMatch);
    
    // Initial check for button state (format and difficulty have default active classes)
    setTimeout(() => {
        // Verify format and difficulty buttons exist
        const formatButtons = document.querySelectorAll('.format-btn[data-format]');
        const difficultyButtons = document.querySelectorAll('.format-btn[data-difficulty]');
        
        console.log('Format buttons found:', formatButtons.length);
        console.log('Difficulty buttons found:', difficultyButtons.length);
        
        // Ensure at least one format and difficulty is selected
        if (formatButtons.length > 0 && !document.querySelector('.format-btn[data-format].active')) {
            formatButtons[0].classList.add('active');
        }
        if (difficultyButtons.length > 0 && !document.querySelector('.format-btn[data-difficulty].active')) {
            difficultyButtons[0].classList.add('active');
        }
        
        checkStartButton();
    }, 200);
}

function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    // Ensure we have valid data
    const teamName = team?.name || 'Unknown';
    const teamFlag = team?.flag || '🏏';
    
    card.innerHTML = `
        <div class="team-flag">${teamFlag}</div>
        <div class="team-name">${teamName}</div>
    `;
    
    console.log('Created team card for:', teamName);
    return card;
}

function selectTeam(teamName, element, type) {
    if (!gameEngine) {
        console.error('Game engine not initialized!');
        return;
    }
    
    if (type === 'player') {
        gameEngine.playerTeam = teamName;
        document.querySelectorAll('#teamSelector .team-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Prevent selecting same team as opponent
        if (gameEngine.opponentTeam === teamName) {
            gameEngine.opponentTeam = null;
            document.querySelectorAll('#opponentSelector .team-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
        
        console.log('Player team selected:', teamName);
    } else {
        // Prevent selecting same team as player
        if (gameEngine.playerTeam === teamName) {
            alert('Cannot select the same team as your team! Please choose a different opponent.');
            return;
        }
        
        gameEngine.opponentTeam = teamName;
        document.querySelectorAll('#opponentSelector .team-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        console.log('Opponent team selected:', teamName);
    }
    
    element.classList.add('selected');
    
    // Visual feedback
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
    
    checkStartButton();
}

function checkStartButton() {
    const formatBtn = document.querySelector('.format-btn[data-format].active');
    const difficultyBtn = document.querySelector('.format-btn[data-difficulty].active');
    
    const format = formatBtn?.dataset.format;
    const difficulty = difficultyBtn?.dataset.difficulty;
    
    const btn = document.getElementById('startMatchBtn');
    const statusDiv = document.getElementById('setupStatus');
    
    if (!btn) return;
    
    const hasPlayerTeam = gameEngine && gameEngine.playerTeam;
    const hasOpponentTeam = gameEngine && gameEngine.opponentTeam;
    const hasFormat = format && format.length > 0;
    const hasDifficulty = difficulty && difficulty.length > 0;
    
    // Update status message
    if (statusDiv) {
        const missing = [];
        if (!hasPlayerTeam) missing.push('Your Team');
        if (!hasOpponentTeam) missing.push('Opponent Team');
        if (!hasFormat) missing.push('Match Format');
        if (!hasDifficulty) missing.push('Difficulty');
        
        if (missing.length > 0) {
            statusDiv.innerHTML = `<p style="color: #dc3545;">⚠️ Missing: ${missing.join(', ')}</p>`;
        } else {
            statusDiv.innerHTML = `<p style="color: #198754;">✓ Ready to start!</p>`;
        }
    }
    
    if (hasPlayerTeam && hasOpponentTeam && hasFormat && hasDifficulty) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.background = 'linear-gradient(135deg, #198754 0%, #0f5132 100%)';
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
        btn.style.background = '#6c757d';
    }
}

function startMatch() {
    const format = document.querySelector('.format-btn[data-format].active')?.dataset.format;
    const difficulty = document.querySelector('.format-btn[data-difficulty].active')?.dataset.difficulty;
    
    if (!gameEngine.playerTeam || !gameEngine.opponentTeam || !format || !difficulty) {
        return;
    }
    
    // Initialize match
    gameEngine.initializeMatch(gameEngine.playerTeam, gameEngine.opponentTeam, format, difficulty);
    
    // Switch to match screen
    showScreen('matchScreen');
    
    // Update UI
    updateScoreboard();
    updatePlayerInfo();
    setupBattingControls();
    updateCommentary(`Match started! ${gameEngine.opponentTeam} set a target of ${gameEngine.target} runs. You need to chase it down!`);
    
    // Start first ball
    setTimeout(() => {
        startNextBall();
    }, 2000);
}

function initializeGameScreen() {
    try {
        // Setup shot buttons
        const shotButtons = document.querySelectorAll('.shot-btn');
        if (shotButtons && shotButtons.length > 0) {
            shotButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const shotType = e.currentTarget.dataset.shot;
                    playShot(shotType);
                });
                
                // Power hold
                btn.addEventListener('mousedown', () => {
                    if (!gameEngine || !gameEngine.waitingForInput) return;
                    gameEngine.startPowerHold();
                    startPowerUpdate();
                });
                
                btn.addEventListener('mouseup', () => {
                    if (!gameEngine) return;
                    gameEngine.stopPowerHold();
                    stopPowerUpdate();
                });
                
                btn.addEventListener('mouseleave', () => {
                    if (!gameEngine) return;
                    gameEngine.stopPowerHold();
                    stopPowerUpdate();
                });
            });
        }
        
        // Stats tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons && tabButtons.length > 0) {
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.target.dataset.tab;
                    switchTab(tab);
                });
            });
        }
        
        // Keyboard controls
        setupKeyboardControls();
    } catch (error) {
        console.error('Error in initializeGameScreen:', error);
    }
}

// Keyboard controls
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // Only handle keys when match screen is active
        const matchScreen = document.getElementById('matchScreen');
        if (!matchScreen || !matchScreen.classList.contains('active')) {
            return;
        }
        
        // Prevent default for game keys
        if (['w', 'a', 's', 'd', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        const key = e.key.toLowerCase();
        
        // Shot selection keys
        if (gameEngine && gameEngine.waitingForInput && !gameEngine.shotSelected) {
            switch(key) {
                case 'w':
                    playShot('defense');
                    break;
                case 'a':
                    playShot('loft');
                    break;
                case 's':
                    playShot('drive');
                    break;
                case 'd':
                    playShot('sweep');
                    break;
            }
        }
        
        // Player movement (left/right arrows)
        if (renderer && renderer.batsmanPos) {
            const moveSpeed = 0.02;
            if (e.key === 'ArrowLeft') {
                renderer.batsmanPos.x = Math.max(0.3, renderer.batsmanPos.x - moveSpeed);
                if (renderer) renderer.draw();
            } else if (e.key === 'ArrowRight') {
                renderer.batsmanPos.x = Math.min(0.7, renderer.batsmanPos.x + moveSpeed);
                if (renderer) renderer.draw();
            }
        }
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startNextBall() {
    if (!gameEngine || !gameEngine.isGameActive) return;
    
    // Start ball delivery
    const ball = gameEngine.startBallDelivery();
    
    if (!ball) {
        console.warn('Ball delivery failed to start');
        return;
    }
    
    // Update commentary
    updateCommentary(`${gameEngine.currentBowler?.name || 'Bowler'} is running in...`);
    
    // Animate ball delivery
    if (renderer) {
        renderer.animateBallDelivery(
            { x: 0.5, y: 0.3 },
            { x: 0.5, y: 0.6 },
            800
        ).then(() => {
            // Ball reached batsman, enable input
            updateCommentary('Choose your shot!');
        }).catch(err => {
            console.error('Ball animation error:', err);
            // Fallback: just enable input
            updateCommentary('Choose your shot!');
        });
    } else {
        // Fallback if renderer not available
        setTimeout(() => {
            updateCommentary('Choose your shot!');
        }, 800);
    }
}

function playShot(shotType) {
    if (!gameEngine) {
        console.error('Game engine not initialized');
        return;
    }
    
    if (!gameEngine.waitingForInput) {
        updateCommentary('Wait for the ball to be delivered!');
        return;
    }
    
    if (gameEngine.shotSelected) {
        return; // Already selected a shot
    }
    
    const timing = gameEngine.updateTiming();
    const success = gameEngine.selectShot(shotType);
    
    if (!success) {
        console.warn('Shot selection failed');
        return;
    }
    
    // Disable buttons
    const shotButtons = document.querySelectorAll('.shot-btn');
    if (shotButtons) {
        shotButtons.forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // Show shot selection feedback
    updateCommentary(`Playing ${shotTypes[shotType]?.name || shotType}...`);
    
    // Process outcome after short delay
    setTimeout(() => {
        if (!gameEngine) return;
        
        const outcome = gameEngine.processShot(shotType, timing);
        
        if (outcome) {
            handleOutcome(outcome);
        } else {
            console.error('No outcome from shot');
            // Re-enable buttons if something went wrong
            if (shotButtons) {
                shotButtons.forEach(btn => {
                    btn.disabled = false;
                });
            }
        }
    }, 500);
}

function handleOutcome(outcome) {
    console.log('Handling outcome:', outcome);
    
    if (!outcome) {
        console.error('No outcome provided');
        // Re-enable buttons
        const shotButtons = document.querySelectorAll('.shot-btn');
        if (shotButtons) {
            shotButtons.forEach(btn => {
                btn.disabled = false;
            });
        }
        return;
    }
    
    // Update commentary
    updateCommentary(outcome.message);
    
    // Visual effects
    if (renderer && renderer.canvas && renderer.canvas.width > 0) {
        const w = renderer.canvas.width;
        const h = renderer.canvas.height;
        
        if (outcome.type === 'four' || outcome.type === 'six') {
            if (renderer.animateBoundary) {
                renderer.animateBoundary(w * 0.5, h * 0.5);
            }
            // Show celebration particles
            if (renderer.createParticles) {
                for (let i = 0; i < 30; i++) {
                    renderer.createParticles(
                        w * (0.4 + Math.random() * 0.2),
                        h * (0.5 + Math.random() * 0.2),
                        '#FFD700',
                        1
                    );
                }
            }
        } else if (outcome.type === 'wicket') {
            if (renderer.animateWicket) {
                renderer.animateWicket(w * 0.5, h * 0.6);
            }
        }
    }
    
    // Update UI
    updateScoreboard();
    updatePlayerInfo();
    updateLastSixBalls();
    updateStats();
    
    // Check if match ended
    if (!gameEngine || !gameEngine.isGameActive) {
        setTimeout(() => {
            showMatchResult();
        }, 3000);
        return;
    }
    
    // Enable buttons for next ball after a delay
    setTimeout(() => {
        console.log('Re-enabling buttons and starting next ball');
        const shotButtons = document.querySelectorAll('.shot-btn');
        if (shotButtons) {
            shotButtons.forEach(btn => {
                btn.disabled = false;
            });
        }
        
        // Start next ball
        if (gameEngine && gameEngine.isGameActive) {
            startNextBall();
        }
    }, 2000);
}

function updateScoreboard() {
    document.getElementById('currentScore').textContent = 
        `${gameEngine.runs}/${gameEngine.wickets}`;
    document.getElementById('currentOvers').textContent = 
        `${gameEngine.overs}.${gameEngine.balls}`;
    document.getElementById('targetScore').textContent = gameEngine.target || '0';
    document.getElementById('requiredRR').textContent = 
        gameEngine.calculateRequiredRR().toFixed(2);
    
    // Update overs progress
    const progress = ((gameEngine.overs + gameEngine.balls / 6) / gameEngine.totalOvers) * 100;
    document.getElementById('oversProgress').style.width = `${progress}%`;
    document.getElementById('oversText').textContent = 
        `${gameEngine.overs}.${gameEngine.balls} / ${gameEngine.totalOvers}.0`;
}

function updatePlayerInfo() {
    // Batsman 1
    if (gameEngine.currentBatsman1) {
        const batsman1 = gameEngine.currentBatsman1;
        const stats = gameEngine.playerStats[batsman1.name];
        document.getElementById('batsman1Name').textContent = batsman1.name;
        document.getElementById('batsman1Stats').textContent = 
            `${stats.runs} (${stats.balls}) - SR: ${stats.strikeRate.toFixed(1)}`;
        updatePlayerAvatar('batsman1Avatar', batsman1.avatar);
    }
    
    // Batsman 2
    if (gameEngine.currentBatsman2) {
        const batsman2 = gameEngine.currentBatsman2;
        const stats = gameEngine.playerStats[batsman2.name];
        document.getElementById('batsman2Name').textContent = batsman2.name;
        document.getElementById('batsman2Stats').textContent = 
            `${stats.runs} (${stats.balls}) - SR: ${stats.strikeRate.toFixed(1)}`;
        updatePlayerAvatar('batsman2Avatar', batsman2.avatar);
    }
    
    // Bowler
    if (gameEngine.currentBowler) {
        const bowler = gameEngine.currentBowler;
        const stats = gameEngine.bowlerStats[bowler.name] || { overs: 0, runs: 0, wickets: 0, economy: 0 };
        document.getElementById('bowlerName').textContent = bowler.name;
        document.getElementById('bowlerStats').textContent = 
            `${stats.overs}-${stats.runs}-${stats.wickets}-${stats.economy.toFixed(1)}`;
        updatePlayerAvatar('bowlerAvatar', bowler.avatar);
    }
}

function updatePlayerAvatar(elementId, avatarUrl) {
    const avatarElement = document.getElementById(elementId);
    if (avatarElement && avatarUrl) {
        avatarElement.style.backgroundImage = `url(${avatarUrl})`;
        avatarElement.style.backgroundSize = 'cover';
        avatarElement.style.backgroundPosition = 'center';
    }
}

function updateLastSixBalls() {
    const container = document.getElementById('lastSixBalls');
    container.innerHTML = '';
    
    gameEngine.lastSixBalls.forEach(ball => {
        const ballDiv = document.createElement('div');
        ballDiv.className = 'ball-indicator';
        
        if (ball === 'W') ballDiv.className += ' ball-wicket';
        else if (ball === '6') ballDiv.className += ' ball-six';
        else if (ball === '4') ballDiv.className += ' ball-four';
        else if (ball === '.') ballDiv.className += ' ball-dot';
        else ballDiv.className += ' ball-run';
        
        ballDiv.textContent = ball;
        container.appendChild(ballDiv);
    });
}

function updateCommentary(message) {
    const commentaryDiv = document.getElementById('commentary');
    commentaryDiv.innerHTML = `<div class="commentary-text">${message}</div>`;
    commentaryDiv.classList.add('animation-bounce');
    setTimeout(() => {
        commentaryDiv.classList.remove('animation-bounce');
    }, 500);
}

function setupBattingControls() {
    // Controls are already set up in initializeGameScreen
    // Just enable them
    document.querySelectorAll('.shot-btn').forEach(btn => {
        btn.disabled = false;
    });
}

let powerUpdateInterval;
function startPowerUpdate() {
    powerUpdateInterval = setInterval(() => {
        gameEngine.updatePower();
        const powerPercent = gameEngine.powerLevel;
        document.getElementById('powerFill').style.width = `${powerPercent}%`;
        document.getElementById('powerValue').textContent = `${Math.round(powerPercent)}%`;
    }, 50);
}

function stopPowerUpdate() {
    if (powerUpdateInterval) {
        clearInterval(powerUpdateInterval);
        powerUpdateInterval = null;
    }
}

function updateTimingIndicator() {
    if (!gameEngine.waitingForInput) {
        document.getElementById('timingFill').style.width = '0%';
        return;
    }
    
    const timing = gameEngine.updateTiming();
    let width = 0;
    
    if (timing === 'perfect') {
        width = 100;
    } else if (timing === 'good') {
        width = 70;
    } else if (timing === 'early' || timing === 'late') {
        width = 30;
    }
    
    document.getElementById('timingFill').style.width = `${width}%`;
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}Tab`) {
            content.classList.add('active');
        }
    });
    
    // Update content based on tab
    if (tabName === 'scorecard') {
        updateScorecardTab();
    } else if (tabName === 'graph') {
        updateGraphTab();
    } else if (tabName === 'manhattan') {
        updateManhattanTab();
    }
}

function updateScorecardTab() {
    const table = document.getElementById('scorecardTable');
    let html = `
        <table class="scorecard-table">
            <thead>
                <tr>
                    <th>Batsman</th>
                    <th>Runs</th>
                    <th>Balls</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>SR</th>
                    <th>How Out</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.keys(gameEngine.playerStats).forEach(name => {
        const stats = gameEngine.playerStats[name];
        html += `
            <tr>
                <td>${name}</td>
                <td>${stats.runs}</td>
                <td>${stats.balls}</td>
                <td>${stats.fours}</td>
                <td>${stats.sixes}</td>
                <td>${stats.strikeRate.toFixed(1)}</td>
                <td>${stats.out ? (stats.howOut || 'out') : 'not out'}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    table.innerHTML = html;
}

function updateGraphTab() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Draw run rate graph
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameEngine.overHistory.length === 0) return;
    
    const maxRuns = Math.max(...gameEngine.overHistory.map(o => o.runs), 20);
    const padding = 40;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw data
    ctx.strokeStyle = '#198754';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    gameEngine.overHistory.forEach((over, index) => {
        const x = padding + (index / (gameEngine.totalOvers - 1)) * graphWidth;
        const y = canvas.height - padding - (over.runs / maxRuns) * graphHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#198754';
    gameEngine.overHistory.forEach((over, index) => {
        const x = padding + (index / (gameEngine.totalOvers - 1)) * graphWidth;
        const y = canvas.height - padding - (over.runs / maxRuns) * graphHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateManhattanTab() {
    const canvas = document.getElementById('manhattanCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Draw Manhattan chart (runs per over)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameEngine.overHistory.length === 0) return;
    
    const maxRuns = Math.max(...gameEngine.overHistory.map(o => o.runs), 20);
    const padding = 40;
    const barWidth = (canvas.width - 2 * padding) / gameEngine.totalOvers;
    
    gameEngine.overHistory.forEach((over, index) => {
        const barHeight = (over.runs / maxRuns) * (canvas.height - 2 * padding);
        const x = padding + index * barWidth;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = over.runs >= 10 ? '#198754' : over.runs >= 6 ? '#ffc107' : '#dc3545';
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        // Label
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(over.over, x + barWidth / 2 - 5, canvas.height - padding + 15);
    });
}

function updateStats() {
    // Update stats panels if visible
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
    if (activeTab === 'scorecard') {
        updateScorecardTab();
    } else if (activeTab === 'graph') {
        updateGraphTab();
    } else if (activeTab === 'manhattan') {
        updateManhattanTab();
    }
}

function showMatchResult() {
    const result = gameEngine.getMatchResult();
    const motm = gameEngine.getManOfTheMatch();
    
    showScreen('resultScreen');
    
    const resultHeader = document.getElementById('resultHeader');
    const resultContent = document.getElementById('resultContent');
    
    // Result title
    let title = '';
    let titleColor = '';
    if (result.result === 'win') {
        title = '🎉 You Won!';
        titleColor = '#198754';
    } else if (result.result === 'loss') {
        title = '😔 You Lost';
        titleColor = '#dc3545';
    } else {
        title = '🤝 Match Tied';
        titleColor = '#ffc107';
    }
    
    resultHeader.innerHTML = `<h1 style="color: ${titleColor}">${title}</h1>`;
    
    // Result content
    resultContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2>Match Summary</h2>
            <div style="margin: 20px 0;">
                <h3>${gameEngine.opponentTeam}: ${result.opponentScore.runs}/${result.opponentScore.wickets} (${result.opponentScore.overs})</h3>
                <h3>${gameEngine.playerTeam}: ${result.playerScore.runs}/${result.playerScore.wickets} (${result.playerScore.overs})</h3>
                <p style="font-size: 1.2em; margin-top: 15px;">
                    Target: ${result.target} | Achieved: ${result.achieved}
                </p>
            </div>
        </div>
        ${motm ? `
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Man of the Match: ${motm.name}</h3>
                <p>${motm.stats.runs} runs (${motm.stats.balls} balls) | ${motm.stats.fours} fours | ${motm.stats.sixes} sixes | SR: ${motm.stats.strikeRate.toFixed(1)}</p>
            </div>
        ` : ''}
    `;
}

// Game loop
function startGameLoop() {
    gameLoop = setInterval(() => {
        if (gameEngine && gameEngine.isGameActive) {
            updateTimingIndicator();
        }
    }, 50);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.stopAnimation();
    }
    if (gameLoop) {
        clearInterval(gameLoop);
    }
});

