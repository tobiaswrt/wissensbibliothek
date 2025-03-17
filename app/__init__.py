from flask import Flask
from markupsafe import Markup
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import markdown
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wiki.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.template_filter('markdown')
def render_markdown(text):
    html = markdown.markdown(text, extensions = ['extra', 'codehilite', 'tables'])
    return html

@app.template_filter('generate_toc')
def generate_toc(markdown_content):
    """
    Generiert ein Inhaltsverzeichnis aus Markdown-Überschriften
    """
    headings = re.findall(r'^(#{1,6})\s+(.+)$', markdown_content, re.MULTILINE)
    
    if not headings:
        return ''
    
    toc = ['<div class="toc_container">', '<h2>Inhaltsverzeichnis</h2>', '<ul class="toc-list">']
    
    for heading in headings:
        level = len(heading[0])
        text = heading[1].strip()
        slug = re.sub(r'[^\w\s-]', '', text).lower()
        slug = re.sub(r'[\s-]+', '-', slug)
        
        indent = '  ' * (level - 1) 
        toc.append(f'{indent}<li class="toc-item toc-level-{level}"><a href="#{slug}">{text}</a></li>')
    
    toc.append('</ul>')
    toc.append('</div>')
    
    return Markup('\n'.join(toc))

@app.template_filter('add_heading_ids')
def add_heading_ids(html_content):
    """
    Fügt IDs zu den HTML-Überschriften hinzu für das Verlinken des Inhaltsverzeichnisses
    """
    for level in range(1, 7):
        pattern = r'<h{0}>(.+?)</h{0}>'.format(level)
        
        def add_id(match):
            text = match.group(1)
            slug = re.sub(r'[^\w\s-]', '', text).lower()
            slug = re.sub(r'[\s-]+', '-', slug)
            return f'<h{level} id="{slug}">{text}</h{level}>'
        
        html_content = re.sub(pattern, add_id, html_content)
    
    return Markup(html_content)

from app import routes