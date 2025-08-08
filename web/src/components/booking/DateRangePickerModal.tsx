import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Calendar, Clock } from 'lucide-react';
import bookingApi from '@/api/bookingApi';

interface DateRangePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    villaId: string;
    onDateSelect: (checkIn: string, checkOut: string) => void;
    initialCheckIn?: string;
    initialCheckOut?: string;
}

interface CalendarDay {
    date: Date;
    dateString: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    isBooked: boolean;
    isPast: boolean;
    isSelected: boolean;
    isInRange: boolean;
    isCheckIn: boolean;
    isCheckOut: boolean;
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
    isOpen,
    onClose,
    villaId,
    onDateSelect,
    initialCheckIn,
    initialCheckOut,
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [checkInDate, setCheckInDate] = useState<string>(initialCheckIn || '');
    const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOut || '');
    const [loading, setLoading] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<string>('');

    // Load booked dates when modal opens or month changes
    useEffect(() => {
        if (isOpen && villaId) {
            loadBookedDates();
        }
    }, [isOpen, villaId, currentMonth]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const loadBookedDates = async () => {
        try {
            setLoading(true);
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;

            // Get current month and next month data
            const [currentMonthData, nextMonthData] = await Promise.all([
                bookingApi.getVillaBookedDates(villaId, { year, month }),
                month === 12
                    ? bookingApi.getVillaBookedDates(villaId, { year: year + 1, month: 1 })
                    : bookingApi.getVillaBookedDates(villaId, { year, month: month + 1 }),
            ]);

            const allBookedDates = [...currentMonthData.bookedDates, ...nextMonthData.bookedDates];

            setBookedDates(allBookedDates);
        } catch (error) {
            console.error('Failed to load booked dates:', error);
            setBookedDates([]);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
    };

    const goToNextMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
    };

    const generateCalendar = (month: Date): CalendarDay[] => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();

        const days: CalendarDay[] = [];

        // Previous month's days
        const prevMonth = new Date(year, monthIndex - 1, 0);
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, monthIndex - 1, prevMonth.getDate() - i);
            days.push(createCalendarDay(date, false, today));
        }

        // Current month's days
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(year, monthIndex, day);
            days.push(createCalendarDay(date, true, today));
        }

        // Next month's days to complete the grid
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, monthIndex + 1, day);
            days.push(createCalendarDay(date, false, today));
        }

        return days;
    };

    const createCalendarDay = (date: Date, isCurrentMonth: boolean, today: Date): CalendarDay => {
        // Use local date string to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const isPast = date < today;
        const isBooked = bookedDates.includes(dateString);
        const isToday = date.getTime() === today.getTime();

        const isCheckIn = checkInDate === dateString;
        const isCheckOut = checkOutDate === dateString;
        const isSelected = isCheckIn || isCheckOut;

        // Check if date is in range
        let isInRange = false;
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            isInRange = date >= checkIn && date <= checkOut;
        } else if (checkInDate && hoveredDate) {
            const checkIn = new Date(checkInDate);
            const hovered = new Date(hoveredDate);
            if (hovered > checkIn) {
                isInRange = date >= checkIn && date <= hovered;
            }
        }

        return {
            date,
            dateString,
            isCurrentMonth,
            isToday,
            isBooked,
            isPast,
            isSelected,
            isInRange,
            isCheckIn,
            isCheckOut,
        };
    };

    const handleDateClick = (day: CalendarDay) => {
        if (day.isPast || day.isBooked || !day.isCurrentMonth) return;

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // First click or reset
            setCheckInDate(day.dateString);
            setCheckOutDate('');
        } else if (checkInDate && !checkOutDate) {
            // Second click
            const checkIn = new Date(checkInDate);
            const clickedDate = new Date(day.dateString);

            if (clickedDate > checkIn) {
                // Check if there are any booked dates between check-in and check-out
                const hasBookedDatesBetween = bookedDates.some(bookedDate => {
                    const booked = new Date(bookedDate);
                    return booked > checkIn && booked < clickedDate;
                });

                if (!hasBookedDatesBetween) {
                    setCheckOutDate(day.dateString);
                } else {
                    // Reset if there are booked dates in between
                    setCheckInDate(day.dateString);
                    setCheckOutDate('');
                }
            } else {
                // Clicked date is before check-in, reset
                setCheckInDate(day.dateString);
                setCheckOutDate('');
            }
        }
    };

    const handleConfirm = () => {
        if (checkInDate && checkOutDate) {
            onDateSelect(checkInDate, checkOutDate);
            onClose();
        }
    };

    const clearDates = () => {
        setCheckInDate('');
        setCheckOutDate('');
    };

    const formatDate = (dateString: string) => {
        // Parse the date string directly to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diffTime = checkOut.getTime() - checkIn.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Generate calendars for current and next month
    const currentMonthCalendar = generateCalendar(currentMonth);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthCalendar = generateCalendar(nextMonth);

    if (!isOpen) return null;

    const modalContent = (
        <div className='fixed inset-0 z-[999999] flex items-center justify-center p-4' style={{ zIndex: 999999 }}>
            {/* Backdrop */}
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />

            {/* Modal - Made smaller with max-w-3xl and better height constraints */}
            <div className='relative bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col'>
                {/* Header - Fixed height */}
                <div className='flex-shrink-0 p-4 border-b border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                            <Calendar className='w-5 h-5 text-[#D96F32]' />
                            <h2 className='text-xl font-bold text-[#C75D2C] font-butler'>Select dates</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors group'
                        >
                            <X className='w-5 h-5 text-[#C75D2C] group-hover:rotate-90 transition-transform duration-200' />
                        </button>
                    </div>

                    {checkInDate && checkOutDate && (
                        <div className='mt-3 flex items-center space-x-4 text-sm'>
                            <div className='flex items-center space-x-2'>
                                <div className='text-[#C75D2C]/70'>Check-in:</div>
                                <div className='font-semibold text-[#C75D2C]'>{formatDate(checkInDate)}</div>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <div className='text-[#C75D2C]/70'>Check-out:</div>
                                <div className='font-semibold text-[#C75D2C]'>{formatDate(checkOutDate)}</div>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Clock className='w-4 h-4 text-[#D96F32]' />
                                <div className='font-semibold text-[#D96F32]'>
                                    {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Calendar Navigation - Fixed height */}
                <div className='flex-shrink-0 p-4 border-b border-[#F8B259]/30'>
                    <div className='flex items-center justify-between'>
                        <button
                            onClick={goToPreviousMonth}
                            disabled={loading}
                            className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors disabled:opacity-50'
                        >
                            <ChevronLeft className='w-5 h-5 text-[#D96F32]' />
                        </button>

                        <div className='flex items-center space-x-6'>
                            <h3 className='text-base font-bold text-[#C75D2C]'>
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <h3 className='text-base font-bold text-[#C75D2C]'>
                                {nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                        </div>

                        <button
                            onClick={goToNextMonth}
                            disabled={loading}
                            className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors disabled:opacity-50'
                        >
                            <ChevronRight className='w-5 h-5 text-[#D96F32]' />
                        </button>
                    </div>
                </div>

                {/* Calendar Content - Scrollable */}
                <div className='flex-1 overflow-y-auto'>
                    <div className='p-4'>
                        {loading ? (
                            <div className='flex items-center justify-center py-16'>
                                <div className='flex flex-col items-center space-y-4'>
                                    <div className='w-8 h-8 border-4 border-[#F8B259]/30 border-t-[#D96F32] rounded-full animate-spin'></div>
                                    <p className='text-[#C75D2C]/70'>Loading available dates...</p>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Current Month */}
                                <div>
                                    <div className='grid grid-cols-7 gap-1 mb-3'>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div
                                                key={day}
                                                className='text-center text-xs font-bold text-[#C75D2C]/70 p-2'
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='grid grid-cols-7 gap-1'>
                                        {currentMonthCalendar.map((day, index) => (
                                            <CalendarDayComponent
                                                key={index}
                                                day={day}
                                                onClick={() => handleDateClick(day)}
                                                onMouseEnter={() => setHoveredDate(day.dateString)}
                                                onMouseLeave={() => setHoveredDate('')}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Next Month */}
                                <div>
                                    <div className='grid grid-cols-7 gap-1 mb-3'>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div
                                                key={day}
                                                className='text-center text-xs font-bold text-[#C75D2C]/70 p-2'
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='grid grid-cols-7 gap-1'>
                                        {nextMonthCalendar.map((day, index) => (
                                            <CalendarDayComponent
                                                key={index}
                                                day={day}
                                                onClick={() => handleDateClick(day)}
                                                onMouseEnter={() => setHoveredDate(day.dateString)}
                                                onMouseLeave={() => setHoveredDate('')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Fixed height */}
                <div className='flex-shrink-0 p-4 border-t border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                            <div className='flex items-center space-x-2'>
                                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                <span className='text-sm text-[#C75D2C]/70'>Booked</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <div className='w-3 h-3 bg-[#D96F32] rounded-full'></div>
                                <span className='text-sm text-[#C75D2C]/70'>Selected</span>
                            </div>
                        </div>

                        <div className='flex items-center space-x-3'>
                            {(checkInDate || checkOutDate) && (
                                <button
                                    onClick={clearDates}
                                    className='px-3 py-2 text-[#C75D2C] hover:bg-[#F8B259]/20 rounded-xl transition-colors font-medium text-sm'
                                >
                                    Clear dates
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                disabled={!checkInDate || !checkOutDate}
                                className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 text-sm ${
                                    checkInDate && checkOutDate
                                        ? 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 shadow-lg'
                                        : 'bg-[#C75D2C]/30 text-[#C75D2C]/50 cursor-not-allowed'
                                }`}
                            >
                                Confirm dates
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Use portal to render modal at document body level
    return createPortal(modalContent, document.body);
};

// Calendar Day Component - Made smaller
const CalendarDayComponent: React.FC<{
    day: CalendarDay;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ day, onClick, onMouseEnter, onMouseLeave }) => {
    const getDateClasses = () => {
        let classes =
            'relative w-10 h-10 flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer rounded-lg';

        if (!day.isCurrentMonth) {
            classes += ' text-[#C75D2C]/30';
        } else if (day.isPast) {
            classes += ' text-[#C75D2C]/40 cursor-not-allowed line-through';
        } else if (day.isBooked) {
            classes += ' text-red-500 cursor-not-allowed relative';
        } else if (day.isCheckIn || day.isCheckOut) {
            classes += ' bg-[#D96F32] text-white font-bold shadow-lg';
        } else if (day.isInRange) {
            classes += ' bg-[#F8B259]/30 text-[#C75D2C]';
        } else if (day.isToday) {
            classes += ' bg-[#F8B259]/20 text-[#C75D2C] font-bold border-2 border-[#F8B259]';
        } else {
            classes += ' text-[#C75D2C] hover:bg-[#F8B259]/20';
        }

        return classes;
    };

    return (
        <div className={getDateClasses()} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {day.date.getDate()}
            {day.isBooked && (
                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-1 h-6 bg-red-500 rotate-45'></div>
                </div>
            )}
            {day.isToday && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#D96F32] rounded-full'></div>
            )}
        </div>
    );
};

export default DateRangePickerModal;
