const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('abrir-calendario-button');
const calendarModal = document.getElementById('calendarModal');
const closeModal = document.getElementById('closeModal');
const aceptarButton = document.createElement('button');
aceptarButton.setAttribute('type', 'button');


let currentDate = new Date();
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

  monthYearElement.textContent = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());

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
  calendarModal.style.display = 'block';
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
  console.log(`Día seleccionado: ${chosenDay.textContent}, Mes: ${chosenMonth}, Año: ${chosenYear}, Hora seleccionada: ${chosenHour.textContent}`);

  if (chosenDay && chosenHour) {
    let amOrPm = chosenHour.textContent.split(":")[0] > 11 ? 'pm' : 'am';
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
    const selectedDate = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonth} de ${chosenYear} a las ${chosenHour.textContent} ${amOrPm}`;

    // Seleccionar el botón de elegir fecha usando la constante existente
    if (openCalendarButton) {
      // Sustituir el textContent del botón con la fecha elegida
      openCalendarButton.textContent = selectedDate;
      openCalendarButton.style.width = 'auto';
    }

    // Ocultar el modal del calendario
    calendarModal.style.display = 'none';
  } else {
    alert('Por favor, selecciona una fecha y una hora antes de aceptar.');
  }


});

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
    node.getAttribute('href') === 'https://elfsight.com/google-reviews-widget/?utm_source=websites&utm_medium=clients&utm_content=google-reviews&utm_term=%25website_domain%25&utm_campaign=free-widget' &&
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

//Detalles servicios
const detallesReparacionMotos = document.getElementById('detalles-reparacion-motos');
const detallesReparacionBaterias = document.getElementById('detalles-reparacion-baterias');
const detallesReparacionPatinetes = document.getElementById('detalles-reparacion-patinetes');
const detallesEnvios = document.getElementById('detalles-envios');
const detallesPreITVs = document.getElementById('detalles-pre-itvs');
const detallesNeumaticos = document.getElementById('detalles-neumaticos');
const detallesPuestasAPunto = document.getElementById('detalles-puestas-a-punto');
const detallesRevisiones = document.getElementById('detalles-revisiones');
if (detallesReparacionMotos) {
  detallesReparacionMotos.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=reparacion-motos';
  });
}
if (detallesReparacionBaterias) {
  detallesReparacionBaterias.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=reparacion-baterias';
  });
}
if (detallesReparacionPatinetes) {
  detallesReparacionPatinetes.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=reparacion-patinetes';
  });
}
if (detallesEnvios) {
  detallesEnvios.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=envios';
  });
}
if (detallesPreITVs) {
  detallesPreITVs.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=pre-itvs';
  });
}
if (detallesNeumaticos) {
  detallesNeumaticos.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=neumaticos';
  });
}
if (detallesPuestasAPunto) {
  detallesPuestasAPunto.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=puestas-a-punto';
  });
}
if (detallesRevisiones) {
  detallesRevisiones.addEventListener('click', function () {
    // Redirigir a otra URL
    window.location.href = './servicios.html?servicios=revisiones';
  });
}

//CARDS
  const originalContainers = document.querySelectorAll("#cards-containers .rows");
  const cardsContainer = document.getElementById("cards-containers");

  function createSlidingCards() {
      // Crear un div para la card deslizable
      const slidingCard = document.createElement("div");
      slidingCard.className = "sliding-card";
      slidingCard.style.display = "flex"; // Hacerlo flexible para el desplazamiento

      // Recorrer cada contenedor y agregar las cards a la card deslizable
      originalContainers.forEach(container => {
          const cards = container.querySelectorAll(".card");
          cards.forEach(card => {
              // Clonar la card para añadirla al slidingCard
              const clonedCard = card.cloneNode(true);
              slidingCard.appendChild(clonedCard);
          });
      });

      // Agregar la card deslizable al contenedor principal
      cardsContainer.appendChild(slidingCard);

      // Aplicar estilos de deslizamiento
      slidingCard.style.overflowX = "auto"; // Permitir el desplazamiento horizontal
      slidingCard.style.scrollSnapType = "x mandatory"; // Para el efecto de 'snap'

      // Estilo de cada card
      slidingCard.querySelectorAll(".card").forEach(card => {
          card.style.scrollSnapAlign = "start"; // Alineación al deslizar
          card.style.minWidth = "300px"; // Ajustar el ancho mínimo de cada card
          card.style.margin = "0 10px"; // Margen entre cards
      });

      // Ocultar las filas originales
      originalContainers.forEach(container => {
          container.style.display = "none";
      });
  }

  function resetCards() {
      // Eliminar la card deslizable
      const slidingCard = document.querySelector(".sliding-card");
      if (slidingCard) {
          slidingCard.remove();
      }

      // Restaurar las filas originales
      originalContainers.forEach(container => {
          container.style.removeProperty('display') // Mostrar las filas originales
          cardsContainer.appendChild(container); // Reagregar al contenedor
      });
  }

  function handleResize() {
      if (window.innerWidth <= 750) {
          // Crear cards deslizable si el ancho es menor o igual a 750px
          if (!document.querySelector(".sliding-card")) {
              createSlidingCards();
          }
      } else {
          // Restaurar la estructura original si el ancho es mayor a 750px
          resetCards();
      }
  }

  // Manejar el evento de redimensionamiento
  window.addEventListener("resize", handleResize);

  // Llamar a la función al cargar la página
  handleResize();

