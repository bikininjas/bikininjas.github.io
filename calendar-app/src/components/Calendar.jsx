import React, { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import CalendarEvent from './CalendarEvent';
import EditEventForm from './EditEventForm';
import './calendar.css';

const Calendar = () => {
    const { events, addEvent, editEvent, deleteEvent } = useCalendar();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsEditing(false);
        setCurrentEvent(null);
    };

    const handleEventClick = (event) => {
        setCurrentEvent(event);
        setIsEditing(true);
    };

    const handleFormSubmit = (eventData) => {
        if (isEditing) {
            editEvent(currentEvent.id, eventData);
        } else {
            addEvent({ ...eventData, date: selectedDate });
        }
        setSelectedDate(null);
        setCurrentEvent(null);
        setIsEditing(false);
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                {/* Calendar UI rendering logic goes here */}
                {/* Example: Render days and handle date clicks */}
            </div>
            <div className="events-list">
                {events.map(event => (
                    <CalendarEvent key={event.id} event={event} onClick={() => handleEventClick(event)} />
                ))}
            </div>
            {selectedDate && (
                <EditEventForm
                    event={isEditing ? currentEvent : null}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setSelectedDate(null);
                        setCurrentEvent(null);
                        setIsEditing(false);
                    }}
                />
            )}
        </div>
    );
};

export default Calendar;