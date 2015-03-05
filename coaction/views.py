from flask import Blueprint, flash, jsonify
from .models import Task, TaskSchema



coaction = Blueprint("coaction", __name__, static_folder="./static")
task_schema = TaskSchema()

@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here
@coaction.route("api/tasks", methods="GET")
def get_tasks():
    tasks = Task.query.all()
    serializer = TaskSchema(many=True)
    result = serializer.dump(tasks)
    return jsonify({"tasks": result.data})

