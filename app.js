import { getDaysInMonth, formatDate } from './components/utils/dateUtils.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.min.js';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function renderCalendar(year, month) {
  const root = document.getElementById('calendar-root');
  const header = document.getElementById('current-month');

  // Fetch days for the given month
  const days = getDaysInMonth(year, month);
  header.textContent = `${year}-${month + 1}`;
  root.innerHTML = '';

  // Fill empty cells before the first day
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell empty-cell';
    root.appendChild(emptyCell);
  }

  // Default to an empty events array in case fetching fails
  let events = [];
  try {
    // Fetch events for the current month from the backend API
    const response = await axios.get('/api/calendar/events');
    events = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  // Fill calendar days with event information
  days.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = day.getDate();
    const dateStr = formatDate(day);

    // Filter events for this particular day
    const dayEvents = events.filter((e) => e.start && e.start.dateTime && e.start.dateTime.startsWith(dateStr));

    // Display each event in the calendar cell
    dayEvents.forEach((event) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.textContent = event.summary || "No Title"; // Fallback if no summary is provided
      cell.appendChild(eventDiv);
    });

    root.appendChild(cell);
  });
}

async function addEvent(title, date, startTime, endTime, location, description) {
  try {
    await axios.post('/api/calendar/events', {
      summary: title,
      start: {
        dateTime: `${date}T${startTime}`,
        timeZone: 'UTC'
      },
      end: {
        dateTime: `${date}T${endTime}`,
        timeZone: 'UTC'
      },
      location: location,
      description: description,
    });
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error adding event:', error);
  }
}

document.getElementById('prev-month').addEventListener('click', async () => {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  await renderCalendar(currentYear, currentMonth);
});

document.getElementById('next-month').addEventListener('click', async () => {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  await renderCalendar(currentYear, currentMonth);
});

document.getElementById('year-input').addEventListener('change', async (e) => {
  currentYear = parseInt(e.target.value, 10) || currentYear;
  await renderCalendar(currentYear, currentMonth);
});

document.getElementById('event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const startTime = document.getElementById('event-start-time').value;
  const endTime = document.getElementById('event-end-time').value;
  const location = document.getElementById('event-location').value;
  const description = document.getElementById('event-description').value;
  await addEvent(title, date, startTime, endTime, location, description);
});

await renderCalendar(currentYear, currentMonth);
