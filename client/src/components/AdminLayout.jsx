"use client";

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from '../routing';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  File,
  Hammer,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
  Globe,
  User,
  Menu,
  Database,
  Pin,
  ChevronLeft,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { postTypes, settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Track which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState({
    post: location.pathname.startsWith('/admin/edit/post') || location.pathname.includes('/admin/posts/post'),
    page: location.pathname.startsWith('/admin/edit/page') || location.pathname.includes('/admin/posts/page'),
    settings: location.pathname.startsWith('/admin/settings'),
    appearance: location.pathname.startsWith('/admin/appearance')
  });

  const toggleExpand = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isLinkActive = (path) => location.pathname === path;
  const isMenuSectionActive = (pathPrefix) => location.pathname.startsWith(pathPrefix);

  const siteTitle = settings?.general?.siteTitle || 'WordPress Admin';
  const siteTagline = settings?.general?.siteTagline || 'Dynamic Dashboard';

  // Helper to render menu item with optional submenu
  const renderMenuItem = ({ label, icon: Icon, path, menuKey, submenuItems }) => {
    const isExpanded = expandedMenus[menuKey];
    const hasSubmenu = submenuItems && submenuItems.length > 0;
    const isActive = hasSubmenu 
      ? isMenuSectionActive(path) 
      : isLinkActive(path);

    return (
      <div key={label} className="menu-group" style={{ marginBottom: '4px' }}>
        {hasSubmenu ? (
          <button
            onClick={() => toggleExpand(menuKey)}
            className={`menu-item-btn ${isActive ? 'active' : ''}`}
          >
            <span className="menu-item-left">
              <Icon size={18} className="menu-icon" />
              <span>{label}</span>
            </span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <Link
            to={path}
            className={`menu-item-btn ${isActive ? 'active' : ''}`}
          >
            <span className="menu-item-left">
              <Icon size={18} className="menu-icon" />
              <span>{label}</span>
            </span>
          </Link>
        )}

        {hasSubmenu && isExpanded && (
          <div className="submenu">
            {submenuItems.map(item => (
              <Link
                key={item.label}
                to={item.path}
                className={`submenu-item ${isLinkActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">WP</div>
          <div className="brand-info">
            <h2 className="brand-title">{siteTitle}</h2>
            <span className="brand-tagline">{siteTagline}</span>
          </div>
        </div>

        <div className="sidebar-menu">
          {/* Main Dashboard Link */}
          {renderMenuItem({
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin',
            menuKey: 'dashboard'
          })}

          <div className="menu-separator">Core Content</div>

          {/* Media Library */}
          {renderMenuItem({
            label: 'Media',
            icon: ImageIcon,
            path: '/admin/media',
            menuKey: 'media'
          })}

          {/* Built-in Post Type: Posts */}
          {renderMenuItem({
            label: 'Posts',
            icon: FileText,
            path: '/admin/posts/post',
            menuKey: 'post',
            submenuItems: [
              { label: 'All Posts', path: '/admin/posts/post' },
              { label: 'Add New Post', path: '/admin/edit/post/new' },
              { label: 'Categories', path: '/admin/categories/post' }
            ]
          })}

          {/* Built-in Post Type: Pages */}
          {renderMenuItem({
            label: 'Pages',
            icon: File,
            path: '/admin/posts/page',
            menuKey: 'page',
            submenuItems: [
              { label: 'All Pages', path: '/admin/posts/page' },
              { label: 'Add New Page', path: '/admin/edit/page/new' }
            ]
          })}

          {/* Custom Post Types (Dynamic) */}
          {postTypes.filter(pt => pt.slug !== 'post' && pt.slug !== 'page').length > 0 && (
            <>
              <div className="menu-separator">Custom Content</div>
              {postTypes.filter(pt => pt.slug !== 'post' && pt.slug !== 'page').map(pt => {
                const subItems = [
                  { label: `All ${pt.plural}`, path: `/admin/posts/${pt.slug}` },
                  { label: `Add New ${pt.singular}`, path: `/admin/edit/${pt.slug}/new` }
                ];
                if (pt.taxonomies?.includes('category')) {
                  subItems.push({ label: 'Categories', path: `/admin/categories/${pt.slug}` });
                }
                return renderMenuItem({
                  label: pt.plural,
                  icon: Database,
                  path: `/admin/posts/${pt.slug}`,
                  menuKey: `cpt-${pt.slug}`,
                  submenuItems: subItems
                });
              })}
            </>
          )}

          <div className="menu-separator">Administration</div>

          {/* Post Type Builder */}
          {renderMenuItem({
            label: 'Post Types Builder',
            icon: Hammer,
            path: '/admin/builder',
            menuKey: 'builder'
          })}

          {/* Appearance */}
          {renderMenuItem({
            label: 'Appearance',
            icon: Palette,
            path: '/admin/appearance',
            menuKey: 'appearance',
            submenuItems: [
              { label: 'Header & Footer', path: '/admin/appearance/header-footer' },
              { label: 'Menus', path: '/admin/appearance/menus' },
              { label: 'Typography (Fonts)', path: '/admin/appearance/fonts' },
              { label: 'Theme Options', path: '/admin/appearance/theme-options' }
            ]
          })}

          {/* Settings */}
          {renderMenuItem({
            label: 'Settings',
            icon: Settings,
            path: '/admin/settings',
            menuKey: 'settings',
            submenuItems: [
              { label: 'General', path: '/admin/settings/general' },
              { label: 'Writing', path: '/admin/settings/writing' },
              { label: 'Reading', path: '/admin/settings/reading' },
              { label: 'Discussion', path: '/admin/settings/discussion' },
              { label: 'Permalinks', path: '/admin/settings/permalinks' }
            ]
          })}
        </div>

        <div className="sidebar-footer">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle-btn">
            <ChevronLeft size={16} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
            {sidebarOpen && <span>Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className={`admin-main ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
        {/* HEADER */}
        <header className="admin-header">
          <div className="header-left">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="header-icon-btn mobile-menu-toggle">
              <Menu size={20} />
            </button>
            <div className="header-site-link">
              <Globe size={16} />
              <Link to="/" className="site-link-text">
                Visit Site
              </Link>
            </div>
            {/* Quick Draft / Add New shortcut dropdown */}
            <div className="quick-actions" style={{ position: 'relative' }}>
              <button 
                type="button" 
                onClick={() => setQuickAddOpen(!quickAddOpen)} 
                className="quick-add-btn"
              >
                <Plus size={14} />
                <span>Quick Add</span>
                <ChevronDown size={10} style={{ marginLeft: '2px', opacity: 0.7 }} />
              </button>

              {quickAddOpen && (
                <div 
                  className="quick-add-dropdown fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    padding: '6px',
                    width: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {postTypes.map(pt => (
                    <button
                      key={pt.slug}
                      type="button"
                      onClick={() => {
                        setQuickAddOpen(false);
                        navigate(`/admin/edit/${pt.slug}/new`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-accent)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <Plus size={12} style={{ color: 'var(--color-primary)' }} />
                      <span>{pt.singular}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile">
              <span className="profile-greeting">Howdy, <strong>Admin</strong></span>
              <div className="profile-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="admin-content-area fade-in">
          {children || <Outlet />}
        </main>
      </div>

      {/* STYLES SPECIFIC TO THE LAYOUT */}
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-secondary);
        }

        /* Sidebar Styling */
        .admin-sidebar {
          width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          transition: width var(--transition-normal);
        }
        .admin-sidebar.closed {
          width: 60px;
        }

        .sidebar-brand {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-color);
          overflow: hidden;
          height: 65px;
        }
        .brand-logo {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          color: #fff;
          font-weight: 800;
          font-family: var(--font-title);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          box-shadow: var(--glow-primary);
        }
        .brand-info {
          display: flex;
          flex-direction: column;
          transition: opacity 0.2s;
        }
        .admin-sidebar.closed .brand-info {
          opacity: 0;
          width: 0;
          pointer-events: none;
        }
        .brand-title {
          font-size: 0.95rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .brand-tagline {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .sidebar-menu {
          flex: 1;
          overflow-y: auto;
          padding: 16px 8px;
        }
        .menu-separator {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin: 16px 12px 6px 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .admin-sidebar.closed .menu-separator {
          opacity: 0;
        }

        /* Menu Buttons */
        .menu-item-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          background: none;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .menu-item-btn:hover {
          background-color: var(--bg-tertiary);
          color: #fff;
        }
        .menu-item-btn.active {
          background-color: var(--bg-accent);
          color: #fff;
          border-color: rgba(99, 102, 241, 0.2);
        }
        .menu-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .menu-icon {
          color: var(--text-muted);
          transition: color var(--transition-fast);
          flex-shrink: 0;
        }
        .menu-item-btn:hover .menu-icon,
        .menu-item-btn.active .menu-icon {
          color: var(--color-primary);
        }
        .admin-sidebar.closed .menu-item-btn span {
          display: none;
        }
        .admin-sidebar.closed .menu-item-btn svg:last-child {
          display: none;
        }

        /* Submenu */
        .submenu {
          margin-top: 4px;
          margin-bottom: 8px;
          padding-left: 36px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-sidebar.closed .submenu {
          display: none;
        }
        .submenu-item {
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          position: relative;
          transition: all var(--transition-fast);
        }
        .submenu-item::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--text-muted);
          transition: background-color var(--transition-fast);
        }
        .submenu-item:hover {
          color: #fff;
          padding-left: 14px;
        }
        .submenu-item:hover::before {
          background-color: var(--color-primary);
        }
        .submenu-item.active {
          color: #fff;
          font-weight: 500;
        }
        .submenu-item.active::before {
          background-color: var(--color-secondary);
          transform: translateY(-50%) scale(1.5);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border-color);
          padding: 10px 8px;
        }
        .sidebar-toggle-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: var(--radius-md);
        }
        .sidebar-toggle-btn:hover {
          color: #fff;
          background-color: var(--bg-tertiary);
        }

        /* Main Container Styling */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left var(--transition-normal);
        }
        .admin-main.expanded {
          margin-left: 260px;
        }
        .admin-main.collapsed {
          margin-left: 60px;
        }

        /* Header Styling */
        .admin-header {
          height: 65px;
          background-color: rgba(19, 24, 36, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .mobile-menu-toggle {
          display: none;
        }
        .header-site-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .site-link-text {
          color: var(--text-secondary);
        }
        .site-link-text:hover {
          color: #fff;
        }
        .quick-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-accent);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #fff;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .quick-add-btn:hover {
          background-color: var(--color-primary);
          box-shadow: var(--glow-primary);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .admin-content-area {
          flex: 1;
        }

        /* Responsive Layout */
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
            width: 260px;
          }
          .admin-main.expanded, .admin-main.collapsed {
            margin-left: 0;
          }
          .profile-greeting {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
