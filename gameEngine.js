// Game Engine - Core Game Logic
class CricketGameEngine {
    constructor() {
        this.reset();
    }

    reset() {
        this.matchFormat = 'T20';
        this.difficulty = 'Medium';
        this.playerTeam = null;
        this.opponentTeam = null;
        this.target = null;
        
        // Match state
        this.overs = 0;
        this.balls = 0;
        this.totalOvers = 20;
        this.runs = 0;
        this.wickets = 0;
        this.currentInnings = 2; // Always 2nd innings chase
        
        // Players
        this.playerSquad = [];
        this.opponentSquad = [];
        this.currentBatsman1 = null;
        this.currentBatsman2 = null;
        this.currentBowler = null;
        this.bowlerIndex = 0;
        
        // Stats
        this.playerStats = {};
        this.bowlerStats = {};
        this.lastSixBalls = [];
        this.overHistory = [];
        this.matchHistory = [];
        
        // Game state
        this.isGameActive = false;
        this.isPlayerTurn = true;
        this.waitingForInput = false;
        this.timingWindow = { start: 0, end: 0, current: 0 };
        this.powerLevel = 0;
        this.powerHolding = false;
        
        // Ball state
        this.currentBall = null;
        this.ballInFlight = false;
        this.shotSelected = null;
        
        // AI state
        this.aiBowlingStrategy = 'normal';
    }

    initializeMatch(playerTeam, opponentTeam, format, difficulty) {
        this.playerTeam = playerTeam;
        this.opponentTeam = opponentTeam;
        this.matchFormat = format;
        this.difficulty = difficulty;
        
        // Set total overs based on format
        this.totalOvers = format === 'T20' ? 20 : format === 'ODI' ? 50 : 90;
        
        // Initialize squads
        this.playerSquad = [...cricketTeams[playerTeam].players];
        this.opponentSquad = [...cricketTeams[opponentTeam].players];
        
        // Initialize stats
        this.playerSquad.forEach(p => {
            this.playerStats[p.name] = {
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                strikeRate: 0,
                out: false,
                howOut: null
            };
        });
        
        this.opponentSquad.forEach(p => {
            if (p.bowling >= 70) {
                this.bowlerStats[p.name] = {
                    overs: 0,
                    runs: 0,
                    wickets: 0,
                    economy: 0
                };
            }
        });
        
        // Generate first innings score (AI batting)
        this.generateFirstInnings();
        
        // Set up second innings
        this.setupSecondInnings();
        
        this.isGameActive = true;
    }

    generateFirstInnings() {
        // Simulate first innings - AI bats first
        let firstInningsRuns = 0;
        let firstInningsWickets = 0;
        let firstInningsOvers = 0;
        let firstInningsBalls = 0;
        
        const totalBalls = this.totalOvers * 6;
        const avgRunsPerOver = this.difficulty === 'Easy' ? 6 : this.difficulty === 'Medium' ? 7.5 : 9;
        
        for (let ball = 0; ball < totalBalls && firstInningsWickets < 10; ball++) {
            const over = Math.floor(ball / 6);
            const ballInOver = ball % 6;
            
            // Calculate run probability based on difficulty
            const runProb = Math.random();
            let runs = 0;
            let wicket = false;
            
            if (runProb < 0.15) {
                wicket = true;
                firstInningsWickets++;
            } else if (runProb < 0.4) {
                runs = 0; // Dot ball
            } else if (runProb < 0.7) {
                runs = Math.random() < 0.7 ? 1 : 2;
            } else if (runProb < 0.9) {
                runs = 4;
            } else {
                runs = 6;
            }
            
            firstInningsRuns += runs;
            
            if (ballInOver === 5) {
                firstInningsOvers++;
                firstInningsBalls = 0;
            } else {
                firstInningsBalls++;
            }
        }
        
        // Adjust based on difficulty
        const difficultyMultiplier = this.difficulty === 'Easy' ? 0.85 : this.difficulty === 'Medium' ? 1.0 : 1.15;
        firstInningsRuns = Math.floor(firstInningsRuns * difficultyMultiplier);
        
        this.target = firstInningsRuns + 1;
        this.matchHistory.push({
            team: this.opponentTeam,
            runs: firstInningsRuns,
            wickets: firstInningsWickets,
            overs: `${firstInningsOvers}.${firstInningsBalls}`
        });
    }

    setupSecondInnings() {
        // Reset for second innings
        this.overs = 0;
        this.balls = 0;
        this.runs = 0;
        this.wickets = 0;
        this.lastSixBalls = [];
        this.overHistory = [];
        
        // Set opening batsmen
        this.currentBatsman1 = this.playerSquad[0];
        this.currentBatsman2 = this.playerSquad[1];
        
        // Set initial bowler
        const bowlers = this.opponentSquad.filter(p => p.bowling >= 70);
        this.currentBowler = bowlers[0];
        this.bowlerIndex = 0;
        
        this.isPlayerTurn = true;
    }

    startBallDelivery() {
        if (!this.isGameActive || this.ballInFlight) return null;
        
        this.ballInFlight = true;
        this.waitingForInput = false;
        this.shotSelected = null;
        this.powerLevel = 0;
        this.powerHolding = false;
        
        // AI selects bowling type
        const bowlingType = this.selectBowlingType();
        this.currentBall = {
            type: bowlingType,
            speed: bowlingTypes[bowlingType].speed,
            swing: bowlingTypes[bowlingType].swing,
            accuracy: bowlingTypes[bowlingType].accuracy,
            timestamp: Date.now()
        };
        
        // Start timing window
        this.startTimingWindow();
        
        return this.currentBall;
    }

    selectBowlingType() {
        // AI bowling strategy based on match situation
        const requiredRR = this.calculateRequiredRR();
        const oversLeft = this.totalOvers - (this.overs + this.balls / 6);
        const wicketsLeft = 10 - this.wickets;
        
        // Adjust strategy based on difficulty
        let strategy = 'normal';
        if (requiredRR > 10 || oversLeft < 3) {
            strategy = 'aggressive'; // Try to take wickets
        } else if (wicketsLeft <= 2) {
            strategy = 'defensive'; // Contain runs
        }
        
        // Select bowling type based on strategy
        const rand = Math.random();
        if (strategy === 'aggressive') {
            if (rand < 0.4) return 'yorker';
            if (rand < 0.7) return 'bouncer';
            return 'fast';
        } else if (strategy === 'defensive') {
            if (rand < 0.5) return 'spin';
            if (rand < 0.8) return 'slower';
            return 'medium';
        } else {
            // Normal strategy
            if (rand < 0.3) return 'fast';
            if (rand < 0.6) return 'medium';
            if (rand < 0.85) return 'spin';
            return Math.random() < 0.5 ? 'yorker' : 'slower';
        }
    }

    startTimingWindow() {
        // Timing window: 0.5 to 1.5 seconds after ball delivery
        const delay = 500 + Math.random() * 1000;
        this.timingWindow.start = Date.now() + delay;
        this.timingWindow.end = this.timingWindow.start + 300; // 300ms window
        this.timingWindow.current = Date.now();
        
        // Enable input after delay
        setTimeout(() => {
            this.waitingForInput = true;
        }, delay);
    }

    updateTiming() {
        if (!this.waitingForInput) return;
        
        const now = Date.now();
        this.timingWindow.current = now;
        
        if (now < this.timingWindow.start) {
            // Too early
            return 'early';
        } else if (now > this.timingWindow.end) {
            // Too late
            return 'late';
        } else {
            // In window
            const windowSize = this.timingWindow.end - this.timingWindow.start;
            const position = (now - this.timingWindow.start) / windowSize;
            return position < 0.3 || position > 0.7 ? 'good' : 'perfect';
        }
    }

    selectShot(shotType) {
        if (!this.waitingForInput || this.shotSelected) return false;
        
        this.shotSelected = shotType;
        const timing = this.updateTiming();
        
        // Process the shot
        setTimeout(() => {
            this.processShot(shotType, timing);
        }, 100);
        
        return true;
    }

    startPowerHold() {
        if (!this.waitingForInput || this.shotSelected) return;
        this.powerHolding = true;
    }

    stopPowerHold() {
        this.powerHolding = false;
    }

    updatePower() {
        if (this.powerHolding && this.waitingForInput && !this.shotSelected) {
            this.powerLevel = Math.min(100, this.powerLevel + 2);
        }
    }

    processShot(shotType, timing) {
        if (!this.currentBall || !this.currentBatsman1) return null;
        
        const shot = shotTypes[shotType];
        const batsman = this.currentBatsman1;
        const bowler = this.currentBowler;
        
        // Calculate outcome based on shot, timing, player stats, and ball type
        const outcome = this.calculateOutcome(shot, batsman, bowler, timing, this.currentBall);
        
        // Process the outcome
        this.applyOutcome(outcome);
        
        // Reset for next ball
        this.ballInFlight = false;
        this.currentBall = null;
        this.shotSelected = null;
        this.powerLevel = 0;
        this.waitingForInput = false;
        
        return outcome;
    }

    calculateOutcome(shot, batsman, bowler, timing, ball) {
        // Base probabilities from shot type
        let boundaryChance = shot.boundaryChance;
        let wicketChance = shot.wicketChance;
        let runChance = shot.runChance;
        let dotChance = shot.dotChance;
        
        // Adjust for timing
        const timingMultiplier = {
            'perfect': 1.3,
            'good': 1.1,
            'early': 0.7,
            'late': 0.8
        }[timing] || 1.0;
        
        boundaryChance *= timingMultiplier;
        wicketChance /= timingMultiplier;
        runChance *= timingMultiplier;
        dotChance /= timingMultiplier;
        
        // Adjust for player stats
        const skillDiff = (batsman.batting - bowler.bowling) / 100;
        boundaryChance += skillDiff * 0.1;
        wicketChance -= skillDiff * 0.05;
        runChance += skillDiff * 0.05;
        dotChance -= skillDiff * 0.1;
        
        // Adjust for ball type
        if (ball.type === 'yorker' || ball.type === 'bouncer') {
            wicketChance += 0.1;
            boundaryChance -= 0.1;
        } else if (ball.type === 'spin') {
            wicketChance += 0.05;
            dotChance += 0.1;
        }
        
        // Adjust for power
        if (this.powerLevel > 50) {
            boundaryChance += 0.15;
            wicketChance += 0.1;
        }
        
        // Normalize probabilities
        const total = boundaryChance + wicketChance + runChance + dotChance;
        boundaryChance /= total;
        wicketChance /= total;
        runChance /= total;
        dotChance /= total;
        
        // Determine outcome
        const rand = Math.random();
        let outcome = {};
        
        if (rand < wicketChance) {
            // Wicket
            const wicketTypes = ['bowled', 'caught', 'lbw', 'stumped', 'runout'];
            outcome = {
                type: 'wicket',
                runs: 0,
                wicketType: wicketTypes[Math.floor(Math.random() * wicketTypes.length)],
                message: this.getCommentary('wicket')
            };
        } else if (rand < wicketChance + dotChance) {
            // Dot ball
            outcome = {
                type: 'dot',
                runs: 0,
                message: this.getCommentary('dot')
            };
        } else if (rand < wicketChance + dotChance + runChance) {
            // Runs
            let runs = 1;
            if (Math.random() < 0.3) runs = 2;
            else if (Math.random() < 0.1) runs = 3;
            
            outcome = {
                type: 'run',
                runs: runs,
                message: this.getCommentary('single')
            };
        } else {
            // Boundary
            const isSix = shot.name === 'Loft' || Math.random() < 0.4 || this.powerLevel > 70;
            outcome = {
                type: isSix ? 'six' : 'four',
                runs: isSix ? 6 : 4,
                message: this.getCommentary(isSix ? 'six' : 'boundary')
            };
        }
        
        // Add timing info
        outcome.timing = timing;
        outcome.shotType = shot.name;
        
        return outcome;
    }

    applyOutcome(outcome) {
        // Update runs
        this.runs += outcome.runs;
        
        // Update ball count
        this.balls++;
        if (this.balls >= 6) {
            this.balls = 0;
            this.overs++;
            this.overHistory.push({
                over: this.overs,
                runs: this.runs - (this.overHistory.reduce((sum, o) => sum + o.runs, 0)),
                wickets: this.wickets
            });
            
            // Change bowler after over
            this.changeBowler();
            
            // Swap batsmen if odd runs or dot
            if (outcome.runs % 2 === 1 || outcome.runs === 0) {
                [this.currentBatsman1, this.currentBatsman2] = 
                    [this.currentBatsman2, this.currentBatsman1];
            }
        } else if (outcome.runs % 2 === 1) {
            // Swap on odd runs
            [this.currentBatsman1, this.currentBatsman2] = 
                [this.currentBatsman2, this.currentBatsman1];
        }
        
        // Update last six balls
        const ballSymbol = outcome.type === 'wicket' ? 'W' : 
                         outcome.type === 'six' ? '6' : 
                         outcome.type === 'four' ? '4' : 
                         outcome.runs > 0 ? outcome.runs.toString() : '.';
        this.lastSixBalls.push(ballSymbol);
        if (this.lastSixBalls.length > 6) {
            this.lastSixBalls.shift();
        }
        
        // Update player stats
        const batsman = this.currentBatsman1;
        const stats = this.playerStats[batsman.name];
        
        if (outcome.type === 'wicket') {
            this.wickets++;
            stats.balls++;
            stats.out = true;
            stats.howOut = outcome.wicketType;
            stats.strikeRate = (stats.runs / stats.balls) * 100;
            
            // Get next batsman
            const availableBatsmen = this.playerSquad.filter(p => 
                !this.playerStats[p.name]?.out && 
                p.name !== batsman.name &&
                p.name !== this.currentBatsman2?.name
            );
            
            if (availableBatsmen.length > 0 && this.wickets < 10) {
                this.currentBatsman1 = availableBatsmen[0];
            }
        } else {
            stats.runs += outcome.runs;
            stats.balls++;
            if (outcome.type === 'four') stats.fours++;
            if (outcome.type === 'six') stats.sixes++;
            stats.strikeRate = (stats.runs / stats.balls) * 100;
        }
        
        // Update bowler stats
        if (this.currentBowler && this.bowlerStats[this.currentBowler.name]) {
            const bowlerStats = this.bowlerStats[this.currentBowler.name];
            bowlerStats.runs += outcome.runs;
            if (outcome.type === 'wicket') bowlerStats.wickets++;
            if (this.balls === 0) bowlerStats.overs++;
            bowlerStats.economy = bowlerStats.overs > 0 ? 
                (bowlerStats.runs / bowlerStats.overs) : 0;
        }
        
        // Check match end conditions
        if (this.wickets >= 10 || this.overs >= this.totalOvers || this.runs >= this.target) {
            this.endMatch();
        }
    }

    changeBowler() {
        const bowlers = this.opponentSquad.filter(p => p.bowling >= 70);
        this.bowlerIndex = (this.bowlerIndex + 1) % Math.min(bowlers.length, 5); // Max 5 bowlers
        this.currentBowler = bowlers[this.bowlerIndex];
    }

    calculateRequiredRR() {
        if (!this.target) return 0;
        const runsNeeded = this.target - this.runs;
        const ballsLeft = (this.totalOvers - this.overs) * 6 - this.balls;
        return ballsLeft > 0 ? (runsNeeded / ballsLeft) * 6 : 0;
    }

    getCommentary(type) {
        const phrases = commentaryPhrases[type] || ['...'];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    endMatch() {
        this.isGameActive = false;
        this.matchHistory.push({
            team: this.playerTeam,
            runs: this.runs,
            wickets: this.wickets,
            overs: `${this.overs}.${this.balls}`
        });
    }

    getMatchResult() {
        const playerScore = this.matchHistory.find(h => h.team === this.playerTeam);
        const opponentScore = this.matchHistory.find(h => h.team === this.opponentTeam);
        
        let result = 'loss';
        if (this.runs >= this.target) {
            result = 'win';
        } else if (this.runs === this.target - 1 && this.wickets < 10) {
            result = 'tie';
        }
        
        return {
            result,
            playerScore,
            opponentScore,
            target: this.target,
            achieved: this.runs
        };
    }

    getManOfTheMatch() {
        let maxRuns = 0;
        let motm = null;
        
        Object.keys(this.playerStats).forEach(name => {
            const stats = this.playerStats[name];
            if (stats.runs > maxRuns) {
                maxRuns = stats.runs;
                motm = { name, stats, team: this.playerTeam };
            }
        });
        
        return motm;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketGameEngine;
}

