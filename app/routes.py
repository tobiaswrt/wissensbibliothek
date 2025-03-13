from app import app
from flask import render_template
from app.models import Category, Subcategory, Article


@app.route("/")
def startseite():
    kategorien = Category.query.all()
    return render_template('startseite.html', kategorien = kategorien)
