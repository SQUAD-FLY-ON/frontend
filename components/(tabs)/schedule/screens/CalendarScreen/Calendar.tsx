import { useScheduleStore } from '@/store/useScheduleStore';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useShallow } from 'zustand/react/shallow';
interface YourComponentProps {
  dates: Record<string, any>;
  setDates: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const CustomCalendar = ({ dates, setDates }: YourComponentProps) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { currentMarkedDates, setCurrentMarkedDates } = useScheduleStore(
    useShallow((state) => ({
      currentMarkedDates: state.currentMarkedDates,
      setCurrentMarkedDates: state.setCurrentMarkedDates,
    }))
  );

  const resetDate = () => {
    setStartDate(null);
    setEndDate(null);
    setDates({});
  }

  const setOneStartDate = (selectedDate: string) => {
    setStartDate(selectedDate);
    setEndDate(null);
    setDates({
      [selectedDate]: {
        startingDay: true,
        endingDay: true,
        color: '#3A88F4',
        textColor: 'white',
      },
    });
  }

  const setDatePeriod = (selectedDate: string) => {
    const range = getDatesBetween(startDate!, selectedDate);
    const newMarked: Record<string, any> = {};

    range.forEach((date, idx) => {
      if (idx === 0) {
        newMarked[date] = {
          startingDay: true,
          color: '#3A88F4',
          textColor: 'white',
        };
      } else if (idx === range.length - 1) {
        newMarked[date] = {
          endingDay: true,
          color: '#3A88F4',
          textColor: 'white',
        };
      } else {
        newMarked[date] = {
          color: '#84B8FF',
          textColor: 'white',
        };
      }
    });

    setEndDate(selectedDate);
    setDates(newMarked);
  }

  const getDatesBetween = (start: string, end: string) => {
    const range = [];
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const isReversed = startDay.isAfter(endDay);
    const from = isReversed ? endDay : startDay;
    const to = isReversed ? startDay : endDay;

    let current = from;

    while (current.isBefore(to) || current.isSame(to, 'day')) {
      range.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }

    return range;
  };

  const handleDayPress = (day: DateData) => {
    const selectedDate = day.dateString;
    if (startDate && !endDate && selectedDate === startDate) {
      resetDate();
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setOneStartDate(selectedDate);
    }
    else if (startDate && !endDate) {
      setDatePeriod(selectedDate);
    }
  };

  return (
    <Calendar
      style={[{
        borderWidth: 1,
        borderColor: 'gray'
      }]}
      markingType="period"
      current={dayjs().format('YYYY-MM-DD')}
      markedDates={dates}
      onDayPress={handleDayPress}
      theme={{
        selectedDayBackgroundColor: '#3A88F4',
        todayTextColor: '#3A88F4',
        arrowColor: '#3A88F4',
      }}
      minDate={dayjs().format('YYYY-MM-DD')}
    />
  );
};

export default CustomCalendar;