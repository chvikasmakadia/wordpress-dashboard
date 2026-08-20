"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Type, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Check, 
  AlertCircle,
  Heading,
  Link as LinkIcon,
  AlignLeft,
  Plus,
  Trash2,
  FolderPlus
} from 'lucide-react';

export default function AppearanceFonts() {
  const { appearance, saveAppearance } = useApp();

  const [activeTab, setActiveTab] = useState('body'); // 'body', 'headings', 'hyperlinks'
  const [activeHeadingLevel, setActiveHeadingLevel] = useState('h1'); // 'h1' - 'h6'
  const [fonts, setFonts] = useState(null);
  
  // Custom Fonts State
  const [customFonts, setCustomFonts] = useState([]);
  const [uploadedFonts, setUploadedFonts] = useState([]);
  
  // Input states for adding new fonts
  const [selectedPresetFont, setSelectedPresetFont] = useState('Poppins, sans-serif');
  const [customFontName, setCustomFontName] = useState('');
  const [customFontFallback, setCustomFontFallback] = useState('sans-serif');

  // Input states for adding new uploaded custom font
  const [uploadedFontFamily, setUploadedFontFamily] = useState('');
  const [uploadedFontFile, setUploadedFontFile] = useState(null);
  const [uploadedFontWeight, setUploadedFontWeight] = useState('400');
  const [uploadedFontStyle, setUploadedFontStyle] = useState('normal');
  const [uploadingFont, setUploadingFont] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Popular free Google Fonts presets
  const popularGoogleFonts = [
    { value: 'Poppins, sans-serif', name: 'Poppins (Modern Sans)' },
    { value: 'Montserrat, sans-serif', name: 'Montserrat (Geometric Sans)' },
    { value: 'Roboto, sans-serif', name: 'Roboto (Clean Sans)' },
    { value: 'Inter, sans-serif', name: 'Inter (Professional Sans)' },
    { value: 'Lato, sans-serif', name: 'Lato (Warm Sans)' },
    { value: 'Oswald, sans-serif', name: 'Oswald (Condensed Sans)' },
    { value: 'Raleway, sans-serif', name: 'Raleway (Elegant Sans)' },
    { value: 'Nunito, sans-serif', name: 'Nunito (Rounded Sans)' },
    { value: 'Quicksand, sans-serif', name: 'Quicksand (Playful Sans)' },
    { value: 'Open Sans, sans-serif', name: 'Open Sans (Neutral Sans)' },
    { value: 'Fira Sans, sans-serif', name: 'Fira Sans (Tech Sans)' },
    { value: 'Ubuntu, sans-serif', name: 'Ubuntu (Modern Sans)' },
    { value: 'Barlow, sans-serif', name: 'Barlow (Utility Sans)' },
    { value: 'Kanit, sans-serif', name: 'Kanit (Bold Geometric Sans)' },
    { value: 'Work Sans, sans-serif', name: 'Work Sans (Neutral Sans)' },
    { value: 'Prompt, sans-serif', name: 'Prompt (Futuristic Sans)' },
    { value: 'Outfit, sans-serif', name: 'Outfit (Clean Geometric Title)' },
    { value: 'Josefin Sans, sans-serif', name: 'Josefin Sans (Art-Deco Sans)' },
    
    { value: 'Lora, serif', name: 'Lora (Classic Serif)' },
    { value: 'Playfair Display, serif', name: 'Playfair Display (Premium Serif)' },
    { value: 'Merriweather, serif', name: 'Merriweather (Readability Serif)' },
    { value: 'Cinzel, serif', name: 'Cinzel (Classical Roman Serif)' },
    { value: 'Libre Baskerville, serif', name: 'Libre Baskerville (Editorial Serif)' },
    { value: 'Alegreya, serif', name: 'Alegreya (Calligraphic Serif)' },
    
    { value: 'Pacifico, cursive', name: 'Pacifico (Brush Script)' },
    { value: 'Dancing Script, cursive', name: 'Dancing Script (Fluid Script)' },
    { value: 'Great Vibes, cursive', name: 'Great Vibes (Formal Script)' },
    { value: 'Caveat, cursive', name: 'Caveat (Handwritten Cursive)' },
    { value: 'Lobster, cursive', name: 'Lobster (Bold Vintage Script)' },
    { value: 'Monoton, cursive', name: 'Monoton (Retro Neon Display)' },
    
    { value: 'Roboto Mono, monospace', name: 'Roboto Mono (Tech Mono)' },
    { value: 'Courier Prime, monospace', name: 'Courier Prime (Typewriter Mono)' }
  ];

  // Sync loaded configurations
  useEffect(() => {
    if (appearance?.fonts) {
      setFonts(appearance.fonts);
    }
    if (appearance?.custom_fonts) {
      setCustomFonts(appearance.custom_fonts);
    }
    if (appearance?.uploaded_fonts) {
      setUploadedFonts(appearance.uploaded_fonts);
    }
  }, [appearance]);

  const fontWeights = [
    { value: '300', label: '300 (Light)' },
    { value: '400', label: '400 (Regular)' },
    { value: '500', label: '500 (Medium)' },
    { value: '600', label: '600 (Semi-Bold)' },
    { value: '700', label: '700 (Bold)' },
    { value: '800', label: '800 (Extra Bold)' }
  ];

  const fontStyles = [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' }
  ];

  const fontTransforms = [
    { value: 'none', label: 'Normal (none)' },
    { value: 'uppercase', label: 'UPPERCASE' },
    { value: 'lowercase', label: 'lowercase' },
    { value: 'capitalize', label: 'Capitalize Words' }
  ];

  const handleFieldChange = (section, field, value) => {
    setFonts(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Add custom font from Google list preset
  const handleAddPresetFont = async () => {
    if (customFonts.includes(selectedPresetFont)) {
      alert('Font is already registered in active library!');
      return;
    }
    const updated = [...customFonts, selectedPresetFont];
    setCustomFonts(updated);
    setSaving(true);
    try {
      await saveAppearance({ custom_fonts: updated });
      setSuccessMsg('Preset font registered successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to register preset font.');
    } finally {
      setSaving(false);
    }
  };

  // Add custom typed font name
  const handleAddCustomFont = async (e) => {
    e.preventDefault();
    if (!customFontName.trim()) return;

    // e.g. "Dancing Script" -> "Dancing Script, cursive"
    // Format appropriately: capitalize first letters of font name
    const formattedName = customFontName.trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    const fontValue = `'${formattedName}', ${customFontFallback}`;

    if (customFonts.some(f => f.toLowerCase().includes(formattedName.toLowerCase()))) {
      alert('Font family is already registered!');
      return;
    }

    const updated = [...customFonts, fontValue];
    setCustomFonts(updated);
    setCustomFontName('');
    setSaving(true);
    try {
      await saveAppearance({ custom_fonts: updated });
      setSuccessMsg(`Google Font "${formattedName}" registered successfully!`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to register custom Google Font.');
    } finally {
      setSaving(false);
    }
  };

  // Delete registered font
  const handleDeleteFont = async (fontVal) => {
    if (!window.confirm('Are you sure you want to remove this font family? Selected headings/body text using this font will fall back to default styling.')) return;
    const updated = customFonts.filter(f => f !== fontVal);
    setCustomFonts(updated);
    setSaving(true);
    try {
      await saveAppearance({ custom_fonts: updated });
      setSuccessMsg('Font family removed from library.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete font family.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCustomFont = async (e) => {
    e.preventDefault();
    if (!uploadedFontFamily.trim() || !uploadedFontFile) {
      alert('Please fill out the Font Family name and select a font file.');
      return;
    }

    setUploadingFont(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const formattedFamily = uploadedFontFamily.trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (uploadedFonts.some(f => f.family.toLowerCase() === formattedFamily.toLowerCase() && f.weight === uploadedFontWeight && f.style === uploadedFontStyle)) {
        alert('This font variant is already registered!');
        setUploadingFont(false);
        return;
      }

      const newFont = {
        family: formattedFamily,
        url: base64Data,
        weight: uploadedFontWeight,
        style: uploadedFontStyle
      };

      const updated = [...uploadedFonts, newFont];
      setUploadedFonts(updated);
      setUploadedFontFamily('');
      setUploadedFontFile(null);
      
      const fileInput = document.getElementById('uploaded-font-file-input');
      if (fileInput) fileInput.value = '';

      setSaving(true);
      try {
        await saveAppearance({ uploaded_fonts: updated });
        setSuccessMsg(`Uploaded Custom Font "${formattedFamily}" registered successfully!`);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to register uploaded custom font.');
      } finally {
        setSaving(false);
        setUploadingFont(false);
      }
    };
    reader.readAsDataURL(uploadedFontFile);
  };

  const handleDeleteUploadedFont = async (fontObj) => {
    if (!window.confirm(`Are you sure you want to remove the custom uploaded font "${fontObj.family}" (${fontObj.weight}, ${fontObj.style})?`)) return;
    
    const updated = uploadedFonts.filter(f => !(f.family === fontObj.family && f.weight === fontObj.weight && f.style === fontObj.style));
    setUploadedFonts(updated);
    setSaving(true);
    try {
      await saveAppearance({ uploaded_fonts: updated });
      setSuccessMsg(`Uploaded Custom Font "${fontObj.family}" removed.`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to remove custom uploaded font.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFonts = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await saveAppearance({ fonts });
      setSuccessMsg('Typography settings updated successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save typography settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!fonts) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <span>Loading Typography Panel...</span>
      </div>
    );
  }

  const activeTabKey = activeTab === 'headings' ? activeHeadingLevel : activeTab;
  const activeFont = fonts[activeTabKey] || {};

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Global Typography Settings</h1>
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
        
        {/* LEFT COLUMN: FONT ADJUSTMENTS & GOOGLE FONTS MANAGER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* MAIN TYPOGRAPHY CUSTOMIZER PANEL */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* TAB HEADERS FOR ELEMENT TYPES */}
            <div className="tab-menu" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '8px' }}>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
                onClick={() => setActiveTab('body')}
                style={activeTab === 'body' ? activeTabStyle : tabStyle}
              >
                <AlignLeft size={15} />
                <span>Body Text</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'headings' ? 'active' : ''}`}
                onClick={() => setActiveTab('headings')}
                style={activeTab === 'headings' ? activeTabStyle : tabStyle}
              >
                <Heading size={15} />
                <span>Headings (H1-H6)</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'hyperlinks' ? 'active' : ''}`}
                onClick={() => setActiveTab('hyperlinks')}
                style={activeTab === 'hyperlinks' ? activeTabStyle : tabStyle}
              >
                <LinkIcon size={15} />
                <span>Hyperlinks</span>
              </button>
            </div>

            {/* Heading Level Secondary Selector */}
            {activeTab === 'headings' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Select Heading:</span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveHeadingLevel(lvl)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: activeHeadingLevel === lvl ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: '#fff',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Font Family Selector (Loads dynamic Custom Registered list!) */}
              <div className="form-group">
                <label className="form-label">Font Family ({activeTabKey.toUpperCase()})</label>
                <select
                  className="form-control"
                  value={activeFont.family || 'inherit'}
                  onChange={e => handleFieldChange(activeTabKey, 'family', e.target.value)}
                >
                  <option value="inherit">Inherit default</option>
                  <optgroup label="System Default Fonts">
                    <option value="system-ui, -apple-system, sans-serif">System Sans-Serif</option>
                    <option value="'Courier New', monospace">Courier Prime Monospace</option>
                  </optgroup>
                   <optgroup label="Active Google Fonts Library">
                    {customFonts.map(font => {
                      // Extract display name, e.g. "'Playfair Display', serif" -> "Playfair Display"
                      const displayName = font.split(',')[0].replace(/['"]/g, '');
                      return (
                        <option key={font} value={font}>{displayName}</option>
                      );
                    })}
                  </optgroup>
                  {uploadedFonts.length > 0 && (
                    <optgroup label="Uploaded Custom Fonts">
                      {Array.from(new Set(uploadedFonts.map(f => f.family))).map(familyName => (
                        <option key={familyName} value={`'${familyName}', sans-serif`}>{familyName}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* RESPONSIVE FONT SIZE SLIDERS */}
              <div className="form-group" style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label className="form-label" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Responsive Font Sizes ({activeTabKey.toUpperCase()})</span>
                  <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>px values</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Desktop Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Monitor size={12} />
                        <span>Desktop Width</span>
                      </span>
                      <span>{activeFont.size_desktop || '16'}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="72"
                      value={activeFont.size_desktop || '16'}
                      onChange={e => handleFieldChange(activeTabKey, 'size_desktop', e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  {/* Tablet Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tablet size={12} />
                        <span>Tablet Width</span>
                      </span>
                      <span>{activeFont.size_tablet || '15'}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="56"
                      value={activeFont.size_tablet || '15'}
                      onChange={e => handleFieldChange(activeTabKey, 'size_tablet', e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  {/* Mobile Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Smartphone size={12} />
                        <span>Mobile Width</span>
                      </span>
                      <span>{activeFont.size_mobile || '14'}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={activeFont.size_mobile || '14'}
                      onChange={e => handleFieldChange(activeTabKey, 'size_mobile', e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Font Weight */}
              <div className="form-group">
                <label className="form-label">Font Weight</label>
                <select
                  className="form-control"
                  value={activeFont.weight || '400'}
                  onChange={e => handleFieldChange(activeTabKey, 'weight', e.target.value)}
                >
                  {fontWeights.map(w => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </select>
              </div>

              {/* Font Style */}
              <div className="form-group">
                <label className="form-label">Font Style</label>
                <select
                  className="form-control"
                  value={activeFont.style || 'normal'}
                  onChange={e => handleFieldChange(activeTabKey, 'style', e.target.value)}
                >
                  {fontStyles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Text Transform Case */}
              <div className="form-group">
                <label className="form-label">Text Case (Transform)</label>
                <select
                  className="form-control"
                  value={activeFont.case || 'none'}
                  onChange={e => handleFieldChange(activeTabKey, 'case', e.target.value)}
                >
                  {fontTransforms.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* SAVE BUTTON */}
            <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveFonts}
                disabled={saving}
                style={{ minWidth: '150px' }}
              >
                {saving ? 'Saving...' : 'Save Typography'}
              </button>
            </div>

          </div>

          {/* DYNAMIC GOOGLE FONTS LIBRARY MANAGER */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderPlus size={16} style={{ color: 'var(--color-primary)' }} />
              <span>Google Fonts Library Manager</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Presets List and Input Registration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Popular Google Font</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      className="form-control"
                      value={selectedPresetFont}
                      onChange={e => setSelectedPresetFont(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                    >
                      {popularGoogleFonts.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddPresetFont}
                      style={{ padding: '0 12px' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddCustomFont} className="form-group" style={{ marginBottom: '0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Register Any Google Font By Name</label>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0 0 8px' }}>
                    Type the exact name from fonts.google.com (e.g. <em>Bebas Neue</em> or <em>Poppins</em>).
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Poppins"
                      value={customFontName}
                      onChange={e => setCustomFontName(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                      required
                    />
                    <select
                      className="form-control"
                      value={customFontFallback}
                      onChange={e => setCustomFontFallback(e.target.value)}
                      style={{ width: '100px', fontSize: '0.75rem', padding: '4px' }}
                    >
                      <option value="sans-serif">Sans-Serif</option>
                      <option value="serif">Serif</option>
                      <option value="cursive">Cursive</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Register Font Family
                  </button>
                </form>
              </div>

              {/* Active Fonts Table */}
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Active Font Library</label>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {customFonts.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No custom fonts registered.</span>
                  ) : (
                    customFonts.map(font => {
                      const displayName = font.split(',')[0].replace(/['"]/g, '');
                      return (
                        <div 
                          key={font}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem'
                          }}
                        >
                          <span style={{ fontFamily: font, color: '#fff' }}>{displayName}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteFont(font)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                            title="Remove Font"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC UPLOADED FONTS LIBRARY MANAGER */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderPlus size={16} style={{ color: 'var(--color-secondary)' }} />
              <span>Uploaded Custom Fonts Manager (Elementor-Style)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Upload Font File Form */}
              <form onSubmit={handleUploadCustomFont} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Font Family Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Brandon Grotesque"
                    value={uploadedFontFamily}
                    onChange={e => setUploadedFontFamily(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Font Weight</label>
                    <select
                      className="form-control"
                      value={uploadedFontWeight}
                      onChange={e => setUploadedFontWeight(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '4px' }}
                    >
                      {fontWeights.map(w => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Font Style</label>
                    <select
                      className="form-control"
                      value={uploadedFontStyle}
                      onChange={e => setUploadedFontStyle(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '4px' }}
                    >
                      {fontStyles.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Font File (.woff2, .woff, .ttf, .otf)</label>
                  <input
                    type="file"
                    id="uploaded-font-file-input"
                    accept=".woff2,.woff,.ttf,.otf"
                    onChange={e => setUploadedFontFile(e.target.files[0])}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      border: '1px dashed var(--border-color)',
                      padding: '8px',
                      borderRadius: '6px',
                      width: '100%',
                      background: 'rgba(0,0,0,0.1)'
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  disabled={uploadingFont || saving}
                  style={{ width: '100%', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>{uploadingFont ? 'Uploading file...' : 'Add Uploaded Custom Font'}</span>
                </button>
              </form>

              {/* Active Uploaded Fonts List */}
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Active Uploaded Fonts Library</label>
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {uploadedFonts.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No custom font files uploaded yet.</span>
                  ) : (
                    uploadedFonts.map((font, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                          borderRadius: '4px', padding: '6px 10px', fontSize: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: font.family, color: '#fff', fontWeight: 'bold' }}>{font.family}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            Weight: {font.weight} | Style: {font.style}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteUploadedFont(font)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                          title="Remove Custom Font"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE TYPOGRAPHY PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Interactive Fonts Preview</span>
            </h3>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              
              <div>
                <span className="badge badge-secondary" style={{ fontSize: '0.55rem', marginBottom: '8px', display: 'block', textTransform: 'uppercase', width: 'fit-content' }}>Headings Levels (H1-H6)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(lvl => {
                    const f = fonts[lvl] || {};
                    const Tag = lvl;
                    const isSelected = activeTab === 'headings' && activeHeadingLevel === lvl;
                    return (
                      <Tag 
                        key={lvl}
                        style={{
                          fontFamily: f.family || 'inherit',
                          fontSize: `${f.size_desktop || '16'}px`,
                          fontWeight: f.weight || '700',
                          fontStyle: f.style || 'normal',
                          textTransform: f.case || 'none',
                          color: '#fff',
                          margin: '0',
                          lineHeight: '1.2',
                          padding: '2px 4px',
                          border: isSelected ? '1px dashed var(--color-primary)' : '1px solid transparent',
                          borderRadius: '4px',
                          background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'none'
                        }}
                      >
                        {lvl.toUpperCase()}: Heading Title
                      </Tag>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="badge badge-secondary" style={{ fontSize: '0.55rem', marginBottom: '8px', display: 'block', textTransform: 'uppercase', width: 'fit-content' }}>Body Content Output</span>
                <p style={{
                  fontFamily: fonts.body.family,
                  fontSize: `${fonts.body.size_desktop}px`,
                  fontWeight: fonts.body.weight,
                  fontStyle: fonts.body.style,
                  textTransform: fonts.body.case,
                  color: 'var(--text-secondary)',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  This paragraph simulates the live text content configured under the Font customizer. Change font settings to see updates.
                </p>
              </div>

              <div>
                <span className="badge badge-secondary" style={{ fontSize: '0.55rem', marginBottom: '8px', display: 'block', textTransform: 'uppercase', width: 'fit-content' }}>Link / Action Output</span>
                <div>
                  <a href="#test" onClick={e => e.preventDefault()} style={{
                    fontFamily: fonts.hyperlinks.family,
                    fontSize: `${fonts.hyperlinks.size_desktop}px`,
                    fontWeight: fonts.hyperlinks.weight,
                    fontStyle: fonts.hyperlinks.style,
                    textTransform: fonts.hyperlinks.case,
                    color: 'var(--color-primary)',
                    textDecoration: 'underline'
                  }}>
                    Explore dynamics &rarr;
                  </a>
                </div>
              </div>

            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.4' }}>
              *Note: Active previews show <strong>Desktop</strong> sizes. Mobile and tablet rules apply reactively on smaller viewports. Dashed outlines demarcate the active selector focus.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styling states for sub-tabs
const tabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.8rem',
  transition: 'all var(--transition-fast)'
};

const activeTabStyle = {
  ...tabStyle,
  color: 'var(--color-primary)',
  borderBottom: '2px solid var(--color-primary)'
};
