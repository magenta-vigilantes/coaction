from .extensions import db



"""Add your models here."""


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False, default="new")
    # creator = user_id
    # assignee = user_id(default=creator)
    due_date = db.Column(db.DateTime, nullable=True)
