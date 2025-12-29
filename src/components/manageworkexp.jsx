// frontend/src/components/manageworkexp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import css from '../css/dashboard.module.css';

const API_URL = 'http://localhost:5000/api/work-experience';

export default function ManageWorkExp() {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    isCurrent: false,
    order: 0
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setWorkExperiences(data.data);
      }
    } catch (err) {
      setError('Failed to fetch work experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save work experience');
      }

      await fetchWorkExperiences();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (workExp) => {
    setFormData({
      company: workExp.company,
      position: workExp.position,
      startDate: workExp.startDate,
      endDate: workExp.endDate,
      description: workExp.description || '',
      isCurrent: workExp.isCurrent,
      order: workExp.order || 0
    });
    setEditingId(workExp._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work experience?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete work experience');
      }

      await fetchWorkExperiences();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: 'Present',
      description: '',
      isCurrent: false,
      order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className={css.dashboardContainer}>Loading...</div>;
  }

  return (
    <div className={css.dashboardContainer}>
      <header className={css.header}>
        <h1>Manage Work Experience</h1>
        <div className={css.userInfo}>
          <button onClick={() => navigate('/admin/dashboard')} className={css.logoutBtn}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className={css.content}>
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {showForm ? 'Cancel' : '+ Add Work Experience'}
          </button>
        </div>

        {showForm && (
          <div className={css.card} style={{ marginBottom: '30px' }}>
            <h2>{editingId ? 'Edit' : 'Add'} Work Experience</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Start Date *
                    </label>
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Sep 2025"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      End Date
                    </label>
                    <input
                      type="text"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      placeholder="e.g., Present or Sep 2025"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="isCurrent"
                      checked={formData.isCurrent}
                      onChange={handleChange}
                    />
                    Current Position
                  </label>

                  <div>
                    <label style={{ marginRight: '8px', fontWeight: '500' }}>Order:</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="0"
                      style={{
                        width: '80px',
                        padding: '5px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {editingId ? 'Update' : 'Add'} Work Experience
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      style={{
                        padding: '12px 24px',
                        background: '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        <div className={css.card}>
          <h2>Work Experiences ({workExperiences.length})</h2>
          {workExperiences.length === 0 ? (
            <p style={{ color: '#666', marginTop: '10px' }}>
              No work experiences added yet. Click "Add Work Experience" to get started.
            </p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {workExperiences.map((workExp) => (
                <div
                  key={workExp._id}
                  style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{workExp.company}</h3>
                      <h4 style={{ margin: '0 0 10px 0', color: '#666', fontWeight: '500' }}>
                        {workExp.position}
                      </h4>
                      <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '14px' }}>
                        {workExp.startDate} - {workExp.endDate}
                      </p>
                      {workExp.description && (
                        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
                          {workExp.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEdit(workExp)}
                        style={{
                          padding: '8px 16px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(workExp._id)}
                        style={{
                          padding: '8px 16px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

