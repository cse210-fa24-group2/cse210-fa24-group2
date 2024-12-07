/**
 * Fetch today's Google Calendar events from the backend.
 */
async function fetchTodaysEvents() {
    try {
        console.log("Fetching today's events...");
        const response = await fetch('/api/calendar/events/today');
        if (!response.ok) {
            console.error("Failed to fetch today's events:", response.statusText);
            return;
        }

        const events = await response.json();
        if (Array.isArray(events)) {
            renderEvents(events);
        } else {
            console.error("Unexpected response format:", events);
        }
    } catch (error) {
        console.error("Error fetching today's events:", error);
    }
}

/**
 * Converts the event's dateTime to a user's local 12-hour time format.
 * @param {string} dateTime - The event's dateTime string.
 * @param {string} timeZone - The event's time zone.
 * @returns {string} - Formatted 12-hour time string with AM/PM.
 */
function formatEventTime(dateTime, timeZone) {
    const date = new Date(dateTime);
    const formatter = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timeZone,
    });
    return formatter.format(date);
}

/**
 * Render the list of events in the "Upcoming Deadlines" section.
 */
function renderEvents(events) {
    console.log("Rendering events...");
    const deadlinesList = document.getElementById('upcoming-deadlines-list');
    if (!deadlinesList) {
        console.error("Could not find element with ID 'upcoming-deadlines-list'");
        return;
    }

    deadlinesList.innerHTML = ''; // Clear any existing events

    if (events.length === 0) {
        const noEventsItem = document.createElement('li');
        noEventsItem.textContent = 'No upcoming deadlines today.';
        deadlinesList.appendChild(noEventsItem);
    } else {
        events.forEach(event => {
            const listItem = document.createElement('li');
            if (event.start && event.start.dateTime && event.start.timeZone) {
                const formattedTime = formatEventTime(event.start.dateTime, event.start.timeZone);
                listItem.textContent = `${event.summary} (${formattedTime})`;
            } else {
                listItem.textContent = `${event.summary} (Time not specified)`;
            }
            deadlinesList.appendChild(listItem);
        });
    }
}

// Fetch today's events when the page loads
window.addEventListener('load', fetchTodaysEvents);
