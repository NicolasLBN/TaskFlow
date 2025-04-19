import os
from fastapi import FastAPI
from pydantic import BaseModel
import duckdb

app = FastAPI()

# Verify if the database directory exists, if not create it
if not os.path.exists("data"):
os.makedirs("data", exist_ok=True)

# Init DuckDB
conn = duckdb.connect(database='data/taskflow.db', read_only=False)

# Create a sequence for auto-incrementing IDs
conn.execute("CREATE SEQUENCE IF NOT EXISTS task_id_seq")

# Create the "tasks" table if it doesn't exist
conn.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER DEFAULT nextval('task_id_seq'),
    title VARCHAR,
    description VARCHAR,
    status VARCHAR DEFAULT 'To Do'
)
""")

# Add default tasks if the table is empty
existing_tasks = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
if existing_tasks == 0:
    default_tasks = [
        ("Task 1", "Description for Task 1", "To Do"),
        ("Task 2", "Description for Task 2", "In Progress"),
        ("Task 3", "Description for Task 3", "Done"),
    ]
    conn.executemany("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)", default_tasks)

# Task model
class Task(BaseModel):
    title: str
    description: str
    status: str = "To Do"

# REST Methods
@app.post("/tasks/")
async def create_task(task: Task):
    conn.execute("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)", (task.title, task.description, task.status))
    return {"message": "Task created successfully", "task": task}

@app.get("/tasks/")
async def read_tasks():
    tasks = conn.execute("SELECT id, title, description, status FROM tasks").fetchall()
    return {"tasks": tasks}

@app.get("/tasks/{task_id}")
async def read_task(task_id: int):
    task = conn.execute("SELECT id, title, description, status FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"task": task}

@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    updated = conn.execute("""
        UPDATE tasks
        SET title = ?, description = ?, status = ?
        WHERE id = ?
    """, (task.title, task.description, task.status, task_id)).rowcount
    if updated == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully", "task": task}

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    deleted = conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,)).rowcount
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}