"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Palette, 
  Check, 
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function AppearanceThemeOptions() {
  const { appearance, saveAppearance } = useApp();

  const [themeOptions, setThemeOptions] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preset Palettes for one-click color schemes
  const colorPresets = [
    {
      name: 'Glowing Indigo (Default)',
      colors: { primaryColor: '#6366f1', accentColor: '#a855f7', bgColor: '#0b0f19', panelBgColor: '#151b2c', textColor: '#f8fafc' }
    },
    {
      name: 'Cyberpunk Neon',
      colors: { primaryColor: '#ff007f', accentColor: '#00ffff', bgColor: '#08010f', panelBgColor: '#130424', textColor: '#ffffff' }
    },
    {
      name: 'Emerald Forest',
      colors: { primaryColor: '#10b981', accentColor: '#059669', bgColor: '#022c22', panelBgColor: '#064e3b', textColor: '#ecfdf5' }
    },
    {
      name: 'Burnt Amber',
      colors: { primaryColor: '#f59e0b', accentColor: '#d97706', bgColor: '#1c1917', panelBgColor: '#292524', textColor: '#fafaf9' }
    },
    {
      name: 'Classic Dark Slate',
      colors: { primaryColor: '#3b82f6', accentColor: '#60a5fa', bgColor: '#0f172a', panelBgColor: '#1e293b', textColor: '#f1f5f9' }
    }
  ];

  useEffect(() => {
    if (appearance?.theme_options) {
      setThemeOptions(appearance.theme_options);
    }
  }, [appearance]);

  const handleColorChange = (key, value) => {
    setThemeOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyPreset = (preset) => {
    setThemeOptions(prev => ({
      ...prev,
      ...preset.colors
    }));
  };

  const handleSaveColors = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await saveAppearance({ theme_options: themeOptions });
      setSuccessMsg('Theme colors saved and applied globally!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save theme colors.');
    } finally {
      setSaving(false);
    }
  };

  if (!themeOptions) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <span>Loading Color Options Panel...</span>
      </div>
    );
  }

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Theme Options & Colors</h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        
        {/* LEFT COLUMN: PALETTES & COLOR PICKERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Preset Palettes Quick Selection */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Quick Preset Palettes</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {colorPresets.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{preset.name}</span>
                  
                  {/* Colors Preview dots */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.colors.bgColor, border: '1px solid rgba(255,255,255,0.2)' }} title="Background" />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.colors.panelBgColor }} title="Panel background" />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.colors.primaryColor }} title="Primary Glow" />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.colors.accentColor }} title="Accent" />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.colors.textColor }} title="Text color" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Color Pickers */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Customize Colors</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Primary Color */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Primary Theme Color</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Applied to main buttons, highlights, and active states.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={themeOptions.primaryColor}
                    onChange={e => handleColorChange('primaryColor', e.target.value)}
                    style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                  />
                  <input
                    type="color"
                    value={themeOptions.primaryColor}
                    onChange={e => handleColorChange('primaryColor', e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Accent Hover Color</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Applied to secondary buttons and hover actions.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={themeOptions.accentColor}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                  />
                  <input
                    type="color"
                    value={themeOptions.accentColor}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Primary Background (bg-primary)</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Overall background behind panels and workspace.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={themeOptions.bgColor}
                    onChange={e => handleColorChange('bgColor', e.target.value)}
                    style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                  />
                  <input
                    type="color"
                    value={themeOptions.bgColor}
                    onChange={e => handleColorChange('bgColor', e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
              </div>

              {/* Panel Background Color */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Panel/Card Background</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Applied to cards, sidebar boxes, and header layout panels.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={themeOptions.panelBgColor}
                    onChange={e => handleColorChange('panelBgColor', e.target.value)}
                    style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                  />
                  <input
                    type="color"
                    value={themeOptions.panelBgColor}
                    onChange={e => handleColorChange('panelBgColor', e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Base Text Color</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Applied to regular body text readouts.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={themeOptions.textColor}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                  />
                  <input
                    type="color"
                    value={themeOptions.textColor}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
              </div>

              {/* Layout Widths Section */}
              <h3 style={{ fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Container Layout Widths</span>
              </h3>

              {/* Header Container Width */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Header Max Width</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Enforced width for header navigation container (e.g. 100%, 1200px).</p>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 100% or 1200px"
                  value={themeOptions.headerWidth || '100%'}
                  onChange={e => handleColorChange('headerWidth', e.target.value)}
                  style={{ width: '130px', fontSize: '0.8rem', padding: '6px 10px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              {/* Footer Container Width */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Footer Max Width</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Enforced width for footer content elements container (e.g. 100%, 1200px).</p>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 100% or 1200px"
                  value={themeOptions.footerWidth || '100%'}
                  onChange={e => handleColorChange('footerWidth', e.target.value)}
                  style={{ width: '130px', fontSize: '0.8rem', padding: '6px 10px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              {/* Main Content Container Width */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-label" style={{ margin: '0 0 2px' }}>Main Content Max Width</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Enforced width for body columns and page contents (e.g. 1200px, 1400px).</p>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1200px or 100%"
                  value={themeOptions.contentWidth || '1200px'}
                  onChange={e => handleColorChange('contentWidth', e.target.value)}
                  style={{ width: '130px', fontSize: '0.8rem', padding: '6px 10px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              {/* Header Settings Section */}
              <h3 style={{ fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Header Sticky & Transparency Options</span>
              </h3>

              {/* Header Transparent Checkbox */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '0' }}>
                    <input
                      type="checkbox"
                      checked={!!themeOptions.headerTransparent}
                      onChange={e => handleColorChange('headerTransparent', e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>Enable Transparent Header</span>
                  </label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                    Removes header background, overlaying it on top of the page content.
                  </p>
                </div>
              </div>

              {/* Header Sticky Checkbox */}
              <div className="picker-row" style={pickerRowStyle}>
                <div style={{ flex: '1' }}>
                  <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '0' }}>
                    <input
                      type="checkbox"
                      checked={!!themeOptions.headerSticky}
                      onChange={e => handleColorChange('headerSticky', e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>Enable Sticky Header</span>
                  </label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                    Pins the header bar to the top of the viewport when scrolling.
                  </p>
                </div>
              </div>

              {/* Header Sticky Offset */}
              {themeOptions.headerSticky && (
                <div className="picker-row" style={pickerRowStyle}>
                  <div style={{ flex: '1' }}>
                    <label className="form-label" style={{ margin: '0 0 2px' }}>Sticky Scroll Offset Trigger (px)</label>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Scroll distance (in pixels) before header becomes sticky (e.g. 50, 100).</p>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 100"
                    value={themeOptions.headerStickyOffset || '0'}
                    onChange={e => handleColorChange('headerStickyOffset', e.target.value)}
                    style={{ width: '130px', fontSize: '0.8rem', padding: '6px 10px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              )}

              {/* Header Sticky Background Color */}
              {themeOptions.headerSticky && (
                <div className="picker-row" style={pickerRowStyle}>
                  <div style={{ flex: '1' }}>
                    <label className="form-label" style={{ margin: '0 0 2px' }}>Sticky Header Background Color</label>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0' }}>Custom background color applied to the header bar when scrolled/sticky.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control hex-input"
                      value={themeOptions.headerStickyBgColor || '#151b2c'}
                      onChange={e => handleColorChange('headerStickyBgColor', e.target.value)}
                      style={{ width: '80px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', height: '28px' }}
                    />
                    <input
                      type="color"
                      value={themeOptions.headerStickyBgColor || '#151b2c'}
                      onChange={e => handleColorChange('headerStickyBgColor', e.target.value)}
                      style={colorInputStyle}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* SAVE BUTTON */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveColors}
                disabled={saving}
                style={{ minWidth: '150px' }}
              >
                {saving ? 'Saving...' : 'Save Theme'}
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME GRAPHICS PREVIEW PANEL */}
        <div>
          <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Real-Time Skin Preview</span>
            </h3>

            {/* Mockup Canvas */}
            <div 
              style={{ 
                background: themeOptions.bgColor, 
                padding: '24px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Mock Header */}
              <div 
                style={{ 
                  background: themeOptions.panelBgColor, 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.7rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Logo Navigation</span>
                <div style={{ display: 'flex', gap: '8px', color: themeOptions.textColor }}>
                  <span style={{ cursor: 'pointer', borderBottom: `2px solid ${themeOptions.primaryColor}` }}>Home</span>
                  <span style={{ opacity: 0.6 }}>Blog</span>
                </div>
              </div>

              {/* Mock Card */}
              <div 
                style={{ 
                  background: themeOptions.panelBgColor, 
                  padding: '16px', 
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <h4 style={{ color: '#fff', fontSize: '0.85rem', margin: '0' }}>Sample Container Box</h4>
                <p style={{ color: themeOptions.textColor, fontSize: '0.72rem', margin: '0', opacity: 0.85, lineHeight: '1.4' }}>
                  This visual element illustrates panel background skinning and global font color styling.
                </p>

                {/* Mock Button */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button 
                    type="button" 
                    style={{ 
                      background: themeOptions.primaryColor, 
                      color: '#fff', 
                      border: 'none', 
                      padding: '5px 12px', 
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Action Primary
                  </button>
                  <button 
                    type="button" 
                    style={{ 
                      background: 'none', 
                      border: `1px solid ${themeOptions.accentColor}`, 
                      color: themeOptions.accentColor, 
                      padding: '4px 10px', 
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      cursor: 'pointer'
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>

            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.4' }}>
              Presets allow you to quickly apply dark, neon, forest, or amber aesthetics. You can manually adjust the color selectors to fine-tune individual components.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        .preset-btn:hover {
          border-color: var(--color-primary) !important;
          background-color: var(--bg-accent) !important;
        }
      `}</style>
    </div>
  );
}

const pickerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '12px 14px',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px'
};

const colorInputStyle = {
  border: 'none',
  padding: '0',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  cursor: 'pointer',
  background: 'none',
  outline: 'none'
};
