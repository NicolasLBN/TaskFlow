from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class Project(BaseModel):
    name: str
    description: str

class Task(BaseModel):
    title: str
    description: str
    status: str = "todo"
    user_id: int
    project_id: int

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
