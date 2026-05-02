import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, calendarConfig, timeSlots } from '../data/booking/mockBooking.js';
import { BookingThemeProvider } from '../context/bookingThemeContext.jsx';
import { BookingLangProvider, useBookingLang } from '../context/bookingLangContext.jsx';
import BookingNavbar from '../components/booking/Navbar.jsx';
import StepIndicator from '../components/booking/StepIndicator.jsx';
import ServicePanel from '../components/booking/ServicePanel.jsx';
import CalendarGrid from '../components/booking/CalendarGrid.jsx';
import TimeSlots from '../components/booking/TimeSlots.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';

function BookingShell() {
  const navigate = useNavigate();
  const { tr, lang } = useBookingLang();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('treatment');
  const [selectedDay, setSelectedDay] = useState(19);
  const [selectedTime, setSelectedTime] = useState('10:30');

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const getDayOfWeek = (day) => new Date(calendarConfig.year, calendarConfig.month, day).getDay();

  const isPast = (day) => day < calendarConfig.defaultSelected;
  const isUnavailable = (day) => calendarConfig.unavailableDays.includes(getDayOfWeek(day));
  const isSelectable = (day) => !isPast(day) && !isUnavailable(day);

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDaySelect = (day) => {
    if (!isSelectable(day)) return;
    setSelectedDay(day);
  };

  const handleTimeSelect = (slotId) => {
    if (timeSlots.find((s) => s.id === slotId)?.booked) return;
    setSelectedTime(slotId);
    setStep(3);
  };

  const handleConfirm = () => {
    window.alert('Booking confirmed! (mock)');
  };

  const formatSelectedDate = (day) => {
    const date = new Date(calendarConfig.year, calendarConfig.month, day);
    const dayOfWeek = date.getDay();
    const month = tr.months[calendarConfig.month];
    const fullDay = tr.fullDays[dayOfWeek];
    return tr.formatDate(day, month, fullDay);
  };

  const selectedDateLabel = formatSelectedDate(selectedDay);
  const service = useMemo(() => services.find((s) => s.id === selectedService) ?? services[0], [selectedService]);

  return (
    <div className="slotly-root">
      <BookingNavbar onBack={() => navigate('/')} />
      <StepIndicator step={step} />
      <main className="slotly-main">
        <ServicePanel services={services} selectedService={selectedService} onSelect={handleServiceSelect} />
        <section className="slotly-stage">
          <div className="slotly-stage-grid">
            <CalendarGrid
              year={calendarConfig.year}
              month={calendarConfig.month}
              selectedDay={selectedDay}
              onSelectDay={handleDaySelect}
              getDaysInMonth={getDaysInMonth}
              getFirstDayOfMonth={getFirstDayOfMonth}
              isPast={isPast}
              isUnavailable={isUnavailable}
            />
            <TimeSlots
              slots={timeSlots}
              selectedTime={selectedTime}
              onSelect={handleTimeSelect}
              selectedDateLabel={selectedDateLabel}
            />
          </div>
          <BookingSummary
            service={service}
            dateLabel={selectedDateLabel}
            selectedTime={selectedTime}
            onConfirm={handleConfirm}
            step={step}
          />
        </section>
      </main>
    </div>
  );
}

export default function SlotlyBookingPage() {
  return (
    <BookingThemeProvider>
      <BookingLangProvider>
        <BookingShell />
      </BookingLangProvider>
    </BookingThemeProvider>
  );
}
