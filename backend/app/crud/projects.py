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



@router.get("/projects-with-details/")
async def get_projects_with_details():
    try:
        # Execute a SQL query to fetch project, user, and task details with joins
        cursor.execute("""
            SELECT 
                p.id AS project_id, 
                p.name AS project_name, 
                p.description AS project_description,
                u.id AS user_id,
                u.username AS user_username,
                t.id AS task_id, 
                t.title AS task_title, 
                t.description AS task_description, 
                t.status AS task_status, 
                t.assigned_user_id AS task_assigned_user_id, 
                au.username AS assigned_user_username, 
                t.created_by AS task_created_by, 
                cu.username AS task_created_by_username, 
                t.created_date AS task_created_date, 
                t.modified_date AS task_modified_date
            FROM projects p
            LEFT JOIN user_projects up ON up.project_id = p.id
            LEFT JOIN users u ON up.user_id = u.id
            LEFT JOIN tasks t ON t.project_id = p.id
            LEFT JOIN users au ON t.assigned_user_id = au.id
            LEFT JOIN users cu ON t.created_by = cu.id
        """)
        rows = cursor.fetchall()

        # Helper function to add a user to the project if not already present
        def add_user(project, user_id, user_username):
            if user_id:
                user = {"id": user_id, "username": user_username}
                if user not in project["users"]:
                    project["users"].append(user)

        # Helper function to add a task to the project if not already present
        def add_task(project, row):
            task_id = row["task_id"]
            if not task_id:
                return
            existing_task_ids = {task["id"] for task in project["tasks"]}
            if task_id in existing_task_ids:
                return
            task = {
                "id": task_id,
                "title": row["task_title"],
                "description": row["task_description"],
                "status": row["task_status"],
                "assigned_user_id": {
                    "id": row["task_assigned_user_id"],
                    "username": row["assigned_user_username"]
                } if row["task_assigned_user_id"] else None,
                "created_by": {
                    "id": row["task_created_by"],
                    "username": row["task_created_by_username"]
                },
                "created_date": row["task_created_date"],
                "modified_date": row["task_modified_date"]
            }
            project["tasks"].append(task)

        projects = {}
        # Iterate over each row and build the project dictionary
        for row in rows:
            project_id = row["project_id"]
            if project_id not in projects:
                projects[project_id] = {
                    "id": project_id,
                    "name": row["project_name"],
                    "description": row["project_description"],
                    "users": [],
                    "tasks": []
                }
            project = projects[project_id]
            add_user(project, row["user_id"], row["user_username"])
            add_task(project, row)

        project_list = list(projects.values())
        # Return the list of projects with their users and tasks
        return {"projects": project_list}

    except Exception as e:
        # Log the error and raise an HTTP 500 error if something goes wrong
        logger.error(f"Error fetching projects with details: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching projects with details")