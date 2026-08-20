"use client";

import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from '../routing';
import { useApp } from '../context/AppContext';
import PublicBlockRenderer from './PublicBlockRenderer';
import { Globe, Menu as MenuIcon, X } from 'lucide-react';

export default function PublicLayout({ children }) {
  const { settings, appearance } = useApp();
  const location = useLocation();

  const siteTitle = settings?.general?.siteTitle || 'CH Dynamic Admin';
  const siteTagline = settings?.general?.siteTagline || 'Dynamic CMS Dashboard';
  const siteLogo = appearance?.site_logo || '';

  // Get primary navigation menu
  const primaryMenu = appearance?.menus?.find(m => m.location === 'primary') || appearance?.menus?.[0];
  const menuItems = primaryMenu?.items || [];

  // Theme color settings
  const themeColors = appearance?.theme_options || {};
  
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!themeColors.headerSticky) {
      setIsSticky(false);
      return;
    }

    const threshold = parseInt(themeColors.headerStickyOffset || '0', 10);
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [themeColors.headerSticky, themeColors.headerStickyOffset]);
  const primaryColor = themeColors.primaryColor || '#6366f1';
  const accentColor = themeColors.accentColor || '#a855f7';
  const bgColor = themeColors.bgColor || '#0b0f19';
  const panelBgColor = themeColors.panelBgColor || '#151b2c';
  const textColor = themeColors.textColor || '#f8fafc';

  // Container Width Options
  const headerWidth = themeColors.headerWidth || '100%';
  const footerWidth = themeColors.footerWidth || '100%';
  const contentWidth = themeColors.contentWidth || '1200px';

  // Responsive fonts settings
  const bodyFont = appearance?.fonts?.body || {};
  const h1Font = appearance?.fonts?.h1 || {};
  const h2Font = appearance?.fonts?.h2 || {};
  const h3Font = appearance?.fonts?.h3 || {};
  const h4Font = appearance?.fonts?.h4 || {};
  const h5Font = appearance?.fonts?.h5 || {};
  const h6Font = appearance?.fonts?.h6 || {};
  const hyperlinksFont = appearance?.fonts?.hyperlinks || {};

  // Inject dynamic custom fonts and style variables
  useEffect(() => {
    // 1. Gather all custom font families to load
    const fontsToLoad = new Set();
    if (bodyFont.family) fontsToLoad.add(bodyFont.family);
    if (h1Font.family) fontsToLoad.add(h1Font.family);
    if (h2Font.family) fontsToLoad.add(h2Font.family);
    if (h3Font.family) fontsToLoad.add(h3Font.family);
    if (h4Font.family) fontsToLoad.add(h4Font.family);
    if (h5Font.family) fontsToLoad.add(h5Font.family);
    if (h6Font.family) fontsToLoad.add(h6Font.family);
    if (hyperlinksFont.family) fontsToLoad.add(hyperlinksFont.family);
    if (appearance?.custom_fonts) {
      appearance.custom_fonts.forEach(f => fontsToLoad.add(f));
    }

    // Load registered font families dynamically from Google Fonts API
    const loadGoogleFonts = () => {
      const families = Array.from(fontsToLoad)
        .map(f => {
          // Extract font family name (strip quotes and fallback sans/serif strings)
          const name = f.split(',')[0].replace(/['"]/g, '').trim();
          if (name === 'inherit' || name.startsWith('system-ui')) return null;
          return `family=${name.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`;
        })
        .filter(Boolean)
        .join('&');

      if (families) {
        const linkId = 'public-google-fonts';
        let link = document.getElementById(linkId);
        if (!link) {
          link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      }
    };

    loadGoogleFonts();
  }, [appearance, bodyFont, h1Font, h2Font, h3Font, h4Font, h5Font, h6Font, hyperlinksFont]);

  // Global Header layout content blocks list
  const headerBlocks = appearance?.header_content || [];
  // Global Footer layout content blocks list
  const footerBlocks = appearance?.footer_content || [];

  // Generate dynamic CSS stylesheet text
  const dynamicStyles = `
    :root {
      --color-primary: ${primaryColor};
      --color-secondary: ${accentColor};
      --bg-primary: ${bgColor};
      --bg-secondary: ${panelBgColor};
      --text-primary: ${textColor};
      --border-color: rgba(255, 255, 255, 0.08);
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --radius-md: 8px;
      --radius-sm: 4px;
      --radius-full: 9999px;
      --glow-primary: 0 0 15px rgba(99, 102, 241, 0.3);
      --header-width: ${headerWidth};
      --footer-width: ${footerWidth};
      --content-width: ${contentWidth};
    }

    body {
      background-color: var(--bg-primary) !important;
      color: var(--text-primary) !important;
      font-family: ${bodyFont.family || 'Inter, sans-serif'} !important;
      font-size: ${bodyFont.size_desktop || '16'}px !important;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    h1 {
      font-family: ${h1Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h1Font.size_desktop || '32'}px !important;
      font-weight: ${h1Font.weight || '700'} !important;
      font-style: ${h1Font.style || 'normal'} !important;
      text-transform: ${h1Font.case || 'none'} !important;
      color: #fff;
    }

    h2 {
      font-family: ${h2Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h2Font.size_desktop || '28'}px !important;
      font-weight: ${h2Font.weight || '700'} !important;
      font-style: ${h2Font.style || 'normal'} !important;
      text-transform: ${h2Font.case || 'none'} !important;
      color: #fff;
    }

    h3 {
      font-family: ${h3Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h3Font.size_desktop || '24'}px !important;
      font-weight: ${h3Font.weight || '600'} !important;
      font-style: ${h3Font.style || 'normal'} !important;
      text-transform: ${h3Font.case || 'none'} !important;
      color: #fff;
    }

    h4 {
      font-family: ${h4Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h4Font.size_desktop || '20'}px !important;
      font-weight: ${h4Font.weight || '600'} !important;
      font-style: ${h4Font.style || 'normal'} !important;
      text-transform: ${h4Font.case || 'none'} !important;
      color: #fff;
    }

    h5 {
      font-family: ${h5Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h5Font.size_desktop || '18'}px !important;
      font-weight: ${h5Font.weight || '600'} !important;
      font-style: ${h5Font.style || 'normal'} !important;
      text-transform: ${h5Font.case || 'none'} !important;
      color: #fff;
    }

    h6 {
      font-family: ${h6Font.family || 'Outfit, sans-serif'} !important;
      font-size: ${h6Font.size_desktop || '16'}px !important;
      font-weight: ${h6Font.weight || '600'} !important;
      font-style: ${h6Font.style || 'normal'} !important;
      text-transform: ${h6Font.case || 'none'} !important;
      color: #fff;
    }

    a {
      font-family: ${hyperlinksFont.family || 'inherit'};
      font-size: ${hyperlinksFont.size_desktop || '16'}px;
      font-weight: ${hyperlinksFont.weight || '500'};
      font-style: ${hyperlinksFont.style || 'normal'};
      text-transform: ${hyperlinksFont.case || 'none'};
    }

    /* Base components */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .btn-primary {
      background-color: var(--color-primary);
      color: #fff;
      box-shadow: var(--glow-primary);
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: var(--border-color);
      color: var(--text-primary);
    }
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    /* Responsive grid styles */
    @media (max-width: 768px) {
      body {
        font-size: ${bodyFont.size_tablet || '15'}px !important;
      }
      h1 { font-size: ${h1Font.size_tablet || '28'}px !important; }
      h2 { font-size: ${h2Font.size_tablet || '24'}px !important; }
      h3 { font-size: ${h3Font.size_tablet || '20'}px !important; }
      h4 { font-size: ${h4Font.size_tablet || '18'}px !important; }
      h5 { font-size: ${h5Font.size_tablet || '16'}px !important; }
      h6 { font-size: ${h6Font.size_tablet || '14'}px !important; }
      a { font-size: ${hyperlinksFont.size_tablet || '15'}px; }
    }
    @media (max-width: 480px) {
      body {
        font-size: ${bodyFont.size_mobile || '14'}px !important;
      }
      h1 { font-size: ${h1Font.size_mobile || '24'}px !important; }
      h2 { font-size: ${h2Font.size_mobile || '20'}px !important; }
      h3 { font-size: ${h3Font.size_mobile || '18'}px !important; }
      h4 { font-size: ${h4Font.size_mobile || '16'}px !important; }
      h5 { font-size: ${h5Font.size_mobile || '14'}px !important; }
      h6 { font-size: ${h6Font.size_mobile || '13'}px !important; }
      a { font-size: ${hyperlinksFont.size_mobile || '14'}px; }
    }

    @keyframes slideDownHeader {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `;

  return (
    <div className="public-site-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <style>{dynamicStyles}</style>

      {/* 1. PUBLIC WEBSITE HEADER WRAPPER */}
      <div 
        className="public-header-wrapper" 
        style={{
          width: '100%',
          flexShrink: 0,
          position: !!themeColors.headerTransparent ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          zIndex: 1000,
          minHeight: (themeColors.headerSticky && !themeColors.headerTransparent) ? '70px' : 'auto'
        }}
      >
        <header 
          className="public-header-bar" 
          style={{
            width: '100%',
            flexShrink: 0,
            zIndex: 1000,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            ...(themeColors.headerSticky && isSticky ? {
              position: 'fixed',
              top: 0,
              left: 0,
              background: themeColors.headerStickyBgColor || 'rgba(11, 15, 25, 0.9)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              animation: 'slideDownHeader 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            } : !!themeColors.headerTransparent ? {
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'transparent'
            } : {
              position: 'relative',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)'
            })
          }}
        >
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {headerBlocks.length > 0 ? (
              <PublicBlockRenderer 
                context="header"
                blocks={headerBlocks} 
                appearance={appearance}
                menuItems={menuItems}
                siteLogoUrl={siteLogo}
              />
            ) : (
              // Premium default navigation header if custom block layout is empty
              <div style={{ maxWidth: headerWidth, width: '100%', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', background: 'transparent', borderBottom: 'none'
                }}>
                  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    {siteLogo ? (
                      <img src={siteLogo} alt="Site Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
                    ) : (
                      <Globe size={24} style={{ color: 'var(--color-primary)' }} />
                    )}
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-title)' }}>
                      {siteTitle}
                    </span>
                  </Link>

                  <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {menuItems.map(item => (
                      <a 
                        key={item.id} 
                        href={item.url || '#'} 
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: location.pathname === item.url ? 'var(--color-primary)' : 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => { if (location.pathname !== item.url) e.target.style.color = '#fff'; }}
                        onMouseLeave={(e) => { if (location.pathname !== item.url) e.target.style.color = 'var(--text-secondary)'; }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* 2. MAIN SUBPAGE WORKSPACE */}
      <main 
        className="public-content-workspace" 
        style={{ 
          flex: '1 0 auto', 
          width: '100%', 
          boxSizing: 'border-box'
        }}
      >
        {children || <Outlet />}
      </main>

      {/* 3. PUBLIC WEBSITE FOOTER */}
      <footer className="public-footer-bar" style={{ width: '100%', flexShrink: 0 }}>
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          {footerBlocks.length > 0 ? (
            <PublicBlockRenderer 
              context="footer"
              blocks={footerBlocks} 
              appearance={appearance}
              menuItems={menuItems}
              siteLogoUrl={siteLogo}
            />
          ) : (
            // Default standard footer if custom block layout is empty
            <div style={{ maxWidth: footerWidth, width: '100%', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
              <div style={{
                padding: '24px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)',
                textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'
              }}>
                <div>
                  &copy; {new Date().getFullYear()} <strong>{siteTitle}</strong>. All rights reserved.
                </div>
                <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
                  {siteTagline} &bull; Powered by CH CMS
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
