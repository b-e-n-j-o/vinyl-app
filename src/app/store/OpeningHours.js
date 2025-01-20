import React from 'react';
import { Clock } from 'lucide-react';

const formatHours = (hourString) => {
  // Remove quotes and split into day and hours
  const [day, hours] = hourString.replace(/['"]/g, '').split(': ');
  
  if (!hours) return { day, open: 'Fermé', close: 'Fermé' };

  // Split hours into open and close times
  const [openTime, closeTime] = hours.split('–').map(time => time.trim());

  // Function to format the time
  const formatTime = (time) => {
    if (!time) return '';
    // Handle special case for PM times without hours
    if (time.includes('PM') && !time.includes('AM') && time.includes(':')) {
      const [h, m] = time.replace(' PM', '').split(':');
      return `${h}:${m}`;
    }
    // Convert 12h format to 24h format
    if (time.includes('AM') || time.includes('PM')) {
      const [t, period] = time.split(' ');
      const [hours, minutes] = t.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
    }
    return time;
  };

  return {
    day,
    open: formatTime(openTime),
    close: formatTime(closeTime)
  };
};

const OpeningHours = ({ hours }) => {
  if (!hours || !Array.isArray(hours) || hours.length === 0) {
    return null;
  }

  const daysOrder = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 7
  };

  const formattedHours = hours
    .map(formatHours)
    .sort((a, b) => daysOrder[a.day] - daysOrder[b.day]);

  const daysInFrench = {
    'Monday': 'Lundi',
    'Tuesday': 'Mardi',
    'Wednesday': 'Mercredi',
    'Thursday': 'Jeudi',
    'Friday': 'Vendredi',
    'Saturday': 'Samedi',
    'Sunday': 'Dimanche'
  };

  return (
    <div className="flex items-start space-x-2">
      <Clock className="h-5 w-5 flex-shrink-0 mt-1 text-[#6F4E37]" />
      <div className="flex-1">
        <h3 className="font-semibold mb-2 text-[#6F4E37]">Horaires d'ouverture</h3>
        <div className="grid gap-2">
          {formattedHours.map(({ day, open, close }, index) => (
            <div 
              key={day}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <span className="font-medium text-[#6F4E37]">
                {daysInFrench[day]}
              </span>
              <span className="text-[#6F4E37]">
                {open === 'Fermé' ? (
                  'Fermé'
                ) : (
                  `${open} - ${close}`
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpeningHours;