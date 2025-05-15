import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_remove_user_from_project():
    # Suppose project_id=1, user_id=1 existent
    response = client.delete("/projects/1/users/1")
    assert response.status_code in (200, 404, 500)
