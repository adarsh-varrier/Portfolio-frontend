import React, { useState, useEffect } from 'react'
import { FaGithub, FaHome } from 'react-icons/fa'
import css from '../css/project.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function Projects({ isDark }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${css.project} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${css.project} ${isDark ? css.dark : css.light}`}>
        <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${css.project} ${isDark ? css.dark : css.light}`}>
      <a href="/#menu" className={css.homeIcon}><FaHome size={24} /></a>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => {
          // Split description by newline to display as multiple h6 elements
          const descriptionLines = project.description.split('\n').filter(line => line.trim());
          
          return (
            <div key={project._id} className={css.card}>
              <div className={css.imgContainer}>
                <img src={project.imageUrl} alt={project.title} />
              </div>
              <div className={css.content}>
                <h3>{project.title}</h3>
                {descriptionLines.map((line, index) => (
                  <h6 key={index}>{line}</h6>
                ))}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={css.githubLink}>
                    <FaGithub size={28} />
                  </a>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  )
}