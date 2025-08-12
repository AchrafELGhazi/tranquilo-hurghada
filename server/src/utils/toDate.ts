const toDate = (date: Date | string): Date => {
    if (date instanceof Date) return date;
    return new Date(date);
};

export default toDate