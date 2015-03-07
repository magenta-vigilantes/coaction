from .extensions import db, login_manager, bcrypt
from marshmallow import Schema, fields, ValidationError
from flask.ext.login import UserMixin


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False, default="new")
    # assignee = user_id(default=creator)
    due_date = db.Column(db.DateTime, nullable=True)
    creator = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, title, status, due_date, creator):
        self.title = title
        self.status = status
        self.due_date = due_date
        self.creator = creator


def must_not_be_blank(data):
    if not data:
        raise ValidationError("Data not provided")


class TaskSchema(Schema):
    title = fields.Str(required=True, validate=must_not_be_blank)
    status = fields.Str(required=True, validate=must_not_be_blank)
    due_date = fields.DateTime(required=False)
    creator = fields.Integer(required=False)

    class Meta:
        fields = ("title", "status", "due_date", "creator")


@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    encrypted_password = db.Column(db.String(60))

    def __init__(self, name, email, password):
        # self.id = id
        self.name = name
        self.email = email
        self.password = password

    def get_password(self):
        return getattr(self, "_password", None)

    def set_password(self, password):
        self._password = self.password
        self.encrypted_password = bcrypt.generate_password_hash(password)

    password = property(get_password, set_password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.encrypted_password, password)

    def __repr__(self):
        return "<User {}>".format(self.email)


class UserSchema(Schema):
    class Meta:
        fields = ("name", "email", "tasks")

