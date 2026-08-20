"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Search, 
  Calendar, 
  Download,
  Info 
} from 'lucide-react';

export default function MediaManager() {
  const { media, uploadMedia, deleteMedia } = useApp();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const newAsset = await uploadMedia(reader.result, file.name);
        setSelectedAsset(newAsset);
      } catch (err) {
        alert('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this media asset? This action is irreversible.')) return;
    try {
      await deleteMedia(id);
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    } catch (err) {
      alert('Failed to delete asset.');
    }
  };

  const filteredMedia = media.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header" style={{ marginBottom: '20px' }}>
        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={24} style={{ color: 'var(--color-primary)' }} />
          <span>Media Library</span>
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Add, view, and manage all visual assets uploaded across pages, posts, headers, and footers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* LEFT COLUMN: UPLOADER & GRID CATALOG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* DRAG-AND-DROP UPLOADER BAR */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'rgba(99, 102, 241, 0.02)', borderColor: 'rgba(99, 102, 241, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UploadCloud size={28} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h4 style={{ margin: '0', fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>Upload New Media Asset</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Drag files here or upload local files. Maximum file size is 50MB.
                </p>
              </div>
            </div>

            <div>
              <input 
                type="file" 
                id="media-page-upload" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <label 
                htmlFor="media-page-upload" 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}
              >
                <span>{uploading ? 'Uploading...' : 'Select File'}</span>
              </label>
            </div>
          </div>

          {/* GRID CATALOG AND FILTER */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
            
            {/* Search filter row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px' }}>
              <Search size={14} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search files by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.8rem', padding: 0, height: 'auto' }}
              />
            </div>

            {/* Catalog Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
              {filteredMedia.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <ImageIcon size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
                  <span>No media items found. Upload an image to populate.</span>
                </div>
              ) : (
                filteredMedia.map(item => {
                  const isSelected = selectedAsset?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAsset(item)}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        background: 'var(--bg-secondary)',
                        border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--border-color)',
                        boxShadow: isSelected ? 'var(--glow-primary)' : 'none',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED INFO PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            {selectedAsset ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', flex: 1 }}>
                
                <h3 style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: '0' }}>
                  File Information
                </h3>

                {/* Preview Box */}
                <div style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={selectedAsset.url} 
                    alt={selectedAsset.name} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                </div>

                {/* Meta details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem' }}>
                  
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Attachment Slug Name</span>
                    <strong style={{ color: '#fff', wordBreak: 'break-all' }}>{selectedAsset.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Date Added</span>
                    <span style={{ color: '#fff', fontWeight: '500' }}>
                      <Calendar size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {selectedAsset.createdAt}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asset ID</span>
                    <span style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>{selectedAsset.id}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Source URL</span>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={selectedAsset.url.startsWith('data:') ? 'Base64 Encoded Image Data' : selectedAsset.url}
                      style={{ fontSize: '0.7rem', padding: '4px 6px', background: 'var(--bg-secondary)', height: '24px' }}
                      onClick={e => e.target.select()}
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px' }}>
                  
                  <a 
                    href={selectedAsset.url} 
                    download={selectedAsset.name} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                  >
                    <Download size={12} />
                    <span>Download Image</span>
                  </a>

                  <button
                    onClick={() => handleDelete(selectedAsset.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                  >
                    <Trash2 size={12} />
                    <span>Delete Permanently</span>
                  </button>

                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1, color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', gap: '8px' }}>
                <ImageIcon size={32} style={{ color: 'var(--text-muted)' }} />
                <span>Select any asset in the catalog grid to view properties and delete records.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
