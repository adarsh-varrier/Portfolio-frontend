// frontend/src/components/ManageOtherDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import css from '../css/dashboard.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function ManageOtherDetails() {
  const [details, setDetails] = useState({
    name: '',
    roles: [''],
    location: '',
    aboutParagraphs: [''],
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    whatsappNumber: '',
    whatsappMessage: '',
    linkedinUrl: '',
    githubUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.OTHER_DETAILS);
      const data = await response.json();
      setDetails({
        name: data.name || '',
        roles: data.roles && data.roles.length > 0 ? data.roles : [''],
        location: data.location || '',
        aboutParagraphs: data.aboutParagraphs && data.aboutParagraphs.length > 0 ? data.aboutParagraphs : [''],
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        whatsappNumber: data.whatsappNumber || '',
        whatsappMessage: data.whatsappMessage || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || ''
      });
    } catch (err) {
      setError('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (index, value) => {
    const newRoles = [...details.roles];
    newRoles[index] = value;
    setDetails(prev => ({
      ...prev,
      roles: newRoles
    }));
  };

  const addRole = () => {
    setDetails(prev => ({
      ...prev,
      roles: [...prev.roles, '']
    }));
  };

  const removeRole = (index) => {
    if (details.roles.length > 1) {
      const newRoles = details.roles.filter((_, i) => i !== index);
      setDetails(prev => ({
        ...prev,
        roles: newRoles
      }));
    }
  };

  const handleAboutChange = (index, value) => {
    const newParagraphs = [...details.aboutParagraphs];
    newParagraphs[index] = value;
    setDetails(prev => ({
      ...prev,
      aboutParagraphs: newParagraphs
    }));
  };

  const addAboutParagraph = () => {
    setDetails(prev => ({
      ...prev,
      aboutParagraphs: [...prev.aboutParagraphs, '']
    }));
  };

  const removeAboutParagraph = (index) => {
    if (details.aboutParagraphs.length > 1) {
      const newParagraphs = details.aboutParagraphs.filter((_, i) => i !== index);
      setDetails(prev => ({
        ...prev,
        aboutParagraphs: newParagraphs
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.OTHER_DETAILS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...details,
          roles: details.roles.filter(role => role.trim() !== ''),
          aboutParagraphs: details.aboutParagraphs.filter(para => para.trim() !== '')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update details');
      }

      setSuccess('Details updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={css.dashboardContainer}>Loading...</div>;
  }

  return (
    <div className={css.dashboardContainer}>
      <header className={css.header}>
        <h1>Manage Other Details</h1>
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

        {success && (
          <div style={{
            background: '#efe',
            color: '#3c3',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Hero Section */}
          <div className={css.card} style={{ marginBottom: '30px' }}>
            <h2>Hero Section</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={details.name}
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
                  Roles (h3 tags) *
                </label>
                {details.roles.map((role, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                      required
                      placeholder={`Role ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    {details.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(index)}
                        style={{
                          padding: '10px 15px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRole}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Role
                </button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Location (h5 tag)
                </label>
                <input
                  type="text"
                  name="location"
                  value={details.location}
                  onChange={handleChange}
                  placeholder="e.g., from Kerala"
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
          </div>

          {/* About Us Section */}
          <div className={css.card} style={{ marginBottom: '30px' }}>
            <h2>About Us</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  About Paragraphs *
                </label>
                {details.aboutParagraphs.map((para, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <textarea
                      value={para}
                      onChange={(e) => handleAboutChange(index, e.target.value)}
                      required
                      rows="3"
                      placeholder={`Paragraph ${index + 1}`}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                    {details.aboutParagraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAboutParagraph(index)}
                        style={{
                          marginTop: '5px',
                          padding: '8px 16px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Remove Paragraph
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAboutParagraph}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Paragraph
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className={css.card} style={{ marginBottom: '30px' }}>
            <h2>Contact Information</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={details.email}
                  onChange={handleChange}
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
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={details.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g., +91 8137008256"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={details.city}
                    onChange={handleChange}
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
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={details.state}
                    onChange={handleChange}
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
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={details.country}
                    onChange={handleChange}
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
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={details.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g., 918137008256 (without +)"
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
                  WhatsApp Message
                </label>
                <input
                  type="text"
                  name="whatsappMessage"
                  value={details.whatsappMessage}
                  onChange={handleChange}
                  placeholder="e.g., Hi, Adarsh"
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
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={details.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/username"
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
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={details.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
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
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
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
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
