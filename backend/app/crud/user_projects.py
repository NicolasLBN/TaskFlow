from fastapi import APIRouter, HTTPException
from app.database import cursor, conn
from app.models import Task
from datetime import datetime
from app.utils.logger import logger

router = APIRouter()

@router.delete("/projects/{project_id}/users/{user_id}")
async def remove_user_from_project(project_id: int, user_id: int):
    try:
        # Check if the user is part of the project
        cursor.execute("""
            SELECT * FROM user_projects
            WHERE project_id = ? AND user_id = ?
        """, (project_id, user_id))
        user_project = cursor.fetchone()

        if not user_project:
            raise HTTPException(status_code=404, detail="User is not part of the project")

        # Remove the user from the project
        cursor.execute("""
            DELETE FROM user_projects
            WHERE project_id = ? AND user_id = ?
        """, (project_id, user_id))
        conn.commit()

        return {"message": f"User {user_id} removed from project {project_id}"}
    except Exception as e:
        logger.error(f"Error removing user {user_id} from project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while removing the user from the project")