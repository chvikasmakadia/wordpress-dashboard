# WordPress Dashboard Builder

A modern drag-and-drop Page Builder application constructed using React, Next.js, and a Node.js backend. Features elementor-like range offsets and styling options for sliders, loop carousels, loop grids, and image carousels.

---

## 🚀 How to Run the Application

Follow these steps to clone and run the application locally on a new machine.

### 📋 Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/chvikasmakadia/wordpress-dashboard.git
cd wordpress-dashboard
```

---

### Step 2: Set Up the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   Create a `.env` file inside the `server/` directory and configure it (see `.env.example` as a reference):
   ```env
   PORT=5000
   # Add your database or secret configurations here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start running on port `5000` (e.g. `http://localhost:5000`).*

---

### Step 3: Set Up the Frontend Client
1. Open a new terminal session and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The client will start running on port `3000` (e.g. `http://localhost:3000`).*

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 15, React 19, Lucide React (Icons)
* **Backend**: Node.js, Express
* **Database**: JSON-based mock database storage
