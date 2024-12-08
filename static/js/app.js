import { getDaysInMonth, formatDate } from './dateUtils.js';
import axios from 'axios';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function renderCalendar(year, month) {
  const root = document.getElementById('calendar-root');
  const header = document.getElementById('current-month');
  const yearInput = document.getElementById('year-input');

  const days = getDaysInMonth(year, month);

  const shortMonth = new Date(year, month).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  header.textContent = shortMonth;

  if (yearInput) {
    yearInput.placeholder = currentYear.toString();
  }

  root.innerHTML = '';

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
      const eventElement = createEventElement(event);
      cell.appendChild(eventElement);
    });

    root.appendChild(cell);
  });
}

function createEventElement(event) {
  const eventDiv = document.createElement('div');
  eventDiv.className = 'event';
  eventDiv.textContent = event.summary || 'No Title';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-event';
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    await deleteEvent(event.id);
  });

  const updateButton = document.createElement('button');
  updateButton.className = 'update-event';
  updateButton.textContent = 'Edit';
  updateButton.addEventListener('click', (e) => {
    e.stopPropagation();
    setupEventUpdateForm(event);
  });

  eventDiv.appendChild(deleteButton);
  eventDiv.appendChild(updateButton);

  return eventDiv;
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

    await axios.post('/api/calendar/events', payload);
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error adding event:', error.response?.data || error.message);
  }
}

async function deleteEvent(eventId) {
  try {
    await axios.delete(`/api/calendar/events/${eventId}`);
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}

async function updateEvent(eventId, updatedData) {
  try {
    await axios.put(`/api/calendar/events/${eventId}`, updatedData);
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

function setupEventUpdateForm(event) {
  document.getElementById('event-title').value = event.summary || '';
  document.getElementById('event-date').value = event.start.dateTime.split('T')[0];
  document.getElementById('event-start-time').value = event.start.dateTime.split('T')[1].slice(0, 5);
  document.getElementById('event-end-time').value = event.end.dateTime.split('T')[1].slice(0, 5);
  document.getElementById('event-location').value = event.location || '';
  document.getElementById('event-description').value = event.description || '';

  const updateButton = document.getElementById('update-event');
  updateButton.dataset.eventId = event.id;

  updateButton.disabled = false; // Enable Update button
  document.getElementById('add-event').disabled = true; // Disable Add button
}

document.getElementById('add-event').addEventListener('click', async (e) => {
  e.preventDefault();

  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const startTime = document.getElementById('event-start-time').value;
  const endTime = document.getElementById('event-end-time').value;
  const location = document.getElementById('event-location').value;
  const description = document.getElementById('event-description').value;

  await addEvent(title, date, startTime, endTime, location, description);

  document.getElementById('event-form').reset(); // Clear form after submission
  document.getElementById('update-event').disabled = true; // Disable Update button
  document.getElementById('add-event').disabled = false; // Enable Add button
});

document.getElementById('update-event').addEventListener('click', async (e) => {
  e.preventDefault();

  const eventId = e.target.dataset.eventId;
  if (!eventId) return;

  const updatedEvent = {
    summary: document.getElementById('event-title').value,
    start: `${document.getElementById('event-date').value}T${document.getElementById('event-start-time').value}:00Z`,
    end: `${document.getElementById('event-date').value}T${document.getElementById('event-end-time').value}:00Z`,
    timeZone: 'UTC',
    location: document.getElementById('event-location').value,
    description: document.getElementById('event-description').value,
  };

  await updateEvent(eventId, updatedEvent);

  document.getElementById('event-form').reset(); // Clear form after submission
  e.target.dataset.eventId = ''; // Clear event ID
  document.getElementById('update-event').disabled = true; // Disable Update button
  document.getElementById('add-event').disabled = false; // Enable Add button
});

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

await renderCalendar(currentYear, currentMonth);
export default {
  addEvent,
  updateEvent,
  deleteEvent,
  renderCalendar
};