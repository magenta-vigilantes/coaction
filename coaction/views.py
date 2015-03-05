from flask import Blueprint, flash, jsonify, request
from .models import Task, TaskSchema
from . import db


coaction = Blueprint("coaction", __name__, static_folder="./static")
task_schema = TaskSchema()


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here

@coaction.route("api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    serializer = TaskSchema(many=True)
    result = serializer.dump(tasks)
    return jsonify({"tasks": result.data})


@coaction.route("api/tasks", methods=["POST"])
def add_tasks():
    if not request.get_json():
        return jsonify({"message": "No input data provided"}), 400
    title_input = request.get_json().get("title")
    status_input = request.get_json().get("status")
    due_date_input = request.get_json().get("due_date")
    input_data = dict(title=title_input, status=status_input, due_date=due_date_input)
    errors = task_schema.validate(input_data)
    if errors:
        return jsonify(errors), 400
    task = Task(input_data)
    db.session.add(task)
    db.session.commit()
    result = task_schema.dump(Task.query.get(task.id))
    return jsonify({"message": "Created new task", "task": result.data})

