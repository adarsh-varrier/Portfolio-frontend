import React, { useState, useEffect } from 'react'
import { FaWhatsapp, FaHome, FaLinkedin, FaGithub, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import css from '../css/contact.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function Contact({ isDark }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.OTHER_DETAILS);
      if (!response.ok) throw new Error('Failed to fetch details');
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
      // Set default values if fetch fails
      setDetails({
        email: 'adarshpmanimandiram@gmail.com',
        phoneNumber: '+91 8137008256',
        city: 'Kottayam',
        state: 'Kerala',
        country: 'India',
        whatsappNumber: '918137008256',
        whatsappMessage: 'Hi, Adarsh',
        linkedinUrl: 'https://www.linkedin.com/in/adarsh-varrier/',
        githubUrl: 'https://github.com/adarsh-varrier'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.contact} ${isDark ? css.dark : css.light}`}>
        <a href="/" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Loading...</p>
      </div>
    );
  }

  const phoneNumber = details?.whatsappNumber || "918137008256";
  const message = details?.whatsappMessage || "Hi, Adarsh";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`${css.contact} ${isDark ? css.dark : css.light}`}>
        <a href="/" className={css.homeIcon}><FaHome size={24} /></a>
        <div className={css.main}>
            {details?.email && (
              <div className={css.mainitem}>
                <div className={css.mainicon}>
                    <FaEnvelope size={18}/>
                </div>
                <a href={`mailto:${details.email}`}>
                    {details.email}
                </a>
              </div>
            )}
            {(details?.city || details?.state || details?.country) && (
              <div className={css.mainitem}>
                <div className={css.mainicon}>
                    <FaMapMarkerAlt size={18}/>
                </div>
                {details.city && <h4>{details.city}</h4>}
                {(details.state || details.country) && (
                  <h3>{[details.state, details.country].filter(Boolean).join(', ')}</h3>
                )}
              </div>
            )}
            {details?.phoneNumber && (
              <div className={css.mainitem}>
                <div className={css.mainicon}>
                    <FaPhoneAlt size={18} />
                </div>
                <a href={`tel:${details.phoneNumber.replace(/\s/g, '')}`}>{details.phoneNumber}</a>
              </div>
            )}
        </div>
        <div className={css.sub}>
            {details?.whatsappNumber && (
              <button className={css.subitem} onClick={() => window.open(url, "_blank")}>
                <div className={css.subicon}>
                    <FaWhatsapp size={22} />
                </div>
                WhatsApp
              </button>
            )}
            {details?.linkedinUrl && (
              <a href={details.linkedinUrl} target="_blank" rel="noopener noreferrer" className={css.subitem}>
                <div className={css.subicon}>
                    <FaLinkedin size={32} />
                </div>
                Linkedin
              </a>
            )}
            {details?.githubUrl && (
              <a href={details.githubUrl} target="_blank" rel="noopener noreferrer" className={css.subitem}>
                <div className={css.subicon}>
                    <FaGithub size={32} />
                </div>
                Github
              </a>
            )}
        </div>
    </div>
  )
}