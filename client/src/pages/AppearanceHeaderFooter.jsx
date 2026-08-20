"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PageBuilder from '../components/PageBuilder';
import MediaLibraryModal from '../components/MediaLibraryModal';
import { 
  Check, 
  AlertCircle, 
  Save, 
  Image as ImageIcon, 
  UploadCloud, 
  Layout, 
  Sparkles,
  Info 
} from 'lucide-react';

export default function AppearanceHeaderFooter() {
  const { appearance, saveAppearance } = useApp();

  const [activePart, setActivePart] = useState('header'); // 'header' or 'footer'
  const [headerBlocks, setHeaderBlocks] = useState([]);
  const [footerBlocks, setFooterBlocks] = useState([]);
  const [globalLogo, setGlobalLogo] = useState('');
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync loaded configs
  useEffect(() => {
    if (appearance) {
      setHeaderBlocks(appearance.header_content || []);
      setFooterBlocks(appearance.footer_content || []);
      setGlobalLogo(appearance.site_logo || '');
    }
  }, [appearance]);

  const executeSaveThemeParts = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await saveAppearance({
        header_content: headerBlocks,
        footer_content: footerBlocks,
        site_logo: globalLogo
      });
      setSuccessMsg('Header & Footer layouts saved successfully!');
      return true;
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save theme layout elements.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveThemeParts = async () => {
    await executeSaveThemeParts();
  };

  return (
    <div className="admin-page-container fade-in">
      
      {/* Header Bar */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layout size={24} style={{ color: 'var(--color-primary)' }} />
            <span>Theme Header & Footer Builder</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Use the modular drag-and-drop page builder to customize the website's global navigation header and footer sections.
          </p>
        </div>

        <button 
          onClick={handleSaveThemeParts} 
          disabled={saving} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '130px' }}
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Layouts'}</span>
        </button>
      </div>

      {/* Success / Error notification */}
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

      {/* Grid: Global Logo Uploader & Theme Part Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Left Column: Theme Builder controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Logo Upload Panel */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Global Site Logo
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              {globalLogo ? (
                <div style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={globalLogo} 
                    alt="Site Logo Preview" 
                    style={{ maxHeight: '60px', width: 'auto', objectFit: 'contain' }} 
                  />
                </div>
              ) : (
                <div style={{ width: '100%', padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '6px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  No global logo loaded
                </div>
              )}

              <button 
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <UploadCloud size={14} />
                <span>Select Logo from Library</span>
              </button>

              <MediaLibraryModal 
                isOpen={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                onSelect={(asset) => {
                  setGlobalLogo(asset.url);
                  setMediaModalOpen(false);
                }}
              />
            </div>
          </div>

          {/* Theme Part Toggle Panel */}
          <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Select Layout Section
            </h3>

            <button
              onClick={() => setActivePart('header')}
              className={`btn ${activePart === 'header' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Layout size={14} />
              <span>Global Header Layout</span>
            </button>

            <button
              onClick={() => setActivePart('footer')}
              className={`btn ${activePart === 'footer' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Layout size={14} style={{ transform: 'rotate(180deg)' }} />
              <span>Global Footer Layout</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
            <Info size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ lineHeight: '1.4' }}>
              <strong>Logo & Menus</strong>: Use the custom <strong>Site Logo</strong> widget and <strong>Navigation Menu</strong> widget inside this builder to compose responsive headers!
            </span>
          </div>

        </div>

        {/* Right Column: Visual Page Builder Canvas Trigger Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px', textAlign: 'center' }}>
          <Layout size={40} style={{ color: 'var(--color-primary)', marginBottom: '16px', transform: activePart === 'footer' ? 'rotate(180deg)' : 'none' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>
            {activePart === 'header' ? 'Global Header Canvas' : 'Global Footer Canvas'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            {activePart === 'header' 
              ? 'Customize the website head banner. You can embed site logos, navigation menus, call-to-action buttons, or multi-column grids.'
              : 'Customize the website footer layout. Arrange social link bars, email newsletters, copyright lines, and widgets.'
            }
          </p>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsBuilderModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: 'bold' }}
          >
            <Sparkles size={14} />
            <span>Customize {activePart === 'header' ? 'Header' : 'Footer'} Layout</span>
          </button>
        </div>

      </div>

      <PageBuilder
        isOpen={isBuilderModalOpen}
        title={activePart === 'header' ? 'Global Header' : 'Global Footer'}
        onClose={() => setIsBuilderModalOpen(false)}
        onPublish={async () => {
          const success = await executeSaveThemeParts();
          if (success) {
            setIsBuilderModalOpen(false);
          }
        }}
        blocks={activePart === 'header' ? headerBlocks : footerBlocks}
        onChange={activePart === 'header' ? setHeaderBlocks : setFooterBlocks}
      />
    </div>
  );
}
