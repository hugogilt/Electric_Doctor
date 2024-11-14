// if (window.location.protocol !== "https:") {
//   window.location.href = "https://electric-doctor.infinityfreeapp.com" + window.location.pathname + window.location.search;
// }

function positionUserMenu() {
  // Obtener las coordenadas de la imagen (userTextSpan)
  const rect = userTextSpan.getBoundingClientRect();

  // Posicionar el menú a la derecha de la imagen
  userMenu.style.left = `${rect.left}px`;
  userMenu.style.top = `${rect.bottom + window.scrollY + 10}px`; // Lo coloca justo debajo de la imagen
}


function logOut() {
  // Realizar la petición para cerrar sesión
  fetch('/php/logout.php', {
    method: 'GET'
  })
    .then(response => {
      if (response.ok) {
        console.log("Sesión cerrada correctamente");
        // Redirigir a la página de login o página principal
        return true;
      } else {
        console.log("Error al cerrar sesión");
      }
    })
    .catch(error => console.error("Error:", error));

}

function cerrarSesion() {
  logOut();
  if (userTextSpan.lastChild.nodeType === Node.TEXT_NODE) {
    userTextSpan.removeChild(userTextSpan.lastChild);
  }
  userMenu.style.display = 'none';
  modalCerrarSesion.style.display = 'none';

}


async function check_user_logged() {
  try {
    const response = await fetch('/php/check_session.php', {
      method: 'GET'
    });
    const data = await response.json();

    if (data.status === 'logged_in') {
      console.log('El usuario está logueado');
      if (userTextSpan.lastChild.nodeType !== Node.TEXT_NODE) {
        userTextSpan.appendChild(document.createTextNode(`Nos alegra verte de nuevo, ${data.nombre}`));
      }
      return true;
    } else {
      console.log('El usuario no está logueado');
      return false;
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    return false; // Opcional, puedes decidir cómo manejar los errores aquí
  }
}

check_user_logged();



// VARIABLES CALENDARIO
const yearElement = document.getElementById('year');
const monthElement = document.getElementById('month');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('abrir-calendario-button');
const calendarModal = document.getElementById('calendarModal');
const closeCalendarModal = document.getElementById('closeCalendarModal');
const aceptarButton = document.createElement('button');
aceptarButton.setAttribute('type', 'button');
const pedirCitaButton = document.querySelector('#pedir-cita-button');
pedirCitaButton.onclick = function () {
  openCalendarButton.classList.add("saltando");

  // Remover la clase después de la animación
  setTimeout(() => {
    openCalendarButton.classList.remove("saltando");
  }, 100); // Debe coincidir con la duración de la transición
};
let ejecutado = false;
const reviewsScript = document.querySelector('#reviews-script');
const reviewsContainer = document.querySelector('#reviews-container');
const correoErrorMessageLogin = document.querySelector('#correo-error-message-login');
const passwordErrorMessageLogin = document.querySelector('#password-error-message-login');
const passwordErrorMessageRegister = document.querySelector('#password-error-message-register');
const confirmPasswordErrorMessageRegister = document.querySelector('#confirm-password-error-message-register');
const userTextSpan = document.querySelector('#user-text');
const userMenu = document.querySelector('#user-menu');
const logoutButton = document.querySelector('#logout');
const modalCerrarSesion = document.querySelector('#modal-cierre-sesion');
// Array global para almacenar los slots no disponibles
let nonAvailableSlots = [];
let reservedSlots = [];
let selectedDate;

const nav = document.querySelector('nav');
document.getElementById('hamburger').addEventListener('click', function () {
  nav.classList.toggle('active'); // Alternar la clase 'active' para mostrar/ocultar el menú
  const header = document.querySelector('header');
  if (nav.classList.contains('active')) {
    header.style.height = 'auto';
  } else {
    header.style.removeProperty('height');
  }

});

window.onresize = function () {
  if (window.innerWidth > 800)
    nav.classList.remove('active')
}


// MODAL LOGIN / REGISTER

function openLoginForm() {
  loginSection.style.display = "flex";
  registerSection.style.display = "none";
  registerForm.reset();
}

function openRegisterForm() {
  loginSection.style.display = "none";
  registerSection.style.display = "block";
  document.getElementById("loginForm").reset();
}

const userButton = document.getElementById("user-text");
const authModal = document.getElementById("authModal");
const closeBtn = document.querySelector(".modal-close");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

document.querySelectorAll('.password-container').forEach(container => {
  const passwordField = container.querySelector('input[type="password"]');
  const togglePassword = container.querySelector('.togglePassword');
  togglePassword.addEventListener('click', function () {
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Cambiar el ícono de Font Awesome
    const icon = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    togglePassword.classList = icon;
  });
});




// Abrir modal al hacer clic en el botón de usuario
userButton.addEventListener("click", async (e) => {
  const isLoggedIn = await check_user_logged();

  if (!isLoggedIn) {
    authModal.style.display = "flex";
    loginSection.style.display = "flex";
    registerSection.style.display = "none";
    loginForm.reset();
    correoErrorMessageLogin.textContent = '';
    passwordErrorMessageLogin.textContent = '';
  } else {
    e.stopPropagation(e); // Evitar que el clic en el menú cierre el menú
    positionUserMenu();
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block'; // Alternar el menú
    document.addEventListener('click', (e) => {
      if (!userTextSpan.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = 'none';
        window.removeEventListener('resize', () => {
          if (userMenu.style.display === 'block') {
            positionUserMenu();
          }
        }); //Elimina el event listener cuando no se muestra el menú
      }
    });
    window.addEventListener('resize', () => {
      if (userMenu.style.display === 'block') {
        positionUserMenu();
      }
    });
    // Muestra el modal al hacer clic en el botón de cerrar sesión
    logoutButton.addEventListener('click', () => {
      modalCerrarSesion.style.display = 'flex';
      userMenu.style.display = 'none';

    });

    // Cierra el modal si el usuario decide cancelar
    document.querySelector('#cancelar-cierre-sesion').addEventListener('click', () => {
      modalCerrarSesion.style.display = 'none';
    });

    // Llama a la función de cerrar sesión (aquí añades tu lógica de cerrar sesión)
    document.querySelector('#confirmar-cierre-sesion').addEventListener('click', () => {
      cerrarSesion();
      // Por ejemplo, puedes redirigir al usuario a una página de logout o eliminar la sesión
    });
  }
});

// Cerrar authMal hacer clic en la 'X' o fuera del contenido
closeBtn.addEventListener("click", () => {
  authModal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target == authModal) {
    authModal.style.display = "none";
  }
});

// Cambiar a formulario de registro
toRegister.addEventListener("click", (e) => {
  e.preventDefault();
  openRegisterForm();
  correoErrorMessageLogin.textContent = '';
  passwordErrorMessageLogin.textContent = '';
  passwordErrorMessageRegister.textContent = '';
  confirmPasswordErrorMessageRegister.textContent = '';
  registerForm.reset();
});


// Cambiar a formulario de inicio de sesión
toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  openLoginForm();
  correoErrorMessageLogin.textContent = '';
  passwordErrorMessageLogin.textContent = '';
  passwordErrorMessageRegister.textContent = '';
  confirmPasswordErrorMessageRegister.textContent = '';
});




const registerForm = document.getElementById("registerForm");
//DataBase Connection Register
registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el envío del formulario tradicional
  passwordErrorMessageRegister.textContent = '';
  confirmPasswordErrorMessageRegister.textContent = '';
  // Obtener los valores del formulario
  const nombre = document.getElementById("registerName").value;
  const apellidos = document.getElementById("registerSurname").value;
  const correo = document.getElementById("registerEmail").value;
  const telefono = document.getElementById("registerPhone").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    confirmPasswordErrorMessageRegister.textContent = 'Las contraseñas no coinciden.'
    if (password.length < 8) {
      passwordErrorMessageRegister.textContent = 'La contraseña debe tener al menos 8 carácteres'
    }
    return;
  }

  // Crear un objeto con los datos del formulario
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('apellidos', apellidos);
  formData.append('correo', correo);
  formData.append('telefono', telefono);
  formData.append('password', password);
  formData.append('confirmPassword', confirmPassword);

  // Usar fetch() para enviar el formulario al servidor sin recargar la página
  fetch('/php/procesar_registro.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())  // Esperar la respuesta en formato JSON
    .then(data => {
      // Verificar si la respuesta es exitosa
      if (data.status === 'success') {
        alert(data.message);  // Mostrar mensaje de éxito
        document.getElementById("registerForm").reset(); // Limpiar el formulario
        openLoginForm();
      } else {
        alert(data.message);  // Mostrar mensaje de error
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Ocurrió un error en el registro. Intenta nuevamente.');
    });
});

const loginForm = document.getElementById("loginForm");
//DataBase Connection Login
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const correo = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  correoErrorMessageLogin.textContent = '';
  passwordErrorMessageLogin.textContent = '';
  passwordErrorMessageRegister.textContent = '';
  confirmPasswordErrorMessageRegister.textContent = '';

  const formData = new FormData();
  formData.append('correo', correo);
  formData.append('password', password);

  fetch('/php/procesar_login.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        authModal.style.display = 'none';
        userTextSpan.appendChild(document.createTextNode(`Nos alegra verte de nuevo, ${data.nombre}`));
      } else {
        if (data.message === 'Contraseña incorrecta') {
          passwordErrorMessageLogin.textContent = 'Contraseña incorrecta'
        } else if (data.message === 'Correo electrónico no encontrado') {
          correoErrorMessageLogin.textContent = 'Correo electrónico no registrado'
        } else {
          alert(data.message);
        }
      }
    })
    .catch(error => {
      console.error('Error en el inicio de sesión:', error);
      alert('Ocurrió un error en el inicio de sesión.');
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


// SI TODOS LOS SLOTS SON NOT AVAILABLE
let notAvailableDays = [];

//SI NO HAY NINGUN SLOT AVAILABLE, Y HAY AL MENOS UNO RESERVED
let completeDays = [];
function isDayComplete(date) {
  return allSlots.every(time => reservedSlots.includes(`${date}-${time}`));
}

// SI HAY ALGUN SLOT AVAILABLE Y ALGUNO RESERVED
let semiCompleteDays = [];


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

    // Si el día tiene al menos una hora reservada, lo agregamos a completeDays
    // if (isDayPartiallyBooked(formattedDate) && !completeDays.includes(formattedDate)) {
    //   completeDays.push(formattedDate);
    // }
    if (isDayComplete(formattedDate)) {
      completeDays.push(formattedDate);
    }

    // // Si el día tiene todos los slots ocupados, lo agregamos a nonAvailableDays
    // if (isDayFullyBooked(formattedDate) && !notAvailableDays.includes(formattedDate)) {
    //   notAvailableDays.push(formattedDate);
    // }
  }
}


// // Función para verificar si todos los slots de un día están ocupados
// function isDayFullyBooked(date) {
//   // Filtra los slots que coinciden con el día específico
//   const daySlots = [...reservedSlots, ...nonAvailableSlots].filter(slot => slot.startsWith(date));
//   // Verifica que todos los slots de ese día estén ocupados
//   return allSlots.every(time => daySlots.includes(`${date}-${time}`));
// };

// // Función para verificar si todos los slots de un día están ocupados
// function isDayFullyBooked(date) {
//   const daySlots = allUnavailableSlots.filter(slot => slot.startsWith(date));
//   return allSlots.every(time => daySlots.includes(`${date}-${time}`));
// };

// // Función para verificar si al menos una hora está reservada en el día
// function isDayPartiallyBooked(date) {
//   const daySlots = reservedSlots.filter(slot => slot.startsWith(date));
//   return daySlots.length > 0;
// };


// // Combinar los arrays reservedSlots y nonAvailableSlots
// const allUnavailableSlots = [...reservedSlots, ...nonAvailableSlots];











// // Función para actualizar días completos y no disponibles
// const updateUnavailableAndCompleteDays = (year, month) => {
//   addPastDaysToNotAvailable(year, month);

//   for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
//     const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//     const daySlots = reservedSlots.filter(slot => slot.startsWith(date));

//     if (daySlots.length > 0) {
//       if (!completeDays.includes(date)) {
//         completeDays.push(date);
//       }
//     } else if (isDayFullyBooked(date) && !notAvailableDays.includes(date)) {
//       notAvailableDays.push(date);
//     }
//   }
// };





// function verificarDiasConSlotsCompletos() {
//   debugger;
//   const morningSlots = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
//   const afternoonSlots = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
//   const allSlots = [...morningSlots, ...afternoonSlots];

//   const allUnavailableSlots = [...reservedSlots, ...nonAvailableSlots];
//   const daysWithAllSlotsBooked = {};

//   allUnavailableSlots.forEach(slot => {
//     const [date, time] = slot.split('-');
//     if (!daysWithAllSlotsBooked[date]) {
//       daysWithAllSlotsBooked[date] = new Set();
//     }
//     daysWithAllSlotsBooked[date].add(time);
//   });

//   const fullyBookedDays = [];

//   for (const [date, times] of Object.entries(daysWithAllSlotsBooked)) {
//     if (allSlots.every(time => times.has(time))) {
//       fullyBookedDays.push(date);
//     }
//   }

//   return fullyBookedDays;
// }

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
  if (document.querySelector('#aceptar')) aceptarButton.remove();

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
  completeDays = [];
  addCompleteDays(year, month);
  addCompleteDayClass(year, month, completeDays); 
};




function isNotAvailable(day) {
  // Crear una fecha en formato 'YYYY-MM-DD'
  const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return notAvailableDays.includes(dateToCheck);
};

const selectDate = (day) => {
  desactivarHorasAnteriores();
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

  if (!isNotAvailable(day)) {
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
      console.error(data.error);
    } else {
      reservedSlots = data; // Almacena las fechas obtenidas en el array global
    }
  } catch (error) {
    console.error('Error al obtener las fechas no disponibles:', error);
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
  if (document.querySelector('#aceptar')) {
    aceptarButton.remove();
  }
}




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

closeCalendarModal.addEventListener('click', () => {
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

aceptarButton.addEventListener('click', async () => {
  await obtenerFechasNoDisponibles();
  let twoPointsPos = chosenHour.textContent.indexOf(":");
  let hour = chosenHour.textContent.slice(0, twoPointsPos);
  let minute = chosenHour.textContent.slice(twoPointsPos + 1) === '00' ? parseInt('0') : '30';
  if (isTimeNotAvailable(selectedDate, hour, minute) || isTimeReserved(selectedDate, hour, minute)) {
    alert('Esta hora ya no se encuentra disponible');
    selectDate(chosenDay.textContent);
    let selectedSlot = Array.from(document.querySelectorAll('.time-slots button')).find(element => element.textContent.trim() === chosenHour.textContent);
    selectedSlot.classList.remove('available')
    selectedSlot.classList.add('selected-not-available')
    selectedSlot.click();
    return;
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
      pedirCitaButton.style.backgroundColor = '#4CAF50';
      pedirCitaButton.style.cursor = 'pointer';
      openCalendarButton.style.width = 'auto';
      pedirCitaButton.onclick = function () {
        let chosenDate = `${chosenYear}-${String(chosenMonth).padStart(2, '0')}-${String(chosenDay.textContent).padStart(2, '0')}-${String(chosenHour.textContent).padStart(4, '0')}`;


        // Función para enviar la fecha y hora al servidor

        fetch('/php/insertar_fecha_elegida.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fechaHora: chosenDate }) // Enviamos la fecha y hora como un objeto JSON
        })
          .then(response => response.json()) // Recibimos la respuesta del servidor
          .then(data => {
            if (data.success) {
              // Si la inserción fue exitosa
              alert(data.message);
            } else {
              // Si hubo un error
              alert(data.message);
            }
          })
          .catch(error => console.error('Error al enviar la fecha y hora:', error));



      }


      // Ocultar el modal del calendario
      calendarModal.style.display = 'none';
    }
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
        // Eliminar publicidad del plugin
        if (node.nodeType === 1 && isTargetLink(node)) {  // Solo elementos <a> con los atributos deseados
          // Comprobar si el hermano anterior es un <script> con el tipo específico
          if (node.previousElementSibling &&
            node.previousElementSibling.nodeName === 'SCRIPT' &&
            node.previousElementSibling.getAttribute('type') === 'application/ld+json') {
            removeInlineStyles(node);  // Eliminar los estilos inline
            node.querySelectorAll('*').forEach(removeInlineStyles);  // Eliminar estilos inline de los descendientes
          }
        }
        // Comprobar si es el div que contiene el span con "Review us on Google" y cambiarlo.
        if (node.nodeType === 1 && node.classList.contains('HeaderWriteReviewButton__Component-sc-a5mrro-0')) {
          node.children[0].children[0].textContent = 'Déjanos tu reseña';
        }
        adecuarReseñasATamaño();
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


function adecuarReseñasATamaño() {
  if (window.innerWidth < 600) {
    if (!ejecutado) {
      //Guarda el primer elemento de las reviews:
      let targetFirstReview = document.querySelector('.HeaderContainer__Inner-sc-1532ffp-0') ? document.querySelector('.HeaderContainer__Inner-sc-1532ffp-0') : null;
      //Guarda la tercera review:
      let targetReviews = document.querySelectorAll('.Balloon__StyledAuthorBlock-sc-1d6y62j-1') ? document.querySelectorAll('.Balloon__StyledAuthorBlock-sc-1d6y62j-1') : null;
      let targetThirdReview = targetReviews[2];
      //Guarda la última reseña:
      let targetLastReview = targetReviews[9];
      // Si existe la primera reseña, la tercera y la útlima, y le ha añadido cierta clase al contenedor (es lo que hace justo antes de
      // mover las reseñas de sitio), cambia el alto del contenedor)
      if (targetFirstReview && targetThirdReview && targetLastReview && reviewsContainer.classList.contains('eapps-widget-show-toolbar')) {
        setTimeout(() => {
          // Calcula la posición superior del primer elemento y la inferior del último
          const startPosition = targetFirstReview.getBoundingClientRect().top + window.scrollY;
          const endPosition = targetThirdReview.getBoundingClientRect().bottom + window.scrollY;

          // Calcula la altura que debe tener el contenedor
          const calculatedHeight = endPosition - startPosition;

          // Aplica la altura calculada al contenedor
          reviewsContainer.style.height = `${calculatedHeight + 20}px`;
          ejecutado = true;
        }, 1000);
        // Hay que ejecutar el código con un poco de retraso ya que incluso después de cargar
        // la última reseña hay un js que las cambia de sitio y esto ha de ejecutarse después
      }
    }

  } else if (ejecutado) {
    reviewsContainer.style.removeProperty('height');
    ejecutado = false;
  }
}


// Iniciar la observación del DOM
observeAllElementsForStyles();
window.onresize = adecuarReseñasATamaño;

