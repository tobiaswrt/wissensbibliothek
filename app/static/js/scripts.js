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

// Allgemeine Popup-Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    // Allgemeine Funktion, um Popups zu öffnen
    function openPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'flex';
        }
    }
    
    // Allgemeine Funktion, um Popups zu schließen
    function closePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
        }
    }
    
    // Event Listener für alle Schließen-Buttons
    document.querySelectorAll('[data-popup-target]').forEach(element => {
        element.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-target');
            closePopup(popupId);
        });
    });
    
    // Event Listener für das Klicken außerhalb von Popups
    document.querySelectorAll('.popup_overlay').forEach(popup => {
        popup.addEventListener('click', function(event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Spezifische Popup-Öffnen-Buttons
    
    // 1. Neue Kategorie Button
    const addCategoryBtn = document.querySelector('.heading_page_wrapper .link_icon_wrapper.background-dark-blue.category_button');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            openPopup('newCategoryPopup');
        });
    }
    
    // Später andere Buttons hinzufügen

});