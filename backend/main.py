import os
import sqlite3
from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

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
'''with open("populate.sql", "r") as file:
    sql_script = file.read()
    cursor.executescript(sql_script)
conn.commit()'''

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

# REST Methods for Users
@app.post("/users/")
async def create_user(user: User):
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, user.password))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User created successfully", "user": user}

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
    cursor.execute("SELECT id, name, description FROM projects")
    projects = cursor.fetchall()
    return {
        "projects": [
            {"id": row[0], "name": row[1], "description": row[2]} for row in projects
        ]
    }


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
@app.post("/register/")
async def register_user(username: str, password: str):
    hashed_password = hash_password(password)
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User registered successfully"}

@app.post("/login/")
async def login_user(username: str, password: str):
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    if not user or not verify_password(password, user[0]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}