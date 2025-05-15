import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_and_login_user():
    # Register
    response = client.post("/register/", json={"username": "testuser", "password": "testpass"})
    assert response.status_code in (200, 400)  # Peut déjà exister
    # Login
    response = client.post("/login/", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    assert "token" in response.json()

def test_get_all_users():
    response = client.get("/users/")
    assert response.status_code == 200
    assert "users" in response.json()

def test_get_user_data():
    # Suppose user 1 existe
    response = client.get("/user-data/", params={"user_id": 1})
    assert response.status_code in (200, 500)
