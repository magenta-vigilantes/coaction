from flask import Blueprint, flash
from .models import Task, TaskSchema

coaction = Blueprint("coaction", __name__, static_folder="./static")
task_schema = TaskSchema()

@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here
