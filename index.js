const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2407-FTB-ET-WEB-FT/events';

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();
}

render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No Events.</li>";
        return;
    }

    const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <p>Name: ${event.name}</p>
        <p>Description: ${event.description}</p>
        <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
        <p>Location: ${event.location}</p>
        <button onclick="deleteEvent(${event.id})">Delete</button>
    `;
    return li;
    });

    eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
    event.preventDefault();

    const name = document.getElementById('eventName').value;
    const description = document.getElementById('eventDescription').value;
    const date = new Date(document.getElementById('eventDate').value);
    const location = document.getElementById('eventLocation').value;

    const formattedDate = date.toISOString();

    const eventData = {
        name: name,
        description: description,
        date: formattedDate,
        location: location,
    };
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        render();
    } catch (error) {
    console.error(error);
    }
}

async function deleteEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/${eventId}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            render();
        } else {
            console.error('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}
