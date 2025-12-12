# Cricket Batting Game - 2nd Innings Chase

A comprehensive single-player cricket batting game where you bat in the 2nd innings against AI bowling. Built with HTML5 Canvas, vanilla JavaScript, and modern web technologies.

## Features

### 🎮 Gameplay
- **2nd Innings Chase**: Always bat second, chasing a target set by the AI
- **Realistic Cricket Mechanics**: Player stats affect performance
- **Multiple Shot Types**: Defense, Drive, Cut, Pull, Sweep, Loft, Leave
- **Timing System**: Perfect timing increases success rate
- **Power Meter**: Hold shot button for more power
- **AI Bowling**: Intelligent bowling with variations (Fast, Medium, Spin, Yorker, Bouncer, Slower Ball)

### 🎨 Visual Features
- **Canvas-Based Rendering**: Smooth animations and visual effects
- **Cricket Field Visualization**: Top-down view with fielders, pitch, and boundaries
- **Player Avatars**: DiceBear API integration for player images
- **Ball Trajectory**: Visual ball trail during delivery
- **Particle Effects**: Celebrations for boundaries and wickets
- **Animated Players**: Batsman, bowler, and fielders

### 📊 Statistics & Analytics
- **Live Scoreboard**: Current score, overs, target, required run rate
- **Player Stats**: Individual batting statistics
- **Last 6 Balls**: Visual indicator of recent deliveries
- **Run Rate Graph**: Visual representation of scoring rate
- **Manhattan Chart**: Runs per over visualization
- **Detailed Scorecard**: Complete match statistics

### 🏏 Teams & Players
- **6 International Teams**: India, Australia, England, Pakistan, New Zealand, South Africa
- **Real Player Names**: Authentic player names and roles
- **Player Ratings**: Batting and bowling ratings affect gameplay
- **11 Players per Team**: Full playing XI

### ⚙️ Match Formats
- **T20**: 20 overs per innings
- **ODI**: 50 overs per innings
- **Test**: 90 overs per innings (simplified)

### 🎯 Difficulty Levels
- **Easy**: More forgiving AI bowling
- **Medium**: Balanced gameplay
- **Hard**: Challenging AI with better accuracy

## How to Play

1. **Setup**
   - Select your team
   - Select opponent team
   - Choose match format (T20/ODI/Test)
   - Select difficulty level

2. **Batting**
   - Wait for the ball to be delivered
   - Watch the timing indicator
   - Select your shot type when ready
   - Hold the shot button for more power (optional)
   - Try to time your shot perfectly for best results

3. **Shot Types**
   - **Defense**: Safe shot, low risk, low reward
   - **Drive**: Balanced shot, good for boundaries
   - **Cut**: Aggressive shot, high boundary chance
   - **Pull**: Power shot, can clear boundary
   - **Sweep**: Against spin, risky but effective
   - **Loft**: Aerial shot, high risk, high reward
   - **Leave**: Let the ball go, very safe

4. **Match Progression**
   - Chase the target set by AI
   - Manage your wickets
   - Watch required run rate
   - Build partnerships

## Technical Details

### File Structure
```
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── gameData.js         # Teams, players, shot types, commentary
├── gameEngine.js       # Core game logic and mechanics
├── renderer.js         # Canvas rendering and animations
└── main.js             # Game controller and UI management
```

### Technologies Used
- **HTML5 Canvas**: For game rendering
- **Vanilla JavaScript**: No frameworks, pure JS
- **CSS3**: Modern styling with animations
- **DiceBear API**: Player avatar generation

### Game Mechanics

#### Shot Outcome Calculation
- Base probabilities from shot type
- Timing multiplier (perfect/good/early/late)
- Player skill difference (batsman vs bowler)
- Ball type adjustments
- Power level influence

#### AI Bowling Strategy
- Adapts based on match situation
- Considers required run rate
- Adjusts for wickets remaining
- Difficulty level affects accuracy

#### Wicket Types
- Bowled
- Caught
- LBW
- Stumped
- Run Out

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Future Enhancements

- [ ] Sound effects and background music
- [ ] Career mode with series of matches
- [ ] Save/load game progress
- [ ] Achievement system
- [ ] More detailed animations
- [ ] Real-time API integration for live player stats
- [ ] Multiplayer support
- [ ] Tournament mode

## Credits

- Player avatars: DiceBear API (https://dicebear.com)
- Game design inspired by classic cricket games
- Built with modern web standards

## License

This project is open source and available for educational purposes.

---

**Enjoy the game! 🏏**

