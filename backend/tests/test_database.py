from main import create_tables, conn

def test_create_tables():
    create_tables()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    assert "users" in tables
    assert "projects" in tables
    assert "tasks" in tables
    assert "user_projects" in tables
