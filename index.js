// JavaScript for toggling the sidebar
document.getElementById('toggleBtn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('minimized');
    document.getElementById('content').classList.toggle('expanded');
});

// JavaScript for loading pages
function loadPage(page) {
    // Replace 'index.html' with the actual file path of the page you want to load
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(error => console.error('Error loading page:', error));
}
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link-item');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});