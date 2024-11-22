
// VARIABLES CALENDARIO
const yearElement = document.getElementById('year');
const monthElement = document.getElementById('month');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('citas');
const openInvoicesButton = document.getElementById('facturas')
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
const closeFormModal = document.getElementById("cerrar-modal-formulario");
closeCalendarModal.addEventListener('click', function () {
  formModal.style.display = 'none';
})

const nombreInput = document.getElementById('nombre');
const apellidosInput = document.getElementById('apellidos');
const telefonoInput = document.getElementById('telefono');
const correoInput = document.getElementById('correo');
const modeloInput = document.getElementById('marca');
const anioInput = document.getElementById('anio');
const problemaInput = document.getElementById('problema');

const contenedorProblema = document.getElementById('contenedor-problema');
const aceptarButton = document.createElement('button');
aceptarButton.type = 'submit';
aceptarButton.id = 'aceptar';
aceptarButton.textContent = 'Aceptar';

const inputsForm = document.querySelectorAll('input');

const userTextSpan = document.querySelector('#user-text');



//CALENDARIO PEDIR CITA
const fechaActual = new Date();
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

const selectDate = (day) => {
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

  if (!isNotAvailable(day) && !isComplete(day)) {
    // Añadir la clase "selected" al día clicado
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




async function selectTime(slot) {
  const slots = document.querySelectorAll('.time-slots button');
  if (document.querySelector('#horaNoDisponibleAlerta')) {
    hourNotAvailableWarning.remove();
  }
  for (let s of slots) {
    s.classList.remove('selected');
    s.classList.remove('selected-not-available');
  }
  if (slot.classList.contains('available')) {
    slot.classList.add('selected');
    chosenHour = slot;
    formModal.style.display = 'flex';
    contenedorProblema.appendChild(aceptarButton);
    for (let inputForm of inputsForm) {
      inputForm.value = '';
    }
    problemaInput.value = '';
  }
  else if (slot.classList.contains('reserved')) {
    const datosCita = await obtenerDatosCita(selectedDate+'-'+slot.textContent);
    formModal.style.display = 'flex';
    nombreInput.value = datosCita.Nombre;
    apellidosInput.value = datosCita.Apellidos;
    telefonoInput.value = datosCita.Telefono;
    correoInput.value = datosCita.Correo_Electronico;
    modeloInput.value = datosCita.Modelo_Vehiculo;
    anioInput.value = datosCita.Ano_Matriculacion;
    problemaInput.value = datosCita.Motivo;
    
    if (document.getElementById('aceptar')) {
      aceptarButton.remove();
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
openCalendarButton.addEventListener('click', () => {
  calendarModal.style.display = 'flex';
  updateCalendar();
});

closeCalendarModal.addEventListener('click', () => {
  calendarModal.style.display = 'none';
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    calendarModal.style.display = 'none';
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

aceptarButton.addEventListener('click', async () => {
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
    let chosenMonthName = monthNames[chosenMonth] || 'mes inválido';

    // Crear la fecha elegida como un string
    const chosenDateString = `Fecha elegida: ${chosenDay.textContent} de ${chosenMonthName} de ${chosenYear} a las ${chosenHour.textContent}h`;

    // Seleccionar el botón de elegir fecha usando la constante existente
    if (openCalendarButton) {
      // Sustituir el textContent del botón con la fecha elegida
      openCalendarButton.textContent = chosenDateString;
      pedirCitaButton.type = 'submit';
      pedirCitaButton.onclick = null;
      pedirCitaButton.style.backgroundColor = '#4CAF50';
      pedirCitaButton.style.cursor = 'pointer';
      openCalendarButton.style.width = 'auto';
      // ---------------------
      if (!eventListenerAñadido) {
        pedirCitaForm.addEventListener("submit", async function (event) {
          event.preventDefault();  // Detiene el envío del formulario

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
            const fechaHora = chosenDate; // Este valor debe ser el valor de la fecha seleccionada

            // Crear el objeto JSON con los datos
            const datosCita = {
              nombre: nombre,
              apellidos: apellidos,
              telefono: telefono,
              correo: correo,
              marca: marca,
              anio: anio,
              problema: problema,
              fechaHora: fechaHora,
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
              showAlert(data.message, 'positive');
            } else if (data.status === 'not-verified-user' || data.status === 'not-verified-client') {
              verificationModal.style.display = 'flex';
              correoFormulario = data.correo;
              if (data.status === 'not-verified-user') {
                nonVerifiedType = 'user';
              } else {
                nonVerifiedType = 'client'
              }
            } else {
              showAlert(data.message, 'negative');
            }
          }
          eventListenerAñadido = true;
        });
      }


      // Ocultar el modal del calendario
      calendarModal.style.display = 'none';
    }
  } else {
    showAlert('Por favor, selecciona una fecha y una hora antes de aceptar.', 'negative');
  }
});












openInvoicesButton.addEventListener('click', async function () {
  await obtenerCitas();
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
          console.error(data.error);
          alert(`Error: ${data.error}`);
      } else {
          // Devolver los datos obtenidos
          return data;
      }
  } catch (error) {
      console.error('Error al obtener los datos de la cita:', error);
      alert('Ocurrió un error al obtener los datos.');
  }
}


async function obtenerCitas() {
  try {
      const response = await fetch('/php/obtener_citas.php', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const data = await response.json();

      if (data.error) {
          console.error(data.error);
          alert(`Error: ${data.error}`);
      } else if (data.citas) {
          console.log('Citas obtenidas:', data.citas);

          data.citas.forEach(cita => {
              console.log(`Cita ID: ${cita.ID_Cita}`);
              console.log(`Modelo: ${cita.Modelo_Vehiculo}`);
              console.log(`Año: ${cita.Ano_Matriculacion}`);
              console.log(`Fecha y hora: ${cita.Fecha_Hora}`);
              console.log(`Motivo: ${cita.Motivo}`);
              console.log(`Estado: ${cita.Estado}`);
              console.log(`Nombre: ${cita.Nombre}`);
              console.log(`Apellidos: ${cita.Apellidos}`);
              console.log(`Teléfono: ${cita.Telefono}`);
              console.log(`Correo: ${cita.Correo_Electronico}`);
          });
      }
  } catch (error) {
      console.error('Error al obtener las citas:', error);
      alert('Ocurrió un error al obtener las citas.');
  }
}

// Llamar a la función para obtener las citas

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
