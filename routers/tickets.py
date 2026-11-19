from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import get_session
from models import Ticket, User, TicketUpdate, TicketCreate
from auth import get_current_user

router = APIRouter(
    prefix = "/tickets",
    tags = ["Tickets"]
)


@router.get("/")
def read_ticket(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    tickets = session.exec(select(Ticket).where(Ticket.user_id == current_user.id)).all()
    return tickets

@router.get("/active")
def read_active_tickets(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    tickets = session.exec(
        select(Ticket).where(Ticket.status == "open")
    ).all()

    return tickets


@router.get("/{ticket_id}")
def get_ticket_by_id(ticket_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Not found")

    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")

    return ticket

@router.post("/")
def post_ticket(ticket: TicketCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    ticket_data = ticket.model_dump()

    new_ticket = Ticket(
        **ticket_data,
        status = "open",
        user_id=current_user.id
    )

    session.add(new_ticket)
    session.commit()
    session.refresh(new_ticket)

    return new_ticket

@router.delete("/{ticket_id}")
def delete_router_by_id(ticket_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Not Found")

    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not Found")

    session.delete(ticket)
    session.commit()
    return ticket

@router.patch("/{ticket_id}")
def update_ticket(ticket_id: int, updated_ticket: TicketUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Not found")

    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not Found")

    ticket_data = updated_ticket.model_dump(exclude_unset=True)
    ticket.sqlmodel_update(ticket_data)

    session.commit()
    session.refresh(ticket)

    return ticket