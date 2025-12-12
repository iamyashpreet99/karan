// Main Game Controller
let gameEngine;
let renderer;
let gameLoop;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    gameEngine = new CricketGameEngine();
    renderer = new CricketRenderer('gameCanvas');
    
    initializeSetupScreen();
    initializeGameScreen();
    
    // Start renderer animation
    renderer.startAnimation();
    
    // Start game loop
    startGameLoop();
});

function initializeSetupScreen() {
    // Load teams
    const teamSelector = document.getElementById('teamSelector');
    const opponentSelector = document.getElementById('opponentSelector');
    
    Object.keys(cricketTeams).forEach(teamName => {
        const team = cricketTeams[teamName];
        
        // Player team selector
        const teamCard = createTeamCard(team);
        teamCard.onclick = () => selectTeam(teamName, teamCard, 'player');
        teamSelector.appendChild(teamCard);
        
        // Opponent team selector
        const opponentCard = createTeamCard(team);
        opponentCard.onclick = () => selectTeam(teamName, opponentCard, 'opponent');
        opponentSelector.appendChild(opponentCard);
    });
    
    // Format selection
    document.querySelectorAll('.format-btn[data-format]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.format-btn[data-format]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            checkStartButton();
        });
    });
    
    // Difficulty selection
    document.querySelectorAll('.format-btn[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.format-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            checkStartButton();
        });
    });
    
    // Start match button
    document.getElementById('startMatchBtn').addEventListener('click', startMatch);
}

function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `
        <div class="team-flag">${team.flag}</div>
        <div class="team-name">${team.name}</div>
    `;
    return card;
}

function selectTeam(teamName, element, type) {
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
    } else {
        // Prevent selecting same team as player
        if (gameEngine.playerTeam === teamName) {
            alert('Cannot select the same team as opponent!');
            return;
        }
        
        gameEngine.opponentTeam = teamName;
        document.querySelectorAll('#opponentSelector .team-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    element.classList.add('selected');
    checkStartButton();
}

function checkStartButton() {
    const format = document.querySelector('.format-btn[data-format].active')?.dataset.format;
    const difficulty = document.querySelector('.format-btn[data-difficulty].active')?.dataset.difficulty;
    
    const btn = document.getElementById('startMatchBtn');
    if (gameEngine.playerTeam && gameEngine.opponentTeam && format && difficulty) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
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
    // Setup shot buttons
    document.querySelectorAll('.shot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const shotType = e.currentTarget.dataset.shot;
            playShot(shotType);
        });
        
        // Power hold
        btn.addEventListener('mousedown', () => {
            if (!gameEngine.waitingForInput) return;
            gameEngine.startPowerHold();
            startPowerUpdate();
        });
        
        btn.addEventListener('mouseup', () => {
            gameEngine.stopPowerHold();
            stopPowerUpdate();
        });
        
        btn.addEventListener('mouseleave', () => {
            gameEngine.stopPowerHold();
            stopPowerUpdate();
        });
    });
    
    // Stats tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startNextBall() {
    if (!gameEngine.isGameActive) return;
    
    // Start ball delivery
    const ball = gameEngine.startBallDelivery();
    
    if (!ball) return;
    
    // Animate ball delivery
    renderer.animateBallDelivery(
        { x: 0.5, y: 0.3 },
        { x: 0.5, y: 0.6 },
        800
    ).then(() => {
        // Ball reached batsman, enable input
        updateCommentary('Choose your shot!');
    });
}

function playShot(shotType) {
    if (!gameEngine.waitingForInput || gameEngine.shotSelected) {
        return;
    }
    
    const timing = gameEngine.updateTiming();
    const success = gameEngine.selectShot(shotType);
    if (!success) return;
    
    // Disable buttons
    document.querySelectorAll('.shot-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Process outcome after short delay
    setTimeout(() => {
        const outcome = gameEngine.processShot(shotType, timing);
        
        if (outcome) {
            handleOutcome(outcome);
        }
    }, 300);
}

function handleOutcome(outcome) {
    // Update commentary
    updateCommentary(outcome.message);
    
    // Visual effects
    if (outcome.type === 'four' || outcome.type === 'six') {
        const w = renderer.canvas.width;
        const h = renderer.canvas.height;
        renderer.animateBoundary(w * 0.5, h * 0.5);
    } else if (outcome.type === 'wicket') {
        const w = renderer.canvas.width;
        const h = renderer.canvas.height;
        renderer.animateWicket(w * 0.5, h * 0.6);
    }
    
    // Update UI
    updateScoreboard();
    updatePlayerInfo();
    updateLastSixBalls();
    updateStats();
    
    // Check if match ended
    if (!gameEngine.isGameActive) {
        setTimeout(() => {
            showMatchResult();
        }, 3000);
        return;
    }
    
    // Enable buttons for next ball
    setTimeout(() => {
        document.querySelectorAll('.shot-btn').forEach(btn => {
            btn.disabled = false;
        });
        startNextBall();
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

