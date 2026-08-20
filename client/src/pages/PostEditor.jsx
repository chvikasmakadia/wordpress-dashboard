"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '../routing';
import { useApp } from '../context/AppContext';
import { Save, ArrowLeft, Image, UploadCloud, Globe, FileText, Check, AlertCircle, Sparkles, Edit3 } from 'lucide-react';
import PageBuilder from '../components/PageBuilder';
import MediaLibraryModal from '../components/MediaLibraryModal';

export default function PostEditor({ initialData }) {
  const { postTypeSlug, id } = useParams();
  const navigate = useNavigate();
  const { postTypes, categories, tags, reloadAll } = useApp();

  const isNew = id === 'new' || !id;
  const currentPostType = postTypes.find(pt => pt.slug === postTypeSlug);

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [selectedCats, setSelectedCats] = useState(initialData?.categories || []);
  const [postTags, setPostTags] = useState(initialData?.tags || []);
  const [customFields, setCustomFields] = useState(initialData?.custom_fields || {});
  const [editorMode, setEditorMode] = useState(initialData?.editor_mode || 'classic');
  const [builderContent, setBuilderContent] = useState(Array.isArray(initialData?.builder_content) ? initialData.builder_content : []);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);

  const [loading, setLoading] = useState(isNew ? false : !initialData);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Set up default custom fields on load or post type change
  useEffect(() => {
    if (currentPostType && isNew) {
      const initialFields = {};
      currentPostType.fields.forEach(f => {
        if (f.type === 'boolean') {
          initialFields[f.id] = false;
        } else if (f.type === 'number') {
          initialFields[f.id] = 0;
        } else {
          initialFields[f.id] = '';
        }
      });
      setCustomFields(initialFields);
      setTitle('');
      setContent('');
      setFeaturedImage('');
      setStatus('draft');
      setSelectedCats([]);
      setPostTags([]);
      setEditorMode('classic');
      setBuilderContent([]);
    }
  }, [postTypeSlug, id, currentPostType]);

  const isFirstMount = React.useRef(true);

  // Load post if editing
  useEffect(() => {
    if (initialData && isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const loadPost = async () => {
      if (isNew) return;
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          const post = await res.json();
          setTitle(post.title);
          setContent(post.content);
          setFeaturedImage(post.featured_image || '');
          setStatus(post.status);
          setSelectedCats(post.categories || []);
          setPostTags(post.tags || []);
          setCustomFields(post.custom_fields || {});
          setEditorMode(post.editor_mode || 'classic');
          setBuilderContent(Array.isArray(post.builder_content) ? post.builder_content : []);
        } else {
          setErrorMsg('Post not found.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setErrorMsg('Network error loading post.');
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNew) {
      loadPost();
    }
  }, [id, isNew]);

  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCategoryToggle = (catId) => {
    setSelectedCats(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchToBuilder = () => {
    if (content.trim()) {
      if (window.confirm("Switch to Page Builder? We'll import your existing text into a text block.")) {
        const textBlock = {
          id: `block-${Date.now()}`,
          type: 'text',
          settings: { text: content, color: '#9ca3af', align: 'left', size: '16' }
        };
        setBuilderContent([textBlock]);
        setEditorMode('builder');
        setIsBuilderModalOpen(true);
      }
    } else {
      setEditorMode('builder');
      setIsBuilderModalOpen(true);
    }
  };

  const handleSwitchToClassic = () => {
    if (builderContent.length > 0) {
      if (window.confirm("Switch back to the Classic Editor? Your layout blocks will be converted to simple text format.")) {
        const compileRecursive = (blocksList) => {
          return blocksList.map(b => {
            if (b.type === 'heading') return `## ${b.settings.text || ''}\n\n`;
            if (b.type === 'text') return `${b.settings.text || ''}\n\n`;
            if (b.type === 'button') return `[${b.settings.text || 'Link'}](${b.settings.url || '#'})\n\n`;
            if (b.type === 'image') return `![Image](${b.settings.url || ''})\n\n`;
            if (b.type === 'alert') return `> ${b.settings.text || ''}\n\n`;
            if (b.type === 'divider') return `--- \n\n`;
            if (b.type === 'section' && b.settings?.columns) {
              return b.settings.columns.map((col, idx) => {
                const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
                return `### Column ${idx + 1}\n\n` + compileRecursive(colBlocks);
              }).join('');
            }
            return '';
          }).join('');
        };
        const compiledText = compileRecursive(builderContent);
        setContent(compiledText);
        setEditorMode('classic');
      }
    } else {
      setEditorMode('classic');
    }
  };

  const executeSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return false;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const postData = {
      title,
      content,
      post_type: postTypeSlug,
      featured_image: featuredImage,
      status,
      categories: selectedCats,
      tags: postTags,
      custom_fields: customFields,
      editor_mode: editorMode,
      builder_content: builderContent
    };

    try {
      const url = isNew ? '/api/posts' : `/api/posts/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        const savedPost = await res.json();
        setSuccessMsg(isNew ? 'Post created successfully!' : 'Post updated successfully!');
        
        if (isNew) {
          // Redirect to the edit path for the newly created post
          setTimeout(() => {
            navigate(`/admin/edit/${postTypeSlug}/${savedPost.id}`);
          }, 1000);
        }
        return true;
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to save post.');
        return false;
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setErrorMsg('Network error saving post.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    await executeSave();
  };

  if (!currentPostType) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Post Type Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cannot load editor. Invalid post type.</p>
        <Link to="/admin" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const hasCategories = currentPostType?.taxonomies?.includes('category');

  if (loading) {
    return (
      <div className="admin-page-container fade-in">
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          <span>Loading Editor...</span>
        </div>
        <PageBuilder
          isOpen={isBuilderModalOpen}
          title={title}
          onChangeTitle={setTitle}
          onClose={() => setIsBuilderModalOpen(false)}
          onPublish={async () => {
            const success = await executeSave();
            if (success) {
              setIsBuilderModalOpen(false);
            }
          }}
          blocks={builderContent}
          onChange={setBuilderContent}
        />
      </div>
    );
  }

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(`/admin/posts/${postTypeSlug}`)} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {isNew ? 'Add New' : 'Edit'} {currentPostType.singular}
            </h1>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="glass-panel pulse-glow" style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            {editorMode === 'classic' ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--bg-accent)', borderColor: 'var(--color-primary)', color: '#fff' }}
                onClick={handleSwitchToBuilder}
              >
                <Sparkles size={13} style={{ color: 'var(--color-secondary)' }} />
                <span>Edit with Page Builder</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleSwitchToClassic}
              >
                <Edit3 size={13} />
                <span>Switch to Classic Editor</span>
              </button>
            )}
          </div>

          {/* Post Title */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <input
              type="text"
              placeholder={`Enter ${currentPostType.singular.toLowerCase()} title here`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '1.75rem',
                fontFamily: 'var(--font-title)',
                fontWeight: '600',
                color: '#fff',
                outline: 'none',
                paddingBottom: '12px',
                marginBottom: '16px'
              }}
              required
            />
            {/* Editor Canvas */}
            {editorMode === 'classic' ? (
              <textarea
                placeholder="Start writing content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  minHeight: '260px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  padding: '0',
                  outline: 'none'
                }}
              />
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
                <Sparkles size={36} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#fff' }}>Visual Layout Mode Enabled</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  This page's content is managed using custom rows and responsive grid columns.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsBuilderModalOpen(true)}
                  >
                    Open Visual Page Builder
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleSwitchToClassic}
                  >
                    Reset to Text Editor
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC CUSTOM FIELDS */}
          {currentPostType.fields && currentPostType.fields.length > 0 && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                Custom Fields
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentPostType.fields.map(field => {
                  const val = customFields[field.id] !== undefined ? customFields[field.id] : '';

                  return (
                    <div key={field.id} className="form-group" style={{ marginBottom: '0' }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{field.label}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({field.id})</span>
                      </label>

                      {/* Check field type */}
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className="form-control"
                          value={val}
                          onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          type="number"
                          className="form-control"
                          value={val}
                          onChange={e => handleCustomFieldChange(field.id, parseFloat(e.target.value) || 0)}
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          className="form-control"
                          value={val}
                          onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          style={{ minHeight: '80px' }}
                        />
                      )}

                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="form-control"
                          value={val}
                          onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'boolean' && (
                        <label className="form-checkbox-label" style={{ marginTop: '4px' }}>
                          <input
                            type="checkbox"
                            checked={!!val}
                            onChange={e => handleCustomFieldChange(field.id, e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                          />
                          <span>Enabled / Active</span>
                        </label>
                      )}

                      {field.type === 'select' && (
                        <select
                          className="form-control"
                          value={val}
                          onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                        >
                          <option value="">-- Select Choice --</option>
                          {field.options && field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PUBLISH SETTINGS */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Publish Panel
            </h3>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-control" 
                value={status} 
                onChange={e => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="publish">Published</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : (isNew ? 'Publish' : 'Update')}</span>
              </button>
              
              <Link 
                to={`/posts/${postTypeSlug}`} 
                className="btn btn-secondary" 
                style={{ width: '100%', textAlign: 'center' }}
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* FEATURED IMAGE */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Image size={15} />
              <span>Featured Image</span>
            </h3>

            {featuredImage ? (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={featuredImage} 
                  alt="Featured Preview" 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '8px', right: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setMediaModalOpen(true)}
                    className="btn btn-secondary btn-sm" 
                    style={{ padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    Replace
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFeaturedImage('')}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '4px 8px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setMediaModalOpen(true)}
                style={{
                  height: '120px', borderRadius: '8px', border: '2px dashed var(--border-color)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', color: 'var(--text-muted)', marginBottom: '12px', cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <UploadCloud size={28} />
                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Select Featured Image</span>
              </div>
            )}

            <MediaLibraryModal 
              isOpen={mediaModalOpen} 
              onClose={() => setMediaModalOpen(false)} 
              onSelect={(asset) => {
                setFeaturedImage(asset.url);
                setMediaModalOpen(false);
              }}
            />
          </div>

          {/* CATEGORIES */}
          {hasCategories && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {categories.filter(cat => (cat.post_type || 'post') === postTypeSlug).map(cat => (
                  <label key={cat.id} className="form-checkbox-label" style={{ userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)' }}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <Link to={`/admin/categories/${postTypeSlug}`} style={{ fontSize: '0.75rem' }}>
                  + Manage Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </form>

      <PageBuilder
        isOpen={isBuilderModalOpen}
        title={title}
        onChangeTitle={setTitle}
        onClose={() => setIsBuilderModalOpen(false)}
        onPublish={async () => {
          const success = await executeSave();
          if (success) {
            setIsBuilderModalOpen(false);
          }
        }}
        blocks={builderContent}
        onChange={setBuilderContent}
      />
    </div>
  );
}
