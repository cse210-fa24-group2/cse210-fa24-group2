/**
 * Utility functions for date operations.
 * @module dateUtils
 */
import { getDaysInMonth, formatDate } from './dateUtils.js';

/**
 * Current year.
 * @type {number}
 */
let currentYear = new Date().getFullYear();

/**
 * Current month (0-indexed).
 * @type {number}
 */
let currentMonth = new Date().getMonth();

/**
 * Renders the calendar for the specified year and month.
 * @async
 * @param {number} year - The year to render.
 * @param {number} month - The month (0-indexed) to render.
 */
async function renderCalendar(year, month) {
  const root = document.getElementById('calendar-root');
  const header = document.getElementById('current-month');
  const yearInput = document.getElementById('year-input');

  const days = getDaysInMonth(year, month);

  const longMonth = new Date(year, month).toLocaleString('en-US', { month: 'long' });
  header.textContent = longMonth;

  if (yearInput) {
    yearInput.value = currentYear.toString();
  }

  root.innerHTML = '';

  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell empty-cell';
    root.appendChild(emptyCell);
  }

  /**
   * @type {Array<Object>} events - Array of calendar events.
   */
  let events = [];
  try {
    const response = await axios.get('/api/calendar/events');
    events = response.data;
    console.log('Events fetched successfully:', events);
    
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  days.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = day.getDate();
    const dateStr = formatDate(day);

    const dayEvents = events.filter((e) => e.start && e.start.dateTime && e.start.dateTime.startsWith(dateStr));
if (dayEvents.length > 0) {
    const eventsSummary = document.createElement('div');
    eventsSummary.className = 'events-summary';
    
    const eventsLabel = document.createElement('div');
    eventsLabel.className = 'events-label';
    eventsLabel.innerHTML = `Events <span class="events-count">${dayEvents.length}</span>`;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'events-tooltip';
    
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    
    dayEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        const startTime = new Date(event.start.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const endTime = new Date(event.end.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        eventItem.innerHTML = `
            <div class="event-time">${startTime} - ${endTime}</div>
            <div class="event-title">${event.summary}</div>
            <div class="event-description">${event.description || ''}</div>
            <div class="event-actions">
                <button class="edit-btn" title="Edit event">✎</button>
                <button class="delete-btn" title="Delete event">X</button>
            </div>
        `;

        // Add event listeners after setting innerHTML
const editButton = eventItem.querySelector('.edit-btn');
const deleteButton = eventItem.querySelector('.delete-btn');

  editButton.addEventListener('click', () => {
      setupEventUpdateForm(event);
  });

  deleteButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
        await deleteEvent(event.id);
    }
});
        
    tooltipContent.appendChild(eventItem);
  });  
    tooltip.appendChild(tooltipContent);
    eventsSummary.appendChild(eventsLabel);
    eventsSummary.appendChild(tooltip);
    cell.appendChild(eventsSummary);
}

root.appendChild(cell);
  });
}

/**
 * Creates an HTML element for a calendar event.
 * @param {Object} event - The event object.
 * @param {string} event.summary - The title of the event.
 * @param {string} event.id - The unique identifier of the event.
 * @returns {HTMLDivElement} The event element.
 */
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

/**
 * Adds a new event to the calendar.
 * @async
 * @param {string} title - Title of the event.
 * @param {string} date - Date of the event in YYYY-MM-DD format.
 * @param {string} startTime - Start time of the event in HH:MM format.
 * @param {string} endTime - End time of the event in HH:MM format.
 * @param {string} location - Location of the event.
 * @param {string} description - Description of the event.
 */
async function addEvent(title, date, startTime, endTime, location, description) {
  try {
    const payload = {
      summary: title,
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
      location: location,
      description: description,
    };

    await axios.post('/api/calendar/events', payload);
    window.fetchAndRenderDeadlines(); 
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error adding event:', error.response?.data || error.message);
  }
}

/**
 * Deletes an event from the calendar.
 * @async
 * @param {string} eventId - The unique identifier of the event to delete.
 */
async function deleteEvent(eventId) {
  try {
    await axios.delete(`/api/calendar/events/${eventId}`);
    window.fetchAndRenderDeadlines(); 
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}

/**
 * Updates an existing calendar event.
 * @async
 * @param {string} eventId - The unique identifier of the event to update.
 * @param {Object} updatedData - The updated event data.
 */
async function updateEvent(eventId, updatedData) {
  try {
    await axios.put(`/api/calendar/events/${eventId}`, updatedData);
    window.fetchAndRenderDeadlines(); 
    await renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

/**
 * Sets up the event update form with the specified event's data.
 * @param {Object} event - The event object.
 */
function setupEventUpdateForm(event) {
  document.getElementById('event-title').value = event.summary || '';
  document.getElementById('event-date').value = event.start.dateTime.split('T')[0];
  document.getElementById('event-start-time').value = event.start.dateTime.split('T')[1].slice(0, 5);
  document.getElementById('event-end-time').value = event.end.dateTime.split('T')[1].slice(0, 5);
  document.getElementById('event-location').value = event.location || '';
  document.getElementById('event-description').value = event.description || '';
  const updateButton = document.getElementById('update-event');
  updateButton.dataset.eventId = event.id;

  updateButton.disabled = false;
  document.getElementById('add-event').disabled = true; 
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

  document.getElementById('event-form').reset();
  document.getElementById('update-event').disabled = true;
  document.getElementById('add-event').disabled = false;
});

document.getElementById('update-event').addEventListener('click', async (e) => {
  e.preventDefault();

  const eventId = e.target.dataset.eventId;
  if (!eventId) return;

  const updatedEvent = {
    summary: document.getElementById('event-title').value,
    start: `${document.getElementById('event-date').value}T${document.getElementById('event-start-time').value}:00Z`,
    end: `${document.getElementById('event-date').value}T${document.getElementById('event-end-time').value}:00Z`,
    location: document.getElementById('event-location').value,
    description: document.getElementById('event-description').value,
  };

  await updateEvent(eventId, updatedEvent);

  document.getElementById('event-form').reset();
  e.target.dataset.eventId = '';
  document.getElementById('update-event').disabled = true;
  document.getElementById('add-event').disabled = false;
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