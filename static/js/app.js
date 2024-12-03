import { getDaysInMonth, formatDate } from './utils/dateUtils.js';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
const events = []; // In-memory event storage

function renderCalendar(year, month) {
    const root = document.getElementById('calendar-root');
    const header = document.getElementById('current-month');

    // Ensure the root and header exist
    if (!root || !header) {
        console.error('Calendar container is not correctly initialized.');
        return;
    }

    // Get days in the current month
    const days = getDaysInMonth(year, month);
    if (!days.length) {
        console.error('No days found for the given month.');
        return;
    }

    // Update header
    header.textContent = `${year}-${month + 1}`;

    // Clear previous content
    root.innerHTML = '';

    // Render empty cells for the first week
    const firstDay = days[0].getDay();
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell empty';
        root.appendChild(emptyCell);
    }

    // Render each day
    days.forEach((day) => {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = day.getDate();

        const dateStr = formatDate(day);
        const eventList = events.filter((e) => e.date === dateStr);
        eventList.forEach((event) => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = event.title;
            cell.appendChild(eventDiv);
        });

        root.appendChild(cell);
    });
}

function addEvent(title, date, time) {
    events.push({
        id: Math.random().toString(36).substr(2, 9),
        title,
        date: formatDate(new Date(date)),
        time,
    });
    renderCalendar(currentYear, currentMonth);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentYear, currentMonth);

    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth -= 1;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        }
        renderCalendar(currentYear, currentMonth);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth += 1;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
        renderCalendar(currentYear, currentMonth);
    });

    document.getElementById('event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        addEvent(title, date, time);
    });
});
