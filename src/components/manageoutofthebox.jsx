// frontend/src/components/ManageOutOfTheBox.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import css from '../css/manageCertificates.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function ManageOutOfTheBox() {
  const [outOfTheBox, setOutOfTheBox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutOfTheBox();
  }, []);

  const fetchOutOfTheBox = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.OUT_OF_THE_BOX);
      const data = await response.json();
      setOutOfTheBox(data);
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
    data.append('role', formData.role);
    data.append('order', formData.order);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingId 
        ? `${API_ENDPOINTS.OUT_OF_THE_BOX}/${editingId}`
        : API_ENDPOINTS.OUT_OF_THE_BOX;
      
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

      alert(editingId ? 'Record updated!' : 'Record added!');
      resetForm();
      fetchOutOfTheBox();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      role: item.role,
      order: item.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`${API_ENDPOINTS.OUT_OF_THE_BOX}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Record deleted!');
      fetchOutOfTheBox();
    } catch (error) {
      alert('Error deleting record');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      role: '',
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
        <h1>Manage Out of the Box</h1>
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
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={css.form}>
            <h2>{editingId ? 'Edit Record' : 'Add New Record'}</h2>
            
            <div className={css.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Tinker-Hack 3.0"
              />
            </div>

            <div className={css.formGroup}>
              <label>Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mentor"
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
              <label>Image {!editingId && '*'}</label>
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
                {editingId ? 'Update' : 'Add'} Record
              </button>
              <button type="button" onClick={resetForm} className={css.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={css.certificatesList}>
          <h2>All Records</h2>
          {loading ? (
            <p>Loading...</p>
          ) : outOfTheBox.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <div className={css.grid}>
              {outOfTheBox.map((item) => (
                <div key={item._id} className={css.certCard}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div className={css.certInfo}>
                    <h3>{item.title}</h3>
                    <p><strong>Role:</strong> {item.role}</p>
                  </div>
                  <div className={css.actions}>
                    <button onClick={() => handleEdit(item)} className={css.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className={css.deleteBtn}>
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
