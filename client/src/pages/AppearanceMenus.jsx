"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  FileText, 
  Link as LinkIcon, 
  Check, 
  Menu as MenuIcon, 
  Settings 
} from 'lucide-react';

export default function AppearanceMenus() {
  const { appearance, saveAppearance, postTypes, categories } = useApp();
  
  // List of all items fetched for menu building
  const [allPages, setAllPages] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  
  // Active menu selected
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState('');
  const [newMenuName, setNewMenuName] = useState('');
  
  // Sidebar Checkboxes selection
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  
  // Custom Link inputs
  const [customLinkUrl, setCustomLinkUrl] = useState('https://');
  const [customLinkLabel, setCustomLinkLabel] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Expand sidebar panels
  const [expandedPanels, setExpandedPanels] = useState({
    pages: true,
    posts: false,
    categories: false,
    custom: false
  });

  const togglePanel = (panel) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Load items and menus
  useEffect(() => {
    const loadItems = async () => {
      try {
        // Fetch pages
        const resPages = await fetch('/api/posts?post_type=page');
        if (resPages.ok) {
          const data = await resPages.json();
          setAllPages(data);
        }
        // Fetch posts
        const resPosts = await fetch('/api/posts?post_type=post');
        if (resPosts.ok) {
          const data = await resPosts.json();
          setAllPosts(data);
        }
      } catch (err) {
        console.error('Error loading menu items source:', err);
      }
    };

    loadItems();

    if (appearance?.menus) {
      setMenus(appearance.menus);
      if (appearance.menus.length > 0 && !activeMenuId) {
        setActiveMenuId(appearance.menus[0].id);
      }
    }
  }, [appearance]);

  const activeMenu = menus.find(m => m.id === activeMenuId);

  // Create new menu
  const handleCreateMenu = (e) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;

    const newMenu = {
      id: `menu-${Date.now()}`,
      name: newMenuName,
      location: '',
      items: []
    };

    const updatedMenus = [...menus, newMenu];
    setMenus(updatedMenus);
    setActiveMenuId(newMenu.id);
    setNewMenuName('');
  };

  // Add items to menu
  const addItemsToMenu = (type, itemsList) => {
    if (!activeMenu) {
      alert('Please select or create a menu first!');
      return;
    }

    const newItems = itemsList.map(item => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      targetId: item.id,
      title: item.name || item.title || 'Untitled',
      url: type === 'category' 
        ? `/category/${item.slug}` 
        : `/posts/${item.post_type || 'post'}/${item.id}`,
      indent: 0
    }));

    const updated = menus.map(m => {
      if (m.id === activeMenuId) {
        return {
          ...m,
          items: [...m.items, ...newItems]
        };
      }
      return m;
    });

    setMenus(updated);
    
    // Clear selections
    if (type === 'page') setSelectedPages([]);
    if (type === 'post') setSelectedPosts([]);
    if (type === 'category') setSelectedCats([]);
  };

  // Add custom link
  const addCustomLink = (e) => {
    e.preventDefault();
    if (!activeMenu) {
      alert('Please select or create a menu first!');
      return;
    }
    if (!customLinkLabel.trim()) return;

    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'custom',
      targetId: '',
      title: customLinkLabel,
      url: customLinkUrl,
      indent: 0
    };

    const updated = menus.map(m => {
      if (m.id === activeMenuId) {
        return {
          ...m,
          items: [...m.items, newItem]
        };
      }
      return m;
    });

    setMenus(updated);
    setCustomLinkUrl('https://');
    setCustomLinkLabel('');
  };

  // Edit menu item properties
  const updateMenuItem = (itemId, updatedProps) => {
    const updated = menus.map(m => {
      if (m.id === activeMenuId) {
        const newItems = m.items.map(item => {
          if (item.id === itemId) {
            return { ...item, ...updatedProps };
          }
          return item;
        });
        return { ...m, items: newItems };
      }
      return m;
    });
    setMenus(updated);
  };

  // Move item up/down
  const moveMenuItem = (itemId, direction) => {
    const updated = menus.map(m => {
      if (m.id === activeMenuId) {
        const idx = m.items.findIndex(item => item.id === itemId);
        if (idx === -1) return m;

        const newItems = [...m.items];
        if (direction === 'up' && idx > 0) {
          const temp = newItems[idx];
          newItems[idx] = newItems[idx - 1];
          newItems[idx - 1] = temp;
        } else if (direction === 'down' && idx < newItems.length - 1) {
          const temp = newItems[idx];
          newItems[idx] = newItems[idx + 1];
          newItems[idx + 1] = temp;
        }
        return { ...m, items: newItems };
      }
      return m;
    });
    setMenus(updated);
  };

  // Delete item from menu
  const deleteMenuItem = (itemId) => {
    const updated = menus.map(m => {
      if (m.id === activeMenuId) {
        return {
          ...m,
          items: m.items.filter(item => item.id !== itemId)
        };
      }
      return m;
    });
    setMenus(updated);
  };

  // Save current menus state to backend
  const handleSaveMenu = async () => {
    if (!activeMenu) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await saveAppearance({ menus });
      setSuccessMsg('Menu saved successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save menu configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Delete entire navigation menu
  const handleDeleteMenu = () => {
    if (!window.confirm(`Are you sure you want to delete the menu "${activeMenu?.name}"?`)) return;
    const updated = menus.filter(m => m.id !== activeMenuId);
    setMenus(updated);
    if (updated.length > 0) {
      setActiveMenuId(updated[0].id);
    } else {
      setActiveMenuId('');
    }
    setSuccessMsg('Menu deleted. Click Save Menu to sync.');
  };

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Menus Configuration</h1>
      </div>

      {successMsg && (
        <div className="glass-panel pulse-glow" style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Check size={16} style={{ color: 'var(--color-danger)' }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MENU CHOOSE / CREATE BAR */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Select menu to edit:</span>
          {menus.length > 0 ? (
            <select
              className="form-control"
              style={{ width: '220px', padding: '6px 12px' }}
              value={activeMenuId}
              onChange={e => setActiveMenuId(e.target.value)}
            >
              {menus.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No menus created yet.</span>
          )}
        </div>

        <form onSubmit={handleCreateMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="New Menu Name..."
            value={newMenuName}
            onChange={e => setNewMenuName(e.target.value)}
            style={{ width: '200px', padding: '6px 12px' }}
            required
          />
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 12px' }}>
            <Plus size={14} />
            <span>Create Menu</span>
          </button>
        </form>
      </div>

      {activeMenu ? (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          
          {/* SIDEBAR: LIST OF ELEMENTS TO ADD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* PAGES PANEL */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <button 
                type="button" 
                className="collapsible-section-btn"
                onClick={() => togglePanel('pages')}
              >
                <span>Add Pages</span>
                <span className="badge badge-secondary">{allPages.length}</span>
              </button>
              
              {expandedPanels.pages && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {allPages.map(page => (
                      <label key={page.id} className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedPages.some(p => p.id === page.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedPages([...selectedPages, page]);
                            else setSelectedPages(selectedPages.filter(p => p.id !== page.id));
                          }}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{page.title}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '6px' }}
                    onClick={() => addItemsToMenu('page', selectedPages)}
                    disabled={selectedPages.length === 0}
                  >
                    Add to Menu
                  </button>
                </div>
              )}
            </div>

            {/* POSTS PANEL */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <button 
                type="button" 
                className="collapsible-section-btn"
                onClick={() => togglePanel('posts')}
              >
                <span>Add Posts</span>
                <span className="badge badge-secondary">{allPosts.length}</span>
              </button>
              
              {expandedPanels.posts && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {allPosts.map(post => (
                      <label key={post.id} className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedPosts.some(p => p.id === post.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedPosts([...selectedPosts, post]);
                            else setSelectedPosts(selectedPosts.filter(p => p.id !== post.id));
                          }}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{post.title}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '6px' }}
                    onClick={() => addItemsToMenu('post', selectedPosts)}
                    disabled={selectedPosts.length === 0}
                  >
                    Add to Menu
                  </button>
                </div>
              )}
            </div>

            {/* CATEGORIES PANEL */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <button 
                type="button" 
                className="collapsible-section-btn"
                onClick={() => togglePanel('categories')}
              >
                <span>Add Categories</span>
                <span className="badge badge-secondary">{categories.length}</span>
              </button>
              
              {expandedPanels.categories && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categories.map(cat => (
                      <label key={cat.id} className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedCats.some(c => c.id === cat.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedCats([...selectedCats, cat]);
                            else setSelectedCats(selectedCats.filter(c => c.id !== cat.id));
                          }}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{cat.name} <small style={{ color: 'var(--text-muted)' }}>({cat.post_type})</small></span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '6px' }}
                    onClick={() => addItemsToMenu('category', selectedCats)}
                    disabled={selectedCats.length === 0}
                  >
                    Add to Menu
                  </button>
                </div>
              )}
            </div>

            {/* CUSTOM LINK PANEL */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <button 
                type="button" 
                className="collapsible-section-btn"
                onClick={() => togglePanel('custom')}
              >
                <span>Add Custom Link</span>
              </button>
              
              {expandedPanels.custom && (
                <form onSubmit={addCustomLink} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customLinkUrl}
                      onChange={e => setCustomLinkUrl(e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Link Text</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Google Search"
                      value={customLinkLabel}
                      onChange={e => setCustomLinkLabel(e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    Add to Menu
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* MAIN MENU EDITOR CANVAS */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', margin: '0' }}>Menu Structure: {activeMenu.name}</h3>
              <span className="badge badge-primary">ID: {activeMenu.id}</span>
            </div>

            {activeMenu.items.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                <MenuIcon size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', display: 'block' }} />
                <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Empty Menu Canvas</h4>
                <p style={{ fontSize: '0.75rem', maxWidth: '280px', margin: '0 auto' }}>Select pages, posts, or custom links from the left panel and click Add to Menu to populate this nav bar.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeMenu.items.map((item, idx) => {
                  return (
                    <div 
                      key={item.id}
                      style={{
                        marginLeft: `${item.indent * 30}px`,
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'margin-left 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1' }}>
                        {item.type === 'page' && <FileText size={15} style={{ color: 'var(--color-primary)' }} />}
                        {item.type === 'post' && <FileText size={15} style={{ color: 'var(--color-secondary)' }} />}
                        {item.type === 'category' && <Plus size={15} style={{ color: 'var(--color-success)' }} />}
                        {item.type === 'custom' && <LinkIcon size={15} style={{ color: 'var(--text-muted)' }} />}
                        
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateMenuItem(item.id, { title: e.target.value })}
                          style={{
                            background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem',
                            padding: '2px 4px', fontWeight: '500', width: '100%',
                            borderBottom: '1px dashed transparent', outline: 'none'
                          }}
                          onFocus={e => e.target.style.borderBottomColor = 'var(--color-primary)'}
                          onBlur={e => e.target.style.borderBottomColor = 'transparent'}
                        />
                        <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase' }}>
                          {item.type}
                        </span>
                      </div>

                      {/* Direction controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {/* Indent Left */}
                        <button
                          type="button"
                          title="Outdent Left"
                          disabled={item.indent === 0}
                          onClick={() => updateMenuItem(item.id, { indent: Math.max(0, item.indent - 1) })}
                          className="btn-action-icon"
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: item.indent === 0 ? 'not-allowed' : 'pointer', color: item.indent === 0 ? 'var(--text-muted)' : '#fff' }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        
                        {/* Indent Right */}
                        <button
                          type="button"
                          title="Indent Right"
                          disabled={item.indent >= 2}
                          onClick={() => updateMenuItem(item.id, { indent: Math.min(2, item.indent + 1) })}
                          className="btn-action-icon"
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: item.indent >= 2 ? 'not-allowed' : 'pointer', color: item.indent >= 2 ? 'var(--text-muted)' : '#fff' }}
                        >
                          <ChevronRight size={14} />
                        </button>
                        
                        {/* Move Up */}
                        <button
                          type="button"
                          title="Move Up"
                          disabled={idx === 0}
                          onClick={() => moveMenuItem(item.id, 'up')}
                          className="btn-action-icon"
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? 'var(--text-muted)' : '#fff' }}
                        >
                          <ArrowUp size={14} />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          title="Move Down"
                          disabled={idx === activeMenu.items.length - 1}
                          onClick={() => moveMenuItem(item.id, 'down')}
                          className="btn-action-icon"
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: idx === activeMenu.items.length - 1 ? 'not-allowed' : 'pointer', color: idx === activeMenu.items.length - 1 ? 'var(--text-muted)' : '#fff' }}
                        >
                          <ArrowDown size={14} />
                        </button>

                        {/* Trash */}
                        <button
                          type="button"
                          title="Remove item"
                          onClick={() => deleteMenuItem(item.id)}
                          className="btn-action-icon"
                          style={{ padding: '4px', border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LOCATION CONFIG */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Menu Settings</span>
              </h4>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeMenu.location === 'primary'}
                    onChange={e => {
                      const updated = menus.map(m => {
                        if (e.target.checked) {
                          if (m.id === activeMenuId) return { ...m, location: 'primary' };
                          if (m.location === 'primary') return { ...m, location: '' };
                        } else {
                          if (m.id === activeMenuId) return { ...m, location: '' };
                        }
                        return m;
                      });
                      setMenus(updated);
                    }}
                    style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Primary Header Location (Assign as Site Navigation)</span>
                </label>
              </div>
            </div>

            {/* SAVE ACTIONS BAR */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteMenu}
              >
                Delete Menu
              </button>
              
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveMenu}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Menu'}
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <MenuIcon size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <h3>No Menu Active</h3>
          <p style={{ maxWidth: '300px', margin: '6px auto 0', fontSize: '0.85rem' }}>Please enter a menu name in the selector above and click "Create Menu" to get started.</p>
        </div>
      )}

      <style>{`
        .collapsible-section-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 20px;
          background: var(--bg-secondary);
          border: none;
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          text-align: left;
        }
        .collapsible-section-btn:hover {
          background-color: var(--bg-accent);
        }
        .btn-action-icon:hover {
          background-color: var(--bg-accent) !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
