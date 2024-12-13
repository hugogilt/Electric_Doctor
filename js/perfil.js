const nombreCompletoUsuario = document.getElementById('nombre-usuario');
const correoUsuario = document.getElementById('correo-usuario');
const telefonoUsuario = document.getElementById('telefono-usuario');
let userData = {};

const correoP = document.getElementById('correo-p');
const verificarCorreoMessage = document.createElement('p');
verificarCorreoMessage.className = 'verificar-correo-message';
const textoMensaje = document.createTextNode('Recuerda ');
const spanVerificar = document.createElement('span');
spanVerificar.textContent = 'verificar la dirección de correo';
verificarCorreoMessage.appendChild(textoMensaje);
verificarCorreoMessage.appendChild(spanVerificar);

// Añadir un event listener al <span> para el evento 'click'
verificarCorreoMessage.addEventListener('click', abrirModalVerificarCorreo);

const editarPerfilButton = document.getElementById('editar-perfil');
const verificarCorreoButton = document.createElement('button');
verificarCorreoButton.classList.add('boton');
verificarCorreoButton.id = 'verificar-correo-button';
verificarCorreoButton.textContent = 'Verificar Correo';

verificarCorreoButton.addEventListener('click', abrirModalVerificarCorreo);

const title = document.querySelector('#title');
if (title) {
  title.addEventListener('click', function () {
    window.location.href = './index.html';
  });
}


async function obtenerDatosUsuario() {
  try {
    const respuesta = await fetch('php/obtener_usuarios.php');
    if (!respuesta.ok) {
      throw new Error(`Error en la respuesta: ${respuesta.status}`);
    }
    const datos = await respuesta.json();

    if (datos.error) {
      window.location.href = '../index.html';
      console.error('Error del servidor:', datos.error);
    } else {
      if (datos.status === 'success') {
        // Si eres admin
        if (Array.isArray(datos.data)) {
          await obtenerDatosAdmin();
        } else {
          userData = datos.data;
        }
      } else {
        window.location.href = '../index.html';
      }
    }
  } catch (error) {
    window.location.href = '../index.html';
    console.error('Error al obtener los datos del usuario:', error);
  }
}

async function obtenerDatosAdmin() {
  try {
    const response = await fetch('/php/obtener_usuario_admin.php');
    const data = await response.json();

    if (data.status === 'success') {
      userData = data.data; 
    } else {
      window.location.href = '../index.html';
      console.log('Error:', data.message);
    }
  } catch (error) {
    window.location.href = '../index.html';
    console.error('Error al realizar la solicitud:', error);
  }
}

async function asignarDatosUsuarioDOM() {
  await obtenerDatosUsuario();  

  if (userData.Nombre) {
    nombreCompletoUsuario.textContent = `${userData.Nombre} ${userData.Apellidos}`;
    correoUsuario.textContent = userData.Correo_Electronico;
    telefonoUsuario.textContent = userData.Telefono;
  } else {
    console.error('Los datos del usuario no están disponibles.');
  }
}



async function comprobarVerificado() {
  fetch('/php/comprobar_verificado.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userData.ID_Usuario }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "non-verified") {
      correoP.insertAdjacentElement('afterend', verificarCorreoMessage);
      editarPerfilButton.insertAdjacentElement('afterend', verificarCorreoButton);
    } else if (data.status === "verified") {
      if (document.getElementsByClassName('verificar-correo-message')) {
        verificarCorreoMessage.remove();
      }
      if (document.getElementById('verificar-correo-button')) {
        verificarCorreoButton.remove();
      }
    }
  })
  .catch(error => {
      console.error("Error en la solicitud:", error);
  });
}






window.onload = async function() {
  await asignarDatosUsuarioDOM();
  comprobarVerificado();
};

//ALERT MESSAGES
function showAlert(message, type) {
  // Crear contenedor si no existe
  let alertContainer = document.getElementById('alert-container');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    document.body.appendChild(alertContainer);
  }

  // Eliminar mensajes anteriores si existen
  while (alertContainer.firstChild) {
    alertContainer.firstChild.remove();
  }

  // Crear el nuevo mensaje
  const alertBox = document.createElement('div');
  alertBox.className = `alert-box ${type === 'positive' ? 'alert-positive' : 'alert-negative'}`;

  // Crear el ícono
  const icon = document.createElement('i');
  icon.className = 'fas fa-info-circle';
  icon.style.marginRight = '10px'; // Separar un poco del texto

  // Crear el texto del mensaje
  const textNode = document.createTextNode(message);

  // Crear la imagen
  const image = document.createElement('img');
  image.src = 'images/doctor.png';  // Ruta de la imagen
  image.alt = 'Doctor';
  image.style.width = '30px';  // Puedes ajustar el tamaño de la imagen
  image.style.marginLeft = '10px';  // Espacio entre el mensaje y la imagen

  // Añadir el ícono, el texto y la imagen al mensaje
  alertBox.appendChild(icon);
  alertBox.appendChild(textNode);
  alertBox.appendChild(image);

  // Agregar el nuevo mensaje al contenedor
  alertContainer.appendChild(alertBox);

  // Mostrar confeti si es positivo
  if (type === 'positive') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.3 }
    });
  }

  // Eliminar mensaje después de que la animación termine
  setTimeout(() => {
    alertBox.remove();
  }, 5000);
}

// MODAL MODIFICAR USUARIOS

const editarPerfilBtn = document.getElementById('editar-perfil');
editarPerfilBtn.addEventListener('click', function () {
  abrirModalModificarUsuario(userData);
});

// Obtener elementos del modal
const modalModificarUsuario = document.getElementById("modal-modificar-usuario");
const aceptarModificarUsuarioBtn = document.getElementById("boton-modificar-usuario-aceptar");
const cerrarModificarUsuarioBtn = document.getElementById("boton-modificar-usuario-cerrar");

// Mostrar el modal con datos del usuario seleccionado
function abrirModalModificarUsuario(usuario) {
  // Mostrar el modal
  modalModificarUsuario.style.display = "flex";

  // Autorrellenar los campos con los datos del usuario
  document.getElementById("modificar-nombre").value = usuario.Nombre;
  document.getElementById("modificar-apellidos").value = usuario.Apellidos;
  document.getElementById("modificar-telefono").value = usuario.Telefono;
  document.getElementById("modificar-correo").value = usuario.Correo_Electronico;
  aceptarModificarUsuarioBtn.addEventListener('click', modificarUsuario);
}


function modificarUsuario() {
  const nombre = document.getElementById("modificar-nombre").value;
  const apellidos = document.getElementById("modificar-apellidos").value;
  const telefono = document.getElementById("modificar-telefono").value;
  const correo = document.getElementById("modificar-correo").value;

  // Enviar los datos modificados al servidor con el ID del usuario
  fetch('/php/modificar_usuario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: userData.ID_Usuario,
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      correo: correo
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showAlert("Datos personales modificados correctamente", "positive");
        asignarDatosUsuarioDOM();
        modalModificarUsuario.style.display = "none";
        if (data.correoModificado) {
          correoP.insertAdjacentElement('afterend', verificarCorreoMessage);
          editarPerfilButton.insertAdjacentElement('afterend', verificarCorreoButton);
        }
      } else {
        showAlert("Ha ocurrido un error al modificar usuario, inténtelo de nuevo.");
      }
    })
    .catch(error => {
      showAlert("Ha ocurrido un error al modificar usuario, inténtelo de nuevo.");
    });
}


// Cerrar el modal con botón cancelar
cerrarModificarUsuarioBtn.addEventListener("click", () => {
  modalModificarUsuario.style.display = "none"
  aceptarModificarUsuarioBtn.removeEventListener('click', modificarUsuario);

});

// Cerrar el modal al hacer clic fuera de su contenido
modalModificarUsuario.addEventListener("click", (e) => {
  if (e.target === modalModificarUsuario) {
    modalModificarUsuario.style.display = "none";
  }
});


//VERIFICAR CORREO
const modalVerificarCorreo = document.getElementById('modal-verificar-correo');
const btnEnviarVerificacion = document.getElementById('btn-enviar-verificacion');
const btnCancelarVerificacion = document.getElementById('btn-cancelar-verificacion');

window.addEventListener('click', function (event) {
  if (event.target === modalVerificarCorreo) {
      cerrarModalVerificacion();
  }
});

btnCancelarVerificacion.addEventListener('click', cerrarModalVerificacion);

function cerrarModalVerificacion() {
  comprobarVerificado();
  modalVerificarCorreo.style.display = 'none';
}

function abrirModalVerificarCorreo() {
  modalVerificarCorreo.style.display = 'flex';
}


btnEnviarVerificacion.addEventListener('click', async function () {
  try {
    const formData = new FormData();
    formData.append('correo', userData.Correo_Electronico);
    formData.append('nonVerifiedType', 'user');

    const response = await fetch('/php/PHPMailer-master/src/enviar_correo.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.status === 'timeout') {
      showAlert(data.message, 'negative');
    } else if (data.status === 'success') {
      showAlert('Correo de verificación enviado correctamente.', 'positive');
    } else if (data.status === 'error') {
      showAlert('Ha ocurrido un error al enviar el correo, por favor, inténtelo de nuevo.');
      console.error('Error: ' + data.message);
    }
  } catch (error) {
    showAlert('Ocurrió un error en el envío del correo de verificación. Inténtelo de nuevo.', 'negative');
  }



  let timer = 30; // Temporizador en segundos
  const timeOutMessage = document.createElement('p');
  
  // Crear el mensaje de cuenta regresiva si no existe ya
  if (!document.querySelector('#time-out-message')) {
    timeOutMessage.id = 'time-out-message';
    timeOutMessage.textContent = `¿No lo ha recibido? Reenvíelo en ${timer} segundos.`;
    btnCancelarVerificacion.insertAdjacentElement('afterend', timeOutMessage);
  }
  
  // Deshabilitar el botón y añadir la clase de deshabilitado
  btnEnviarVerificacion.disabled = true;
  btnEnviarVerificacion.classList.add('disabledButton');
  
  // Actualizar el mensaje cada segundo
  const intervalId = setInterval(() => {
    timer--;
    if (timer > 0) {
      timeOutMessage.textContent = `¿No lo ha recibido? Reenvíelo en ${timer} segundos.`;
    } else {
      clearInterval(intervalId); 
      btnEnviarVerificacion.disabled = false; 
      btnEnviarVerificacion.classList.remove('disabledButton'); 
      timeOutMessage.remove(); 
    }
  }, 1000);
});

// CAMBIAR CONTRASEÑA
const cambiarContraseñaButton = document.getElementById('cambiar-contrasena');
cambiarContraseñaButton.addEventListener('click', abrirModalCambiarContrasena);

// Mostrar el modal
function abrirModalCambiarContrasena() {
  const modal = document.getElementById("modal-cambiar-contraseña");
  modal.style.display = "flex";
}

// Cerrar el modal
function cerrarModalCambiarContrasena() {
  const modal = document.getElementById("modal-cambiar-contraseña");
  modal.style.display = "none";
}

// Asignar eventos
document.getElementById("modal-cambiar-contraseña-close").onclick = cerrarModalCambiarContrasena;

window.addEventListener('click', function (event) {
  const modal = document.getElementById("modal-cambiar-contraseña");
  if (event.target === modal) {
    cerrarModalCambiarContrasena();
  }
});

const cambiarContraseñaForm = document.getElementById('modal-cambiar-contraseña-form');
document.getElementById('modal-cambiar-contraseña-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Evita el envío predeterminado del formulario

  // Crear el objeto FormData con los valores de los inputs
  const formData = new FormData();
  formData.append('contraseña_actual', document.getElementById('modal-cambiar-contraseña-actual').value);
  formData.append('nueva_contraseña', document.getElementById('modal-cambiar-contraseña-nueva').value);
  formData.append('confirmar_contraseña', document.getElementById('modal-cambiar-contraseña-confirmar').value);

  // Validar que las contraseñas coinciden
  if (formData.get('nueva_contraseña') !== formData.get('confirmar_contraseña')) {
      showAlert('Las contraseñas no coinciden');
      return;
  }

  try {
      const response = await fetch('/php/cambiar_contrasena.php', {
          method: 'POST',
          body: formData, 
      });

      const data = await response.json();

      if (data.status === 'success') {
          alert(data.message);
          document.getElementById('modal-cambiar-contraseña-form').reset();
          document.getElementById('modal-cambiar-contraseña').style.display = 'none';
          showAlert('Contraseña modificada con éxito', 'positive');
      } else if (data.status === 'false-password') {
        showAlert('La contraseña actual introducida es incorrecta', 'negative')
      } else {
          showAlert('Ha ocurrido un error al cambiar la contraseña, inténtelo de nuevo', 'negative');
      }
  } catch (error) {
      alert('Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.');
  }
});






