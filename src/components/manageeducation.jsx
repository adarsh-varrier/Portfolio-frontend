// frontend/src/components/ManageEducation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import css from '../css/manageCertificates.module.css';

const API_URL = 'http://localhost:5000/api/education';

export default function ManageEducation() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    university: '',
    grade: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEducation(data);
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
    data.append('degree', formData.degree);
    data.append('university', formData.university);
    data.append('grade', formData.grade);
    data.append('order', formData.order);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingId 
        ? `${API_URL}/${editingId}`
        : API_URL;
      
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

      alert(editingId ? 'Education record updated!' : 'Education record added!');
      resetForm();
      fetchEducation();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu._id);
    setFormData({
      degree: edu.degree,
      university: edu.university,
      grade: edu.grade,
      order: edu.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Education record deleted!');
      fetchEducation();
    } catch (error) {
      alert('Error deleting education record');
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      university: '',
      grade: '',
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
        <h1>Manage Education</h1>
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
          {showForm ? 'Cancel' : '+ Add Education'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={css.form}>
            <h2>{editingId ? 'Edit Education' : 'Add New Education'}</h2>
            
            <div className={css.formGroup}>
              <label>Degree *</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                placeholder="e.g., Master of Computer Applications"
              />
            </div>

            <div className={css.formGroup}>
              <label>University *</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                required
                placeholder="e.g., Cochin University of Science and Technology"
              />
            </div>

            <div className={css.formGroup}>
              <label>Grade *</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                placeholder="e.g., 8.8 CGPA or 80.25%"
              />
            </div>

            <div className={css.formGroup}>
              <label>Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={css.formGroup}>
              <label>Education Image {!editingId && '*'}</label>
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
                {editingId ? 'Update' : 'Add'} Education
              </button>
              <button type="button" onClick={resetForm} className={css.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={css.certificatesList}>
          <h2>All Education Records</h2>
          {loading ? (
            <p>Loading...</p>
          ) : education.length === 0 ? (
            <p>No education records found.</p>
          ) : (
            <div className={css.grid}>
              {education.map((edu) => (
                <div key={edu._id} className={css.certCard}>
                  <img src={edu.imageUrl} alt={edu.degree} />
                  <div className={css.certInfo}>
                    <h3>{edu.degree}</h3>
                    <p><strong>University:</strong> {edu.university}</p>
                    <p><strong>Grade:</strong> {edu.grade}</p>
                  </div>
                  <div className={css.actions}>
                    <button onClick={() => handleEdit(edu)} className={css.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(edu._id)} className={css.deleteBtn}>
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

