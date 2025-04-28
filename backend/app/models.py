from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    password: str

class Project(BaseModel):
    name: str
    description: str

class Task(BaseModel):
    id: Optional[int]  # L'ID est optionnel car il est généré automatiquement
    project_id: int
    title: str
    description: str
    status: str
    assigned_user_id: Optional[int]  # Peut être nul si aucun utilisateur n'est assigné
    created_by: int
    created_date: str
    modified_date: str

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str