import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEvent } from '../store/calendarSlice';

const EditEventForm = ({ event, onClose }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDate(event.date);
            setDescription(event.description);
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateEvent({ ...event, title, date, description }));
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default EditEventForm;