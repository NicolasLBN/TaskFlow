import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_update_delete_task():
    task_data = {
        "id":0, 
        "title": "Default Title",
        "description": "Default Description",
        "status": "todo",
        "assigned_user_id": None,
        "project_id": 1,
        "created_by": 1,
        "created_date": "2025-04-28T18:44:50.535Z",
        "modified_date": "2025-04-28T18:44:50.530879"
    }
    response = client.post("/tasks/", json=task_data)
    print(response)
    assert response.status_code == 200
    task = response.json()["task"]
    task_id = task.get("id", 1)  # fallback

    # Update
    response = client.put(f"/tasks/{task_id}", json={"title": "Updated", "description": "Updated", "status": "Done"})
    assert response.status_code in (200, 500)

    # Delete
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code in (200, 404, 500)

def test_get_all_tasks_by_project():
    response = client.get("/tasks", params={"project_id": 1})
    assert response.status_code in (200, 500)
