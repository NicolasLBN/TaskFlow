import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(scope="module")
def test_user():
    return {"username": "testuser", "password": "testpass"}

@pytest.fixture(scope="module")
def test_project():
    return {"name": "Test Project", "description": "Project for testing"}

@pytest.fixture(scope="module")
def test_task():
    return {"title": "Test Task", "description": "This is a test task", "status": "To Do"}

def test_register_user(test_user):
    response = client.post("/register/", params=test_user)
    assert response.status_code in (200, 400)
    assert "message" in response.json()

def test_login_user(test_user):
    response = client.post("/login/", params=test_user)
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"

def test_create_project(test_project):
    response = client.post("/projects/", json=test_project)
    assert response.status_code == 200
    assert response.json()["project"]["name"] == test_project["name"]

def test_get_users():
    response = client.get("/users/")
    assert response.status_code == 200
    assert "users" in response.json()
    assert isinstance(response.json()["users"], list)

def test_create_task(test_task):
    # First get user and project IDs
    users_response = client.get("/users/")
    projects_response = client.get("/projects/")
    if not users_response.json()["users"] or not projects_response.json()["projects"]:
        pytest.skip("No users or projects available for task creation")

    user_id = users_response.json()["users"][0]["id"]
    project_id = projects_response.json()["projects"][0]["id"]

    task_payload = {
        **test_task,
        "user_id": user_id,
        "project_id": project_id
    }

    response = client.post("/tasks/", json=task_payload)
    assert response.status_code == 200
    assert response.json()["message"] == "Task created successfully"

def test_read_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert "tasks" in response.json()
