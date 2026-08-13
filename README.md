# 🚀 Real-Time WhatsApp-Like Chat & Notifications Microservices Application

An enterprise-ready, full-stack real-time chat and notification web application built with **Node.js, Express, TypeORM, MySQL, Joi, Socket.io, React.js, Vite, TanStack React Query, Docker, and Docker Compose**.

---

## 🏗️ Architecture & Technology Stack

### Backend (Node.js Microservices)
- **Auth & User Service** (`Port 5001`): JWT Auth, Bcrypt hashing, profile & contact search, Joi payload validation, TypeORM + MySQL.
- **Chat & Message Service** (`Port 5002`): 1-on-1 and Group conversations, Message history, Socket.io WebSockets for instant message delivery, live typing status, online presences, and double blue ticks (`✓`, `✓✓`, `✓✓` blue).
- **Notification Service** (`Port 5003`): Event notifications, unread counts, system alert logs.
- **Clean Controller-Service-Repository Pattern**: Modular, scalable microservices codebase with global async error handling.

### Frontend (React.js + Vite)
- **Vite & React 18**: Fast SPA setup with custom WhatsApp Web dark/light themes.
- **TanStack React Query**: Server state caching, optimistic updates, and background refetching.
- **Context API Layer**: `AuthContext` (JWT session), `SocketContext` (Socket.io event lifecycle), `ThemeContext` (Dark/Light mode).
- **Aesthetic WhatsApp Web UI**: Custom message bubbles, unread counters, audio alert tone simulation, emoji picker, media drawer, and user modals.

### DevOps & Microservices Orchestration
- **API Gateway (Nginx - `Port 8000`)**: Unified reverse proxy for REST API routing and WebSockets upgrading.
- **Docker Compose**: One-command cluster launcher orchestrating MySQL 8.0, Auth, Chat, Notification services, Nginx Gateway, and React Frontend.

---

## ⚡ Quick Start with Docker Compose

Run the entire microservices stack with a single command:

```bash
docker-compose up --build
```

Once running:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **API Gateway**: [http://localhost:8000](http://localhost:8000)
- **MySQL Database**: `localhost:3306`

---

## 🔑 Pre-Configured Demo Accounts

Use any of these demo accounts to log in instantly:

| Email | Password | Role |
| :--- | :--- | :--- |
| `ahmed@whatsapp.com` | `password123` | Senior Full Stack Engineer |
| `sara@whatsapp.com` | `password123` | UI/UX Designer & Product Lead |
| `omar@whatsapp.com` | `password123` | DevOps & Cloud Architect |

---

## 🛠️ Local Manual Development Setup

If running without Docker:

1. **Start MySQL Database**: Ensure MySQL is running on port 3306 with database `whatsapp_db`.
2. **Install & Start Auth Service**:
   ```bash
   cd backend/auth-service
   npm install
   npm run dev
   ```
3. **Install & Start Chat Service**:
   ```bash
   cd backend/chat-service
   npm install
   npm run dev
   ```
4. **Install & Start Notification Service**:
   ```bash
   cd backend/notification-service
   npm install
   npm run dev
   ```
5. **Install & Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
6. **Populate Demo Seed Data** (Optional):
   ```bash
   npx ts-node backend/seed.ts
   ```

---

## 🌟 Real-Time Features Summary
- **Real-time WebSockets Messaging**: Instant send/receive via Socket.io.
- **Message Status Ticks**: Single tick (`✓`) sent, double tick (`✓✓`) delivered, blue double tick (`✓✓`) read.
- **Live Typing Indicator**: Real-time broadcast when user is typing.
- **Online Presence**: Live green dot & online status updates.
- **Direct & Group Chats**: Create custom multi-participant groups.
- **Audio & Push Toast Notifications**: Built-in sound effects on incoming messages.
