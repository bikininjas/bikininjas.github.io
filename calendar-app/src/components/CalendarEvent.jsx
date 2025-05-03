import React from 'react';

const CalendarEvent = ({ event, onEdit, onDelete }) => {
    return (
        <div className="calendar-event">
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.description}</p>
            <button onClick={() => onEdit(event)}>Edit</button>
            <button onClick={() => onDelete(event.id)}>Delete</button>
        </div>
    );
};

export default CalendarEvent;