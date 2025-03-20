from app import app, db
from app.models import Category, Subcategory, Article

# Flask-Anwendungskontext erstellen
with app.app_context():
    # Datenbank-Tabellen erstellen
    db.create_all()
    print("Datenbanktabellen wurden erfolgreich erstellt!")
