import os
import sqlite3

# Ensure the "data" folder exists
os.makedirs("data", exist_ok=True)

# Initialize SQLite
conn = sqlite3.connect("data/taskflow.db", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

def create_tables():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'To Do',
        assigned_user_id INTEGER,
        created_by INTEGER NOT NULL,
        created_date TEXT NOT NULL,
        modified_date TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (assigned_user_id) REFERENCES users (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_projects (
        user_id INTEGER,
        project_id INTEGER,
        PRIMARY KEY (user_id, project_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)
    conn.commit()
