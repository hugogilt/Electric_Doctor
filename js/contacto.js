document.getElementById('form-contacto').addEventListener('submit', function (event) {
  event.preventDefault(); // Evita el envío normal del formulario

  const formData = new FormData(this); // Obtiene los datos del formulario

  fetch('/php/solicitar_ayuda.php', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
      }
      return response.json(); // Intentamos convertir la respuesta en JSON
    })
    .then(data => {
      if (data.status === 'success') {
        showAlert('Mensaje enviado, le responderemos lo antes posible.', 'positive')
      } else if (data.status === 'timeout') {
        showAlert(data.message, 'negative')
      } else {
        showAlert('Ha ocurrido un error al enviar el mensaje, inténtelo de nuevo.', 'negative')
      }
    })
    .catch(error => {
      showAlert('Ha ocurrido un error al enviar el mensaje, inténtelo de nuevo.', 'negative')
    });

  const enviarBtn = document.getElementById('enviarContacto');

  añadirMensajeTimeOut(enviarBtn);

});

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

const title = document.querySelector('#title');
if (title) {
  title.addEventListener('click', function () {
    window.location.href = './index.html';
  });
}

function añadirMensajeTimeOut(botonTimeOut) {
  let timer = 30; // Temporizador en segundos
  const timeOutMessage = document.createElement('p');

  // Crear el mensaje de cuenta regresiva si no existe ya
  if (!document.querySelector('#time-out-message')) {
    timeOutMessage.id = 'time-out-message';
    timeOutMessage.textContent = `Su consulta ha sido enviada, si desea hacer otra debe esperar ${timer} segundos.`;
    botonTimeOut.insertAdjacentElement('afterend', timeOutMessage);
  }

  // Deshabilitar el botón y añadir la clase de deshabilitado
  botonTimeOut.disabled = true;
  botonTimeOut.classList.add('disabledButton');

  // Actualizar el mensaje cada segundo
  const intervalId = setInterval(() => {
    timer--;
    if (timer > 0) {
      timeOutMessage.textContent = `Su consulta ha sido enviada, si desea hacer otra debe esperar ${timer} segundos.`;
    } else {
      clearInterval(intervalId);
      botonTimeOut.disabled = false;
      botonTimeOut.classList.remove('disabledButton');
      timeOutMessage.remove();
    }
  }, 1000);
}
