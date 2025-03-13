from app import app, db
from app.models import Category, Subcategory, Article
from datetime import datetime

# Flask-Anwendungskontext erstellen
with app.app_context():
    try:
        # Überprüfen, ob bereits Daten vorhanden sind
        existing_categories = Category.query.all()

        if not existing_categories:
            print("Füge Testdaten hinzu...")

            # Beispiel-Kategorie erstellen
            kategorie = Category(
                name="Mathematik",
                description="Alles rund um mathematische Konzepte und Formeln",
                icon="calculator",
                color="#3498db"
            )
            db.session.add(kategorie)
            db.session.commit()
            print(f"Kategorie '{kategorie.name}' wurde erstellt (ID: {kategorie.id})")

            # Beispiel-Unterkategorie erstellen
            unterkategorie = Subcategory(
                name="Algebra",
                description="Grundlagen der Algebra und algebraische Strukturen",
                category_id=kategorie.id
            )
            db.session.add(unterkategorie)
            db.session.commit()
            print(f"Unterkategorie '{unterkategorie.name}' wurde erstellt (ID: {unterkategorie.id})")

            # Beispiel-Artikel erstellen
            artikel = Article(
                title="Quadratische Gleichungen",
                description="Eine Einführung in quadratische Gleichungen und deren Lösungsmethoden",
                content="""
# Quadratische Gleichungen

Eine quadratische Gleichung hat die Form:

$ax^2 + bx + c = 0$

wobei $a \neq 0$ ist.

## Lösungsformel

Die Lösungen einer quadratischen Gleichung können mit der folgenden Formel berechnet werden:

$x = \\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

## Beispiel

Lösen wir die Gleichung $2x^2 + 5x - 3 = 0$:

1. Identifizieren der Koeffizienten: $a=2$, $b=5$, $c=-3$
2. Einsetzen in die Formel: $x = \\frac{-5 \pm \sqrt{5^2 - 4 \cdot 2 \cdot (-3)}}{2 \cdot 2}$
3. Vereinfachen: $x = \\frac{-5 \pm \sqrt{25 + 24}}{4} = \\frac{-5 \pm \sqrt{49}}{4} = \\frac{-5 \pm 7}{4}$
4. Die beiden Lösungen sind: $x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = 0.5$ und $x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = -3$
                """,
                author="Max Mustermann",
                subcategory_id=unterkategorie.id
            )
            db.session.add(artikel)
            db.session.commit()
            print(f"Artikel '{artikel.title}' wurde erstellt (ID: {artikel.id})")

            print("\nAlle Testdaten wurden erfolgreich hinzugefügt!")
        else:
            print(f"Es sind bereits {len(existing_categories)} Kategorien in der Datenbank vorhanden.")
            for cat in existing_categories:
                print(f"- {cat.name} (ID: {cat.id})")

    except Exception as e:
        print(f"Fehler beim Hinzufügen der Testdaten: {str(e)}")
        db.session.rollback()