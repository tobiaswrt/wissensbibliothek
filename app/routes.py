from app import app
from flask import render_template

@app.route("/")
def startseite():
    return render_template('startseite.html')