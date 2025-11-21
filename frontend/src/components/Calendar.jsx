import { useState, useEffect } from 'react';

function Calendar({ dailyStats, year = 2025 }) {
  const [currentYear, setCurrentYear] = useState(year);

  // Create a map of date -> tree count for easy lookup
  const statsMap = {};
  dailyStats.forEach(stat => {
    statsMap[stat.date] = stat.treeCount;
  });

  // Function to get days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Function to get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Generate calendar for a specific month
  const generateMonth = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const treeCount = statsMap[dateStr] || 0;
      days.push({ day, treeCount, dateStr });
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate November and December
  const novemberDays = generateMonth(currentYear, 11);
  const decemberDays = generateMonth(currentYear, 12);

  const renderMonth = (month, days) => {
    return (
      <div style={{
        flex: '1',
        minWidth: '280px',
        border: '2px solid var(--color-primary)',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: 'white'
      }}>
        {/* Month Header */}
        <h3 style={{
          textAlign: 'center',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
          fontSize: '1.25rem'
        }}>
          {monthNames[month - 1]} {currentYear}
        </h3>

        {/* Day Names */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.25rem',
          marginBottom: '0.5rem'
        }}>
          {dayNames.map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: 'var(--color-text-light)',
              padding: '0.25rem'
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.25rem'
        }}>
          {days.map((dayData, index) => {
            if (!dayData) {
              return <div key={`empty-${index}`} />;
            }

            const hasActivity = dayData.treeCount > 0;
            const today = new Date();
            const isToday = dayData.day === today.getDate() &&
                           month === (today.getMonth() + 1) &&
                           currentYear === today.getFullYear();

            return (
              <div
                key={dayData.dateStr}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isToday ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  borderRadius: '8px',
                  backgroundColor: hasActivity ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: hasActivity ? 'white' : 'var(--color-text)',
                  fontSize: '0.875rem',
                  fontWeight: hasActivity ? 'bold' : 'normal',
                  cursor: hasActivity ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (hasActivity) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={hasActivity ? `${dayData.treeCount} trees spotted` : 'No activity'}
              >
                <span>{dayData.day}</span>
                {hasActivity && (
                  <span style={{
                    fontSize: '0.65rem',
                    marginTop: '0.125rem'
                  }}>
                    🎄 {dayData.treeCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>
          🎄 Season Calendar
        </h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: '3px',
            marginRight: '0.5rem'
          }} />
          Days with activity
        </div>
      </div>

      {/* Calendars Container - Responsive */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        justifyContent: 'center'
      }}>
        {renderMonth(11, novemberDays)}
        {renderMonth(12, decemberDays)}
      </div>
    </div>
  );
}

export default Calendar;
