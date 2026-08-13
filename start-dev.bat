@echo off
echo ===================================================
echo   Launching Real-Time WhatsApp Web Microservices
echo ===================================================

echo Starting Auth Service on port 5001...
start "Auth Service (5001)" cmd /k "cd backend\auth-service && npm run dev"

echo Starting Chat Service on port 5002...
start "Chat Service (5002)" cmd /k "cd backend\chat-service && npm run dev"

echo Starting Notification Service on port 5003...
start "Notification Service (5003)" cmd /k "cd backend\notification-service && npm run dev"

echo Starting React Frontend on port 3000...
start "React Frontend (3000)" cmd /k "cd frontend && npm run dev"

echo All services launched! Access Frontend at http://localhost:3000
