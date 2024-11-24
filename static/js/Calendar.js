import { getDaysInMonth, formatDate } from './dateUtils.js';

async function Calendar() {
  const today = new Date();
  const days = getDaysInMonth(today.getFullYear(), today.getMonth());

  let events = [];
  try {
    const response = await axios.get('/api/calendar/events');
    events = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  const calendarHTML = days
    .map((day) => {
      const formattedDate = formatDate(day);
      const dayEvents = events.filter((e) => e.start.dateTime.startsWith(formattedDate));

      return `
      <div class="calendar-cell">
        ${day.getDate()}
        ${dayEvents.map((event) => `<div class="event">${event.summary}</div>`).join('')}
      </div>
    `;
    })
    .join('');

  return `<div class="calendar">${calendarHTML}</div>`;
}

export default Calendar;
