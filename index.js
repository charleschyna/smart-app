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
  document.addEventListener('DOMContentLoaded',function(){

   document.getElementById('addApiary').addEventListener('submit', function(e) {
    e.preventDefault();
    addApiary();

    document.getElementById('AddHiveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addHive();
    });

    loadApiaries();

    function addApiary() {
        constApiaryName= document.getElementById('ApiaryName').value;
        const apiaryLocation = document.getElementById('ApiaryLocation').value;

        let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
        apiaries.push({ name: apiaryMame, location: apiaryLocation, hives: []});

        localStorage.setItem('apiaries',JSON.stringify(apiaries));

        document.getElementById('apiaryName').value ='';
        document.getElementById('apiaryLocation').value ='';

        loadApiaries(); 
    }
    function addHive() {
        const hiveName =document.getElementById('hiveName').value;
        const apiaryName = document.getElementById('selectedpiary').value;

        let apiaies = JSON.parse (localStorage.getItem('apiaries')) || [];

        const apiary = apiaries.find(a=>a.name === apiaryName);

        if(apiary) {
            apiary.hives.push(hiveName);
            localStorage.setItem('apiaries',JSON.stringify(apiaries));
            document.getElementById('hiveName').value ='';
            loadApiaries();
        }
    }

    function loadApiaries() {
        const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
       



