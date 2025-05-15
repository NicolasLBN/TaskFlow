import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_project():
    response = client.post("/projects/", json={"name": "Test Project", "description": "Desc"})
    assert response.status_code == 200
    assert "project" in response.json()

def test_get_all_projects():
    response = client.get("/projects/")
    assert response.status_code == 200
    assert "projects" in response.json()

def test_get_projects_with_details():
    response = client.get("/projects-with-details/")
    assert response.status_code == 200
    assert "projects" in response.json()
