from app import app, db
from flask import render_template, request, redirect, url_for, flash
from app.models import Category, Subcategory, Article
from flask import jsonify

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
        # Flash Nachrichten hinzufügen

    except Exception as e:
        db.session.rollback()
        # Flash Nachrichten hinzufügen

    return redirect(url_for('themen'))

@app.route("/themen/kategorie/<int:kategorie_id>/neu", methods = ['POST'])
def subkategorie_erstellen(kategorie_id):
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')

        neue_subkategorie = Subcategory (
            name = name,
            description = description,
            category_id = kategorie_id
        )

        try:
            db.session.add(neue_subkategorie)
            db.session.commit()
            # Flash Nachrichten hinzufügen

        except Exception as e:
            db.session.rollback()
            # Flash Nachrichten hinzufügen

        return redirect(url_for('kategorie_anzeigen', kategorie_id = kategorie_id))
    
@app.route("/themen/subkategorie/<int:subkategorie_id>/neu", methods=['POST'])
def artikel_erstellen(subkategorie_id):
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        content = request.form.get('content')
        author = request.form.get('author')
        
        neuer_artikel = Article(
            title=title,
            description=description,
            content=content,
            author=author,
            subcategory_id=subkategorie_id
        )
        
        try:
            db.session.add(neuer_artikel)
            db.session.commit()
            # Flash Nachrichten hinzufügen

        except Exception as e:
            db.session.rollback()
            # Flash Nachrichten hinzufügen
            
        return redirect(url_for('subkategorie_anzeigen', subkategorie_id=subkategorie_id))
    
from flask import request, jsonify

@app.route("/artikel/update/<int:artikel_id>", methods=['POST'])
def artikel_update(artikel_id):
    if request.method == 'POST':
        data = request.json
        
        artikel = Article.query.get_or_404(artikel_id)
        
        artikel.title = data.get('title', artikel.title)
        artikel.content = data.get('content', artikel.content)
        if 'description' in data:
            artikel.description = data.get('description')
        
        try:
            db.session.commit()
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)})
    
@app.route("/themen/loeschen/<int:kategorie_id>", methods=['POST'])
def kategorie_loeschen(kategorie_id):
    kategorie = Category.query.get_or_404(kategorie_id)
    
    try:
        db.session.delete(kategorie)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route("/themen/daten/<int:kategorie_id>", methods=['GET'])
def kategorie_daten(kategorie_id):
    kategorie = Category.query.get_or_404(kategorie_id)
    
    try:
        return jsonify({
            'success': True,
            'category': {
                'id': kategorie.id,
                'name': kategorie.name,
                'description': kategorie.description
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route("/themen/bearbeiten", methods=['POST'])
def kategorie_bearbeiten():
    if request.method == 'POST':
        category_id = request.form.get('category_id')
        name = request.form.get('name')
        description = request.form.get('description')
        
        kategorie = Category.query.get_or_404(category_id)
        
        kategorie.name = name
        kategorie.description = description
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            
        return redirect(url_for('themen'))
    
@app.route("/themen/subkategorie/loeschen/<int:subkategorie_id>", methods=['POST'])
def subkategorie_loeschen(subkategorie_id):
    subkategorie = Subcategory.query.get_or_404(subkategorie_id)
    
    try:
        # Lösche die Subkategorie (und alle zugehörigen Artikel aufgrund der cascade-Option)
        db.session.delete(subkategorie)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route("/themen/subkategorie/daten/<int:subkategorie_id>", methods=['GET'])
def subkategorie_daten(subkategorie_id):
    subkategorie = Subcategory.query.get_or_404(subkategorie_id)
    
    try:
        return jsonify({
            'success': True,
            'subcategory': {
                'id': subkategorie.id,
                'name': subkategorie.name,
                'description': subkategorie.description
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route("/themen/subkategorie/bearbeiten", methods=['POST'])
def subkategorie_bearbeiten():
    if request.method == 'POST':
        subcategory_id = request.form.get('subcategory_id')
        name = request.form.get('name')
        description = request.form.get('description')
        
        subkategorie = Subcategory.query.get_or_404(subcategory_id)
        category_id = subkategorie.category_id
        
        subkategorie.name = name
        subkategorie.description = description
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        
        return redirect(url_for('kategorie_anzeigen', kategorie_id=category_id))
    
@app.route("/artikel/loeschen/<int:artikel_id>", methods=['POST'])
def artikel_loeschen(artikel_id):
    artikel = Article.query.get_or_404(artikel_id)
    subkategorie_id = artikel.subcategory_id
    
    try:
        # Artikel aus der Datenbank löschen
        db.session.delete(artikel)
        db.session.commit()
        return jsonify({
            'success': True, 
            'redirect': url_for('subkategorie_anzeigen', subkategorie_id=subkategorie_id)
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})