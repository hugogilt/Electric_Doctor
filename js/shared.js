// VARIABLES CALENDARIO
const yearElement = document.getElementById('year');
const monthElement = document.getElementById('month');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('abrir-calendario-button');
const calendarModal = document.getElementById('calendarModal');
const closeModal = document.getElementById('closeModal');
const aceptarButton = document.createElement('button');
aceptarButton.setAttribute('type', 'button');
const pedirCitaButton = document.querySelector('#pedir-cita-button');
pedirCitaButton.onclick = function() {
  openCalendarButton.classList.add("saltando");

  // Remover la clase después de la animación
  setTimeout(() => {
      openCalendarButton.classList.remove("saltando");
  }, 100); // Debe coincidir con la duración de la transición
};




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
    });
  
    // Cambiar a formulario de inicio de sesión
    toLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.style.display = "flex";
      registerSection.style.display = "none";
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
  

  //CALENDARIO PEDIR CITA

  let currentDate = new Date();
currentDate.setDate(1);
const selectedDayText = document.createElement('p');
selectedDayText.id = 'selectedDay';

datesElement.after(selectedDayText);

let chosenDay;
let chosenHour;
let chosenYear;
let chosenMonth;

let dayNotAvailableWarning;
if (document.querySelector('#diaNoDisponibleAlerta')) {
  dayNotAvailableWarning = document.querySelector('#diaNoDisponibleAlerta');
}

let hourNotAvailableWarning;
if (document.querySelector('#horaNoDisponibleAlerta')) {
  hourNotAvailableWarning = document.querySelector('#horaNoDisponibleAlerta');
}

let fechaInput = document.createElement('input');


const title = document.querySelector('#title');
if (title) {
  title.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './index.html';
  });
}



// Aquí puedes agregar más días disponibles en formato 'YYYY-MM-DD'
const availableDays = [
  '2024-11-01', '2024-11-02' // Asegúrate de que las fechas coincidan con el mes y año actual
];

const updateCalendar = () => {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  yearElement.textContent = currentDate.toLocaleString('es-ES', { year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());
  monthElement.textContent = currentDate.toLocaleString('es-ES', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());

  // Clear previous dates
  datesElement.innerHTML = '';
  timeSlotsElement.innerHTML = '';
  selectedDayText.textContent = '';
  if (document.querySelector('#diaNoDisponibleAlerta')) {
    dayNotAvailableWarning.remove();
  }
  if (document.querySelector('#horaNoDisponibleAlerta')) {
    hourNotAvailableWarning.remove();
  }
  if (document.querySelector('#aceptar')) {
    aceptarButton.remove();
  }


  // Get the first day of the month
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Ajuste para alinear correctamente los días
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create empty slots for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    datesElement.innerHTML += '<div class="date"></div>';
  }

  // Create date elements
  for (let day = 1; day <= daysInMonth; day++) {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date ' + (isAvailable(day) ? 'available' : 'not-available');
    dateDiv.textContent = day;
    dateDiv.addEventListener('click', () => selectDate(day));
    datesElement.appendChild(dateDiv);
  }
};

//POR QUÉ TODO ESTÁ HECHO CON ARROW FUNCTIONS?
const isAvailable = (day) => {
  // Crear una fecha en formato 'YYYY-MM-DD'
  const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return availableDays.includes(dateToCheck);
};

const selectDate = (day) => {
  const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  timeSlotsElement.innerHTML = ''; // Limpiar slots anteriores
  updateTimeSlots(selectedDate); // Actualizar los slots de tiempo
  const dayOfWeek = new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long' });
  selectedDayText.textContent = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${day}`;

  //Poner dias de color azul cuando los selecciones
  // Añadir la clase "selected" al día clicado y eliminarla del resto
  const allDays = document.querySelectorAll('.date');
  allDays.forEach(dayElement => {
    dayElement.classList.remove('selected');
    dayElement.classList.remove('selected-not-available');
  });

  if (isAvailable(day)) {
    // Añadir la clase "selected" al día clicado, (seguramente haya una forma mejor de hacerlo)
    chosenDay = [...allDays].find(dayElement => dayElement.textContent === String(day));
    if (chosenDay) {
      chosenDay.classList.add('selected');
      chosenYear = currentDate.getFullYear();
      chosenMonth = currentDate.getMonth() + 1;
    }
  }
  else {
    chosenDay = [...allDays].find(dayElement => dayElement.textContent === String(day));
    if (chosenDay) {
      chosenDay.classList.add('selected-not-available');
    }
  }

};

const isTimeAvailable = (date, hour, minute) => {
  const availableSlots = [
    '2024-11-01-9:00', '2024-11-01-9:30', '2024-11-01-10:00',
    '2024-11-01-10:30', '2024-11-01-11:00', '2024-11-01-11:30',
    '2024-11-01-16:00', '2024-11-01-16:30', '2024-11-01-17:00',
    '2024-11-01-17:30', '2024-11-01-18:00', '2024-11-01-18:30',
    '2024-11-02-9:00', '2024-11-02-10:00'
  ];
  return availableSlots.includes(`${date}-${hour}:${minute === 0 ? '00' : '30'}`);
};

const updateTimeSlots = (selectedDate) => {
  const morningStart = 9; // 9:00
  const morningEnd = 14; // 14:00
  const afternoonStart = 16; // 16:00
  const afternoonEnd = 19; // 19:00
  let displayHours = false;

  // Crear slots de la mañana (cada media hora)
  for (let hour = morningStart; hour < morningEnd; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slot = document.createElement('button');
      slot.type = 'button';
      const formattedHour = `${hour}:${minute === 0 ? '00' : '30'}`;
      if (isTimeAvailable(selectedDate, hour, minute)) {
        slot.className = 'available';
        displayHours = true;
      } else {
        slot.className = 'not-available';
      }
      slot.textContent = formattedHour;
      slot.addEventListener('click', () => selectTime(slot));
      timeSlotsElement.appendChild(slot);
    }
  }

  // Crear slots de la tarde (cada media hora)
  for (let hour = afternoonStart; hour < afternoonEnd; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slot = document.createElement('button');
      slot.type = 'button';
      const formattedHour = `${hour}:${minute === 0 ? '00' : '30'}`;
      if (isTimeAvailable(selectedDate, hour, minute)) {
        slot.className = 'available';
        displayHours = true;
      } else {
        slot.className = 'not-available';
      }
      slot.textContent = formattedHour;
      slot.addEventListener('click', () => selectTime(slot));
      timeSlotsElement.appendChild(slot);
    }
  }
  const hoursNotDisplay = document.querySelectorAll('button.not-available');
  if (!displayHours) {
    for (let hourNotDisplay of hoursNotDisplay) {
      hourNotDisplay.style.display = 'none'
    }
    if (!document.querySelector('#diaNoDisponibleAlerta')) {
      dayNotAvailableWarning = document.createElement('p');
      dayNotAvailableWarning.textContent = ('No hay horas disponibles para este día');
      dayNotAvailableWarning.id = 'diaNoDisponibleAlerta';
      timeSlotsElement.after(dayNotAvailableWarning);
    }
    dayNotAvailableWarning.classList.remove('transition');
    dayNotAvailableWarning.style.color = 'white';
    setTimeout(() => { dayNotAvailableWarning.className = 'transition' }, 1);
    setTimeout(() => { dayNotAvailableWarning.style.color = '#f28b82'; }, 2);

  } else {
    for (let hourNotDisplay of hoursNotDisplay) {
      hourNotDisplay.style.removeProperty('display');
    }
    if (document.querySelector('#diaNoDisponibleAlerta')) {
      dayNotAvailableWarning.remove();
    }

  }
  if (document.querySelector('#horaNoDisponibleAlerta')) { //Elimino hora no disponible alerta cuando clicko cualquiero otro día
    hourNotAvailableWarning.remove();
  }
  if (document.querySelector('#aceptar')) {
    aceptarButton.remove();
  }
};



const selectTime = (slot) => {
  const slots = document.querySelectorAll('.time-slots button');
  if (document.querySelector('#horaNoDisponibleAlerta')) {
    hourNotAvailableWarning.remove();
  }
  if (document.querySelector('#aceptar')) {
    aceptarButton.remove();
  }
  for (let s of slots) {
    s.classList.remove('selected');
    s.classList.remove('selected-not-available');
  }
  if (slot.classList.contains('available')) {
    slot.classList.add('selected');
    aceptarButton.id = 'aceptar';
    aceptarButton.textContent = 'Aceptar'
    timeSlotsElement.after(aceptarButton);
    chosenHour = slot;
  }
  else {
    slot.classList.add('selected-not-available');
    hourNotAvailableWarning = document.createElement('p');
    hourNotAvailableWarning.textContent = ('Esta hora no está disponible');
    hourNotAvailableWarning.id = 'horaNoDisponibleAlerta';
    timeSlotsElement.after(hourNotAvailableWarning);
    hourNotAvailableWarning.classList.remove('transition');
    hourNotAvailableWarning.style.color = 'white';
    setTimeout(() => { hourNotAvailableWarning.className = 'transition' }, 1);
    setTimeout(() => { hourNotAvailableWarning.style.color = '#f28b82'; }, 2);
  }

};

// Funciones para abrir y cerrar el modal
openCalendarButton.addEventListener('click', () => {
  calendarModal.style.display = 'flex';
  updateCalendar();
});

closeModal.addEventListener('click', () => {
  calendarModal.style.display = 'none';
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    calendarModal.style.display = 'none';
  }
});

prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

aceptarButton.addEventListener('click', () => {

  if (chosenDay && chosenHour) {
    const monthNames = {
      1: 'enero',
      2: 'febrero',
      3: 'marzo',
      4: 'abril',
      5: 'mayo',
      6: 'junio',
      7: 'julio',
      8: 'agosto',
      9: 'septiembre',
      10: 'octubre',
      11: 'noviembre',
      12: 'diciembre'
    };

    // Convertir el número del mes en el nombre del mes
    chosenMonth = monthNames[chosenMonth] || 'mes inválido';

    // Crear la fecha elegida como un string
    const selectedDate = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonth} de ${chosenYear} a las ${chosenHour.textContent}`;

    // Seleccionar el botón de elegir fecha usando la constante existente
    if (openCalendarButton) {
      // Sustituir el textContent del botón con la fecha elegida
      openCalendarButton.textContent = selectedDate;
      pedirCitaButton.style.backgroundColor = '#4CAF50';
      pedirCitaButton.onclick = null;
      pedirCitaButton.style.cursor = 'pointer';
      pedirCitaButton.type = 'submit';
      openCalendarButton.style.width = 'auto';
    }

    // Ocultar el modal del calendario
    calendarModal.style.display = 'none';
  } else {
    alert('Por favor, selecciona una fecha y una hora antes de aceptar.');
  }


});


// REVIEWS

// Función para eliminar estilos inline de cualquier elemento
function removeInlineStyles(node) {
    if (node.style) {
      node.removeAttribute('style');  // Eliminar el atributo 'style'
    }
  }
  
  // Función para verificar si el nodo <a> tiene los atributos deseados
  function isTargetLink(node) {
    return (
      node.nodeName === 'A' &&
      node.getAttribute('target') === '_blank' &&
      node.getAttribute('rel') === 'noreferrer'
    );
  }
  
  // Función para observar y eliminar los estilos inline de todos los elementos
  function observeAllElementsForStyles() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Revisar todos los nodos agregados
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && isTargetLink(node)) {  // Solo elementos <a> con los atributos deseados
            // Comprobar si el hermano anterior es un <script> con el tipo específico
            if (node.previousElementSibling &&
              node.previousElementSibling.nodeName === 'SCRIPT' &&
              node.previousElementSibling.getAttribute('type') === 'application/ld+json') {
              removeInlineStyles(node);  // Eliminar los estilos inline
              node.querySelectorAll('*').forEach(removeInlineStyles);  // Eliminar estilos inline de los descendientes
            }
          }
        });
  
        // Revisar cambios en los atributos
        if (mutation.target.nodeType === 1 && mutation.target.nodeName === 'A' && mutation.attributeName === 'style') {
          if (isTargetLink(mutation.target)) {  // Solo aplicar a elementos <a> con los atributos deseados
            // Comprobar si el hermano anterior es un <script> con el tipo específico
            if (mutation.target.previousElementSibling &&
              mutation.target.previousElementSibling.nodeName === 'SCRIPT' &&
              mutation.target.previousElementSibling.getAttribute('type') === 'application/ld+json') {
              removeInlineStyles(mutation.target);  // Eliminar los estilos inline
            }
          }
        }
      });
    });
  
    // Observar todo el DOM
    observer.observe(document.body, {
      childList: true,  // Detectar nodos agregados o eliminados
      attributes: true,  // Observar cambios en atributos
      subtree: true,  // Observar todos los descendientes del body
      attributeFilter: ['style']  // Solo monitorear cambios en el atributo 'style'
    });
  
    // Eliminar estilos inline de todos los elementos actuales que son <a> y tienen los atributos deseados
    document.querySelectorAll('a[style]').forEach((link) => {
      if (isTargetLink(link)) {
        if (link.previousElementSibling &&
          link.previousElementSibling.nodeName === 'SCRIPT' &&
          link.previousElementSibling.getAttribute('type') === 'application/ld+json') {
          removeInlineStyles(link);
        }
      }
    });
  }


  // Iniciar la observación del DOM
observeAllElementsForStyles();

// Inicializar el calendario
updateCalendar();

  