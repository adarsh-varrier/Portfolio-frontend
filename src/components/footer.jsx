import React, { useState, useEffect } from 'react';
import css from '../css/footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGitlab, faTelegram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const API_URL = 'http://localhost:5000/api/other-details';

export default function Footer({ isDark }) {
  const [details, setDetails] = useState({
    email: 'adarshpmanimandiram@gmail.com',
    phoneNumber: '+91 8137008256'
  });

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch details');
      const data = await response.json();
      if (data.email) setDetails(prev => ({ ...prev, email: data.email }));
      if (data.phoneNumber) setDetails(prev => ({ ...prev, phoneNumber: data.phoneNumber }));
    } catch (error) {
      console.error('Error fetching details:', error);
      // Keep default values if fetch fails
    }
  };

  return (
    <footer className={`${css.footer} ${isDark ? css.dark : css.light}`}>
      <div className={css.section}>
        <h3>Let's Connect</h3>
        <ul>
          <li>
            <a href={`mailto:${details.email}`}>
              {details.email}
            </a>
          </li>
          <li>
            <a href={`tel:${details.phoneNumber.replace(/\s/g, '')}`}>{details.phoneNumber}</a>
          </li>
        </ul>
      </div>
      
      <div className={css.section}>
        <h3>Explore</h3>
        <ul>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/AdarshP_.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
          <li><a href="/project">Projects</a></li>
          <li><a href="/work">Experience</a></li>
        </ul>
      </div>
      
      <div className={css.section}>
        <h3>Social links</h3>
        <ul className={css.socials}>
          <li>
            <a href="https://www.linkedin.com/in/adarsh-varrier/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          </li>
          <li>
            <a href="https://github.com/adarsh-varrier" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </li>
          <li>
            <a href="https://gitlab.com/adarshwarrier" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGitlab} size="2x" />
            </a>
          </li>
          <li>
            <a href="https://t.me/adarsh_varrier?start=Hi_Adarsh" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} size="2x" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}