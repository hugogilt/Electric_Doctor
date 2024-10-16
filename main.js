const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const timeSlotsElement = document.getElementById('timeSlots');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const openCalendarButton = document.getElementById('abrir-calendario-button');
const calendarModal = document.getElementById('calendarModal');
const closeModal = document.getElementById('closeModal');

let currentDate = new Date();

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

const isAvailable = (day) => {
    // Crear una fecha en formato 'YYYY-MM-DD'
    const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availableDays.includes(dateToCheck);
};

const selectDate = (day) => {
    const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    timeSlotsElement.innerHTML = ''; // Limpiar slots anteriores
    updateTimeSlots(selectedDate); // Actualizar los slots de tiempo
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
    let dayNotAvailableWarning;
    if (document.querySelector('#diaNoDisponibleAlerta')) {
        dayNotAvailableWarning = document.querySelector('#diaNoDisponibleAlerta');
    } 

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
        debugger;
        dayNotAvailableWarning.classList.remove('transition');
        dayNotAvailableWarning.style.color = 'white';
        setTimeout(() => {dayNotAvailableWarning.className = 'transition'}, 1);
        setTimeout(() => {dayNotAvailableWarning.style.color = 'red';}, 2);

    } else {
        for (let hourNotDisplay of hoursNotDisplay) {
            hourNotDisplay.style.removeProperty('display');
        }
        document.querySelector('#diaNoDisponibleAlerta').remove();
    }
};



const selectTime = (slot) => {
    const slots = document.querySelectorAll('.time-slots button');
    slots.forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
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

// Inicializar el calendario
updateCalendar();