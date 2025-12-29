// frontend/src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import css from '../css/dashboard.module.css';

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Tommyshelby/login');
  };

  return (
    <div className={css.dashboardContainer}>
      <header className={css.header}>
        <h1>Admin Dashboard</h1>
        <div className={css.userInfo}>
          <span>Welcome, {admin?.username}</span>
          <button onClick={handleLogout} className={css.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <div className={css.content}>
        <div className={css.card}>
          <h2>👋 Welcome Back!</h2>
          <p>Manage your portfolio content from here.</p>
        </div>

        <div className={css.grid}>
          <div className={css.menuCard}>
            <h3>📚 Education</h3>
            <p>Manage education details</p>
            <button onClick={() => navigate('/admin/education')}>Manage</button>
          </div>

          <div className={css.menuCard}>
            <h3>💼 Work Experience</h3>
            <p>Update work experience</p>
            <button onClick={() => navigate('/admin/work-experience')}>Manage</button>
          </div>

          <div className={css.menuCard}>
            <h3>🚀 Projects</h3>
            <p>Add or edit projects</p>
            <button onClick={() => navigate('/admin/project')}>Manage</button>
          </div>

          <div className={css.menuCard}>
            <h3>🏆 Certificates</h3>
            <p>Manage certificates</p>
            <button onClick={() => navigate('/admin/certificates')}>Manage</button>
          </div>
          <div className={css.menuCard}>
            <h3>🏆 Out of the box</h3>
            <p>Manage Out of the box</p>
            <button onClick={() => navigate('/admin/outofthebox')}>Manage</button>
          </div>
          <div className={css.menuCard}>
            <h3>🏆 Other Details</h3>
            <p>Manage Other Details</p>
            <button onClick={() => navigate('/admin/otherdetails')}>Manage</button>
          </div>
        </div>
      </div>
    </div>
  );
}