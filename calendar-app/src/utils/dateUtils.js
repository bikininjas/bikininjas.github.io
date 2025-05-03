export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const parseDate = (dateString) => {
    return new Date(dateString);
};

export const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1);
};

export const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0);
};