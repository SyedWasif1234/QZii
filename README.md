# QuizMaster
A full stack application  where users have different roles (Student, Faculty, Admin). This project combines **Role-Based Access Control (RBAC)** for resource management with **Real-Time Multiplayer Battles** powered by WebSockets and Redis.

🚀 Features Implemented

🔐 Authentication & Security

    Secure Auth Flow:** Registration, Login, and Logout using JWT (JSON Web Tokens) stored in HttpOnly cookies.
    Role-Based Access Control (RBAC): Middleware protects routes based on user roles (`Student`, `Faculty`, `Admin`).
    Middleware Protection: `AuthMiddleware` verifies sessions, and specific role-checkers ensure data integrity.

⚔️ Real-Time Battle Mode (Socket.io + Redis)

    1v1 Multiplayer: Real-time quiz battles between users.
    Event-Driven Architecture: Uses Socket.io to push updates (scores, next question) only when state changes, minimizing server load.
    Redis Caching: "Hot" game data (room state, current scores, question sets) is stored in Redis for lightning-fast access, reducing database I/O.
    Latency Handling: Server-side validation ensures fair play while client-side timers provide immediate visual feedback.

📚 Quiz & Content Management

    Category Management: Admin-managed topics (e.g., JavaScript, System Design).
    Quiz Engine: Faculty/Admins can create quizzes and manage question banks.
    Data Fetching: Efficiently fetches quiz data from PostgreSQL via Prisma ORM.

🛠️ Tech Stack

    Runtime: Node.js
    Framework: Express.js
    Database: PostgreSQL (via Prisma ORM)
    Caching/Real-time Store:** Redis (Upstash)
    WebSockets: Socket.io
    Authentication:JWT, Bcrypt.js, Cookie-Parser

🧾 API Routes to Build

🔐 Auth & API Key:

    POST /auth/register → Register user with a role (default: student)
    POST /auth/login → Login, return JWT
    POST /auth/api-key → Generate API key
    GET /auth/me → Get current user profile

⚔️ Battle Mode (Socket Events):

    The battle system uses a separate socket handler optimized with Redis:
    1.  `create_challenge`: Host initializes a room. Server fetches quiz from DB, strips answers, and caches game state in Redis.
    2.  `join_challenge`: Opponent joins via Room ID. Server syncs game state.
    3.  `submit_answer`: Validates answers against Redis cache. Updates score.
    4.  `next_question` / `game_over`: Server pushes state updates to both clients simultaneously.

📚 Quiz & Categories :
    
    Category Controller: Manage quiz topics.
    Quiz API: CRUD operations for Quizzes.
    Questions API: Add/Edit questions linked to specific quizzes.

📦 Installation & Setup

    1.  Clone the repository:
        ```bash
        git clone [https://github.com/yourusername/campushub.git](https://github.com/yourusername/campushub.git)
        cd campushub
        ```
    
    2.  Install Dependencies:
        ```bash
        npm install
        ```
    
    3.  **Environment Setup:
       
        Create a `.env` file in the root directory:
        ```env
        PORT=
        DATABASE_URL=
        REDIS_URL=
        JWT_SECRET="your_secure_secret"
        ```
    
    5. Database Migration (Prisma):
        ```bash
        npx prisma migrate dev --name init
        ```
    
    6. Run the Server:
        ```bash
        npm run dev
        ```

---

🎯 Key Learnings Implemented

    Modular Architecture: Separation of concerns (Controllers, Routes, Middleware, Socket Handlers).
    Hybrid Database Approach: Using PostgreSQL for persistent data (Users, Quizzes) and Redis for ephemeral data (Active Battles).
    Optimistic UI Patterns: Synchronizing client-side timers with server-side validation to ensure a smooth user experience.
    Secure Authentication: Implementation of HttpOnly cookies to prevent XSS attacks.
