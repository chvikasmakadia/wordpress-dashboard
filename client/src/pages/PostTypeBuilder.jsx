"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hammer, Plus, Trash2, Sliders, Database, Layers, CheckSquare, HelpCircle } from 'lucide-react';

export default function PostTypeBuilder() {
  const { postTypes, addPostType, deletePostType } = useApp();

  // New post type form state
  const [singular, setSingular] = useState('');
  const [plural, setPlural] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [enableCategories, setEnableCategories] = useState(true);

  // New custom fields state
  const [fields, setFields] = useState([]);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle auto-slug creation on singular change
  const handleSingularChange = (val) => {
    setSingular(val);
    // Convert to lowercase, replace non-alphanumeric with hyphen
    const suggestedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setSlug(suggestedSlug);
  };

  const handleAddField = () => {
    setFields(prev => [
      ...prev,
      {
        id: `field_${Date.now()}`,
        label: '',
        name: '',
        type: 'text',
        options: '' // For select fields
      }
    ]);
  };

  const handleFieldChange = (index, key, val) => {
    setFields(prev => {
      const updated = [...prev];
      updated[index][key] = val;

      // Auto-name/slugify field name on label change
      if (key === 'label') {
        updated[index].name = val.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
      }

      return updated;
    });
  };

  const handleRemoveField = (index) => {
    setFields(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!singular || !plural || !slug) {
      setErrorMessage('Please fill in Singular, Plural and Slug fields.');
      return;
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanSlug) {
      setErrorMessage('Invalid Slug.');
      return;
    }

    // Validate fields
    const validatedFields = [];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label.trim() || !f.name.trim()) {
        setErrorMessage(`Custom field #${i + 1} has empty label or ID.`);
        return;
      }
      
      const cleanFieldName = f.name.replace(/[^a-z0-9_]/g, '');
      if (!cleanFieldName) {
        setErrorMessage(`Custom field #${i + 1} has an invalid ID.`);
        return;
      }

      const fieldObj = {
        id: cleanFieldName,
        label: f.label,
        type: f.type,
        options: f.type === 'select' ? f.options.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      
      // Check duplicate IDs
      if (validatedFields.some(x => x.id === fieldObj.id)) {
        setErrorMessage(`Duplicate field ID detected: "${fieldObj.id}"`);
        return;
      }

      validatedFields.push(fieldObj);
    }

    const postTypeData = {
      slug: cleanSlug,
      singular,
      plural,
      description,
      fields: validatedFields,
      taxonomies: enableCategories ? ['category', 'tag'] : ['tag']
    };

    setSaving(true);
    try {
      await addPostType(postTypeData);
      setSuccessMessage(`Post type "${singular}" registered successfully!`);
      // Reset form
      setSingular('');
      setPlural('');
      setSlug('');
      setDescription('');
      setEnableCategories(true);
      setFields([]);
    } catch (err) {
      setErrorMessage(err.message || 'Error registering post type.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCPT = async (slug, singularLabel) => {
    if (!window.confirm(`Are you sure you want to delete the "${singularLabel}" post type? This will PERMANENTLY delete all posts associated with it.`)) {
      return;
    }

    try {
      await deletePostType(slug);
      setSuccessMessage(`Post type "${singularLabel}" deleted successfully.`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete post type.');
    }
  };

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Post Types Builder</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Build custom content types dynamically with tailored data fields.
          </p>
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
        {/* NEW POST TYPE FORM */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Create New Post Type</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Singular Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Portfolio"
                value={singular}
                onChange={e => handleSingularChange(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Plural Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Portfolios"
                value={plural}
                onChange={e => setPlural(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Slug (Identifier) *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. portfolio"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Used in API endpoints. Letters, numbers, hyphens, and underscores only.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="A short description of this post type..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={enableCategories}
                onChange={e => setEnableCategories(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              <span>Enable Categories & Tags (Taxonomies)</span>
            </label>
          </div>

          {/* CUSTOM FIELDS SUBFORM */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Custom Fields Configuration</h3>
              <button type="button" onClick={handleAddField} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <Plus size={12} /> Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No custom fields added yet. Only default fields (Title, Content, Featured Image) will be loaded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {fields.map((f, index) => (
                  <div key={f.id} className="field-config-row" style={{
                    padding: '14px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', position: 'relative'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="btn btn-danger btn-sm"
                      style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 6px' }}
                    >
                      <Trash2 size={12} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginRight: '24px' }}>
                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Field Label *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Price"
                          value={f.label}
                          onChange={e => handleFieldChange(index, 'label', e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Field ID (System Name) *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. price"
                          value={f.name}
                          onChange={e => handleFieldChange(index, 'name', e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Field Type</label>
                        <select
                          className="form-control"
                          value={f.type}
                          onChange={e => handleFieldChange(index, 'type', e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        >
                          <option value="text">Text (String)</option>
                          <option value="number">Number</option>
                          <option value="textarea">Text Area (Rich Block)</option>
                          <option value="date">Date</option>
                          <option value="boolean">Toggle / Checkbox</option>
                          <option value="select">Select Dropdown</option>
                        </select>
                      </div>

                      {f.type === 'select' && (
                        <div className="form-group" style={{ marginBottom: '0' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Options (comma-separated)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Red, Green, Blue"
                            value={f.options}
                            onChange={e => handleFieldChange(index, 'options', e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }} disabled={saving}>
            <Sliders size={16} />
            <span>{saving ? 'Creating...' : 'Register Post Type'}</span>
          </button>
        </form>

        {/* CURRENTLY REGISTERED POST TYPES */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: 'var(--color-secondary)' }} />
            <span>Registered Post Types</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {postTypes.map(pt => {
              const isDefault = pt.slug === 'post' || pt.slug === 'page';

              return (
                <div key={pt.slug} className="post-type-card" style={{
                  padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{pt.plural}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({pt.slug})</span>
                      {isDefault ? (
                        <span className="badge badge-secondary" style={{ padding: '1px 6px', fontSize: '0.6rem' }}>Default</span>
                      ) : (
                        <span className="badge badge-primary" style={{ padding: '1px 6px', fontSize: '0.6rem' }}>Custom</span>
                      )}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {pt.description || 'No description provided.'}
                    </p>
                    
                    {/* Render field summary */}
                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <strong>Custom Fields:</strong> {pt.fields && pt.fields.length > 0 ? (
                        pt.fields.map(f => f.label).join(', ')
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>None (Only built-in default fields)</span>
                      )}
                    </div>
                  </div>

                  {!isDefault && (
                    <button
                      onClick={() => handleDeleteCPT(pt.slug, pt.singular)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '6px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
