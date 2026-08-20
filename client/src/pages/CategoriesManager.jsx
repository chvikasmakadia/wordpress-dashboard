"use client";

import React, { useState } from 'react';
import { useParams, Link } from '../routing';
import { useApp } from '../context/AppContext';
import { Folder, Plus, Trash2, Tag } from 'lucide-react';

export default function CategoriesManager() {
  const { postTypeSlug } = useParams();
  const { postTypes, categories, addCategory, deleteCategory } = useApp();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currentPostType = postTypes.find(pt => pt.slug === postTypeSlug);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      await addCategory({ name, slug, description, post_type: postTypeSlug });
      setSuccessMsg(`Category "${name}" added successfully.`);
      setName('');
      setSlug('');
      setDescription('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (id === '1') {
      alert('The "Uncategorized" category cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the category "${catName}"? Posts in this category will default to Uncategorized.`)) {
      return;
    }

    try {
      await deleteCategory(id);
      setSuccessMsg('Category deleted successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete category.');
    }
  };

  if (!currentPostType) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Post Type Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cannot manage categories for invalid post type.</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{currentPostType.singular} Categories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage the classification categories for your {currentPostType.plural.toLowerCase()}.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
        {/* ADD CATEGORY FORM */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Add New Category</span>
          </h2>

          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Technology"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              How it appears on your site.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. technology"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              The URL-friendly version of the name. If empty, we will auto-generate it.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="A short description of this category..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={saving}>
            <Folder size={16} />
            <span>{saving ? 'Adding...' : 'Add New Category'}</span>
          </button>
        </form>

        {/* LIST TABLE */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="admin-table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Slug</th>
                </tr>
              </thead>
              <tbody>
                {categories.filter(cat => (cat.post_type || 'post') === postTypeSlug).map(cat => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: '500', color: '#fff' }}>
                      {cat.name}
                      <div className="row-actions">
                        {cat.id !== '1' ? (
                          <button 
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="action-danger"
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Trash2 size={11} /> Delete
                            </span>
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Locked (Default)</span>
                        )}
                      </div>
                    </td>
                    <td>{cat.description || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td>{cat.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
