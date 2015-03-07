#!/usr/bin/env python
import os

from flask.ext.script import Manager, Shell, Server
from flask.ext.migrate import MigrateCommand
from flask.ext.script.commands import ShowUrls, Clean

from coaction import create_app, db
from coaction.models import Task, User, Comment

app = create_app()
manager = Manager(app)
manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)
manager.add_command('show-urls', ShowUrls())
manager.add_command('clean', Clean())


@manager.shell
def make_shell_context():
    """ Creates a python REPL with several default imports
        in the context of the app
    """

    return dict(app=app, db=db)


@manager.command
def createdb():
    """Creates the database with all model tables. 
    Migrations are preferred."""
    db.create_all()


@manager.command
def seed_tasks():
    users = [["1", "Skul", "test@example.org"]]
    for id, name, email in users:
        user = User(id=id, name=name, email=email)
        db.session.add(user)
    db.session.commit()
    tasks = [["Fake data", "new", "2015-03-10T17:54:48.972000+00:00", "1"],
            ["Make new friends", "new", "2015-03-10T17:54:48.972000+00:00", "1"],
            ["Continue to be really, really cool", "new", "2015-03-10T17:54:48.972000+00:00", "1"   ]]
    for title, status, due_date, creator in tasks:
        task = Task(title=title,
                    status=status,
                    due_date=due_date,
                    creator=creator)
        db.session.add(task)
    db.session.commit()
    print("tasks seeded")


if __name__ == '__main__':
    manager.run()
