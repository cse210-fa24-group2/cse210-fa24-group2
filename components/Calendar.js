import { getDaysInMonth, formatDate } from './utils/dateUtils.js';
import mockData from './utils/mockData.js';

function Calendar() {
  const today = new Date();
  const days = getDaysInMonth(today.getFullYear(), today.getMonth());

  const calendarHTML = days.map((day) => {
    const formattedDate = formatDate(day);
    const event = mockData.find(e => e.date === formattedDate);
    return `
      <div class="calendar-cell">
        ${day.getDate()}
        ${event ? `<div class="event">${event.title}</div>` : ''}
      </div>
    `;
  }).join('');

  return `<div class="calendar">${calendarHTML}</div>`;
}

export default Calendar;
