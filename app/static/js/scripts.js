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