import React from 'react';
import Calendar from './Calendar';
import { useCalendar } from '../hooks/useCalendar';

const App = () => {
    const { events, addEvent, editEvent, deleteEvent } = useCalendar();

    return (
        <div className="app">
            <h1>Calendar App</h1>
            <Calendar 
                events={events} 
                addEvent={addEvent} 
                editEvent={editEvent} 
                deleteEvent={deleteEvent} 
            />
        </div>
    );
};

export default App;