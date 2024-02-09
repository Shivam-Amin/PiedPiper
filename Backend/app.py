from flask import Flask
from markupsafe import escape
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:anonymous@localhost:3306/piedpiper'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Users(db.Model):    
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        

    def __repr__(self):
        return f'<User {self.name}>'

@app.route("/")
def home():
    return "<h1>Hello, from backend. Running on port 5000...</h1>"

@app.route("/api/user/<name>")
def sayHi(name):
    usr = Users(name, "klaj", "")
    db.session.add(usr)
    db.session.commit()

if __name__ == '__main__':
    # db.create_all()
    app.run(debug=True)
