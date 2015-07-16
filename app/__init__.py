from flask import Flask, request, Response, render_template,send_from_directory
from flask import Flask
from mongokit import Connection,Document 

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
app = Flask(__name__, static_folder='static')
app.config.from_object(__name__)
# connect to the database
connection = Connection(app.config['MONGODB_HOST'],
                        app.config['MONGODB_PORT'])
class Exam(Document):
    structure = {
        'name': unicode,
        'data': list,
        'datestr': unicode
    }




    use_dot_notation = True
    def __repr__(self):
        return '<Exam %r>' % (self.name)

# register the User document with our current connection
connection.register([Exam])

from app import views






