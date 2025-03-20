from app import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    description = db.Column(db.Text)
    # icon = db.Column(db.Text)
    # color = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate = datetime.utcnow)

    subcategories = db.relationship('Subcategory', backref = 'category', lazy = 'dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.name}>'

class Subcategory(db.Model):
    __tablename__ = 'subcategories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable = False)

    articles = db.relationship('Article', backref='subcategory', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Subcategory {self.name}>'

class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text, nullable=False)  # Markdown-Inhalt
    author = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Fremdschlüssel zu Subcategory
    subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.id'), nullable=False)

    def __repr__(self):
        return f'<Article {self.title}>'
