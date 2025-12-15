
# 🧩 Last Puzzle Endgame

![Hackathon Badge](https://img.shields.io/badge/HACKSPHERE-2024-neon) ![Problem Statement](https://img.shields.io/badge/Problem_Statement-4-blue) ![Status](https://img.shields.io/badge/Deployed-Live-success)

> **A strategic, algorithmic maze puzzle game featuring teleportation paradoxes and resource management.**

## 🚀 Play Now (Live Deployment)
| **Play Online** | **Video Demo** |
| :---: | :---: |
| [**👉 Click Here to Play Last Puzzle Endgame**](https://glittery-narwhal-e3df0b.netlify.app/) | [**📺 Watch Gameplay Video**](INSERT_YOUR_VIDEO_LINK_HERE) |
> *Deployed on Netlify in accordance with Judging Criteria #6*

---

## 📖 Project Overview
**Last Puzzle Endgame** is a submission for **PCON HACKSPHERE 2024** addressing **Problem Statement 4: PortalMaze**.

The game requires players to navigate complex grid environments using movement, limited wall-breaking mechanics, and color-coded teleportation portals. It is designed to challenge spatial reasoning and algorithmic thinking.

### ✨ Key Features
* **Dual-Mode Gameplay:**
    * **Normal Mode:** Pure pathfinding logic with zero wall breaks.
    * **Endgame Mode (Wall Break):** Strategic resource management allowing up to $K$ wall breaks to find shortcuts.
* **Teleportation Mechanics:** Zero-cost traversal via color-matched portal pairs.
* **Internal Path Analysis:** The game runs a background algorithm to calculate the optimal path (Par Score) for every level.
* **Level Editor (Optional Feature):** A fully functional editor allowing users to create, validate, and publish their own maps.
* **Auto-Validation:** Custom logic ensures no user map is broken or unsolvable before publishing.

---

## 🧠 Technical Architecture & Algorithms
*This section highlights the "Advanced Thinking" required by Problem Statement 4.*

To ensure fairness and functionality, we implemented a custom pathfinding engine:

### 1. State-Aware BFS (Breadth-First Search)
We use a modified BFS to solve the maze. Unlike standard pathfinding, our node state tracks `(x, y, drills_used)`.
* **Why?** Visiting a cell with 0 drills remaining is a different "state" than visiting it with 1 drill remaining. This allows the algorithm to find the true shortest path involving wall breaks.

### 2. The Validator Engine
Before a map is saved in the Editor, the engine runs three checks:
1.  **Is GOAL reachable?**
2.  **What is the shortest path with $K=0$?**
3.  **What is the shortest path with $K \le Max$?**
*If the map is unsolvable, the "Publish" button remains locked.*

---

## 🎮 Controls & Mechanics
* **Move:** `W`, `A`, `S`, `D` or Arrow Keys.
* **Teleport:** Stand on a colored portal and press `Enter`.
* **Break Wall:** Hold `Shift` + `Arrow Key` (consumes 1 Break charge).

> **Note:** Scores are calculated based on **Step Count** (primary) and **Time Elapsed** (secondary).

---

## 🛠️ Tech Stack
* **Frontend:** React + Vite
* **Language:** JavaScript / TypeScript
* **Database:** Firebase Firestore (Level Storage & Leaderboards)
* **Styling:** CSS Modules

---

## 💻 Local Setup Instructions
Follow these steps to run the code locally for review.

### 1. Clone the Repository
```bash
git clone [https://github.com/Manojsingh3003/LAST_PUZZLE_ENDGAME.git](https://github.com/Manojsingh3003/LAST_PUZZLE_ENDGAME.git)
cd LAST_PUZZLE_ENDGAME
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment
``` bash
Create a .env file in the root folder. You must add Firebase credentials to enable the Level Editor and Leaderboard features.
VITE_FIREBASE_API_KEY="your_key"
VITE_FIREBASE_AUTH_DOMAIN="your_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
# Add other standard Firebase config keys here
```

### 4. Run Locally
```bash
npm run dev

Open http://localhost:5173 in your browser.
```

# 🤝 Contribution
Developed by Manbendra Singh |2024UGEE067
Created during the 48-hour HACKSPHERE Coding Challenge.

