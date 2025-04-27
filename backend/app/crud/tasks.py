from fastapi import APIRouter, HTTPException
from app.database import cursor, conn
from app.models import Task
from datetime import datetime
from app.utils.logger import logger

router = APIRouter()

# REST Methods for Tasks
@router.post("/tasks/")
async def create_task(task: Task):
    cursor.execute("""
        INSERT INTO tasks (title, description, status, user_id, project_id)
        VALUES (?, ?, ?, ?, ?)
    """, (task.title, task.description, task.status, task.user_id, task.project_id))
    conn.commit()
    return {"message": "Task created successfully", "task": task}


@router.put("/tasks/{task_id}")
async def update_task(task_id: int, task_data: dict):
    try:
        title = task_data.get("title")
        description = task_data.get("description")
        status = task_data.get("status")
        modified_date = datetime.utcnow().isoformat()

        cursor.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, status = ?, modified_date = ?
            WHERE id = ?
            """,
            (title, description, status, modified_date, task_id),
        )
        conn.commit()

        return {
            "id": task_id,
            "title": title,
            "description": description,
            "status": status,
            "modifiedDate": modified_date,
        }
    except Exception as e:
        logger.error(f"Error updating task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while updating the task")


@router.get("/tasks")
async def get_all_tasks_by_project(project_id: int):
    try:
        print(f"Fetching all tasks for project_id: {project_id}")
        cursor.execute("""
            SELECT 
                t.id,
                t.project_id,
                t.title,
                t.description,
                t.status,
                t.created_date,
                t.modified_date,
                assigned_user.id AS assigned_user_id,
                assigned_user.username AS assigned_user_username,
                created_user.id AS created_user_id,
                created_user.username AS created_user_username
            FROM 
                tasks t
            LEFT JOIN 
                users AS assigned_user ON t.assigned_user_id = assigned_user.id
            LEFT JOIN 
                users AS created_user ON t.created_by = created_user.id
            WHERE 
                t.project_id = ?
        """, (project_id,))
        tasks = cursor.fetchall()

        # Convert rows to dictionaries and structure the response
        return [
            {
                "id": task["id"],
                "project_id": task["project_id"],
                "title": task["title"],
                "description": task["description"],
                "status": task["status"],
                "createdDate": task["created_date"],
                "modifiedDate": task["modified_date"],
                "assignedUser": {
                    "id": task["assigned_user_id"],
                    "username": task["assigned_user_username"]
                } if task["assigned_user_id"] else None,
                "createdBy": {
                    "id": task["created_user_id"],
                    "username": task["created_user_username"]
                }
            }
            for task in tasks
        ]
    except Exception as e:
        logger.error(f"Error fetching tasks for project_id {project_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching tasks for the project")
