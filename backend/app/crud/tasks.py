from fastapi import APIRouter, HTTPException
from app.database import cursor, conn
from app.models import Task
from datetime import datetime, timezone
from app.utils.logger import logger

router = APIRouter()

# REST Methods for Tasks

@router.post("/tasks/")
async def create_task(task: Task):
    # Print the received task object for debugging
    print(task.dict())  # Debug: show received object
    # Insert the new task into the database
    cursor.execute("""
        INSERT INTO tasks (title, description, status, assigned_user_id, project_id, created_by, created_date, modified_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (task.title, task.description, task.status, task.assigned_user_id, task.project_id, task.created_by, task.created_date, task.modified_date))
    conn.commit()
    # Return a success message and the created task
    return {"message": "Task created successfully", "task": task}


@router.put("/tasks/{task_id}")
async def update_task(task_id: int, task_data: dict):
    print(f"Updating task with ID: {task_data}")
    try:
        # Extract all fields from the request data
        title = task_data.get("title")
        description = task_data.get("description")
        status = task_data.get("status")
        assigned_user_id = task_data.get("assigned_user_id")
        project_id = task_data.get("project_id")
        created_by = task_data.get("created_by")
        created_date = task_data.get("created_date")
        # Always update modified_date to now
        modified_date = datetime.now(timezone.utc).isoformat()

        # Update all fields in the database
        cursor.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, status = ?, assigned_user_id = ?, project_id = ?, created_by = ?, created_date = ?, modified_date = ?
            WHERE id = ?
            """,
            (title, description, status, assigned_user_id, project_id, created_by, created_date, modified_date, task_id),
        )
        conn.commit()

        # Return the updated task information
        return {
            "id": task_id,
            "title": title,
            "description": description,
            "status": status,
            "assigned_user_id": assigned_user_id,
            "project_id": project_id,
            "created_by": created_by,
            "created_date": created_date,
            "modified_date": modified_date,
        }

    except Exception as e:
        logger.error(f"Error updating task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while updating the task")

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    try:
        # Check if the task exists
        cursor.execute("SELECT id FROM tasks WHERE id = ?", (task_id,))
        task = cursor.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Delete the task from the database
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()

        # Return a success message
        return {"message": f"Task with ID {task_id} deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the task")
        
@router.get("/tasks")
async def get_all_tasks_by_project(project_id: int):
    try:
        print(f"Fetching all tasks for project_id: {project_id}")
        # Query all tasks for the given project, joining user info
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
                "projectId": task["project_id"],
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