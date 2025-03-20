from app import app, db
from app.models import Category, Subcategory, Article
from datetime import datetime

with app.app_context():
    try:
        existing_categories = Category.query.all()

        print("Füge Testdaten hinzu...")

        kategorie = Category(
            name="IoT",
            description="Internet of Things Sammlung",
            icon="calculator",
            color="#3498db"
        )
        db.session.add(kategorie)
        db.session.commit()
        print(f"Kategorie '{kategorie.name}' wurde erstellt (ID: {kategorie.id})")

        unterkategorie = Subcategory(
            name="ioBroker",
            description="Grundlagen und Nutzung des ioBrokers",
            category_id=kategorie.id
        )
        db.session.add(unterkategorie)
        db.session.commit()
        print(f"Unterkategorie '{unterkategorie.name}' wurde erstellt (ID: {unterkategorie.id})")

        artikel = Article(
            title="Adapter Vis-2",
            description="Eine Einführung in die Visualisierung 2 vom ioBroker.",
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

    except Exception as e:
        print(f"Fehler beim Hinzufügen der Testdaten: {str(e)}")
        db.session.rollback()
