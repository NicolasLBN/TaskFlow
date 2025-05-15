import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_routes_exist():
    # Vérifie que les routes principales sont bien enregistrées
    routes = [route.path for route in app.routes]
    assert "/ws/kanban" in routes
    # Ajoutez ici d'autres assertions selon les routes attendues

def test_cors_headers():
    response = client.options(
        "/ws/kanban",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
