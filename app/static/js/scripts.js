// Dark - Light Modus
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.sb_settings_box');
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function openPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'flex';
        }
    }
    
    function closePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
        }
    }
    
    document.querySelectorAll('[data-popup-target]').forEach(element => {
        element.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-target');
            closePopup(popupId);
        });
    });
    
    document.querySelectorAll('.popup_overlay').forEach(popup => {
        popup.addEventListener('click', function(event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    const addCategoryBtn = document.querySelector('.heading_page_wrapper .link_icon_wrapper.background-dark-blue.category_button');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            openPopup('newCategoryPopup');
        });
    }
    
    const addSubcategoryBtn = document.querySelector('.heading_page_wrapper .link_icon_wrapper.background-dark-blue');
    if (addSubcategoryBtn && document.getElementById('newSubcategoryPopup')) {
        addSubcategoryBtn.addEventListener('click', function() {
            openPopup('newSubcategoryPopup');
        });
    }

    const addArticleBtn = document.querySelector('.heading_page_wrapper .link_icon_wrapper.background-dark-blue');
    if (addArticleBtn && document.getElementById('newArticlePopup')) {
        addArticleBtn.addEventListener('click', function() {
            openPopup('newArticlePopup');
            
            if (!window.articleEditor) {
                window.articleEditor = new SimpleMDE({
                    element: document.getElementById('article_content'),
                    spellChecker: false,
                    autofocus: false,
                    toolbar: ["bold", "italic", "heading", "|", 
                             "quote", "unordered-list", "ordered-list", "|", 
                             "link", "image", "table", "|", 
                             "preview", "side-by-side", "fullscreen", "|", 
                             "guide"]
                });
            }
        });
    }
});

// Edit-Modus für Artikel
const editButton = document.querySelector('.article_btn_edit');

if (editButton) {
    // Artikel-ID aus der URL extrahieren
    const urlPath = window.location.pathname;
    const articleId = urlPath.match(/\/artikel\/(\d+)/)?.[1];
    
    // Elemente für die Bearbeitung
    const articleTitle = document.querySelector('.article_header_wrapper h1');
    const articleDescription = document.querySelector('.article-description');
    const articleContent = document.querySelector('.article_content');
    
    // Speichern-Button vorbereiten
    const saveButton = document.createElement('div');
    saveButton.className = 'article_btn article_btn_save';
    saveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
        </svg>
    `;
    saveButton.style.display = 'none';
    
    // Abbrechen-Button vorbereiten
    const cancelButton = document.createElement('div');
    cancelButton.className = 'article_btn article_btn_cancel';
    cancelButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
        </svg>
    `;
    cancelButton.style.display = 'none';
    
    // Löschen-Button vorbereiten
    const deleteButton = document.createElement('div');
    deleteButton.className = 'article_btn article_btn_delete';
    deleteButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
        </svg>
    `;
    deleteButton.style.display = 'none';
    
    // Buttons zum Container hinzufügen
    const btnContainer = editButton.parentElement;
    btnContainer.appendChild(saveButton);
    btnContainer.appendChild(cancelButton);
    btnContainer.appendChild(deleteButton);
    
    // Ursprüngliche Werte speichern
    let originalTitle = '';
    let originalDescription = '';
    let originalContent = '';
    let editor = null;
    
    // Edit-Modus-Status
    let isEditing = false;
    
    // Edit-Button-Klick
    editButton.addEventListener('click', function() {
        if (!isEditing) {
            enterEditMode();
        }
    });
    
    // Speichern-Button-Klick
    saveButton.addEventListener('click', function() {
        saveChanges();
    });
    
    // Abbrechen-Button-Klick
    cancelButton.addEventListener('click', function() {
        exitEditMode(true);
    });
    
    // Löschen-Button-Klick
    deleteButton.addEventListener('click', function() {
        if (confirm('Möchtest du diesen Artikel wirklich löschen?')) {
            deleteArticle();
        }
    });
    
    // Edit-Modus aktivieren
    function enterEditMode() {
        isEditing = true;
        
        // Originale Werte speichern
        originalTitle = articleTitle.textContent;
        originalDescription = articleDescription ? articleDescription.textContent : '';
        originalContent = articleContent.getAttribute('data-markdown-content') || 
                          articleContent.querySelector('.article_content_inner')?.getAttribute('data-markdown');
        
        // Titel in Input umwandeln
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = originalTitle;
        titleInput.className = 'edit-title-input';
        articleTitle.innerHTML = '';
        articleTitle.appendChild(titleInput);
        
        // Beschreibung in Textarea umwandeln (falls vorhanden)
        if (articleDescription) {
            const descInput = document.createElement('textarea');
            descInput.value = originalDescription;
            descInput.className = 'edit-description-input';
            descInput.rows = 2;
            articleDescription.innerHTML = '';
            articleDescription.appendChild(descInput);
        }
        
        // Content in SimpleMDE Editor umwandeln
        const editorContainer = document.createElement('div');
        editorContainer.id = 'markdown-editor-container';
        
        const textarea = document.createElement('textarea');
        textarea.id = 'markdown-editor';
        textarea.value = originalContent;
        
        articleContent.innerHTML = '';
        articleContent.appendChild(textarea);
        
        // SimpleMDE initialisieren
        editor = new SimpleMDE({
            element: textarea,
            spellChecker: false,
            autofocus: false,
            toolbar: ["bold", "italic", "heading", "|", 
                     "quote", "unordered-list", "ordered-list", "|", 
                     "link", "image", "table", "|", 
                     "preview", "side-by-side", "fullscreen", "|", 
                     "guide"]
        });
        
        // Buttons anpassen
        editButton.style.display = 'none';
        saveButton.style.display = 'flex';
        cancelButton.style.display = 'flex';
        deleteButton.style.display = 'flex';
    }
    
    // Änderungen speichern
    function saveChanges() {
        // Werte aus den Eingabefeldern holen
        const newTitle = document.querySelector('.edit-title-input').value;
        const newContent = editor.value();
        const newDescription = articleDescription ? 
            document.querySelector('.edit-description-input').value : originalDescription;
        
        // AJAX-Request zum Speichern senden
        fetch(`/artikel/update/${articleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent,
                description: newDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Seite neu laden, um den aktualisierten Inhalt anzuzeigen
                window.location.reload();
            } else {
                alert('Fehler beim Speichern: ' + data.error);
                // Im Fehlerfall weiterhin im Edit-Modus bleiben
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Speichern');
        });
    }
    
    // Artikel löschen
    function deleteArticle() {
        fetch(`/artikel/loeschen/${articleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Zur Subkategorie-Seite zurückkehren
                window.location.href = data.redirect;
            } else {
                alert('Fehler beim Löschen: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Löschen');
        });
    }
    
    // Edit-Modus verlassen
    function exitEditMode(discard = false) {
        isEditing = false;
        
        if (discard) {
            // Seite neu laden, um zum Original zurückzukehren
            window.location.reload();
        }
        
        // Buttons zurücksetzen
        editButton.style.display = 'flex';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        deleteButton.style.display = 'none';
    }
}

// Kontextmenü-Funktionalität
const contextMenu = document.getElementById('contextMenu');
let targetElement = null;

function showContextMenu(e, target) {
    e.preventDefault();
    
    targetElement = target;
    
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    
    contextMenu.style.display = 'block';
}

function hideContextMenu() {
    if (contextMenu) {
        contextMenu.style.display = 'none';
    }
    targetElement = null;
}

// Hilfsfunktion zum Öffnen von Popups (falls nicht bereits definiert)
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'flex';
    }
}

// Event-Listener für Rechtsklick auf Kategorien
if (contextMenu) {
    document.querySelectorAll('.category_box_outline').forEach(categoryItem => {
        categoryItem.addEventListener('contextmenu', function(e) {
            // ID aus dem URL-Parameter extrahieren
            const href = this.getAttribute('href');
            const categoryId = href.match(/\/themen\/(\d+)/)[1];
            
            // Speichere die ID als Attribut für späteren Zugriff
            this.setAttribute('data-category-id', categoryId);
            
            showContextMenu(e, this);
        });
    });
    
    // Event-Listener für Klicks auf Kontextmenü-Optionen
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!targetElement) return;
            
            const action = this.getAttribute('data-action');
            const itemId = targetElement.getAttribute('data-category-id');
            const elementToRemove = targetElement; // Wichtig: Referenz speichern
            
            if (action === 'delete') {
                // Löschen-Aktion
                if (confirm('Möchtest du diese Kategorie wirklich löschen? Alle zugehörigen Unterkategorien und Artikel werden ebenfalls gelöscht.')) {
                    fetch(`/themen/loeschen/${itemId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Element aus dem DOM entfernen
                            elementToRemove.remove();
                        } else {
                            alert('Fehler beim Löschen: ' + data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Fehler beim Löschen');
                    });
                }
            } else if (action === 'edit') {
                // Bearbeiten-Aktion
                fetch(`/themen/daten/${itemId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Popup-Formularfelder mit den Daten füllen
                        const editIdField = document.getElementById('edit_category_id');
                        const editNameField = document.getElementById('edit_category_name');
                        const editDescField = document.getElementById('edit_category_description');
                        
                        if (editIdField && editNameField && editDescField) {
                            editIdField.value = itemId;
                            editNameField.value = data.category.name;
                            editDescField.value = data.category.description || '';
                            
                            // Popup öffnen
                            openPopup('editCategoryPopup');
                        } else {
                            console.error('Edit fields not found');
                            alert('Fehler: Formularfelder nicht gefunden');
                        }
                    } else {
                        alert('Fehler beim Laden der Kategorie: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Fehler beim Laden der Kategorie');
                });
            }
            
            hideContextMenu();
        });
    });
    
    // Kontextmenü ausblenden bei Klick außerhalb
    document.addEventListener('click', function() {
        hideContextMenu();
    });
    
    // Kontextmenü ausblenden bei Drücken der Escape-Taste
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideContextMenu();
        }
    });
    
    // Kontextmenü ausblenden, wenn das Fenster die Größe ändert
    window.addEventListener('resize', function() {
        hideContextMenu();
    });
}

// Kontextmenü-Funktionalität für Subkategorien
const subcontextMenu = document.getElementById('subcontextMenu');
let subTargetElement = null;

function showSubcontextMenu(e, target) {
    e.preventDefault();
    
    subTargetElement = target;
    
    subcontextMenu.style.left = `${e.pageX}px`;
    subcontextMenu.style.top = `${e.pageY}px`;
    
    subcontextMenu.style.display = 'block';
}

function hideSubcontextMenu() {
    if (subcontextMenu) {
        subcontextMenu.style.display = 'none';
    }
    subTargetElement = null;
}

// Event-Listener für Rechtsklick auf Subkategorien in der Kategorie-Ansicht
if (subcontextMenu) {
    document.querySelectorAll('.subcategory_card').forEach(subcategoryItem => {
        subcategoryItem.addEventListener('contextmenu', function(e) {
            // ID aus dem URL-Parameter extrahieren
            const href = this.getAttribute('href');
            const subcategoryId = href.match(/\/subkategorie\/(\d+)/)[1];
            
            // Speichere die ID als Attribut für späteren Zugriff
            this.setAttribute('data-subcategory-id', subcategoryId);
            
            showSubcontextMenu(e, this);
        });
    });
    
    // Event-Listener für Klicks auf Kontextmenü-Optionen
    document.querySelectorAll('#subcontextMenu .context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!subTargetElement) return;
            
            const action = this.getAttribute('data-action');
            const itemId = subTargetElement.getAttribute('data-subcategory-id');
            const elementToRemove = subTargetElement; // Wichtig: Referenz speichern
            
            if (action === 'delete') {
                // Löschen-Aktion
                if (confirm('Möchtest du diese Unterkategorie wirklich löschen? Alle zugehörigen Artikel werden ebenfalls gelöscht.')) {
                    fetch(`/themen/subkategorie/loeschen/${itemId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Element aus dem DOM entfernen
                            elementToRemove.remove();
                        } else {
                            alert('Fehler beim Löschen: ' + data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Fehler beim Löschen');
                    });
                }
            } else if (action === 'edit') {
                // Bearbeiten-Aktion
                fetch(`/themen/subkategorie/daten/${itemId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Popup-Formularfelder mit den Daten füllen
                        const editIdField = document.getElementById('edit_subcategory_id');
                        const editNameField = document.getElementById('edit_subcategory_name');
                        const editDescField = document.getElementById('edit_subcategory_description');
                        
                        if (editIdField && editNameField && editDescField) {
                            editIdField.value = itemId;
                            editNameField.value = data.subcategory.name;
                            editDescField.value = data.subcategory.description || '';
                            
                            // Popup öffnen
                            openPopup('editSubcategoryPopup');
                        } else {
                            console.error('Edit fields not found');
                            alert('Fehler: Formularfelder nicht gefunden');
                        }
                    } else {
                        alert('Fehler beim Laden der Unterkategorie: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Fehler beim Laden der Unterkategorie');
                });
            }
            
            hideSubcontextMenu();
        });
    });
    
    // Kontextmenü ausblenden bei Klick außerhalb
    document.addEventListener('click', function() {
        hideSubcontextMenu();
    });
    
    // Kontextmenü ausblenden bei Drücken der Escape-Taste
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSubcontextMenu();
        }
    });
    
    // Kontextmenü ausblenden, wenn das Fenster die Größe ändert
    window.addEventListener('resize', function() {
        hideSubcontextMenu();
    });
}

// Diese Funktion zu app/static/js/scripts.js hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    // Finden Sie alle .codehilite Container
    const codeBlocks = document.querySelectorAll('.article_content div.codehilite');
    
    codeBlocks.forEach(function(block) {
        // Versuchen, die Sprache aus der Klasse abzuleiten
        const preElement = block.querySelector('pre');
        if (preElement) {
            const codeElement = preElement.querySelector('code');
            if (codeElement && codeElement.className) {
                const langMatch = codeElement.className.match(/language-(\w+)/);
                if (langMatch && langMatch[1]) {
                    // Sprachname als data-Attribut setzen
                    block.setAttribute('data-language', langMatch[1]);
                } else {
                    block.setAttribute('data-language', 'code');
                }
            } else {
                block.setAttribute('data-language', 'code');
            }
        }
        
        // Kopieren-Button hinzufügen
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3v2h8V3H8zM6 5V1h12v4h4v18H2V5h4zm14 2H4v14h16V7z" fill="currentColor"/></svg>';
        copyButton.setAttribute('title', 'Code kopieren');
        
        // Ereignishandler für Kopieren-Button
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('pre').textContent;
            navigator.clipboard.writeText(code).then(function() {
                // Erfolgreich kopiert
                copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg>';
                copyButton.classList.add('success');
                
                // Nach 2 Sekunden den Button zurücksetzen
                setTimeout(function() {
                    copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3v2h8V3H8zM6 5V1h12v4h4v18H2V5h4zm14 2H4v14h16V7z" fill="currentColor"/></svg>';
                    copyButton.classList.remove('success');
                }, 2000);
            });
        });
        
        block.appendChild(copyButton);
    });
});