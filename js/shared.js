const nav = document.querySelector('nav');
document.getElementById('hamburger').addEventListener('click', function() {
    nav.classList.toggle('active'); // Alternar la clase 'active' para mostrar/ocultar el menú
    const header = document.querySelector('header');
    if (nav.classList.contains('active')) {
        header.style.height = 'auto';
    } else {
        header.style.removeProperty('height');
    }

});

window.onresize = function() {
    if(window.innerWidth > 800)
        nav.classList.remove('active')
}