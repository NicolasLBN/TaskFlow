from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import cursor, conn
from app.websocket_manager import manager, websocket_endpoint
from app.database import create_tables
from app.utils.logger import logger
from fastapi import WebSocket
from app.crud import users, projects, tasks, user_projects
from app.auth import jwt_handler, security

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers here if you modularize even more

# WebSocket route
app.websocket("/ws/kanban")(websocket_endpoint)

# Create tables on startup
create_tables()

logger.info("Application started.")

# Routes from CRUD
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(user_projects.router)
