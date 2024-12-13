
// VARIABLES CALENDARIO
const yearElement = document.getElementById('year');
const monthElement = document.getElementById('month');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('citas');
const openInvoicesButton = document.getElementById('facturas');
const openUsersButton = document.getElementById('usuarios');
const abrirListadoCitasButton = document.getElementById('listado-citas');
const calendarModal = document.getElementById('calendarModal');
const closeCalendarModal = document.getElementById('closeCalendarModal');
const pedirCitaButton = document.querySelector('#pedir-cita-button');
let eventListenerAñadido = false;
let ejecutado = false;
// Array global para almacenar los slots no disponibles
let nonAvailableSlots = [];
let reservedSlots = [];
let selectedDate;
const formModal = document.getElementById("modal-formulario");
const formModalContent = document.querySelector(".modal-formulario-content");
const closeFormModalButton = document.getElementById("cerrar-modal-formulario");
closeCalendarModal.addEventListener('click', closeCalendar);

function closeCalendar() {
  calendarModal.style.display = 'none';
  editingDate = false;
  calendarModal.style.zIndex = '11';
  if (document.querySelector('#aceptar-modificando-fecha')) {
    aceptarModificandoFechaButton.remove();
  }
}

async function openCalendar() {
  calendarModal.style.display = 'flex';
  updateCalendar();
}

let editingDate = false;

function closeFormModal() {
  formModal.style.display = 'none';
  [nombreInput, apellidosInput, telefonoInput, correoInput].forEach(input => {
    input.disabled = false;
    input.classList.remove('disabled');
  });
  pidiendoCita = false;
}

closeFormModalButton.addEventListener('click', closeFormModal);
formModal.addEventListener('click', function (e) {
  if (!formModalContent.contains(e.target)) {
    closeFormModal();
  }
});

const nombreInput = document.getElementById('nombre');
const apellidosInput = document.getElementById('apellidos');
const telefonoInput = document.getElementById('telefono');
const correoInput = document.getElementById('correo');
const modeloInput = document.getElementById('marca');
const anioInput = document.getElementById('anio');
const problemaInput = document.getElementById('problema');

const contenedorProblema = document.querySelector('#contenedor-problema');
const aceptarButton = document.createElement('button');
aceptarButton.type = 'submit';
aceptarButton.id = 'aceptar';
aceptarButton.textContent = 'Aceptar';


const inputsForm = document.querySelectorAll('input');

const userTextSpan = document.querySelector('#user-text');
const modalCancelarCita = document.querySelector('#modal-cancelar-cita');
const mantenerCitaButton = document.querySelector('#cancelar-cancelar-cita');
const cancelarCitaButton = document.querySelector('#confirmar-cancelar-cita');

let citaElegida, modificandoAño, modificandoDia, modificandoHora,
  modificandoMes, modificandoCitaIDPersona,
  IDPersonaCitaACompletar, correoPersonaCitaACompletar, chosenDate;

const modificarFechaButton = document.querySelector('#modificar-fecha-button');
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
const aceptarModificandoFechaButton = document.createElement('button');
aceptarModificandoFechaButton.setAttribute('type', 'button');
aceptarModificandoFechaButton.addEventListener('click', aceptarModificandoFecha);


// COMPLETAR CITA
// Elementos del modal
const modalCompletarCita = document.getElementById('modal-completar-cita');
const modalCompletarCitaCerrar = document.getElementById('modal-completar-cita-cerrar');
const modalCompletarCitaGuardar = document.getElementById('modal-completar-cita-guardar');
const modalCompletarCitaTextarea = document.getElementById('modal-completar-cita-textarea');



// Cerrar modal
modalCompletarCitaCerrar.addEventListener('click', () => {
  modalCompletarCita.style.display = 'none';
});

// Guardar observaciones y subir factura
modalCompletarCitaGuardar.addEventListener('click', async function () {
  let facturaSubida = false;
  const modalCompletarCitaObservaciones = modalCompletarCitaTextarea.value.trim();
  const archivoFactura = document.getElementById('factura').files[0];
  const montoTotal = document.getElementById('monto_total').value.trim();

  // Validamos si se ha seleccionado un archivo para la factura
  if (!archivoFactura) {
    showAlert('Por favor, agrega una factura.', 'negative');
    return;
  }

  if (!montoTotal || isNaN(parseFloat(montoTotal)) || parseFloat(montoTotal) <= 0) {
    showAlert('Por favor, ingresa un monto válido.', 'negative');
    return;
  }

  try {
    // Subir factura
    const formData = new FormData();
    formData.append('id_usuario', IDPersonaCitaACompletar || 'NULL');
    formData.append('factura', archivoFactura);
    formData.append('correo', correoPersonaCitaACompletar);
    formData.append('monto_total', montoTotal);
    const respuesta = await fetch('subir_factura.php', {
      method: 'POST',
      body: formData,
    });
    const resultado = await respuesta.json();
    if (respuesta.ok && resultado.status === 'success') {
      facturaSubida = true;
    } else {
      showAlert(`Error al subir la factura: ${resultado.message}`, 'negative');
    }
  } catch (error) {
    showAlert('Error al subir la factura.', 'negative');
  }

  if (facturaSubida) {
    // Limpiar el campo de texto y ocultar el modal
    modalCompletarCitaTextarea.value = '';
    modalCompletarCita.style.display = 'none';

    // Guardar las observaciones
    await cambiarEstadoCita(citaACompletar, modalCompletarCitaObservaciones);
    recargarCitas();
  }

});




// Cerrar modal al hacer clic fuera de él
modalCompletarCita.addEventListener('click', (e) => {
  if (e.target === modalCompletarCita) {
    modalCompletarCita.style.display = 'none';
  }
});


// MODAL USUARIOS

const modalUsuarios = document.getElementById("modal-obtener-clientes-y-usuarios");
const cerrarModalUsuariosBtn = document.getElementById("cerrar-modal-usuarios");



//CALENDARIO PEDIR CITA
const fechaActual = new Date();
let currentDate = new Date();
currentDate.setDate(1);
const selectedDayText = document.createElement('p');
selectedDayText.id = 'selectedDay';

datesElement.after(selectedDayText);
let chosenDay, chosenHour, chosenYear, chosenMonth, modificandoFecha = false,
  pidiendoCita = false, creandoCita = false, citaACompletar;

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
    window.location.href = 'https://electric-doctor.infinityfreeapp.com';
  });
}


// SI TODOS LOS SLOTS SON NOT AVAILABLE
let notAvailableDays = [];
function isDayNotAvailable(date) {
  return allSlots.every(time => nonAvailableSlots.includes(`${date}-${time}`));
}

//SI NO HAY NINGUN SLOT AVAILABLE, Y HAY AL MENOS UNO RESERVED
let completeDays = [];

function isDayComplete(date) {
  // Verifica si todas las horas del día están en alguno de los dos arrays
  const allSlotsCovered = allSlots.every(time =>
    reservedSlots.includes(`${date}-${time}`) || nonAvailableSlots.includes(`${date}-${time}`)
  );

  // Verifica si al menos una hora está en reservedSlots
  const hasReservedSlot = allSlots.some(time =>
    reservedSlots.includes(`${date}-${time}`)
  );

  // El día es completo si se cumplen ambas condiciones
  return allSlotsCovered && hasReservedSlot;
}


// SI HAY ALGUN SLOT AVAILABLE Y ALGUNO RESERVED
let semiCompleteDays = [];
function isDaySemiComplete(date) {
  let hasReservedSlot = false;
  let hasFreeSlot = false;

  for (const time of allSlots) {
    const fullSlot = `${date}-${time}`;
    if (reservedSlots.includes(fullSlot)) {
      hasReservedSlot = true;
    } else if (!nonAvailableSlots.includes(fullSlot)) {
      hasFreeSlot = true;
    }

    // Si se cumplen ambas condiciones, no hace falta seguir comprobando
    if (hasReservedSlot && hasFreeSlot) {
      return true;
    }
  }

  // Devuelve true solo si ambas condiciones se cumplen
  return hasReservedSlot && hasFreeSlot;
}



const allSlots = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

function addCompleteDays(year, month) {
  // Verificar y añadir los días con todos los slots ocupados al array notAvailableDays
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (isDayComplete(formattedDate)) {
      completeDays.push(formattedDate);
    }
  }
}

function addNotAvailableDays(year, month) {
  // Verificar y añadir los días con todos los slots ocupados al array notAvailableDays
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (isDayNotAvailable(formattedDate)) {
      notAvailableDays.push(formattedDate);
    }
  }
}

function addSemiCompleteDays(year, month) {
  // Verificar y añadir los días con todos los slots ocupados al array notAvailableDays
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (isDaySemiComplete(formattedDate)) {
      semiCompleteDays.push(formattedDate);
    }
  }
}

// Función updateCalendar adaptada
async function updateCalendar() {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Llama a addPastDaysToNotAvailable con el año y mes actuales
  addPastDaysToNotAvailable(year, month);

  // Filtra `notAvailableDays` para eliminar los fines de semana del mes anterior
  notAvailableDays = notAvailableDays.filter(dateString => {
    const [y, m] = dateString.split('-').map(Number);
    return !(y === year && m === month);
  });

  // Añade los sábados y domingos del mes actual
  for (let dia = 1; dia <= 31; dia++) {
    const fecha = new Date(year, month, dia);

    // Verifica si la fecha pertenece al mes actual
    if (fecha.getMonth() !== month) break;

    // Si es sábado (6) o domingo (0), añade al array
    if (fecha.getDay() === 0 || fecha.getDay() === 6) {
      const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
      if (!notAvailableDays.includes(formattedDate)) {
        notAvailableDays.push(formattedDate);
      }
    }
  }

  // Actualizar el resto del calendario (manteniendo el resto del código de updateCalendar)
  yearElement.textContent = currentDate.toLocaleString('es-ES', { year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());
  monthElement.textContent = currentDate.toLocaleString('es-ES', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
  datesElement.innerHTML = '';
  timeSlotsElement.innerHTML = '';
  selectedDayText.textContent = '';
  if (document.querySelector('#diaNoDisponibleAlerta')) dayNotAvailableWarning.remove();
  if (document.querySelector('#horaNoDisponibleAlerta')) hourNotAvailableWarning.remove();
  if (document.querySelector('#aceptar-modificando-fecha')) aceptarModificandoFechaButton.remove();

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    datesElement.innerHTML += '<div class="date"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date ' + (isNotAvailable(day) ? 'not-available' : 'available');
    dateDiv.textContent = day;
    dateDiv.addEventListener('click', () => selectDate(day));
    datesElement.appendChild(dateDiv);
  }

  await obtenerFechasNoDisponibles();
  if (month === fechaActual.getMonth()) {
    desactivarHorasAnteriores();
    addNotAvailableDays(year, month);
    addNotAvailableDaysClass(year, month, notAvailableDays)
  }


  completeDays = [];
  addCompleteDays(year, month);
  addCompleteDayClass(year, month, completeDays);

  semiCompleteDays = [];
  addSemiCompleteDays(year, month);
  addSemiCompleteDaysClass(year, month, semiCompleteDays)

};




function isNotAvailable(day) {
  // Crear una fecha en formato 'YYYY-MM-DD'
  const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return notAvailableDays.includes(dateToCheck);
};

function isComplete(day) {
  // Crear una fecha en formato 'YYYY-MM-DD'
  const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return completeDays.includes(dateToCheck);
};

function selectDate(day) {
  selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

  chosenDay = [...allDays].find(dayElement => Number(dayElement.textContent) === Number(day));
  chosenYear = currentDate.getFullYear();
  chosenMonth = currentDate.getMonth() + 1;
  if (!isNotAvailable(day) && !isComplete(day)) {
    // Añadir la clase "selected" al día clicado
    if (chosenDay) {
      chosenDay.classList.add('selected');
    }
  }
  else {
    // Añadir la clase "selected-not-available" al día clicado
    if (chosenDay) {
      chosenDay.classList.add('selected-not-available');
    }
  }

};


// Función para obtener fechas no disponibles de la base de datos
async function obtenerFechasNoDisponibles() {
  try {
    const response = await fetch('/php/obtener_fechas_reservadas.php');
    const data = await response.json();

    if (data.error) {
      // console.error(data.error);
    } else {
      reservedSlots = data; // Almacena las fechas obtenidas en el array global
    }
  } catch (error) {
    // console.error('Error al obtener las fechas no disponibles:', error);
  }
}

// Función para añadir días al array correspondiente según el dia actual
function addPastDaysToNotAvailable(year, month) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();


  // Añadir días anteriores al día actual al array de días no disponibles
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    // Añadir todos los días del mes si el mes es anterior al actual
    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
      const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (!notAvailableDays.includes(formattedDate)) {
        notAvailableDays.push(formattedDate);
      }
    }
  } else if (year === currentYear && month === currentMonth) {
    // Añadir solo los días anteriores al día actual en el mes actual
    for (let day = 1; day < currentDay; day++) {
      const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (!notAvailableDays.includes(formattedDate)) {
        notAvailableDays.push(formattedDate);
      }
    }
  }
};


// Añadir las horas anteriores a la hora actual y una hora más de cortesía para el taller
function desactivarHorasAnteriores() {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

  // Hora actual redondeada al siguiente intervalo de 30 minutos
  let currentHour = now.getHours();
  let currentMinutes = now.getMinutes() > 0 ? Math.ceil(now.getMinutes() / 30) * 30 : 0;
  if (currentMinutes === 60) {
    currentHour += 1;
    currentMinutes = 0;
  }

  // Crea los intervalos de 30 minutos desde las 9:00 hasta el siguiente intervalo completo
  let hour = 9;
  let minute = 0;
  //Mientras la hora no sea mayor que la hora actual 
  // y los minutos menores a los minutos actuales, lo añade al array de no disponibles
  while (hour <= currentHour || (hour > currentHour && minute < currentMinutes)) {

    const timeSlot = `${today}-${hour.toString()}:${minute.toString().padStart(2, '0')}`;
    nonAvailableSlots.push(timeSlot);

    // Incrementa de 30 en 30 minutos
    minute += 30;
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }
  }
}


function addCompleteDayClass(year, month, completeDays) {
  // Recorre cada día en el array completeDays
  completeDays.forEach(date => {
    // Extrae el año, mes y día del string en formato YYYY-MM-DD
    const [dateYear, dateMonth, dateDay] = date.split('-').map(Number);

    // Verifica si el año y el mes coinciden con el mes del calendario actual
    if (dateYear === year && dateMonth === month + 1) {
      // Busca el elemento del calendario que corresponde a dateDay
      const dayElement = Array.from(datesElement.children).find(
        el => el.classList.contains('date') && el.textContent == dateDay
      );

      // Si el elemento existe, añade la clase 'completeDay'
      if (dayElement) {
        dayElement.classList.add('complete-day');
      }
    }
  });
}

function addNotAvailableDaysClass(year, month, notAvailableDays) {
  // Recorre cada día en el array notAvailableDays
  notAvailableDays.forEach(date => {
    // Extrae el año, mes y día del string en formato YYYY-MM-DD
    const [dateYear, dateMonth, dateDay] = date.split('-').map(Number);

    // Verifica si el año y el mes coinciden con el mes del calendario actual
    if (dateYear === year && dateMonth === month + 1) {
      // Busca el elemento del calendario que corresponde a dateDay
      const dayElement = Array.from(datesElement.children).find(
        el => el.classList.contains('date') && el.textContent == dateDay
      );

      // Si el elemento existe, añade la clase 'not-available'
      if (dayElement) {
        dayElement.classList.add('not-available');
      }
    }
  });
}

function addSemiCompleteDaysClass(year, month, semiCompleteDays) {
  // Recorre cada día en el array semiCompleteDays
  semiCompleteDays.forEach(date => {
    // Extrae el año, mes y día del string en formato YYYY-MM-DD
    const [dateYear, dateMonth, dateDay] = date.split('-').map(Number);

    // Verifica si el año y el mes coinciden con el mes del calendario actual
    if (dateYear === year && dateMonth === month + 1) {
      // Busca el elemento del calendario que corresponde a dateDay
      const dayElement = Array.from(datesElement.children).find(
        el => el.classList.contains('date') && el.textContent == dateDay
      );

      // Si el elemento existe, añade la clase 'semi-complete-day'
      if (dayElement) {
        dayElement.classList.add('semi-complete-day');
      }
    }
  });
}





function isTimeNotAvailable(date, hour, minute) {
  const formattedDate = `${date}-${hour}:${minute === 0 ? '00' : '30'}`;
  return nonAvailableSlots.includes(formattedDate);
}

function isTimeReserved(date, hour, minute) {
  const formattedDate = `${date}-${hour}:${minute === 0 ? '00' : '30'}`;
  return reservedSlots.includes(formattedDate);
}




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

      if (isTimeNotAvailable(selectedDate, hour, minute)) {
        slot.className = 'not-available';
      } else if (isTimeReserved(selectedDate, hour, minute)) {
        slot.className = 'reserved';
      } else {
        slot.className = 'available';
        displayHours = true;
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
      if (isTimeNotAvailable(selectedDate, hour, minute)) {
        slot.className = 'not-available';
      } else if (isTimeReserved(selectedDate, hour, minute)) {
        slot.className = 'reserved';
      } else {
        slot.className = 'available';
        displayHours = true;
      }

      slot.textContent = formattedHour;
      slot.addEventListener('click', () => selectTime(slot));
      timeSlotsElement.appendChild(slot);
    }
  }
  const hoursNotDisplay = document.querySelectorAll('.time-slots button');
  let foundDate = notAvailableDays.find(day => day === selectedDate);
  if (!displayHours || foundDate) {
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
}




async function selectTime(slot, key = false) {
  const slots = document.querySelectorAll('.time-slots button');
  if (document.querySelector('#horaNoDisponibleAlerta')) {
    hourNotAvailableWarning.remove();
  }
  if (document.querySelector('#aceptar-modificando-fecha')) {
    aceptarModificandoFechaButton.remove();
  }
  for (let s of slots) {
    s.classList.remove('selected');
    s.classList.remove('selected-not-available');
  }
  if (slot.classList.contains('available')) {
    slot.classList.add('selected');
    chosenHour = slot;
    modificandoDia = chosenDay.textContent;
    if (!editingDate) {
      pidiendoCita = true;
      formModal.style.display = 'flex';
      modificarFechaButton.parentElement.insertAdjacentElement('afterend', aceptarButton);
      const chosenMonthName = monthNames[parseInt(chosenMonth)];
      const chosenDateString = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonthName} de ${chosenYear} a las ${chosenHour.textContent}h`;
      modificarFechaButton.textContent = chosenDateString;
      for (let inputForm of inputsForm) {
        inputForm.value = '';
      }
      problemaInput.value = '';
      modificarFechaButton.addEventListener('click', openModificarFechaCalendar);

    } else {
      slot.classList.add('selected');
      aceptarModificandoFechaButton.id = 'aceptar-modificando-fecha';
      aceptarModificandoFechaButton.textContent = 'Aceptar'
      timeSlotsElement.after(aceptarModificandoFechaButton);
    }
  }
  else if (slot.classList.contains('reserved') && !pidiendoCita && !editingDate) {
    const datosCita = await obtenerDatosCita(selectedDate + '-' + slot.textContent);
    formModal.style.display = 'flex';
    nombreInput.value = datosCita.Nombre;
    apellidosInput.value = datosCita.Apellidos;
    telefonoInput.value = datosCita.Telefono;
    correoInput.value = datosCita.Correo_Electronico;
    modeloInput.value = datosCita.Modelo_Vehiculo;
    anioInput.value = datosCita.Ano_Matriculacion;
    problemaInput.value = datosCita.Motivo;
    modificandoCitaIDPersona = datosCita.ID;
    modificandoDia = chosenDay.textContent;
    chosenHour = slot;
    const chosenMonthName = monthNames[parseInt(chosenMonth)];
    const chosenDateString = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonthName} de ${chosenYear} a las ${chosenHour.textContent}h`;
    modificarFechaButton.textContent = chosenDateString;
    if (!key) {
      modificarFechaButton.removeEventListener('click', openModificarFechaCalendar);
      if (document.getElementById('aceptar')) {
        aceptarButton.remove();
      }
    }


  } else {
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
openCalendarButton.addEventListener('click', function () {
  openCalendar();
});

closeCalendarModal.addEventListener('click', () => {
  closeCalendar();
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    closeCalendar();
  }
  if (event.target === formModal) {
    formModal.style.display = 'none';
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

formModal.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!pidiendoCita) {

    // Crear el objeto de datos para enviar
    const data = {
      id_cita: citaElegida,
      nombre: nombreInput.value,
      apellidos: apellidosInput.value,
      telefono: telefonoInput.value,
      correo: correoInput.value,
      modelo: modeloInput.value,
      anio: anioInput.value,
      problema: problemaInput.value,
      fecha: chosenDate
    };

    try {
      // Enviar los datos al archivo PHP usando fetch
      const response = await fetch('/php/modificar_cita.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Comprobar si la respuesta es exitosa
      const result = await response.json();

      if (result.status === 'success') {
        console.log('Éxito:', result.message);
        showAlert(result.message, 'positive');
      } else {
        console.log('Error:', result.message);
        showAlert(result.message, 'negative');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      showAlert('Ocurrió un error al modificar la cita.', 'negative');
    }
    closeFormModal();
    recargarCitas();
  } else {
    // COMPRUEBO QUE ESA CITA SIGA DISPONIBLE
    await obtenerFechasNoDisponibles();
    let twoPointsPos = chosenHour.textContent.indexOf(":");
    let hour = chosenHour.textContent.slice(0, twoPointsPos);
    let minute = chosenHour.textContent.slice(twoPointsPos + 1) === '00' ? parseInt('0') : '30';
    if (isTimeNotAvailable(selectedDate, hour, minute) || isTimeReserved(selectedDate, hour, minute)) {
      showAlert('La hora seleccionada ya no se encuentra disponible', 'negative');
      return;
    }

    let chosenDate = `${chosenYear}-${String(chosenMonth).padStart(2, '0')}-${String(chosenDay.textContent).padStart(2, '0')}-${String(chosenHour.textContent).padStart(4, '0')}`;
    const correo = document.getElementById('correo').value;
    // Realizar la solicitud AJAX para verificar el correo
    const correoResponse = await fetch('/php/verificar_correo_usuarios.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo: correo })
    });

    const dataRespuesta = await correoResponse.json();
    let isUserLogged = await check_user_logged();
    if (dataRespuesta.status === 'exists' && !isUserLogged) { //Si el correo existe en la tabla usuarios y no ha iniciado sesión
      authModal.style.display = "flex";
      loginSection.style.display = "flex";
      registerSection.style.display = "none";
      loginForm.reset();
      correoErrorMessageLogin.textContent = '';
      passwordErrorMessageLogin.textContent = '';
      document.getElementById("loginEmail").value = correo;
      return false; // No proceder con la inserción
    } else {  // si el correo existe y ha iniciado sesión o no existe
      // Recoger los datos del formulario
      const nombre = document.getElementById('nombre').value;
      const apellidos = document.getElementById('apellidos').value;
      const telefono = document.getElementById('telefono').value;
      const marca = document.getElementById('marca').value;
      const anio = document.getElementById('anio').value;
      const problema = document.getElementById('problema').value;

      // Crear el objeto JSON con los datos
      const datosCita = {
        nombre: nombre,
        apellidos: apellidos,
        telefono: telefono,
        correo: correo,
        marca: marca,
        anio: anio,
        problema: problema,
        fechaHora: chosenDate,
        dataRespuesta: dataRespuesta
      };

      // Enviar los datos al servidor
      const response = await fetch('/php/insertar_datos_citas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosCita)
      });

      const data = await response.json();
      if (data.status === 'success') {
        showAlert(data.message, 'positive' || data.status === 'not-verified-user' || data.status === 'not-verified-client');
        closeFormModal();
        closeCalendar();
      } else {
        showAlert(data.message, 'negative');
      }
    }
  }

});












//Modal Citas
const modalCitasBody = document.getElementById("modal-citas-body");

abrirListadoCitasButton.addEventListener('click', async function () {
  const atributoSeleccionado = document.getElementById("filtro-atributo").value;
  const valorInput = document.getElementById("filtro-valor");

  if (!atributoSeleccionado) {
    valorInput.disabled = true;
    valorInput.value = ""; // Limpiar el valor del input al abrir el modal
  }
  openListadoCitasModal();
  modificarFechaButton.addEventListener('click', openModificarFechaCalendar);

})


//Obtener datos cita
async function obtenerDatosCita(fechaHora) {
  try {
    // Realizar la solicitud al servidor
    const response = await fetch('/php/obtener_datos_cita.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Fecha_Hora: fechaHora })
    });

    // Convertir la respuesta a JSON
    const data = await response.json();

    if (data.error) {
      showAlert('Ha ocurrido un error al obtener los datos de la cita', 'negative')
    } else {
      // Devolver los datos obtenidos
      return data;
    }
  } catch (error) {
    showAlert('Ha ocurrido un error al obtener los datos de la cita', 'negative')

  }
}


// Llamar a la función para obtener las citas
async function obtenerCitas() {
  try {
    const response = await fetch('/php/obtener_citas.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.error && !data.error === 'No se encontraron citas.') {
      showAlert('Ha ocurrido un error al obtener las citas', 'negative')
    } else if (data.citas) {
      return data.citas;
    }
    else {
      return data.error
    }
  } catch (error) {
    // console.error('Error al obtener las citas:', error);
    // alert('Ocurrió un error al obtener las citas.');
    showAlert('Ha ocurrido un error al obtener las citas', 'negative')

  }
}


async function cancelarCita(idCita) {
  try {
    // Realizar la solicitud AJAX para cancelar la cita
    const response = await fetch('/php/cancelar_cita.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_cita: idCita })
    });

    const data = await response.json();

    if (data.success) {
      // alert(data.message); // Mensaje de éxito
      showAlert('Cita eliminada con éxito.', 'positive');
    } else {
      // alert(data.message); // Mensaje de error
      showAlert('Ocurrió un error al cancelar la cita.', 'negative');
    }
  } catch (error) {
    // console.error('Error al cancelar la cita:', error);
    showAlert('Ocurrió un error al cancelar la cita.', 'negative');
  }
}


// Función para cambiar el estado de la cita
async function cambiarEstadoCita(idCita, observaciones = '') {
  try {
    // Realizar la solicitud AJAX para cambiar el estado de la cita
    const response = await fetch('/php/cambiar_estado_cita.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_cita: idCita, observaciones: observaciones })
    });

    const data = await response.json();

    if (data.status === 'success') {
      // alert(data.message); // Mensaje de éxito
      showAlert(data.message, 'positive');
    } else {
      // alert(data.message); // Mensaje de error
      showAlert(data.message, 'negative');
    }
  } catch (error) {
    // console.error('Error al cambiar el estado de la cita:', error);
    showAlert('Ocurrió un error al cambiar el estado de la cita.', 'negative');
  }
}










async function check_user_logged() {
  try {
    const response = await fetch('/php/check_session.php', {
      method: 'GET'
    });
    const data = await response.json();

    if (data.status === 'logged_in') {
      if (userTextSpan.lastChild.nodeType !== Node.TEXT_NODE) {
        userTextSpan.appendChild(document.createTextNode(`Nos alegra verte de nuevo, ${data.nombre}`));
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.error("Error al verificar la sesión:", error);
    return false; // Opcional, puedes decidir cómo manejar los errores aquí
  }
}

// Función para abrir el modal con los datos
let citasOriginales = []; // Guardará el array inicial de citas

async function openListadoCitasModal() {
  const modal = document.getElementById("modal-citas");
  mostrarCitas(await obtenerCitas());

  // Mostrar el modal
  modal.style.display = "flex";
  let citas = await obtenerCitas();
  recargarCitas();
  if (typeof citas === 'object' && citas.length > 0) {
    actualizarContadorResultados(citas.length);
  }
}


function limpiarListadoCitas() {
  while (modalCitasBody.firstChild) {
    modalCitasBody.removeChild(modalCitasBody.firstChild);
  }
}

function mostrarCitas(arrayDeObjetos) {

  // Limpiar el contenido previo
  limpiarListadoCitas();

  if (typeof arrayDeObjetos === 'object' && arrayDeObjetos.length > 0) {
    // Guardar las citas originales para el filtro
    citasOriginales = arrayDeObjetos;
    // Crear cajones dinámicamente
    arrayDeObjetos.forEach((objeto) => {
      modalCitasBody.appendChild(crearCajon(objeto));
    });
  } else {
    citasOriginales = [];
  }

}


function crearCajon(cita) {
  // Crear el contenedor principal para cada cita
  const cajon = document.createElement("div");

  // Añadir la clase correspondiente según el estado de la cita
  if (cita.Estado === 'Pendiente') {
    cajon.classList.add("pendiente");
  } else if (cita.Estado === 'Completada') {
    cajon.classList.add("completada");
  }

  cajon.classList.add("modal-citas-cajon");

  // Crear el título del cajón
  const tituloCajon = document.createElement("h3");
  tituloCajon.classList.add("modal-citas-titulo");
  tituloCajon.textContent = `Cita #${cita.ID_Cita}`;

  // Crear el contenido de la cita
  const contenidoCita = document.createElement("div");
  contenidoCita.classList.add("modal-citas-cajon-contenido");

  const nombreCompleto = document.createElement("p");
  nombreCompleto.textContent = `Nombre Completo: ${cita.Nombre} ${cita.Apellidos}`;

  const modelo = document.createElement("p");
  modelo.textContent = `Modelo Vehículo: ${cita.Modelo_Vehiculo}`;

  const anoMatriculacion = document.createElement("p");
  anoMatriculacion.textContent = `Año de Matriculación: ${cita.Ano_Matriculacion}`;

  const telefono = document.createElement("p");
  telefono.textContent = `Teléfono: ${cita.Telefono}`;

  const correo = document.createElement("p");
  correo.textContent = `Correo Electrónico: ${cita.Correo_Electronico}`;

  const motivo = document.createElement("p");
  motivo.textContent = `Motivo: ${cita.Motivo}`;

  const fechaHora = document.createElement("p");
  fechaHora.textContent = `Fecha y Hora: ${cita.Fecha_Hora}`;

  const estado = document.createElement("p");
  estado.textContent = `Estado: ${cita.Estado}`;

  // Agregar los párrafos de información al contenedor de contenido
  contenidoCita.appendChild(nombreCompleto);
  contenidoCita.appendChild(modelo);
  contenidoCita.appendChild(anoMatriculacion);
  contenidoCita.appendChild(telefono);
  contenidoCita.appendChild(correo);
  contenidoCita.appendChild(motivo);
  contenidoCita.appendChild(fechaHora);
  contenidoCita.appendChild(estado);

  // Crear los botones de Cancelar y Modificar
  const botonesContainer = document.createElement("div");
  botonesContainer.classList.add("modal-citas-botones");
  const botonModificar = document.createElement("button");

  botonModificar.classList.add("modal-citas-boton");
  botonModificar.textContent = "Modificar";
  botonModificar.addEventListener("click", () => modificarCita(cita.Fecha_Hora, cita.ID_Cita));


  // Botón "Cita completada" solo si el estado es 'Pendiente'
  if (cita.Estado === 'Pendiente') {
    const botonCompletada = document.createElement("button");
    botonCompletada.classList.add("modal-citas-boton");
    botonCompletada.textContent = "Cita completada";
    botonCompletada.style.float = 'right';
    botonCompletada.addEventListener('click', () => {
      modalCompletarCita.style.display = 'block';
      citaACompletar = cita.ID_Cita;
      IDPersonaCitaACompletar = cita.ID_Usuario == null ? cita.ID_Cliente : cita.ID_Usuario;
      correoPersonaCitaACompletar = cita.Correo_Electronico;
    });
    // botonCompletada.addEventListener("click", () => marcarCitaCompletada(cita.ID_Cita));
    botonesContainer.appendChild(botonCompletada); // Añadir el botón "Cita completada"
    const botonCancelar = document.createElement("button");
    botonCancelar.classList.add("modal-citas-boton");
    botonCancelar.textContent = "Cancelar";
    botonCancelar.addEventListener("click", () => showCancelarCitaModal(cita.ID_Cita));



    // Agregar los botones al contenedor de botones
    botonesContainer.appendChild(botonModificar);
    botonesContainer.appendChild(botonCancelar);
  }
  // Botón "Cita pendiente" solo si el estado es 'Completada'
  else if (cita.Estado === 'Completada') {
    if (cita.Observaciones !== null) {
      const observaciones = document.createElement("p");
      observaciones.textContent = `Observaciones: ${cita.Observaciones}`;
      contenidoCita.appendChild(observaciones);
    }
    const botonPendiente = document.createElement("button");
    botonPendiente.classList.add("modal-citas-boton");
    botonPendiente.textContent = "Cita pendiente";
    botonPendiente.style.float = 'right';
    botonPendiente.addEventListener("click", () => marcarCitaPendiente(cita.ID_Cita));
    botonesContainer.appendChild(botonPendiente); // Añadir el botón "Cita pendiente"
    botonModificar.classList.add('disabledButton');
    botonModificar.disabled = true;

    botonesContainer.appendChild(botonModificar);
  }



  // Agregar el título, el contenido de la cita y los botones al cajón
  cajon.appendChild(tituloCajon);
  cajon.appendChild(contenidoCita);
  cajon.appendChild(botonesContainer);

  return cajon;
}

// Función para marcar una cita como completada
async function marcarCitaCompletada(citaId) {
  await cambiarEstadoCita(citaId);
  mostrarCitas(await obtenerCitas());
  filtrarCitas();
}

// Función para marcar una cita como pendiente
async function marcarCitaPendiente(citaId) {
  await cambiarEstadoCita(citaId);
  mostrarCitas(await obtenerCitas());
  filtrarCitas();
}



let idCitaAEliminar;
// Función para cancelar una cita (puedes modificar la lógica según lo necesites)
function showCancelarCitaModal(idCita) {
  modalCancelarCita.style.display = 'flex';
  idCitaAEliminar = idCita;
}

cancelarCitaButton.addEventListener('click', async function () {
  cancelarCita(idCitaAEliminar);
  modalCancelarCita.style.removeProperty('display');
  let citas = await obtenerCitas();
  mostrarCitas(citas);
  filtrarCitas();
});


mantenerCitaButton.addEventListener('click', function () {
  modalCancelarCita.style.display = 'none';
});

// Función para modificar una cita 
async function modificarCita(fechaHora, idCita) {
  chosenDate = fechaHora;
  [modificandoAño, modificandoMes, modificandoDia, modificandoHora] = fechaHora.split('-');
  const monthName = monthNames[parseInt(modificandoMes)];
  const modificandoDateString = `Fecha: ${modificandoDia} de ${monthName} de ${fechaHora.split('-')[0]} a las ${modificandoHora}h`;
  modificarFechaButton.textContent = modificandoDateString;
  formModal.style.zIndex = '13';
  // Hacer que el calendario se abra en el mes de la cita
  currentDate.setMonth(modificandoMes - 1);
  currentDate.setFullYear(modificandoAño);
  await updateCalendar();
  selectDate(modificandoDia);
  const slots = document.querySelectorAll('.time-slots button');
  for (let slot of slots) {
    if (slot.textContent == modificandoHora) {
      selectTime(slot, true);
    }
  }
  modificarFechaButton.parentElement.insertAdjacentElement('afterend', aceptarButton);
  citaElegida = idCita;
  [nombreInput, apellidosInput, telefonoInput, correoInput].forEach(input => {
    input.disabled = true;
    input.classList.add('disabled');
  });
}


async function openModificarFechaCalendar() {
  editingDate = true;
  await openCalendar();
  calendarModal.style.zIndex = '14';
  selectDate(modificandoDia);
}


async function aceptarModificandoFecha() {
  //COMPRUEBO QUE ESA CITA SIGA DISPONIBLE
  await obtenerFechasNoDisponibles();
  addCompleteDays(year.textContent, currentDate.getMonth());
  addNotAvailableDays(year.textContent, currentDate.getMonth());
  let twoPointsPos = chosenHour.textContent.indexOf(":");
  let hour = chosenHour.textContent.slice(0, twoPointsPos);
  let minute = chosenHour.textContent.slice(twoPointsPos + 1) === '00' ? parseInt('0') : '30';
  if (isTimeNotAvailable(selectedDate, hour, minute) || isTimeReserved(selectedDate, hour, minute)) {
    showAlert('La hora seleccionada ya no se encuentra disponible', 'negative');

    if (completeDays.includes(selectedDate) || notAvailableDays.includes(selectedDate)) {
      chosenDay.classList.remove('available');
      chosenDay.classList.remove('semi-complete-day');
      updateCalendar();
      chosenDay.classList.add('selected-not-available');
      selectDate(chosenDay.textContent);
      chosenDay.click();
      return;
    } else {
      selectDate(chosenDay.textContent);
      let selectedSlot = Array.from(document.querySelectorAll('.time-slots button')).find(element => element.textContent.trim() === chosenHour.textContent);
      selectedSlot.classList.remove('available');
      selectedSlot.classList.add('selected-not-available');
      selectedSlot.click();
      return;
    }

  }

  if (chosenDay && chosenHour) {

    // Convertir el número del mes en el nombre del mes
    let chosenMonthName = monthNames[chosenMonth] || 'mes inválido';

    // Crear la fecha elegida como un string
    const chosenDateString = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonthName} de ${chosenYear} a las ${chosenHour.textContent}h`;

    // Seleccionar el botón de elegir fecha usando la constante existente
    if (modificarFechaButton) {
      // Sustituir el textContent del botón con la fecha elegida
      modificarFechaButton.textContent = chosenDateString;
      closeCalendar();
      chosenDate = `${chosenYear}-${String(chosenMonth).padStart(2, '0')}-${String(chosenDay.textContent).padStart(2, '0')}-${String(chosenHour.textContent).padStart(4, '0')}`;
    }
  } else {
    showAlert('Por favor, selecciona una fecha y una hora antes de aceptar.', 'negative');
  }
}




// Filtrar citas por atributo y valor
function filtrarCitas() {
  const atributo = document.getElementById("filtro-atributo").value;
  const valorInput = document.getElementById("filtro-valor");
  const estadoSeleccionado = document.getElementById("filtro-estado").value;
  const mesSeleccionado = document.getElementById("filtro-mes").value;

  // Deshabilitar el input si no se selecciona un atributo válido
  if (!atributo) {
    valorInput.disabled = true;
    valorInput.value = ""; // Limpiar el valor del input
  } else {
    valorInput.disabled = false;
  }

  const valor = valorInput.value.toLowerCase();

  // Filtrar citas
  const citasFiltradas = citasOriginales.filter((cita) => {
    let cumpleFiltroPrincipal = true;
    let cumpleFiltroEstado = true;
    let cumpleFiltroMes = true;

    // Aplicar filtro principal
    if (atributo) {
      if (atributo === "NombreCompleto") {
        const nombreCompleto = `${cita.Nombre} ${cita.Apellidos}`.toLowerCase();
        cumpleFiltroPrincipal = nombreCompleto.includes(valor);
      } else {
        const campo = cita[atributo]?.toString().toLowerCase();
        cumpleFiltroPrincipal = campo && campo.includes(valor);
      }
    }

    // Aplicar filtro por estado
    if (estadoSeleccionado) {
      cumpleFiltroEstado = cita.Estado.toLowerCase() === estadoSeleccionado;
    }

    // Aplicar filtro por mes
    if (mesSeleccionado) {
      const mesCita = cita.Fecha_Hora.split("-")[1]; // El mes está en la posición 1 del formato YYYY-MM-DD-HH:MM
      cumpleFiltroMes = mesCita === mesSeleccionado;
    }

    // Solo incluir citas que cumplan todos los filtros
    return cumpleFiltroPrincipal && cumpleFiltroEstado && cumpleFiltroMes;
  });

  // Limpiar el contenido del modal
  limpiarListadoCitas();

  // Si no hay resultados y se han aplicado filtros, mostrar el mensaje
  if (citasFiltradas.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "modal-citas-no-resultados";
    mensaje.textContent = "No se han encontrado resultados.";
    modalCitasBody.appendChild(mensaje);
    // Actualizar el contador de resultados
    actualizarContadorResultados(0);
    return;
  }
  // Ordenar citas por ID_Cita de mayor a menor
  citasFiltradas.sort((a, b) => b.ID_Cita - a.ID_Cita);

  // Renderizar citas filtradas
  citasFiltradas.forEach((cita) => {
    modalCitasBody.appendChild(crearCajon(cita));
  });

  // Actualizar el contador de resultados
  actualizarContadorResultados(citasFiltradas.length);

  // Si no se han aplicado filtros, mostrar el número total de citas
  if (!atributo && !estadoSeleccionado && !mesSeleccionado && !valor) {
    actualizarContadorResultados(citasOriginales.length);
  }
}

// Función para actualizar el contador de resultados
function actualizarContadorResultados(cantidad) {
  const contador = document.getElementById("contador-citas");
  contador.textContent = `Mostrando ${cantidad} resultados`;
}








// Cerrar modal al hacer clic fuera del contenido
function closeModalOnOutsideClick(event) {
  const modalContent = document.querySelector(".modal-citas-content");
  if (!modalContent.contains(event.target)) {
    closeModal();
  }
}

function closeModal() {
  const modal = document.getElementById("modal-citas");
  modal.style.display = "none";
}

// Botón de recarga
const recargarCitasButton = document.getElementById("recargar-citas");

// Agregar un eventListener al botón para recargar el listado de citas
recargarCitasButton.addEventListener('click', recargarCitas);

async function recargarCitas() {
  // Obtener nuevamente las citas y mostrarlas
  mostrarCitas(await obtenerCitas());
  filtrarCitas();
}




// ALERT MESSAGES
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
  image.src = '../images/doctor.png';  // Ruta de la imagen
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



// Obtener usuarios y clientes

async function obtenerUsuarios() {
  try {
    const response = await fetch('/php/obtener_usuarios.php');
    const data = await response.json();

    if (data.status === 'success') {
      return data.data;
    } else {
      showAlert('Ha ocurrido un error al obtener los usuarios', 'negative');
    }
  } catch (error) {
    showAlert('Ha ocurrido un error al obtener los usuarios', 'negative');
  }
}

async function obtenerClientes() {
  try {
    const response = await fetch('/php/obtener_clientes.php');
    const data = await response.json();

    if (data.status === 'success') {
      return data.data;
    } else {
      showAlert('Ha ocurrido un error al obtener los clientes', 'negative');
    }
  } catch (error) {
    showAlert('Ha ocurrido un error al obtener los clientes', 'negative');
  }
}


// Variables para almacenar datos originales
let usuariosData = [];
let clientesData = [];

// Cargar datos al abrir el modal
async function cargarDatosUsuariosYClientes() {
  try {
    const usuarios = await obtenerUsuarios();
    const clientes = await obtenerClientes();

    // Guardamos los datos originales
    usuariosData = usuarios;
    clientesData = clientes;

    filtrarDatos();

    // Mostrar el modal
    abrirModalUsuarios();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function filtrarDatos() {
  const tipoFiltro = document.getElementById("filtro-tipo").value;
  const inputt = document.getElementById("filtro-usuarios-valor");
  const valorFiltro = inputt.value.toLowerCase();

  const modalGrid = document.querySelector(".modal-clientes-y-usuarios-grid");

  const mensajePrevio = document.querySelector(".modal-usuarios-no-resultados");
  if (mensajePrevio) mensajePrevio.remove();

  const usuariosFiltrados = usuariosData.filter(usuario => {
    let valorComparar;
    if (tipoFiltro === "Nombre") {
      valorComparar = `${usuario.Nombre} ${usuario.Apellidos}`.toLowerCase();
    } else if (tipoFiltro === "Verificado") {
      return usuario.Verificado == valorFiltro || valorFiltro === "";
    } else {
      valorComparar = usuario[tipoFiltro]?.toLowerCase();
    }
    return valorComparar?.startsWith(valorFiltro);
  });

  const clientesFiltrados = clientesData.filter(cliente => {
    let valorComparar;
    if (tipoFiltro === "Nombre") {
      valorComparar = `${cliente.Nombre} ${cliente.Apellidos}`.toLowerCase();
    } else if (tipoFiltro === "Verificado") {
      return cliente.Verificado == valorFiltro || valorFiltro === "";
    } else {
      valorComparar = cliente[tipoFiltro]?.toLowerCase();
    }
    return valorComparar?.startsWith(valorFiltro);
  });

  renderUsuarios(usuariosFiltrados);
  renderClientes(clientesFiltrados);

  // Actualizar texto de resultados
  document.getElementById("usuarios-resultados").textContent = `Mostrando ${usuariosFiltrados.length} resultados`;
  document.getElementById("clientes-resultados").textContent = `Mostrando ${clientesFiltrados.length} resultados`;

  if (usuariosFiltrados.length === 0 && clientesFiltrados.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "modal-usuarios-no-resultados";
    mensaje.textContent = "No se han encontrado resultados.";
    mensaje.style.gridColumn = "1 / span 3";
    modalGrid.appendChild(mensaje);
  }
}




function renderUsuarios(usuariosFiltrados) {
  const usuariosContainer = document.getElementById("usuarios-container");
  usuariosContainer.innerHTML = ""; // Limpiar resultados anteriores

  if (usuariosFiltrados.length === 0) {
    return; // Si no hay resultados, no hacemos nada aquí
  }

  usuariosFiltrados.forEach(usuario => {
    const usuarioCard = document.createElement("div");
    usuarioCard.className = "usuario-card";

    // Campo: Nombre
    const nombreCampo = document.createElement("div");
    nombreCampo.className = "usuario-campo";
    const nombreStrong = document.createElement("strong");
    nombreStrong.textContent = "Nombre:";
    const nombreP = document.createElement("p");
    nombreP.textContent = `${usuario.Nombre} ${usuario.Apellidos}`;
    nombreCampo.appendChild(nombreStrong);
    nombreCampo.appendChild(nombreP);

    // Campo: Teléfono
    const telefonoCampo = document.createElement("div");
    telefonoCampo.className = "usuario-campo";
    const telefonoStrong = document.createElement("strong");
    telefonoStrong.textContent = "Teléfono:";
    const telefonoP = document.createElement("p");
    telefonoP.textContent = usuario.Telefono;
    telefonoCampo.appendChild(telefonoStrong);
    telefonoCampo.appendChild(telefonoP);

    // Campo: Correo
    const correoCampo = document.createElement("div");
    correoCampo.className = "usuario-campo";
    const correoStrong = document.createElement("strong");
    correoStrong.textContent = "Correo:";
    const correoP = document.createElement("p");
    correoP.textContent = usuario.Correo_Electronico;
    correoCampo.appendChild(correoStrong);
    correoCampo.appendChild(correoP);

    // Campo: Verificado
    const verificadoCampo = document.createElement("div");
    verificadoCampo.className = "usuario-campo";
    const verificadoStrong = document.createElement("strong");
    verificadoStrong.textContent = "Verificado:";
    const verificadoP = document.createElement("p");
    verificadoP.textContent = usuario.Verificado === 1 ? "Sí" : "No";
    verificadoCampo.appendChild(verificadoStrong);
    verificadoCampo.appendChild(verificadoP);

    // Botón Modificar
    const modificarBoton = document.createElement("button");
    modificarBoton.className = "boton-cajon-usuarios";
    modificarBoton.textContent = "Modificar";
    modificarBoton.onclick = () => abrirModalModificarUsuario(usuario);

    // Botón Ascender/Descender
    const modificarRangoBoton = document.createElement("button");
    modificarRangoBoton.className = "boton-cajon-usuarios";
    modificarRangoBoton.style.float = "right";
    modificarRangoBoton.onclick = () => modificarRangoUsuario(usuario.ID_Usuario);

    if (usuario.Rol === 'cliente') {
      modificarRangoBoton.textContent = 'Ascender';
      modificarRangoBoton.id = "boton-ascender-usuario";

    } else if (usuario.Rol === 'admin') {
      modificarRangoBoton.textContent = 'Descender';
      modificarRangoBoton.id = "boton-descender-usuario";


    } else {
      showAlert('Ha ocurrido un error al mostrar los usuarios', 'negative')
      modalUsuarios.style.display = 'none'
    }


    // Añadir campos y botón al usuarioCard
    usuarioCard.appendChild(nombreCampo);
    usuarioCard.appendChild(telefonoCampo);
    usuarioCard.appendChild(correoCampo);
    usuarioCard.appendChild(verificadoCampo);
    usuarioCard.appendChild(modificarBoton);
    usuarioCard.appendChild(modificarRangoBoton);

    // Añadir la tarjeta al contenedor
    usuariosContainer.appendChild(usuarioCard);
  });
}


function renderClientes(clientesFiltrados) {
  const clientesContainer = document.getElementById("clientes-container");
  clientesContainer.innerHTML = ""; // Limpiar resultados anteriores

  if (clientesFiltrados.length === 0) {
    return; // Si no hay resultados, no hacemos nada aquí
  }

  clientesFiltrados.forEach(cliente => {
    const clienteCard = document.createElement("div");
    clienteCard.className = "cliente-card";

    // Campo: Nombre
    const nombreCampo = document.createElement("div");
    nombreCampo.className = "cliente-campo";
    const nombreStrong = document.createElement("strong");
    nombreStrong.textContent = "Nombre:";
    const nombreP = document.createElement("p");
    nombreP.textContent = `${cliente.Nombre} ${cliente.Apellidos}`;
    nombreCampo.appendChild(nombreStrong);
    nombreCampo.appendChild(nombreP);

    // Campo: Teléfono
    const telefonoCampo = document.createElement("div");
    telefonoCampo.className = "cliente-campo";
    const telefonoStrong = document.createElement("strong");
    telefonoStrong.textContent = "Teléfono:";
    const telefonoP = document.createElement("p");
    telefonoP.textContent = cliente.Telefono;
    telefonoCampo.appendChild(telefonoStrong);
    telefonoCampo.appendChild(telefonoP);

    // Campo: Correo
    const correoCampo = document.createElement("div");
    correoCampo.className = "cliente-campo";
    const correoStrong = document.createElement("strong");
    correoStrong.textContent = "Correo:";
    const correoP = document.createElement("p");
    correoP.textContent = cliente.Correo_Electronico;
    correoCampo.appendChild(correoStrong);
    correoCampo.appendChild(correoP);

    // Campo: Verificado
    const verificadoCampo = document.createElement("div");
    verificadoCampo.className = "cliente-campo";
    const verificadoStrong = document.createElement("strong");
    verificadoStrong.textContent = "Verificado:";
    const verificadoP = document.createElement("p");
    verificadoP.textContent = cliente.Verificado === 1 ? "Sí" : "No";
    verificadoCampo.appendChild(verificadoStrong);
    verificadoCampo.appendChild(verificadoP);

    // Añadir campos al clienteCard
    clienteCard.appendChild(nombreCampo);
    clienteCard.appendChild(telefonoCampo);
    clienteCard.appendChild(correoCampo);
    clienteCard.appendChild(verificadoCampo);

    // Añadir la tarjeta al contenedor
    clientesContainer.appendChild(clienteCard);
  });
}

function actualizarFiltro() {
  const filtroTipo = document.getElementById("filtro-tipo");
  const filtroValor = document.getElementById("filtro-usuarios-valor");
  const filtroContainer = filtroValor.parentElement; // Contenedor padre del input

  // Eliminar el elemento actual del filtro
  filtroContainer.removeChild(filtroValor);

  if (filtroTipo.value === "Verificado") {
    // Crear un nuevo select para "Sí" y "No"
    const selectVerificado = document.createElement("select");
    selectVerificado.id = "filtro-usuarios-valor";
    selectVerificado.className = "filtro-usuarios-valor";
    selectVerificado.onchange = filtrarDatos;

    // Opciones del select
    const opcionDefault = document.createElement("option");
    opcionDefault.value = "";
    opcionDefault.textContent = "Seleccionar";

    const opcionSi = document.createElement("option");
    opcionSi.value = "1";
    opcionSi.textContent = "Sí";

    const opcionNo = document.createElement("option");
    opcionNo.value = "0";
    opcionNo.textContent = "No";

    // Añadir las opciones al select
    selectVerificado.appendChild(opcionDefault);
    selectVerificado.appendChild(opcionSi);
    selectVerificado.appendChild(opcionNo);

    // Añadir el nuevo select al contenedor
    filtroContainer.appendChild(selectVerificado);
  } else {
    // Restaurar el input de texto para los demás filtros
    const inputTexto = document.createElement("input");
    inputTexto.type = "text";
    inputTexto.id = "filtro-usuarios-valor";
    inputTexto.className = "filtro-usuarios-valor";
    inputTexto.placeholder = "Escribe para filtrar...";
    inputTexto.oninput = filtrarDatos;

    // Añadir el input al contenedor
    filtroContainer.appendChild(inputTexto);
  }
}





// Evento para los filtros
document.getElementById("filtro-valor").addEventListener("input", filtrarDatos);
document.getElementById("filtro-valor").addEventListener("input", filtrarCitas);
document.getElementById("filtro-valor").addEventListener("input", recargarCitas);

document.getElementById("filtro-estado").addEventListener("change", filtrarDatos);
document.getElementById("filtro-estado").addEventListener("change", filtrarCitas);
document.getElementById("filtro-estado").addEventListener("change", recargarCitas);

document.getElementById("filtro-tipo").addEventListener("change", filtrarDatos);
document.getElementById("filtro-tipo").addEventListener("change", filtrarCitas);
document.getElementById("filtro-tipo").addEventListener("change", recargarCitas);

document.getElementById('filtro-mes').addEventListener('change', filtrarCitas);
document.getElementById('filtro-mes').addEventListener('change', filtrarDatos);
document.getElementById('filtro-mes').addEventListener('change', recargarCitas);






// Función para cerrar el modal
function cerrarModalUsuarios() {
  modalUsuarios.style.display = "none";
}

// Abrir el modal (puedes personalizar esta parte según cómo se abre tu modal)
function abrirModalUsuarios() {
  modalUsuarios.style.display = "flex";
}

// Cerrar el modal al hacer clic en "X"
cerrarModalUsuariosBtn.addEventListener("click", cerrarModalUsuarios);

// Cerrar el modal al hacer clic fuera del contenido
modalUsuarios.addEventListener("click", (e) => {
  if (e.target === modalUsuarios) {
    cerrarModalUsuarios();
  }
});



openUsersButton.addEventListener('click', cargarDatosUsuariosYClientes);

// MODAL MODIFICAR USUARIOS


// Obtener elementos del modal
const modalModificarUsuario = document.getElementById("modal-modificar-usuario");
const aceptarModificarUsuarioBtn = document.getElementById("boton-modificar-usuario-aceptar");
const cerrarModificarUsuarioBtn = document.getElementById("boton-modificar-usuario-cerrar");
let usuarioAModificar;

// Mostrar el modal con datos del usuario seleccionado
function abrirModalModificarUsuario(usuario) {
  // Mostrar el modal
  modalModificarUsuario.style.display = "flex";

  // Autorrellenar los campos con los datos del usuario
  document.getElementById("modificar-nombre").value = usuario.Nombre;
  document.getElementById("modificar-apellidos").value = usuario.Apellidos;
  document.getElementById("modificar-telefono").value = usuario.Telefono;
  document.getElementById("modificar-correo").value = usuario.Correo_Electronico;
  usuarioAModificar = usuario;
  aceptarModificarUsuarioBtn.addEventListener('click', modificarUsuario);
}

// Función para modificar el rol del usuario
function modificarRangoUsuario(idUsuario) {
  // Crear los datos que se enviarán en la solicitud
  const data = new FormData();
  data.append('id_usuario', idUsuario);

  // Realizar la solicitud AJAX
  fetch('modificar_rango_usuario.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showAlert('Rol del usuario actualizado correctamente.', 'positive');
        cargarDatosUsuariosYClientes();
      } else {
        showAlert('Error al modificar el rango del usuario', 'negative')
        console.error('Error: ' + data.message);
      }
    })
    .catch(error => {
      showAlert('Error al modificar el rango del usuario', 'negative')
      console.error(error);
    });
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
      id: usuarioAModificar.ID_Usuario,
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      correo: correo
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showAlert("Usuario modificado correctamente", "positive");
        cargarDatosUsuariosYClientes();
        modalModificarUsuario.style.display = "none";
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

//FACTURAS

// Función para obtener las facturas desde la API
async function obtenerFacturas() {
  try {
    const response = await fetch('/php/obtener_facturas.php');
    const data = await response.json();

    if (data.error) {
      console.error('Error al obtener las facturas:', data.error);
      return [];
    }

    console.log('Facturas obtenidas:', data.facturas);
    return data.facturas;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return [];
  }
}

// Elementos del DOM
const invoicesModal = document.getElementById('invoicesModal');
const closeInvoicesModal = document.getElementById('closeInvoicesModal');
const invoicesContainer = document.getElementById('invoicesContainer');

// Función para abrir el modal
function abrirModal() {
  invoicesModal.style.display = 'flex';
}

// Función para cerrar el modal
function cerrarModal() {
  invoicesModal.style.display = 'none';
}

// Función para renderizar las facturas en el modal
function renderizarFacturas(facturas) {
  invoicesContainer.innerHTML = ''; // Limpiar contenido previo

  // Ordenar las facturas por ID de mayor a menor
  const facturasOrdenadas = facturas.sort((a, b) => b.ID_Factura - a.ID_Factura);

  facturasOrdenadas.forEach(factura => {
    const facturaDiv = document.createElement('div');
    facturaDiv.className = 'invoice-box';

    // Función auxiliar para crear párrafos con strong
    const crearParrafo = (titulo, valor) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titulo;
      strong.style.display = 'block'; // Display block en los <strong>
      p.appendChild(strong);
      p.appendChild(document.createTextNode(valor));
      return p;
    };

    // Crear y agregar los elementos de la factura
    facturaDiv.appendChild(crearParrafo('ID Factura:', factura.ID_Factura));
    facturaDiv.appendChild(crearParrafo('Nombre Completo:', `${factura.Nombre} ${factura.Apellidos}`));
    facturaDiv.appendChild(crearParrafo('Correo:', factura.Correo_Electronico));
    facturaDiv.appendChild(crearParrafo('Teléfono:', factura.Telefono));
    facturaDiv.appendChild(crearParrafo('Fecha de Emisión:', factura.Fecha_Emision));
    facturaDiv.appendChild(crearParrafo('Monto Total:', factura.Monto_Total));

    // Crear el botón de descarga
    const botonDescarga = document.createElement('button');
    botonDescarga.className = 'descargar-btn';
    botonDescarga.textContent = 'Descargar Factura';

    // Añadir el evento al botón
    botonDescarga.addEventListener('click', () => {
      descargarFactura(factura.ID_Factura);
    });

    facturaDiv.appendChild(botonDescarga);

    // Agregar la factura al contenedor principal
    invoicesContainer.appendChild(facturaDiv);
  });
}




// Array para almacenar las facturas originales
let facturasOriginales = [];

// Función para filtrar facturas
function filtrarFacturas() {
  const atributo = document.getElementById("filtro-facturas-atributo").value;
  const valorInput = document.getElementById("filtro-facturas-valor");
  const valor = valorInput.value.toLowerCase();

  // Filtrar facturas
  const facturasFiltradas = facturasOriginales.filter((factura) => {
    if (!atributo) return true; // Si no hay atributo, mostrar todas

    const campo = factura[atributo]?.toString().toLowerCase();
    return campo && campo.includes(valor);
  });

  // Limpiar el listado actual y mostrar las facturas filtradas
  renderizarFacturas(facturasFiltradas);

  // Actualizar el contador independiente de facturas
  actualizarContadorFacturas(facturasFiltradas.length);

}

const contador = document.getElementById("contador-facturas");

// Función para actualizar el contador de resultados
function actualizarContadorFacturas(cantidad) {
  const mensaje = document.createElement("p");
  if (cantidad === 0) {
    mensaje.className = "modal-facturas-no-resultados";
    mensaje.textContent = "No se han encontrado resultados.";
    contador.insertAdjacentElement('afterend', mensaje);
  } else {
    if (document.querySelector('.modal-facturas-no-resultados')) {
      document.querySelector('.modal-facturas-no-resultados').remove();
    }
  }
  contador.textContent = `Mostrando ${cantidad} resultados`;
}

// Modificar la función de renderizado para guardar las facturas originales
async function cargarFacturas() {
  facturasOriginales = await obtenerFacturas();
  renderizarFacturas(facturasOriginales);
  actualizarContadorFacturas(facturasOriginales.length);
}

comprobarSelectFacturas();
// Evento para habilitar/deshabilitar el input según el valor del select
document.getElementById("filtro-facturas-atributo").addEventListener("change", comprobarSelectFacturas);

function comprobarSelectFacturas() {
  const atributo = document.getElementById("filtro-facturas-atributo").value;
  const valorInput = document.getElementById("filtro-facturas-valor");

  // Deshabilitar el input si el select está en "Seleccionar..."
  valorInput.disabled = atributo === "";
  if (valorInput.disabled) valorInput.value = "";
}

// Evento para filtrar al escribir en el input
document.getElementById("filtro-facturas-valor").addEventListener("input", filtrarFacturas);

// Cargar facturas al abrir el modal
openInvoicesButton.addEventListener('click', async () => {
  await cargarFacturas();
  abrirModal();
});

// Evento para cerrar el modal
closeInvoicesModal.addEventListener('click', cerrarModal);

// Cerrar el modal al hacer clic fuera de la caja de contenido
invoicesModal.addEventListener('click', (event) => {
  if (event.target === invoicesModal) {
    cerrarModal();
  }
});


function descargarFactura(idFactura) {
  const formData = new FormData();
  formData.append('id', idFactura);

  fetch('/php/descargar_factura.php', {
    method: 'POST',
    body: formData,
  })
    .then(async response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Error desconocido en el servidor');
        });
      }
      return response.blob();
    })
    .then(blob => {
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío. Verifica el contenido en el servidor.');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Factura_${idFactura}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      showAlert(`No se pudo descargar la factura: ${error.message}`);
    });
}






