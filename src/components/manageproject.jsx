// frontend/src/components/ManageProject.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import css from '../css/manageCertificates.module.css';
import { API_ENDPOINTS } from '../config/api';

export default function ManageProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS);
      const data = await response.json();
      setProjects(data);
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
    data.append('githubUrl', formData.githubUrl);
    data.append('order', formData.order);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingId 
        ? `${API_ENDPOINTS.PROJECTS}/${editingId}`
        : API_ENDPOINTS.PROJECTS;
      
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

      alert(editingId ? 'Project updated!' : 'Project added!');
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || '',
      order: project.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`${API_ENDPOINTS.PROJECTS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Project deleted!');
      fetchProjects();
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      githubUrl: '',
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
        <h1>Manage Projects</h1>
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
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={css.form}>
            <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            
            <div className={css.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Emotion Based Music Recommendation System"
              />
            </div>

            <div className={css.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Enter description lines separated by newlines. Each line will be displayed as a separate h6 element."
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Tip: Press Enter to create a new line. Each line will be displayed separately.
              </small>
            </div>

            <div className={css.formGroup}>
              <label>GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
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
              <label>Project Image {!editingId && '*'}</label>
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
                {editingId ? 'Update' : 'Add'} Project
              </button>
              <button type="button" onClick={resetForm} className={css.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={css.certificatesList}>
          <h2>All Projects</h2>
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className={css.grid}>
              {projects.map((project) => (
                <div key={project._id} className={css.certCard}>
                  <img src={project.imageUrl} alt={project.title} />
                  <div className={css.certInfo}>
                    <h3>{project.title}</h3>
                    <p><strong>Description:</strong> {project.description.substring(0, 100)}...</p>
                    {project.githubUrl && (
                      <p><strong>GitHub:</strong> <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">{project.githubUrl}</a></p>
                    )}
                  </div>
                  <div className={css.actions}>
                    <button onClick={() => handleEdit(project)} className={css.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project._id)} className={css.deleteBtn}>
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
