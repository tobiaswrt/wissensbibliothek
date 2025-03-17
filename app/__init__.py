from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import markdown
from markdown_katex.extension import KatexExtension
import bleach
from bleach.sanitizer import ALLOWED_ATTRIBUTES, ALLOWED_TAGS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wiki.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.template_filter('markdown')
def render_markdown(text):
    html = markdown.markdown(text, extensions = ['extra', 'codehilite', 'tables'])
    return html

from app import routes