from fastapi import FastAPI
from sqlmodel import SQLModel
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import engine
from routers import tickets, users


app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/login")
def login_page():
    return FileResponse("frontend/login.html")


@app.get("/register")
def register_page():
    return FileResponse("frontend/register.html")

@app.get("/")
def home():
    return FileResponse("frontend/index.html")


SQLModel.metadata.create_all(engine)


app.include_router(tickets.router)
app.include_router(users.router)