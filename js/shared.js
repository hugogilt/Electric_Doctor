document.getElementById('hamburger').addEventListener('click', function() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active'); // Alternar la clase 'active' para mostrar/ocultar el menú
});