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


// MODAL LOGIN

document.addEventListener("DOMContentLoaded", function () {
    const userButton = document.getElementById("user");
    const modal = document.getElementById("authModal");
    const closeBtn = document.querySelector(".modal-close");
    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");
    const toRegister = document.getElementById("toRegister");
    const toLogin = document.getElementById("toLogin");
    const inputs = document.getElementsByClassName("input-auth");
  
    // Abrir modal al hacer clic en el botón de usuario
    userButton.addEventListener("click", () => {
      modal.style.display = "flex";
      loginSection.style.display = "flex";
      registerSection.style.display = "none";
    });
  
    // Cerrar modal al hacer clic en la 'X' o fuera del contenido
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  
    // Cambiar a formulario de registro
    toRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.style.display = "none";
      registerSection.style.display = "block";
      for (let input of inputs) {
        inpudt.style.height = '50%'
      }
    });
  
    // Cambiar a formulario de inicio de sesión
    toLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.style.display = "flex";
      registerSection.style.display = "none";
      for (let input of inputs) {
        inpdut.style.height = 'initial'
      }
    });
  
    // Validación de contraseñas coincidentes en el registro
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
      } else {
        alert("Registro exitoso!");
        modal.style.display = "none";
      }
    });
  });
  