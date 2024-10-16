//ESTO FUNCIONA PERO NO ES CALENDARIO REAL, LE FALTAN COSAS
// Variables globales
const diasLaborales = [1, 2, 3, 4, 5]; // Lunes a Viernes
const horarioApertura = [
    { dia: 1, horas: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] }, // Lunes
    { dia: 2, horas: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] }, // Martes
    { dia: 3, horas: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] }, // Miércoles
    { dia: 4, horas: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] }, // Jueves
    { dia: 5, horas: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] }  // Viernes
];

document.getElementById('abrir-calendario-button').addEventListener('click', function () {
    abrirModalCalendario();
});

document.querySelector('.close').addEventListener('click', function () {
    cerrarModalCalendario();
});

function abrirModalCalendario() {
    document.getElementById('calendarModal').style.display = 'block';
    generarCalendario(); // Generar el calendario al abrir
}

function cerrarModalCalendario() {
    document.getElementById('calendarModal').style.display = 'none';
}

function generarCalendario() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Limpiar el calendario previo

    const fechaActual = new Date();
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    for (let dia = primerDiaDelMes.getDate(); dia <= ultimoDiaDelMes.getDate(); dia++) {
        const diaFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia);
        const diaNumero = diaFecha.getDay();

        const diaBoton = document.createElement('button');
        diaBoton.textContent = dia;
        diaBoton.className = 'day'; // Clase para el día
        diaBoton.type = 'button'; // Establecer el tipo del botón

        // Solo mostrar botones de lunes a viernes
        if (diasLaborales.includes(diaNumero)) {
            // Aquí puedes agregar lógica para verificar si hay citas disponibles
            const hayCitasDisponibles = true; // Cambia esto según la lógica que necesites
            if (hayCitasDisponibles) {
                diaBoton.classList.add('available'); // Clase si hay citas disponibles
            } else {
                diaBoton.classList.add('not-available'); // Clase si no hay citas disponibles
            }

            diaBoton.addEventListener('click', function () {
                seleccionarFecha(diaFecha);
            });
            calendar.appendChild(diaBoton);
        }
    }
}

function seleccionarFecha(fecha) {
    document.getElementById('timeSelection').classList.remove('hidden');
    mostrarHorasDisponibles(fecha);
}

function mostrarHorasDisponibles(fecha) {
    const availableTimes = document.getElementById('availableTimes');
    availableTimes.innerHTML = ''; // Limpiar horas previas

    const diaSemana = fecha.getDay();
    const horasDisponibles = horarioApertura.find(hora => hora.dia === diaSemana).horas;

    horasDisponibles.forEach(hora => {
        const horaBoton = document.createElement('button');
        horaBoton.textContent = hora;
        horaBoton.className = 'hora-boton';
        horaBoton.type = 'button'; // Establecer el tipo del botón

        // Aquí puedes añadir lógica para marcar horas ocupadas
        const horaDisponible = true; // Cambia esto según la lógica que necesites
        if (horaDisponible) {
            horaBoton.classList.add('available'); // Clase si la hora está disponible
        } else {
            horaBoton.classList.add('not-available'); // Clase si la hora no está disponible
        }

        horaBoton.addEventListener('click', function () {
            // Cambiar el color del botón al seleccionar la hora
            horaBoton.style.backgroundColor = '#3362a4';

            // Lógica al seleccionar la hora
            alert(`Has seleccionado el ${fecha.toLocaleDateString()} a las ${hora}`);
        });
        availableTimes.appendChild(horaBoton);
    });
}