
# 🧩 Last Puzzle Endgame

<div align="center">

![Hackathon Badge](https://img.shields.io/badge/HACKSPHERE-2024-neon?style=for-the-badge)
![Problem Statement](https://img.shields.io/badge/Problem_Statement-4-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Deployed-Live-success?style=for-the-badge)

> **A strategic, algorithmic maze puzzle game featuring teleportation paradoxes and resource management.**

| 🚀 Play Online | 📺 Video Demo |
| :---: | :---: |
| [**👉 Click Here to Play**](https://glittery-narwhal-e3df0b.netlify.app/) | [**🍿 Watch Gameplay**](https://www.flexclip.com/share/14876450OVcSNhTnPByReGsEjYWNYMWzIqGRYZWu.html) |

*For the best experience, please set your browser zoom to 80%.*

</div>

---

## 📖 Project Overview

**Last Puzzle Endgame** is a submission for **PCON HACKSPHERE 2024**, directly addressing **Problem Statement 4: PortalMaze**.

The game requires players to navigate complex grid environments using movement, limited wall-breaking mechanics, and color-coded teleportation portals. It is designed to challenge spatial reasoning and algorithmic thinking, moving beyond simple traversal to strategic resource management.

### ✨ Key Features

* **⚔️ Dual-Mode Gameplay:**
    * **Normal Mode:** Pure pathfinding logic.
    * **Endgame Mode:** Introduces strategic resource management, allowing up to $K$ wall breaks to forge new shortcuts.
* **🌀 Teleportation Mechanics:** Zero-cost traversal via color-matched portal pairs.
* **🤖 Internal Path Analysis:** The game runs a background algorithm to calculate the optimal path (Par Score) for every level to ensure fair scoring.
* **💾 Persistent Player Identity:** Automatic username association via local storage/database prevents the need for repetitive data entry on leaderboards.
* **🛠️ Level Editor & Auto-Validation:** A fully functional editor allowing users to create maps. The system automatically validates solvency before allowing publication.

---

## 🧠 Technical Architecture & Algorithms

*This section highlights the "Advanced Thinking" required by Problem Statement 4.*

To ensure fairness and functionality, we implemented a custom pathfinding engine rather than relying on standard libraries.

### 1. State-Aware BFS (Breadth-First Search)
We use a modified BFS to solve the maze. Unlike standard pathfinding where a node is simply $(x, y)$, our node state tracks:

$$State = (x, y, drills\_used)$$

* **The Logic:** Visiting a cell with **0 drills** remaining is a fundamentally different "state" than visiting it with **1 drill** remaining.
* **The Result:** This allows the algorithm to find the *true* shortest path involving strategic wall breaks, rather than just the shortest open path.

### 2. The Validator Engine
Before a map is saved in the **Editor**, the engine runs three critical checks:
1.  **Reachability:** Is the **GOAL** physically reachable from the start?
2.  **Base Case:** What is the shortest path with Drill Count $K=0$?
3.  **Max Potential:** What is the shortest path with Drill Count $K \le Max$?

> 🔒 **Safety Lock:** If the map is deemed unsolvable by the engine, the "Publish" button remains locked to prevent frustration for other players.

---

## 🎮 Controls & Mechanics

| Action | Controls | Note |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or `Arrow Keys` | Basic movement. |
| **Teleport** | Stand on Portal + `Enter` | Instantly move between linked colors. |
| **Break Wall** | `Shift` + `Arrow Key` | Consumes **1 Drill Charge**. |

> **🏆 Scoring:** Scores are calculated based on **Step Count** (Primary Metric) and **Time Elapsed** (Secondary Metric).

---

## 🛠️ Tech Stack

* **Frontend:** ![React](https://img.shields.io/badge/-React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/-Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
* **Language:** ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
* **Backend / DB:** ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) (Firestore & Auth)
* **Styling:** CSS Modules

---

## 💻 Local Setup Instructions

Follow these steps to run the code locally for review.

### 1. Clone the Repository
```bash
git clone https://github.com/ManojSingh3003/LAST_PUZZLE_ENDGAME.git
cd LAST_PUZZLE_ENDGAME
```
2. Install Dependencies
```bash
npm install
```
3. Configure Environment
```bash
Create a .env file in the root folder. You must add your specific Firebase credentials to enable the Level Editor and Leaderboard features.
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_bucket.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

4. Run Locally
```bash
npm run dev
```

Open http://localhost:5173 in your browser.
⚠️ Troubleshooting: Firebase Indexes
If the game loads but the Leaderboard or Level List fails:
 * Open your browser console (F12).
 * Look for a red Firebase error containing a link.
 * Click the link—it will take you to the Firebase Console and automatically create the required composite indexes.
# 🤝 Contribution & Credits
Developed by: Manbendra Singh (2024UGEE067)
Event: Created with ❤️ during the 48-hour HACKSPHERE Coding Challenge.


