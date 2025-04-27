from fastapi import APIRouter, HTTPException
from app.database import cursor, conn
from app.auth.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.models import RegisterRequest, LoginRequest
from app.utils.logger import logger

router = APIRouter()

@router.post("/register/")
async def register_user(request: RegisterRequest):
    username = request.username
    password = request.password
    hashed_password = hash_password(password)
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
    except Exception:
        logger.warning(f"Failed register attempt for {username}")
        raise HTTPException(status_code=400, detail="Username already exists")
    logger.info(f"User {username} registered successfully")
    return {"message": "User registered successfully"}

@router.post("/login/")
async def login_user(request: LoginRequest):
    username = request.username
    password = request.password
    cursor.execute("SELECT id, password FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    if not user or not verify_password(password, user[1]):
        logger.warning(f"Failed login for {username}")
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token({"sub": user[0], "username": username})
    return {"token": token}

@router.get("/users/")
async def get_all_users():
    cursor.execute("SELECT id, username FROM users")
    users = cursor.fetchall()
    return {"users": [{"id": user["id"], "username": user["username"]} for user in users]}

@router.get("/user-data/")
async def get_user_data(user_id: int):
    try:
        logger.info(f"Fetching data for user_id: {user_id}")

        # Récupérer les projets de l'utilisateur
        cursor.execute("SELECT * FROM projects WHERE id IN (SELECT project_id FROM user_projects WHERE user_id = ?)", (user_id,))
        projects = cursor.fetchall()

        # Récupérer les membres de l'équipe
        cursor.execute("""
            SELECT u.id, u.username FROM users u
            JOIN user_projects pu ON u.id = pu.user_id
            WHERE pu.project_id IN (SELECT project_id FROM user_projects WHERE user_id = ?)
        """, (user_id,))
        team_members = cursor.fetchall()

        return {
            "projects": [{"id": p[0], "name": p[1], "description": p[2]} for p in projects],
            "team_members": [{"id": m[0], "username": m[1]} for m in team_members]
        }
    except Exception as e:
        logger.error(f"Error fetching data for user_id {user_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching user data")
