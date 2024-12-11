/**
 * Utility functions for date operations.
 * @module dateUtils
 */
import { getDaysInMonth, formatDate } from './dateUtils.js';

/**
 * Generate the calendar for the current month.
 * @async
 * @function Calendar
 * @returns {Promise<string>} - The HTML string representation of the calendar.
 */
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateWeekdays() {
  return weekdays.map(day => `<div class="weekday">${day}</div>`).join('');
}

async function Calendar() {
  const today = new Date();
  const days = getDaysInMonth(today.getFullYear(), today.getMonth());

  /**
   * @type {Array<Object>} events - Array of calendar events.
   */
  let events = [];

  try {
    const response = await axios.get('/api/calendar/events');
    events = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  const weekdaysHTML = `<div class="calendar-grid weekdays">${generateWeekdays()}</div>`;
  const calendarHTML = days.map(day => {
    const formattedDate = formatDate(day);
    const dayEvents = events.filter(e => e.start.dateTime.startsWith(formattedDate));
    console.log('Day events:', dayEvents);
    

    return `
      <div class="calendar-cell">
        <span class="date">${day.getDate()}</span>
        
        ${dayEvents.map(event => `<div class="event">${event.summary}</div>`).join('')}
      </div>`;
  }).join('');

  return weekdaysHTML + `<div class="calendar-grid">${calendarHTML}</div>`;
}

/**
 * Load the calendar HTML content into the container on the index page.
 * @async
 * @function loadCalendar
 * @returns {Promise<void>} - Injects calendar HTML into the container.
 */
export async function loadCalendar() {
  try {
    const response = await fetch('/calendar.html');
    if (!response.ok) {
      console.error('Failed to load calendar:', response.statusText);
      return;
    }

    const calendarHTML = await response.text();
    const container = document.getElementById('calendar-container');
    if (container) {
      container.innerHTML = calendarHTML;
      container.style.overflow = 'hidden';
      container.style.maxHeight = '100%';
      console.log('Calendar loaded successfully.');

      await loadCalendarScripts();
    } else {
      console.error('Calendar container not found.');
    }
  } catch (error) {
    console.error('Error loading calendar:', error);
  }
}

/**
 * Dynamically load additional scripts for calendar functionality.
 * @async
 * @function loadCalendarScripts
 * @returns {Promise<void>} - Dynamically appends scripts to the DOM.
 */
async function loadCalendarScripts() {
  try {
    const scriptApp = document.createElement('script');
    scriptApp.type = 'module';
    scriptApp.src = '/static/js/app.js';
    document.body.appendChild(scriptApp);

    console.log('Calendar scripts loaded successfully.');
  } catch (error) {
    console.error('Error loading calendar scripts:', error);
  }
}

window.addEventListener('load', loadCalendar);
export default {
  Calendar,
  loadCalendar
};