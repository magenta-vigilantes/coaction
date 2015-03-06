from .extensions import db
from marshmallow import Schema, fields, ValidationError


"""Add your models here."""


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False, default="new")
    # creator = user_id
    # assignee = user_id(default=creator)
    due_date = db.Column(db.DateTime, nullable=True)


    def __init__(self, title, status, due_date):
        self.title = title
        self.status = status
        self.due_date = due_date


def must_not_be_blank(data):
    if not data:
        raise ValidationError("Data not provided")


class TaskSchema(Schema):
    title = fields.Str(required=True, validate=must_not_be_blank)
    status = fields.Str(required=True, validate=must_not_be_blank)
    due_date = fields.DateTime(required=False)

    class Meta:
        fields = ("title", "status", "due_date")

