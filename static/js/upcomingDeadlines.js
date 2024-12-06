/**
 * Fetch today's Google Calendar events from the backend.
 * @returns {Promise<void>} 
 */
async function fetchTodaysEvents() {
    try {
        console.log("Fetching today's events...");
        const response = await fetch('/api/calendar/events/today');
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
            console.error("Failed to fetch today's events:", response.statusText);
            return;
        }

        const events = await response.json();
        console.log("Fetched events:", events);

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
 * Converts UTC time to a 12-hour format with AM/PM.
 * @param {string} utcTime - The UTC time string.
 * @returns {string} - The formatted 12-hour time string.
 */
function convertUTCTo12HourFormat(utcTime) {
    // Create a Date object from the UTC time
    const date = new Date(utcTime);

    // Get the hours in 24-hour format
    let hours = date.getUTCHours();

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Get the minutes and pad with a leading zero if necessary
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Construct the final 12-hour time string
    const timeString = `${hours}:${minutes} ${ampm}`;

    return timeString;
}

/**
 * Render the list of events in the "Upcoming Deadlines" section.
 * @param {Array} events - List of events to render.
 */
function renderEvents(events) {
    console.log("Rendering events...");
    const deadlinesList = document.getElementById('upcoming-deadlines-list');
    
    if (!deadlinesList) {
        console.error("Could not find element with ID 'upcoming-deadlines-list'");
        return;
    }

    // Clear any existing events
    deadlinesList.innerHTML = '';

    if (events.length === 0) {
        console.log("No events found for today.");
        const noEventsItem = document.createElement('li');
        noEventsItem.textContent = 'No upcoming deadlines today.';
        deadlinesList.appendChild(noEventsItem);
    } else {
        events.forEach(event => {
            console.log("Rendering event:", event.summary, "at", event.start?.dateTime || 'N/A');

            const listItem = document.createElement('li');

            if (event.start && event.start.dateTime) {
                // Convert UTC time to 12-hour format
                const formattedTime = convertUTCTo12HourFormat(event.start.dateTime);

                // Set the event details in the list item
                listItem.textContent = `${event.summary} (${formattedTime})`;
            } else {
                // If event start time is not specified
                listItem.textContent = `${event.summary} (Time not specified)`;
            }

            deadlinesList.appendChild(listItem);
        });
    }
}

// Calls the function to fetch today's events when the page loads
window.addEventListener('load', () => {
    console.log("Window loaded. Fetching today's events.");
    fetchTodaysEvents();
});