import { getDaysInMonth, formatDate } from './components/utils/dateUtils.js';
import mockEvents from './components/utils/mockData.js';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendar(year, month) {
  const root = document.getElementById('calendar-root');
  const header = document.getElementById('current-month');

  const days = getDaysInMonth(year, month);
  const firstDay = days[0].getDay();

  header.textContent = `${year}-${month + 1}`;
  root.innerHTML = '';

  // Fill empty days before the first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell';
    root.appendChild(emptyCell);
  }

  // Fill days with events
  days.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = day.getDate();

    const dateStr = formatDate(day);
    const events = mockEvents.filter((e) => e.date === dateStr);
    events.forEach((event) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.textContent = event.title;
      cell.appendChild(eventDiv);
    });

    root.appendChild(cell);
  });
}

function addEvent(title, date, time) {
  mockEvents.push({
    id: Math.random().toString(36).substr(2, 9),
    title,
    date: formatDate(new Date(date)),
    time,
  });
  renderCalendar(currentYear, currentMonth);
}

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

document.getElementById('year-input').addEventListener('change', (e) => {
  currentYear = parseInt(e.target.value, 10) || currentYear;
  renderCalendar(currentYear, currentMonth);
});

document.getElementById('event-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const time = document.getElementById('event-time').value;
  addEvent(title, date, time);
});

renderCalendar(currentYear, currentMonth);
