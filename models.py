from sqlmodel import SQLModel, Field

class Ticket(SQLModel, table = True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    priority: str
    status: str
    user_id: int = Field(foreign_key="user.id")

class TicketCreate(SQLModel):
    title: str
    description: str
    priority: str

class TicketUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    priority: str | None = None
    status: str | None = None

class User(SQLModel, table = True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    password_hash: str

class UserPublic(SQLModel):
    id: int
    email: str