from flask import Flask, render_template

from . import models
from .extensions import (db, migrate, config, debug_toolbar, bcrypt, login_manager)
from .views import coaction


SQLALCHEMY_DATABASE_URI = "postrges://localhost/coaction"
DEBUG = True
SECRET_KEY = 'development-key'
DEBUG_TB_INTERCEPT_REDIRECTS = False


def create_app():
    app = Flask(__name__)
    app.config.from_object(__name__)
    app.register_blueprint(coaction)

    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    return app