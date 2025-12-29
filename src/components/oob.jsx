import React, { useState, useEffect } from 'react';
import css from '../css/oob.module.css'; 
import { FaHome } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/outofthebox';

export default function Oob({ isDark }) {
  const [outOfTheBox, setOutOfTheBox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOutOfTheBox();
  }, []);

  const fetchOutOfTheBox = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch out of the box records');
      const data = await response.json();
      setOutOfTheBox(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.Oob} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${css.Oob} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${css.Oob} ${isDark ? css.dark : css.light}`}>
      <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
      {outOfTheBox.length === 0 ? (
        <p>No records found.</p>
      ) : (
        outOfTheBox.map((item) => (
          <div key={item._id} className={css.card}>
            <div className={css.imgContainer}>
              <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className={css.content}>
              <h4>{item.title}</h4>
              <h5>{item.role}</h5>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
