// Home.jsx
import React, { useState, useEffect } from 'react';
import css from '../css/home.module.css';
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:5000/api/other-details';

export default function Home({ isDark, scrollToMenu }) {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch details');
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
      // Set default values if fetch fails
      setDetails({
        name: 'Adarsh',
        roles: ['Web Developer', 'Full Stack Developer'],
        location: 'from Kerala',
        aboutParagraphs: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.home} ${isDark ? css.dark : css.light}`}>
        <div className={css.homemain}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${css.home} ${isDark ? css.dark : css.light}`}>
      <div className={css.homemain}>
        <h1>Hi, I am {details?.name || 'Adarsh'}.</h1>
        <div style={{ position: 'relative', minHeight: '2.5rem', marginTop: '1rem' }}>
          {details?.roles && details.roles.map((role, index) => (
            <h3 key={index}>{role}</h3>
          ))}
          {details?.location && <h5>{details.location}</h5>}
        </div>
        
      </div>
      <div className={css.homesub}>
        <button onClick={()=>setShowAbout(true)}>About me</button>
        <button onClick={() => navigate("/contact")}>Let's Connect</button>
        <button onClick={scrollToMenu}>My Journey</button>
      </div>
      {/* About Me Popup */}
      {showAbout && (
        <div className={css.popupOverlay} onClick={() => setShowAbout(false)}>
          <div className={css.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={css.closeBtn} onClick={() => setShowAbout(false)}>×</button>
            <h2 className={css.popupTitle}>About Me</h2>
            <div className={css.board}>
              {details?.aboutParagraphs && details.aboutParagraphs.length > 0 ? (
                details.aboutParagraphs.map((paragraph, index) => (
                  <p key={index} className={css.paragraph}>{paragraph}</p>
                ))
              ) : (
                <p className={css.paragraph}>No about information available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
