# Quick Start Guide - Running the Cricket Game Locally

## Method 1: Simple (Just Open in Browser)
1. Navigate to the project folder
2. Double-click `index.html`
3. The game will open in your default browser

**Note:** Some browsers may block external resources (like avatars). If avatars don't load, use Method 2.

---

## Method 2: Using Python HTTP Server (Recommended)

### Windows:
1. Open Command Prompt or PowerShell in the project folder
2. Run: `python -m http.server 8000`
   - Or double-click `run-local.bat`
3. Open browser and go to: `http://localhost:8000`

### Mac/Linux:
1. Open Terminal in the project folder
2. Run: `python3 -m http.server 8000`
   - Or run: `bash run-local.sh`
3. Open browser and go to: `http://localhost:8000`

### Stop the server:
- Press `Ctrl+C` in the terminal

---

## Method 3: Using Node.js (if you have Node.js installed)

1. Install http-server globally (one-time):
   ```bash
   npm install -g http-server
   ```

2. Run the server:
   ```bash
   http-server -p 8000
   ```

3. Open browser and go to: `http://localhost:8000`

---

## Method 4: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser will open automatically

---

## Troubleshooting

### Avatars not loading?
- Use Method 2, 3, or 4 (local server)
- This is due to CORS (Cross-Origin Resource Sharing) restrictions

### Port 8000 already in use?
- Use a different port: `python -m http.server 8080`
- Then go to: `http://localhost:8080`

### Python not found?
- Install Python from https://www.python.org/
- Or use Method 3 (Node.js) or Method 4 (VS Code)

---

## Game Controls

Once the game is running:
1. Select your team and opponent
2. Choose match format (T20/ODI/Test)
3. Select difficulty level
4. Click "Start Match"
5. Wait for ball delivery
6. Click shot buttons to play
7. Time your shots for best results!

Enjoy the game! 🏏

