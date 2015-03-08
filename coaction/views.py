from flask import Blueprint, flash, jsonify, request
from flask.ext.login import current_user, login_required, login_user, logout_user
from .models import Task, TaskSchema, User, UserSchema, Comment, CommentSchema
from . import db

coaction = Blueprint("coaction", __name__, static_folder="./static")
task_schema = TaskSchema()
user_schema = UserSchema()
comment_schema = CommentSchema()


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


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
    assignee_input = request.get_json().get("assignee")
    input_data = dict(title=title_input, status=status_input, due_date=due_date_input, creator=current_user.id, assignee=assignee_input)
    errors = task_schema.validate(input_data)
    if errors:
        return jsonify(errors), 400
    task = Task(**input_data)
    db.session.add(task)
    db.session.commit()
    result = task_schema.dump(Task.query.get(task.id))
    return jsonify({"message": "Created new task", "task": result.data}), 200


@coaction.route("/api/tasks/<int:id>", methods=["PUT"])
def edit_task(id):
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    task = Task.query.get_or_404(id)
    task.title = request.get_json().get("title")
    task.status = request.get_json().get("status")
    task.due_date = request.get_json().get("due_date")
    task.assignee = request.get_json().get("assignee")
    db.session.commit()
    return jsonify({"message": "Your Task has been updated"}), 200


@coaction.route("/api/register", methods=["POST"])
def register():
    if not request.get_json():
        return jsonify({"message": "Must provide username, email, and password"}), 400
    name_input = request.get_json().get("name")
    email_input = request.get_json().get("email")
    password_input = request.get_json().get("password")
    input_data = dict(name=name_input, email=email_input, password=password_input)
    check = User.query.filter_by(email=email_input).first()
    name_check = User.query.filter_by(name=name_input).first()
    if check:
        return jsonify({"message": "Email address already exists."}), 400
    elif name_check:
        return jsonify({"message": "Please select a unique username."}), 400
    else:
        errors = user_schema.validate(input_data)
        if errors:
            return jsonify(errors), 400
        user = User(name=name_input, email=email_input, password=password_input)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        result = user_schema.dump(User.query.get(user.id))
        return jsonify({"message": "You have been registered and logged in.", "user": result.data}), 200


@coaction.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return "You have been logged out. Do come again.", 200


@coaction.route("/api/login", methods=["POST"])
def login():
    if not request.get_json():
        return jsonify({"message": "Please try again."}), 400
    name_input = request.get_json().get("name")
    password_input = request.get_json().get("password")
    user = User.query.filter_by(name=name_input).first()
    if user and user.check_password(password_input):
        login_user(user)
        return jsonify({"message": "You have been logged in."}), 200
    else:
        return jsonify({"message": "Incorrect Username or Password"}), 400


@coaction.route("/api/tasks/<task_id>/comments", methods=["POST"])
def add_comment(task_id):
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    text_input = request.get_json().get("text")
    date_created_input = request.get_json().get("date_created")
    input_data = dict(text=text_input, date_created=date_created_input, user_id=current_user.id, task_id=task_id)
    errors = comment_schema.validate(input_data)
    if errors:
        return jsonify(errors), 400
    comment = Comment(**input_data)
    db.session.add(comment)
    db.session.commit()
    result = comment_schema.dump(Comment.query.get(comment.id))
    return jsonify({"message": "Comment added", "comment": result.data}), 200


@coaction.route("/api/tasks/<task_id>/comments/<comment_id>", methods=["PUT"])
def edit_comment(task_id, comment_id):
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    comment = Comment.query.get_or_404(id)
    comment.text = request.get_json().get("text")
    comment.date_created = request.get_json().get("date_created")
    db.session.commit()
    return jsonify({"message": "Your comment has been edited"}), 200


@coaction.route("/api/users/<user_id>/", methods=["GET"])
def view_user_tasks(user_id):
    tasks = Task.query.filter_by(creator=current_user.id)
    serializer = TaskSchema(many=True)
    result = serializer.dump(tasks)
    return jsonify({"tasks": result.data}), 200


@coaction.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    serializer = UserSchema(many=True)
    result = serializer.dump(users)
    return jsonify({"users": result.data}), 200
