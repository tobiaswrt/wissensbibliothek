const themeToggle = document.getElementById('theme-toggle');
    
// Prüfe, ob ein gespeichertes Theme existiert
const savedTheme = localStorage.getItem('theme');
    
// Setze das gespeicherte Theme, falls vorhanden
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.checked = true;
}
    
// Event Listener für den Theme Switch
themeToggle.addEventListener('change', function() {
  if (this.checked) {
    // Dark Mode einschalten
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    // Light Mode einschalten
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
});