import React, { useState, useEffect } from 'react'
import { FaGraduationCap, FaHome } from "react-icons/fa";
import css from '../css/education.module.css';

const API_URL = 'http://localhost:5000/api/education';

export default function Education({ isDark }) {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch education');
      const data = await response.json();
      setEducation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.edu} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Loading education...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${css.edu} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${css.edu} ${isDark ? css.dark : css.light}`}>
      <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
      {education.length === 0 ? (
        <p>No education records found.</p>
      ) : (
        education.map((edu) => (
          <div key={edu._id} className={css.card}>
            <div className={css.imgContainer}>
              <img src={edu.imageUrl} alt={edu.degree} />
            </div>
            <div className={css.content}>
              <h3>{edu.degree}</h3>
              <h4>{edu.university}</h4>
              <div className={css.gradeContainer}>
                <p><FaGraduationCap size={24} />{edu.grade}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}