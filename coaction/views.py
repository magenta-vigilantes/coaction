from flask import Blueprint, flash, jsonify, request
from flask.ext.login import current_user, login_required, login_user, logout_user
from .models import Task, TaskSchema, User, UserSchema
from . import db


coaction = Blueprint("coaction", __name__, static_folder="./static")
task_schema = TaskSchema()
user_schema = UserSchema()


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here

@coaction.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    serializer = TaskSchema(many=True)
    result = serializer.dump(tasks)
    return jsonify({"tasks": result.data})


@coaction.route("/api/tasks", methods=["POST"])
def add_tasks():
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    title_input = request.get_json().get("title")
    status_input = request.get_json().get("status")
    due_date_input = request.get_json().get("due_date")
    creator_input = request.get_json().get("creator")
    input_data = dict(title=title_input, status=status_input, due_date=due_date_input, creator=creator_input)
    errors = task_schema.validate(input_data)
    if errors:
        return jsonify(errors), 400
    task = Task(**input_data)
    db.session.add(task)
    db.session.commit()
    result = task_schema.dump(Task.query.get(task.id))
    return jsonify({"message": "Created new task", "task": result.data})

@coaction.route("/api/tasks/<int:id>", methods=["PUT"])
def edit_task(id):
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    task = Task.query.get_or_404(id)
    task.title = request.get_json().get("title")
    task.status = request.get_json().get("status")
    task.due_date = request.get_json().get("due_date")
    db.session.commit()
    return jsonify({"message": "Your Task has been updated"})


@coaction.route("/api/register", methods=["POST"])
def register():
    if not request.get_json():
        return jsonify({"message": "Must provide username, email, and password"}), 400
    name_input = request.get_json("name")
    email_input = request.get_json("email")
    password_input = request.get_json("password")
    check = User.query.filter_by(email=email_input).first()
    name_check = User.query.filter_by(name=name_input).first()
    if check:
        return jsonify({"message": "Email address already exists."}), 400
    elif name_check:
        return jsonify({"message": "Please select a unique username."}), 400
    else:
        input_data = dict(name=name_input, email=email_input, password=password_input)
        errors = user_schema.validate(input_data)
        if errors:
            return jsonify(errors), 400
        user = User(**input_data)
        db.session.add(user)
        db.session.commit()
        result = user_schema.dump(User.query.get(user.name))
        return jsonify({"message": "Created new user", "user": result.data})
