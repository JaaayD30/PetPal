import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConnectedMatches = () => {
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/my-matches/details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching match list:', err);
      }
    };

    fetchMatches();
  }, []);

  const handleRemove = async (matchId) => {
    try {
      await axios.delete(`http://localhost:5000/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(prev => prev.filter(match => match.id !== matchId));
    } catch (err) {
      console.error('Error removing match:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Matched Companions</h2>

      {matches.map((match, index) => (
        <div key={match.id} style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f5f5f5',
          padding: 16,
          marginBottom: 12,
          borderRadius: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <img
            src={match.base64image ? `data:image/jpeg;base64,${match.base64image}` : '/Images/default-user.png'}
            alt="Profile"
            style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 16 }}
          />
          <div style={{ flexGrow: 1 }}>
            <p><strong>You have matched with {match.full_name}</strong></p>
            <button onClick={() => navigate(`/match-details/${match.id}`)} style={{ marginRight: 10 }}>
              View Details
            </button>
            <button onClick={() => handleRemove(match.id)} style={{ backgroundColor: '#e74c3c', color: 'white' }}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};



export default ConnectedMatches;
