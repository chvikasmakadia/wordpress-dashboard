"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Search, 
  Check, 
  Calendar 
} from 'lucide-react';

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
  const { media, uploadMedia, deleteMedia } = useApp();
  const [activeTab, setActiveTab] = useState('library'); // 'upload' or 'library'
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const newAsset = await uploadMedia(reader.result, file.name);
        setSelectedAsset(newAsset);
        setActiveTab('library'); // switch to grid view
      } catch (err) {
        alert('Failed to upload image. Make sure it is a valid image file.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this asset from the Media Library?')) return;
    try {
      await deleteMedia(id);
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    } catch (err) {
      alert('Failed to delete media asset.');
    }
  };

  // Filter library items based on query
  const filteredMedia = media.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div style={modalOverlayStyle}>
      <div className="glass-panel" style={modalContentStyle}>
        
        {/* Modal Header */}
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0', color: '#fff' }}>Media Library</h2>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div style={subtabBarStyle}>
          <button
            onClick={() => setActiveTab('upload')}
            style={activeTab === 'upload' ? activeSubtabStyle : subtabStyle}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab('library')}
            style={activeTab === 'library' ? activeSubtabStyle : subtabStyle}
          >
            Media Library
          </button>
        </div>

        {/* Modal Body */}
        <div style={modalBodyStyle}>
          
          {/* UPLOAD FILES VIEW */}
          {activeTab === 'upload' && (
            <div style={uploadContainerStyle}>
              <input 
                type="file" 
                id="modal-upload-input" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <label htmlFor="modal-upload-input" style={uploadBoxStyle}>
                <UploadCloud size={48} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600' }}>
                  {uploading ? 'Uploading asset...' : 'Select File to Upload'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supports JPEG, PNG, GIF, SVG, WebP up to 50MB
                </span>
              </label>
            </div>
          )}

          {/* MEDIA LIBRARY VIEW */}
          {activeTab === 'library' && (
            <div style={libraryContainerStyle}>
              
              {/* Library Left Grid */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' }}>
                
                {/* Search Bar */}
                <div style={searchBarContainerStyle}>
                  <Search size={14} style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search uploaded files..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                  />
                </div>

                {/* Image Grid */}
                <div style={gridStyle}>
                  {filteredMedia.length === 0 ? (
                    <div style={emptyGridStyle}>
                      <ImageIcon size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                      <span>No media assets found.</span>
                    </div>
                  ) : (
                    filteredMedia.map(item => {
                      const isSelected = selectedAsset?.id === item.id;
                      return (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedAsset(item)}
                          style={{
                            ...gridCardStyle,
                            borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                            boxShadow: isSelected ? 'var(--glow-primary)' : 'none'
                          }}
                        >
                          <img src={item.url} alt={item.name} style={gridImgStyle} />
                          {isSelected && (
                            <div style={checkBadgeStyle}>
                              <Check size={10} style={{ color: '#fff' }} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

              {/* Library Right Sidebar (Item details) */}
              <div style={sidebarStyle}>
                {selectedAsset ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0' }}>
                      Attachment Details
                    </h3>
                    
                    <div style={sidebarPreviewBoxStyle}>
                      <img src={selectedAsset.url} alt={selectedAsset.name} style={sidebarPreviewImgStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={detailsRowStyle}>
                        <span style={detailsLabelStyle}>File Name:</span>
                        <span style={detailsValueStyle} title={selectedAsset.name}>{selectedAsset.name}</span>
                      </div>
                      <div style={detailsRowStyle}>
                        <span style={detailsLabelStyle}>Uploaded:</span>
                        <span style={detailsValueStyle}>
                          <Calendar size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {selectedAsset.createdAt}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={(e) => handleDelete(selectedAsset.id, e)}
                        style={deleteLinkStyle}
                      >
                        <Trash2 size={12} />
                        <span>Delete Permanently</span>
                      </button>

                      <button
                        onClick={() => onSelect(selectedAsset)}
                        style={selectBtnStyle}
                      >
                        Select Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={sidebarEmptyStyle}>
                    <ImageIcon size={24} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
                    <span>Select an image to view details</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}

// Styling Constants
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(4px)',
  zIndex: 99999999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '920px',
  height: '80vh',
  maxHeight: '680px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-tertiary)'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  transition: 'all 0.2s'
};

const subtabBarStyle = {
  display: 'flex',
  gap: '8px',
  padding: '10px 20px 0 20px',
  borderBottom: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-tertiary)'
};

const subtabStyle = {
  padding: '8px 16px',
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s'
};

const activeSubtabStyle = {
  ...subtabStyle,
  color: 'var(--color-primary)',
  borderBottom: '2px solid var(--color-primary)'
};

const modalBodyStyle = {
  flex: 1,
  display: 'flex',
  overflow: 'hidden'
};

const uploadContainerStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px'
};

const uploadBoxStyle = {
  width: '100%',
  maxWidth: '460px',
  height: '240px',
  border: '2px dashed var(--border-color)',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.01)',
  transition: 'all 0.2s'
};

const libraryContainerStyle = {
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  padding: '16px'
};

const searchBarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  padding: '6px 12px'
};

const searchInputStyle = {
  background: 'none',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontSize: '0.8rem',
  width: '100%'
};

const gridStyle = {
  flex: 1,
  overflowY: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
  gap: '10px',
  paddingRight: '6px'
};

const emptyGridStyle = {
  gridColumn: '1 / -1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 0',
  color: 'var(--text-muted)',
  fontSize: '0.8rem'
};

const gridCardStyle = {
  position: 'relative',
  aspectRatio: '1',
  background: 'var(--bg-tertiary)',
  border: '2px solid transparent',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s'
};

const gridImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const checkBadgeStyle = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
};

const sidebarStyle = {
  width: '260px',
  borderLeft: '1px solid var(--border-color)',
  paddingLeft: '16px',
  marginLeft: '16px',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0
};

const sidebarPreviewBoxStyle = {
  width: '100%',
  height: '140px',
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const sidebarPreviewImgStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain'
};

const detailsRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  fontSize: '0.7rem'
};

const detailsLabelStyle = {
  color: 'var(--text-muted)',
  fontWeight: '500'
};

const detailsValueStyle = {
  color: '#fff',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const deleteLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-danger)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 0',
  justifyContent: 'center'
};

const selectBtnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'var(--color-primary)',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

const sidebarEmptyStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: 'var(--text-muted)',
  fontSize: '0.75rem',
  textAlign: 'center'
};
