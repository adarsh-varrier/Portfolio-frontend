// frontend/src/components/ManageCertificates.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import css from '../css/manageCertificates.module.css';

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issuer: '',
    issueDate: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/certificates');
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('issuer', formData.issuer);
    data.append('issueDate', formData.issueDate);
    data.append('order', formData.order);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingId 
        ? `http://localhost:5000/api/certificates/${editingId}`
        : 'http://localhost:5000/api/certificates';
      
      const method = editingId ? 'put' : 'post';

      await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      alert(editingId ? 'Certificate updated!' : 'Certificate added!');
      resetForm();
      fetchCertificates();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title,
      description: cert.description || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      order: cert.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Certificate deleted!');
      fetchCertificates();
    } catch (error) {
      alert('Error deleting certificate');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      issuer: '',
      issueDate: '',
      order: 0
    });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setUploadProgress(0);
  };

  return (
    <div className={css.container}>
      <header className={css.header}>
        <h1>Manage Certificates</h1>
        <div>
          <button onClick={() => navigate('/admin/dashboard')} className={css.backBtn}>
            Back to Dashboard
          </button>
          <button onClick={() => { logout(); navigate('/Tommyshelby/login'); }} className={css.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <div className={css.content}>
        <button onClick={() => setShowForm(!showForm)} className={css.addBtn}>
          {showForm ? 'Cancel' : '+ Add Certificate'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={css.form}>
            <h2>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
            
            <div className={css.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={css.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className={css.formGroup}>
              <label>Issuer</label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
              />
            </div>

            <div className={css.formGroup}>
              <label>Issue Date</label>
              <input
                type="text"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                placeholder="e.g., Jan 2024"
              />
            </div>

            <div className={css.formGroup}>
              <label>Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
              />
            </div>

            <div className={css.formGroup}>
              <label>Certificate Image {!editingId && '*'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingId}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className={css.progress}>
                  <div className={css.progressBar} style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress}%
                  </div>
                </div>
              )}
            </div>

            <div className={css.formActions}>
              <button type="submit" className={css.submitBtn}>
                {editingId ? 'Update' : 'Add'} Certificate
              </button>
              <button type="button" onClick={resetForm} className={css.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={css.certificatesList}>
          <h2>All Certificates</h2>
          {loading ? (
            <p>Loading...</p>
          ) : certificates.length === 0 ? (
            <p>No certificates found.</p>
          ) : (
            <div className={css.grid}>
              {certificates.map((cert) => (
                <div key={cert._id} className={css.certCard}>
                  <img src={cert.imageUrl} alt={cert.title} />
                  <div className={css.certInfo}>
                    <h3>{cert.title}</h3>
                    {cert.issuer && <p><strong>Issuer:</strong> {cert.issuer}</p>}
                    {cert.issueDate && <p><strong>Date:</strong> {cert.issueDate}</p>}
                  </div>
                  <div className={css.actions}>
                    <button onClick={() => handleEdit(cert)} className={css.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cert._id)} className={css.deleteBtn}>
                      Delete
                    </button>
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