import { useState, useEffect } from 'react';
import '../styles/calendar.css';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error("Failed to parse saved events", e);
      }
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
    setShowEventForm(true);
    setEditingEvent(null);
    setNewEvent({ title: '', description: '' });
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const eventToAdd = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      title: newEvent.title,
      description: newEvent.description,
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventToAdd : e));
    } else {
      setEvents([...events, eventToAdd]);
    }

    setShowEventForm(false);
    setNewEvent({ title: '', description: '' });
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setNewEvent({
      title: event.title,
      description: event.description,
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
    if (editingEvent && editingEvent.id === eventId) {
      setShowEventForm(false);
      setEditingEvent(null);
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    
    let days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === date);
      const isToday = isCurrentMonth && day === todayDate;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${dayEvents.length > 0 ? 'has-events' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className="event-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
                title={event.description || event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="month-nav-btn">
          &larr;
        </button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="month-nav-btn">
          &rarr;
        </button>
      </div>

      <div className="weekday-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderCalendar()}
      </div>

      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
            <p>
              {selectedDate?.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </p>
            
            <div className="form-group">
              <label htmlFor="event-title">Title</label>
              <input
                id="event-title"
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Event title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="event-desc">Description</label>
              <textarea
                id="event-desc"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Event description"
              />
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowEventForm(false)} className="btn-cancel">
                Cancel
              </button>
              
              <button onClick={handleAddEvent} className="btn-save">
                {editingEvent ? 'Update' : 'Add'}
              </button>
              
              {editingEvent && (
                <button 
                  onClick={() => handleDeleteEvent(editingEvent.id)} 
                  className="btn-delete"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}