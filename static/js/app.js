import { getDaysInMonth, formatDate } from './dateUtils.js';

// Axios is available globally because you are importing it in the HTML file

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function renderCalendar(year, month) {
  const root = document.getElementById('calendar-root');
  const header = document.getElementById('current-month');

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

  let events = [];
  try {
    const response = await axios.get('/api/calendar/events');
    events = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  days.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = day.getDate();
    const dateStr = formatDate(day);

    const dayEvents = events.filter((e) => e.start && e.start.dateTime && e.start.dateTime.startsWith(dateStr));
    dayEvents.forEach((event) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.textContent = event.summary || 'No Title';
      cell.appendChild(eventDiv);
    });

    root.appendChild(cell);
  });
}

async function addEvent(title, date, startTime, endTime, location, description) {
  try {
    const payload = {
      summary: title,
      start: `${date}T${startTime}:00Z`,
      end: `${date}T${endTime}:00Z`,
      timeZone: 'UTC',
      location: location,
      description: description,
    };

    console.log('Payload to be sent:', payload); // Debugging

    await axios.post('/api/calendar/events', payload);
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error adding event:', error.response?.data || error.message);
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
