/**
 * Unit tests for calendar event operations in the application.
 * 
 * This file contains Jest test cases for CRUD operations (Add, Read, Update, Delete) 
 * on calendar events, along with the rendering of the calendar.
 */

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';

describe('Event Operations Tests (Add, Read, Update, Delete)', () => {
  let mock;
  let app;
  let deleteEvent, updateEvent, renderCalendar;

  beforeAll(async () => {
    const axiosModule = await import('axios');
    global.axios = axiosModule.default;
  });

  /**
   * Set up the DOM and mocks before each test.
   */
  beforeEach(async () => {
    mock = new MockAdapter(global.axios);

    document.body.innerHTML = `
      <div id="calendar-root"></div>
      <button id="add-event">Add Event</button>
      <button id="prev-month">Previous Month</button>
      <button id="next-month">Next Month</button>
      <input id="event-title" value="Test Event" />
      <input id="event-date" value="2024-12-25" />
      <input id="event-start-time" value="10:00" />
      <input id="event-end-time" value="11:00" />
      <input id="event-location" value="Online" />
      <input id="event-description" value="Test Description" />
      <input id="year-input" value="2024" />
      <div id="current-month">DEC</div>
      <form id="event-form">
        <button id="update-event" disabled>Edit</button>
      </form>
    `;

    const addEventButton = document.getElementById('add-event');
    if (addEventButton) {
      addEventButton.addEventListener = jest.fn();
    }

    const prevMonthButton = document.getElementById('prev-month');
    if (prevMonthButton) {
      prevMonthButton.addEventListener = jest.fn();
    }

    const nextMonthButton = document.getElementById('next-month');
    if (nextMonthButton) {
      nextMonthButton.addEventListener = jest.fn();
    }

    mock.onGet('/api/calendar/events').reply(200, []);

    jest.clearAllMocks();

    const appModule = await import('../static/js/app.js');
    app = appModule.default;
    deleteEvent = app.deleteEvent;
    updateEvent = app.updateEvent;
    renderCalendar = app.renderCalendar;
  });

  /**
   * Reset mocks after each test.
   */
  afterEach(() => {
    if (mock) mock.reset();
  });

  /**
   * Test for adding an event.
   */
  test('should add an event correctly', async () => {
    const title = 'New Event';
    const date = '2024-12-25';
    const startTime = '10:00';
    const endTime = '11:00';
    const location = 'Online';
    const description = 'This is a test event';

    mock.onPost('/api/calendar/events').reply(200, { data: 'Event added' });

    const addEventSpy = jest.spyOn(app, 'addEvent');

    await app.addEvent(title, date, startTime, endTime, location, description);

    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe('/api/calendar/events');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      summary: title,
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
      timeZone: 'America/Los_Angeles',
      location: location,
      description: description,
    });
    expect(addEventSpy).toHaveBeenCalledTimes(1);

    addEventSpy.mockRestore();
  });

  /**
   * Test for deleting an event.
   */
  test('should delete an event correctly', async () => {
    const eventId = '123';

    mock.onDelete(`/api/calendar/events/${eventId}`).reply(200, { data: 'Event deleted' });

    await deleteEvent(eventId);

    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(`/api/calendar/events/${eventId}`);
  });

  /**
   * Test for updating an event.
   */
  test('should update an event correctly', async () => {
    const eventId = '123';
    const updatedEvent = {
      summary: 'Updated Event',
      start: '2024-12-25T10:00:00Z',
      end: '2024-12-25T11:00:00Z',
      timeZone: 'UTC',
      location: 'Updated Location',
      description: 'Updated description',
    };

    mock.onPut(`/api/calendar/events/${eventId}`).reply(200, { data: 'Event updated' });

    await updateEvent(eventId, updatedEvent);

    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`/api/calendar/events/${eventId}`);
    expect(JSON.parse(mock.history.put[0].data)).toEqual(updatedEvent);
  });

  test('should render the calendar correctly', async () => {
    const mockEvents = [
      {
        id: '1',
        summary: 'Test Event 1',
        start: { dateTime: '2024-12-25T10:00:00Z' },
        end: { dateTime: '2024-12-25T11:00:00Z' },
      },
      {
        id: '2',
        summary: 'Test Event 2',
        start: { dateTime: '2024-12-26T12:00:00Z' },
        end: { dateTime: '2024-12-26T13:00:00Z' },
      },
    ];
    mock.onGet('/api/calendar/events').reply(200, mockEvents); // Returns mockEvents array

    await renderCalendar(2024, 11);

    const calendarRoot = document.getElementById('calendar-root');
    expect(calendarRoot).toBeInTheDocument();

    const firstDay = new Date(2024, 11, 1).getDay();
    const expectedCells = 31 + firstDay;
    expect(calendarRoot.children.length).toBe(expectedCells);

    const eventElements = document.querySelectorAll('.event');
    expect(eventElements.length).toBe(mockEvents.length);
    expect(eventElements[0]).toHaveTextContent('Test Event 1');
    expect(eventElements[1]).toHaveTextContent('Test Event 2');
  });
});
