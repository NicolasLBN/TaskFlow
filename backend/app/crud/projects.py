from fastapi import APIRouter, HTTPException
from app.database import cursor, conn
from app.utils.logger import logger
from app.models import Project
import sqlite3

router = APIRouter()

@router.post("/projects/")
async def create_project(project: Project):
    cursor.execute("INSERT INTO projects (name, description) VALUES (?, ?)", (project.name, project.description))
    conn.commit()
    return {"message": "Project created successfully", "project": project}

@router.post("/projects/{project_id}/users/{user_id}")
async def assign_user_to_project(project_id: int, user_id: int):
    try:
        cursor.execute("INSERT INTO user_projects (user_id, project_id) VALUES (?, ?)", (user_id, project_id))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User is already assigned to this project")
    return {"message": f"User {user_id} assigned to project {project_id}"}

@router.get("/projects/")
async def get_all_projects():
    try:
        # Fetch all projects
        cursor.execute("SELECT * FROM projects")
        projects = cursor.fetchall()

        project_list = []
        for project in projects:
            project_id, name, description = project

            # Fetch users associated with the project
            cursor.execute("""
                SELECT u.id, u.username FROM users u
                JOIN user_projects up ON u.id = up.user_id
                WHERE up.project_id = ?
            """, (project_id,))
            users = [{"id": user[0], "username": user[1]} for user in cursor.fetchall()]

            # Fetch tasks associated with the project
            cursor.execute("""
                SELECT t.id, t.project_id, t.title, t.description, t.status, 
                       t.assigned_user_id, t.created_by, t.created_date, t.modified_date,
                       au.username AS assigned_user_name,
                       cu.username AS created_by_name
                FROM tasks t
                LEFT JOIN users au ON t.assigned_user_id = au.id
                LEFT JOIN users cu ON t.created_by = cu.id
                WHERE t.project_id = ?
            """, (project_id,))
            tasks = [
                {
                    "id": task[0],
                    "project_id": task[1],
                    "title": task[2],
                    "description": task[3],
                    "status": task[4],
                    "assigned_user_id": task[5],  # Assigned user ID
                    "assignedUser": {"id": task[5], "username": task[9]} if task[5] else None,
                    "created_by": task[6],  # Created by user ID
                    "createdBy": {"id": task[6], "username": task[10]},
                    "created_date": task[7],
                    "modified_date": task[8],
                }
                for task in cursor.fetchall()
            ]

            # Add the project to the list
            project_list.append({
                "id": project_id,
                "name": name,
                "description": description,
                "users": users,
                "tasks": tasks,
            })
        return {"projects": project_list}
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching projects")