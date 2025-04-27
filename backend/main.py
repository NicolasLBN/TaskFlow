import os
import sqlite3
from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "YOUR_SECRET_KEY"  # Change this to a secure random key
ALGORITHM = "HS256"

# Configuration de base du logger
logging.basicConfig(
    level=logging.INFO,  # Niveau de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)  # Créez un logger pour ce module
logger.info("Logger is working correctly!")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Ensure the "data" folder exists
os.makedirs("data", exist_ok=True)

# Initialize SQLite
conn = sqlite3.connect("data/taskflow.db", check_same_thread=False)
cursor = conn.cursor()

# Create the "users" table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# Create the "projects" table
cursor.execute("""
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
)
""")

# Create the "tasks" table
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'To Do',
    user_id INTEGER,
    project_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id)
)
""")

# Create the "user_projects" table (many-to-many relationship)
cursor.execute("""
CREATE TABLE IF NOT EXISTS user_projects (
    user_id INTEGER,
    project_id INTEGER,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id)
)
""")

# Read and execute the SQL file
with open("populate.sql", "r") as file:
    sql_script = file.read()
    cursor.executescript(sql_script)
conn.commit()

# Models
class User(BaseModel):
    username: str
    password: str

class Project(BaseModel):
    name: str
    description: str

class Task(BaseModel):
    title: str
    description: str
    status: str = "To Do"
    user_id: int
    project_id: int


# REST Methods for Projects
@app.post("/projects/")
async def create_project(project: Project):
    cursor.execute("INSERT INTO projects (name, description) VALUES (?, ?)", (project.name, project.description))
    conn.commit()
    return {"message": "Project created successfully", "project": project}

@app.post("/projects/{project_id}/users/{user_id}")
async def assign_user_to_project(project_id: int, user_id: int):
    try:
        cursor.execute("INSERT INTO user_projects (user_id, project_id) VALUES (?, ?)", (user_id, project_id))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User is already assigned to this project")
    return {"message": f"User {user_id} assigned to project {project_id}"}

@app.delete("/projects/{project_id}/users/{user_id}")
async def remove_user_from_project(project_id: int, user_id: int):
    try:
        # Vérifier si l'association existe
        cursor.execute(
            "SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?",
            (user_id, project_id),
        )
        association = cursor.fetchone()
        if not association:
            raise HTTPException(
                status_code=404, detail="User is not assigned to this project"
            )

        # Supprimer l'association
        cursor.execute(
            "DELETE FROM user_projects WHERE user_id = ? AND project_id = ?",
            (user_id, project_id),
        )
        conn.commit()

        return {"message": f"User {user_id} removed from project {project_id}"}
    except Exception as e:
        logger.error(f"Error removing user {user_id} from project {project_id}: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while removing the user from the project"
        )


# REST Methods for Tasks
@app.post("/tasks/")
async def create_task(task: Task):
    cursor.execute("""
        INSERT INTO tasks (title, description, status, user_id, project_id)
        VALUES (?, ?, ?, ?, ?)
    """, (task.title, task.description, task.status, task.user_id, task.project_id))
    conn.commit()
    return {"message": "Task created successfully", "task": task}

@app.get("/tasks/")
async def read_tasks():
    cursor.execute("""
        SELECT tasks.id, tasks.title, tasks.description, tasks.status, users.username, projects.name
        FROM tasks
        LEFT JOIN users ON tasks.user_id = users.id
        LEFT JOIN projects ON tasks.project_id = projects.id
    """)
    tasks = cursor.fetchall()
    return {"tasks": tasks}

@app.get("/projects/")
async def get_all_projects():
    try:
        # Récupérer tous les projets
        cursor.execute("SELECT * FROM projects")
        projects = cursor.fetchall()

        # Construire la réponse avec les utilisateurs et leurs tâches
        project_list = []
        for project in projects:
            project_id, name, description = project

            # Récupérer les utilisateurs rattachés au projet
            cursor.execute("""
                SELECT u.id, u.username FROM users u
                JOIN user_projects up ON u.id = up.user_id
                WHERE up.project_id = ?
            """, (project_id,))
            users = cursor.fetchall()

            # Ajouter les tâches pour chaque utilisateur
            user_list = []
            for user in users:
                user_id, username = user
                cursor.execute("""
                    SELECT id, title, description, status FROM tasks
                    WHERE user_id = ? AND project_id = ?
                """, (user_id, project_id))
                tasks = cursor.fetchall()

                user_list.append({
                    "id": user_id,
                    "username": username,
                    "tasks": [
                        {"id": task[0], "title": task[1], "description": task[2], "status": task[3]}
                        for task in tasks
                    ]
                })

            project_list.append({
                "id": project_id,
                "name": name,
                "description": description,
                "users": user_list
            })

        return {"projects": project_list}
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching projects")

@app.get("/users/")
async def get_all_users():
    cursor.execute("SELECT id, username FROM users")
    users = cursor.fetchall()
    return {"users": [{"id": user[0], "username": user[1]} for user in users]}


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify a password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# REST Methods

class RegisterRequest(BaseModel):
    username: str
    password: str

@app.post("/register/")
async def register_user(request: RegisterRequest):
    username = request.username
    password = request.password
    hashed_password = hash_password(password)
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        logger.warning(f"Failed register in attempt for user: {username}")
        raise HTTPException(status_code=400, detail="Username already exists")
    logger.info(f"User {username} register in successfully")
    return {"message": "User registered successfully"}



def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login/")
async def login_user(request: LoginRequest):
    username = request.username
    password = request.password
    logger.info(f"Attempting to log in user: {username}")

    # Fetch the user from the database
    cursor.execute("SELECT id, password FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    # Check if the user exists and the password is correct
    if not user or not verify_password(password, user[1]):  # Access the password as user[1]
        logger.warning(f"Failed login attempt for user: {username}")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    logger.info(f"User {username} logged in successfully")

    # Create an access token
    access_token = create_access_token(data={"sub": user[0], "username": username})  # user[0] is the user ID
    return {"token": access_token}

@app.get("/user-data/")
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