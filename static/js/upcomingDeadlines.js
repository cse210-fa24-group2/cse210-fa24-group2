/**
 * Fetch today's Google Calendar events from the backend.
 * @async
 * @function fetchTodaysEvents
 * @returns {Promise<Array>} - A promise that resolves to an array of today's events.
 */
async function fetchTodaysEvents() {
    try {
        console.log("Fetching today's events...");
        const response = await fetch('/api/calendar/events/today');
        if (!response.ok) {
            console.error("Failed to fetch today's events:", response.statusText);
            return [];
        }

        const events = await response.json();
        return Array.isArray(events) ? events : [];
    } catch (error) {
        console.error("Error fetching today's events:", error);
        return [];
    }
}

/**
 * Fetch today's internship follow-ups from the backend.
 * @async
 * @function fetchTodaysInternships
 * @returns {Promise<Array>} - A promise that resolves to an array of today's internships.
 */
async function fetchTodaysInternships() {
    try {
        console.log("Fetching today's internships...");
        const response = await fetch('/api/internships/today');
        if (!response.ok) {
            console.error("Failed to fetch today's internships:", response.statusText);
            return [];
        }

        const internships = await response.json();
        return Array.isArray(internships) ? internships : [];
    } catch (error) {
        console.error("Error fetching today's internships:", error);
        return [];
    }
}

/**
 * Converts the event's dateTime to a user's local 12-hour time format.
 * @function formatEventTime
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
 * Fetch and display all today's deadlines, including calendar events and internships.
 * @async
 * @function fetchAndRenderDeadlines
 * @returns {Promise<void>} - A promise that resolves once deadlines are rendered.
 */
async function fetchAndRenderDeadlines() {
    try {
        console.log("Fetching all deadlines...");

        const [events, internships] = await Promise.all([
            fetchTodaysEvents(),
            fetchTodaysInternships()
        ]);

        const combinedDeadlines = [
            ...events.map(event => ({
                type: 'event',
                summary: event.summary,
                time: event.start && event.start.dateTime ? formatEventTime(event.start.dateTime, event.start.timeZone) : "Time not specified"
            })),
            ...internships.map(internship => ({
                type: 'internship',
                summary: `${internship.companyName} (${internship.positionTitle})`
            }))
        ];

        renderDeadlines(combinedDeadlines);
    } catch (error) {
        console.error("Error fetching and rendering deadlines:", error);
    }
}

/**
 * Render the combined deadlines in the "Upcoming Deadlines" section.
 * @function renderDeadlines
 * @param {Array} deadlines - Array of deadline objects to render.
 */
function renderDeadlines(deadlines) {
    console.log("Rendering deadlines...");
    const deadlinesList = document.getElementById('upcomingDeadlinesList');
    if (!deadlinesList) {
        console.error("Could not find element with ID 'upcomingDeadlinesList'");
        return;
    }

    deadlinesList.innerHTML = '';

    if (deadlines.length === 0) {
        const noDeadlinesItem = document.createElement('li');
        noDeadlinesItem.textContent = 'No upcoming deadlines today.';
        deadlinesList.appendChild(noDeadlinesItem);
    } else {
        deadlines.forEach(deadline => {
            const listItem = document.createElement('li');
            if (deadline.type === 'event') {
                listItem.textContent = `${deadline.summary} (${deadline.time})`;
            } else {
                listItem.textContent = deadline.summary;
            }
            deadlinesList.appendChild(listItem);
        });
    }
}

window.fetchAndRenderDeadlines = fetchAndRenderDeadlines;

window.addEventListener('load', fetchAndRenderDeadlines);
