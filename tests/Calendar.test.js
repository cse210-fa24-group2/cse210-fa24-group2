import '@testing-library/jest-dom'; // For DOM assertions
import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';

describe('Event Operations Tests (Add, Read, Update, Delete)', () => {
  let mock;
  let app;
  let deleteEvent, updateEvent, renderCalendar;

  beforeAll(async () => {
    // Ensure axios is globally available
    const axiosModule = await import('axios');
    global.axios = axiosModule.default;
  });

  beforeEach(async () => {
    // Initialize MockAdapter before each test
    mock = new MockAdapter(global.axios);

    // Set up the DOM with all required elements
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

    // Mock addEventListener on 'add-event', 'prev-month', and 'next-month' buttons without invoking callbacks
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

    // Set up a default mock for axios.get to prevent 404 during initial renderCalendar call
    mock.onGet('/api/calendar/events').reply(200, []); // Returns an empty array of events

    // Clear all mock calls and instances before each test
    jest.clearAllMocks();

    // Dynamically import 'app.js' after setting up the DOM and mocks
    const appModule = await import('../static/js/app.js');
    app = appModule.default;
    deleteEvent = app.deleteEvent;
    updateEvent = app.updateEvent;
    renderCalendar = app.renderCalendar;
  });

  afterEach(() => {
    // Reset the mock after each test
    if (mock) mock.reset();
  });

  // Test for addEvent (Add an event)
  test('should add an event correctly', async () => {
    const title = 'New Event';
    const date = '2024-12-25';
    const startTime = '10:00';
    const endTime = '11:00';
    const location = 'Online';
    const description = 'This is a test event';

    // Mock axios.post response
    mock.onPost('/api/calendar/events').reply(200, { data: 'Event added' });

    // Spy on addEvent to ensure it's called only once
    const addEventSpy = jest.spyOn(app, 'addEvent');

    // Call addEvent directly on app
    await app.addEvent(title, date, startTime, endTime, location, description);

    // Check if axios.post was called with correct parameters
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe('/api/calendar/events');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      summary: title,
      start: `${date}T${startTime}:00Z`,
      end: `${date}T${endTime}:00Z`,
      timeZone: 'UTC',
      location: location,
      description: description,
    });

    // Ensure addEvent was called once
    expect(addEventSpy).toHaveBeenCalledTimes(1);

    // Restore the original implementation
    addEventSpy.mockRestore();
  });

  // Test for deleteEvent (Delete an event)
  test('should delete an event correctly', async () => {
    const eventId = '123';

    // Mock axios.delete response
    mock.onDelete(`/api/calendar/events/${eventId}`).reply(200, { data: 'Event deleted' });

    // Call deleteEvent
    await deleteEvent(eventId);

    // Check if axios.delete was called with correct event ID
    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(`/api/calendar/events/${eventId}`);
  });

  // Test for updateEvent (Update an event)
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

    // Mock axios.put response
    mock.onPut(`/api/calendar/events/${eventId}`).reply(200, { data: 'Event updated' });

    // Call updateEvent
    await updateEvent(eventId, updatedEvent);

    // Check if axios.put was called with correct event ID and data
    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`/api/calendar/events/${eventId}`);
    expect(JSON.parse(mock.history.put[0].data)).toEqual(updatedEvent);
  });

  // Test for renderCalendar (Check if it renders calendar correctly)
  test('should render the calendar correctly', async () => {
    // Mock axios.get response for fetching events
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

    // Call renderCalendar for December 2024 (Month is 0-indexed, so 11 = December)
    await renderCalendar(2024, 11);

    // Check if the calendar root element exists
    const calendarRoot = document.getElementById('calendar-root');
    expect(calendarRoot).toBeInTheDocument();

    // December 2024 has 31 days, plus any empty cells at the start
    // Calculate expected number of cells: 31 days + empty cells based on first day
    const firstDay = new Date(2024, 11, 1).getDay(); // December 1, 2024 is Sunday (0)
    const expectedCells = 31 + firstDay;
    expect(calendarRoot.children.length).toBe(expectedCells);

    // Check if events are rendered
    const eventElements = document.querySelectorAll('.event');
    expect(eventElements.length).toBe(mockEvents.length);
    expect(eventElements[0]).toHaveTextContent('Test Event 1');
    expect(eventElements[1]).toHaveTextContent('Test Event 2');
  });
});
