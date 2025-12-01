import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import { getDailyStats } from '../services/api';

function CalendarPage() {
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDailyStats();
        setDailyStats(data.dailyStats);
      } catch (err) {
        setError('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        Loading calendar...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <Calendar dailyStats={dailyStats} year={new Date().getFullYear()} />
      </div>
    </div>
  );
}

export default CalendarPage;
