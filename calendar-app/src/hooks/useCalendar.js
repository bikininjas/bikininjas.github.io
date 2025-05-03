import { useState } from 'react';

const useCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const addEvent = (event) => {
        setEvents((prevEvents) => [...prevEvents, event]);
    };

    const editEvent = (eventId, updatedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
        );
    };

    const deleteEvent = (eventId) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    };

    const selectDate = (date) => {
        setSelectedDate(date);
    };

    return {
        events,
        selectedDate,
        addEvent,
        editEvent,
        deleteEvent,
        selectDate,
    };
};

export default useCalendar;