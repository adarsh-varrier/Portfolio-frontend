// workexperience.jsx
import React, { useState, useEffect } from 'react'
import { FaRegCalendarAlt, FaHome } from "react-icons/fa";
import css from '../css/work.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function Workexperience({ isDark }) {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WORK_EXPERIENCE);
      const data = await response.json();
      if (data.success) {
        setWorkExperiences(data.data);
      }
    } catch (error) {
      console.error('Error fetching work experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.work} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <div style={{ color: isDark ? '#fff' : '#333' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${css.work} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        {workExperiences.length === 0 ? (
          <div style={{ color: isDark ? '#fff' : '#333', textAlign: 'center' }}>
            No work experience available
          </div>
        ) : (
          workExperiences.map((workExp) => (
            <div key={workExp._id} className={css.card}>
              <div className={css.content}>
                <h3>{workExp.company}</h3>
                <h4>{workExp.position}</h4>
                <div className={css.gradeContainer}>
                  <p><FaRegCalendarAlt size={24} />{workExp.startDate} - {workExp.endDate}</p>
                </div>
                {workExp.description && (
                  <p style={{ marginTop: '10px', color: isDark ? '#ccc' : '#666' }}>
                    {workExp.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
    </div>
  )
}