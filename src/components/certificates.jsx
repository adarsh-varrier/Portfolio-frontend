// frontend/src/components/Certificates.jsx
import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import css from '../css/certificates.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function Certificates({ isDark }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CERTIFICATES);
      if (!response.ok) throw new Error('Failed to fetch certificates');
      const data = await response.json();
      setCertificates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.certificates} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Loading certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${css.certificates} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`${css.certificates} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        
        {certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          certificates.map((cert) => (
            <div key={cert._id} className={css.card} onClick={() => handleImageClick(cert)}>
              <div className={css.imgContainer}>
                <img src={cert.imageUrl} alt={cert.title} />
                {cert.title && <div className={css.certTitle}>{cert.title}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      
    </>
  );
}