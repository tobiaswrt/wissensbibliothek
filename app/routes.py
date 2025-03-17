from app import app, db
from flask import render_template, request, redirect, url_for, flash
from app.models import Category, Subcategory, Article

@app.route("/")
def startseite():
    kategorien = Category.query.all()
    return render_template('startseite.html', kategorien = kategorien)

@app.route("/themen")
def themen():
    kategorien = Category.query.all()
    return render_template('themen.html', kategorien = kategorien)

@app.route("/themen/<int:kategorie_id>")
def kategorie_anzeigen(kategorie_id):
    kategorie = Category.query.get_or_404(kategorie_id)
    subkategorien = kategorie.subcategories.all()
    return render_template('kategorie.html', kategorie = kategorie, subkategorien = subkategorien)

@app.route("/themen/subkategorie/<int:subkategorie_id>")
def subkategorie_anzeigen(subkategorie_id):
    subkategorie = Subcategory.query.get_or_404(subkategorie_id)
    artikel = subkategorie.articles.all()
    return render_template('subkategorie.html', subkategorie=subkategorie, artikel=artikel)

@app.route("/themen/subkategorie/artikel/<int:artikel_id>")
def artikel_anzeigen(artikel_id):
    artikel = Article.query.get_or_404(artikel_id)
    return render_template('artikel.html', artikel=artikel)

@app.route("/themen/neu", methods = ['POST'])
def kategorie_erstellen():
    name = request.form.get('name')
    description = request.form.get('description')

    neue_kategorie = Category(
        name = name,
        description = description,
    )

    try:
        db.session.add(neue_kategorie)
        db.session.commit()

    except Exception as e:
        db.session.rollback()

    return redirect(url_for('themen'))
