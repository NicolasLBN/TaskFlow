from fastapi import FastAPI
from pydantic import BaseModel
import duckdb

app = FastAPI()

# Initialisation de DuckDB (en mémoire pour cet exemple)
con = duckdb.connect(database=':memory:')

class Task(BaseModel):
    title: str
    description: str

@app.post("/tasks/")
async def create_task(task: Task):
    con.execute("CREATE TABLE IF NOT EXISTS tasks (title VARCHAR, description VARCHAR)")
    con.execute("INSERT INTO tasks VALUES (?, ?)", (task.title, task.description))
    return {"message": "Task created successfully", "task": task}

@app.get("/tasks/")
async def read_tasks():
    result = con.execute("SELECT * FROM tasks").fetchall()
    return {"tasks": result}
