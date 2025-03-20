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
    """
    Verbesserter Markdown-Filter mit sauberer HTML-Ausgabe für spezielle Formate
    """
    # Farbtext mit spezifischer Farbe
    def color_replace(match):
        color = match.group(1)
        content = match.group(2)
        # Normalisiere Zeilenumbrüche, damit sie konsistent sind
        content = content.replace('\r\n', '\n')
        # Ersetze Zeilenumbrüche durch <br> Tags ohne zusätzliche Abstände
        content = content.replace('\n', '<br>')
        return f'<span style="color:{color}">{content}</span>'
    
    text = re.sub(r'\{color:(#[0-9a-fA-F]{3,6})\}(.*?)\{/color\}', 
                  color_replace, text, flags=re.DOTALL)
    
    # Standardfarbe
    def standard_color_replace(match):
        content = match.group(1)
        content = content.replace('\r\n', '\n')
        content = content.replace('\n', '<br>')
        return f'<span style="color:#2541EF">{content}</span>'
    
    text = re.sub(r'\{color\}(.*?)\{/color\}', 
                  standard_color_replace, text, flags=re.DOTALL)
    
    # Vorformatierte Code-Schriftart mit präziser Whitespace-Behandlung
    def code_font_replace(match):
        content = match.group(1)
        # Normalisiere Zeilenumbrüche
        content = content.replace('\r\n', '\n')
        # HTML escapen
        content = content.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        # Behandle Zeilenumbrüche und Leerzeichen präzise
        content = content.replace(' ', '&nbsp;')
        content = content.replace('\n', '<br>')
        return f'<span class="code-font">{content}</span>'
    
    text = re.sub(r'\{code-font\}(.*?)\{/code-font\}', 
                  code_font_replace, text, flags=re.DOTALL)
    
    # Code-Block-Syntax
    text = re.sub(r'<code-block language="([^"]+)">', r'<pre><code class="language-\1">', text)
    text = re.sub(r'</code-block>', r'</code></pre>', text)
    
    # Inline-Code-Syntax
    text = re.sub(r'<code>(.*?)</code>', r'`\1`', text, flags=re.DOTALL)
    
    # Markdown zu HTML konvertieren
    html = markdown.markdown(text, extensions=[
        'extra',
        'codehilite',
        'fenced_code',
        'nl2br',
        'sane_lists',
        'tables'
    ])
    
    return html

@app.template_filter('add_code_styling')
def add_code_styling(html_content):
    pattern = r'<pre><code class="language-([^"]+)">(.*?)</code></pre>'
    
    def add_styling(match):
        language = match.group(1)
        code = match.group(2)
        return f'''
        <div class="code-block-container">
            <div class="code-block-header">
                <span class="code-language">{language.upper()}</span>
                <button class="code-copy-btn" title="Code kopieren">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3v2h8V3H8zM6 5V1h12v4h4v18H2V5h4zm14 2H4v14h16V7z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <pre><code class="language-{language}">{code}</code></pre>
        </div>
        '''
    
    return re.sub(pattern, add_styling, html_content, flags=re.DOTALL)

# Sie können auch eine speziellere Escape-Funktion hinzufügen
@app.template_filter('escape_markdown')
def escape_markdown(text):
    """Escape Markdown-Syntax, damit sie als reiner Text angezeigt wird"""
    escape_chars = ['\\', '`', '*', '_', '{', '}', '[', ']', '(', ')', '#', '+', '-', '.', '!']
    for char in escape_chars:
        text = text.replace(char, '\\' + char)
    return text

@app.template_filter('generate_toc')
def generate_toc(markdown_content):
    """
    Generiert ein Inhaltsverzeichnis aus Markdown-Überschriften mit Nummerierung
    """
    # Suche nach Überschriften im Format: # Überschrift
    headings = re.findall(r'^(#{1,6})\s+(.+)$', markdown_content, re.MULTILINE)
    
    if not headings:
        return ''
    
    toc = ['<div class="toc_container">', '<h2>Inhaltsverzeichnis</h2>', '<ul class="toc_list">']
    
    counters = [0, 0, 0, 0, 0, 0]
    last_level = 0
    
    for heading in headings:
        level = len(heading[0])
        
        text = heading[1].strip()
        
        slug = re.sub(r'[^\w\s-]', '', text).lower()
        slug = re.sub(r'[\s-]+', '-', slug)
        
        if level > last_level:
            counters[level-1] += 1
            for i in range(level, 6):
                counters[i] = 0
        elif level < last_level:
            counters[level-1] += 1
            for i in range(level, 6):
                counters[i] = 0
        else:
            counters[level-1] += 1
        
        numbering = ""
        for i in range(level):
            if counters[i] > 0:
                numbering += str(counters[i]) + "."
        
        indent = '  ' * (level - 1)
        toc.append(f'{indent}<li class="toc-item toc-level-{level}"><a href="#{slug}"><span class="toc-number">{numbering}</span> {text}</a></li>')
        
        last_level = level
    
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