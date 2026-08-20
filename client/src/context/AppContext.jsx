"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({ children, initialSettings, initialAppearance, initialPostTypes }) => {
  const pathname = usePathname();
  const [postTypes, setPostTypes] = useState(initialPostTypes || []);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [settings, setSettings] = useState(initialSettings || null);
  const [appearance, setAppearance] = useState(initialAppearance || null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(!initialSettings);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error('Error fetching media library:', err);
    }
  };

  const uploadMedia = async (base64Data, filename) => {
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: filename, url: base64Data })
      });
      if (res.ok) {
        const newAsset = await res.json();
        setMedia(prev => [newAsset, ...prev]);
        return newAsset;
      }
      throw new Error('Upload failed');
    } catch (err) {
      console.error('Error uploading media asset:', err);
      throw err;
    }
  };

  const deleteMedia = async (id) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id));
        return true;
      }
      throw new Error('Deletion failed');
    } catch (err) {
      console.error('Error deleting media asset:', err);
      throw err;
    }
  };

  const fetchPostTypes = async () => {
    try {
      const res = await fetch('/api/post-types');
      if (res.ok) {
        const data = await res.json();
        setPostTypes(data);
      }
    } catch (err) {
      console.error('Error fetching post types:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchAppearance = async () => {
    try {
      const res = await fetch('/api/appearance');
      if (res.ok) {
        const data = await res.json();
        setAppearance(data);
      }
    } catch (err) {
      console.error('Error fetching appearance settings:', err);
    }
  };

  const loadAll = async () => {
    if (!initialSettings) {
      setLoading(true);
    }
    await Promise.all([
      fetchPostTypes(),
      fetchCategories(),
      fetchTags(),
      fetchSettings(),
      fetchAppearance(),
      fetchMedia()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!appearance) return;

    const root = document.documentElement;
    const { theme_options, fonts, custom_fonts, uploaded_fonts } = appearance;

    const isAdmin = pathname && pathname.startsWith('/admin');

    if (isAdmin) {
      // Reset variables to default admin dark theme palette
      root.style.setProperty('--color-primary', '#6366f1');
      root.style.setProperty('--color-primary-hover', '#4f46e5');
      root.style.setProperty('--color-secondary', '#a855f7');
      root.style.setProperty('--bg-primary', '#0b0e14');
      root.style.setProperty('--bg-secondary', '#131824');
      root.style.setProperty('--bg-tertiary', '#1b2234');
      root.style.setProperty('--text-primary', '#f3f4f6');
      root.style.setProperty('--text-secondary', '#9ca3af');
      root.style.setProperty('--text-muted', '#6b7280');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');

      // Clear dynamic typography styles
      const styleTag = document.getElementById('dynamic-appearance-styles');
      if (styleTag) styleTag.remove();
      const uploadedTag = document.getElementById('uploaded-fonts-loader');
      if (uploadedTag) uploadedTag.remove();
      const googleTag = document.getElementById('google-fonts-loader');
      if (googleTag) googleTag.remove();

      return;
    }

    if (theme_options) {
      if (theme_options.primaryColor) root.style.setProperty('--color-primary', theme_options.primaryColor);
      if (theme_options.accentColor) root.style.setProperty('--color-secondary', theme_options.accentColor);
      if (theme_options.bgColor) root.style.setProperty('--bg-primary', theme_options.bgColor);
      if (theme_options.panelBgColor) root.style.setProperty('--bg-secondary', theme_options.panelBgColor);
      if (theme_options.textColor) root.style.setProperty('--text-primary', theme_options.textColor);
    }

    // Uploaded Custom Fonts Loader Logic
    const uploadedFonts = uploaded_fonts || [];
    if (uploadedFonts.length > 0) {
      let uploadedStyleTag = document.getElementById('uploaded-fonts-loader');
      if (!uploadedStyleTag) {
        uploadedStyleTag = document.createElement('style');
        uploadedStyleTag.id = 'uploaded-fonts-loader';
        document.head.appendChild(uploadedStyleTag);
      }
      uploadedStyleTag.innerHTML = uploadedFonts.map(f => `
        @font-face {
          font-family: '${f.family}';
          src: url('${f.url}') format('${f.url.includes('woff2') ? 'woff2' : f.url.includes('woff') ? 'woff' : f.url.includes('otf') ? 'opentype' : 'truetype'}');
          font-weight: ${f.weight || '400'};
          font-style: ${f.style || 'normal'};
          font-display: swap;
        }
      `).join('\n');
    } else {
      const tag = document.getElementById('uploaded-fonts-loader');
      if (tag) tag.remove();
    }

    // Google Fonts Loader Logic
    const cleanFontFamily = (familyStr) => {
      if (!familyStr || familyStr === 'inherit') return null;
      return familyStr.split(',')[0].replace(/['"]/g, '').trim();
    };

    const googleFontsToLoad = new Set();
    
    if (fonts) {
      Object.keys(fonts).forEach(key => {
        const cleanName = cleanFontFamily(fonts[key]?.family);
        if (cleanName && !['system-ui', '-apple-system', 'sans-serif', 'serif', 'inherit', 'monospace', 'Courier New'].includes(cleanName)) {
          googleFontsToLoad.add(cleanName);
        }
      });
    }

    if (custom_fonts) {
      custom_fonts.forEach(f => {
        const cleanName = cleanFontFamily(f);
        if (cleanName && !['system-ui', '-apple-system', 'sans-serif', 'serif', 'inherit', 'monospace', 'Courier New'].includes(cleanName)) {
          googleFontsToLoad.add(cleanName);
        }
      });
    }

    if (googleFontsToLoad.size > 0) {
      let linkTag = document.getElementById('google-fonts-loader');
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.id = 'google-fonts-loader';
        linkTag.rel = 'stylesheet';
        document.head.appendChild(linkTag);
      }
      const fontQuery = Array.from(googleFontsToLoad)
        .map(name => `family=${name.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`)
        .join('&');
      linkTag.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    } else {
      const tag = document.getElementById('google-fonts-loader');
      if (tag) tag.remove();
    }

    if (fonts) {
      let styleTag = document.getElementById('dynamic-appearance-styles');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-appearance-styles';
        document.head.appendChild(styleTag);
      }

      const bodyFont = fonts.body || {};
      const h1Font = fonts.h1 || {};
      const h2Font = fonts.h2 || {};
      const h3Font = fonts.h3 || {};
      const h4Font = fonts.h4 || {};
      const h5Font = fonts.h5 || {};
      const h6Font = fonts.h6 || {};
      const linkFont = fonts.hyperlinks || {};

      styleTag.innerHTML = `
        body {
          font-family: ${bodyFont.family || 'inherit'};
          font-size: ${bodyFont.size_desktop || '16'}px;
          font-weight: ${bodyFont.weight || '400'};
          font-style: ${bodyFont.style || 'normal'};
          text-transform: ${bodyFont.case || 'none'};
        }
        h1 {
          font-family: ${h1Font.family || 'inherit'};
          font-size: ${h1Font.size_desktop || '32'}px;
          font-weight: ${h1Font.weight || '700'};
          font-style: ${h1Font.style || 'normal'};
          text-transform: ${h1Font.case || 'none'};
        }
        h2 {
          font-family: ${h2Font.family || 'inherit'};
          font-size: ${h2Font.size_desktop || '28'}px;
          font-weight: ${h2Font.weight || '700'};
          font-style: ${h2Font.style || 'normal'};
          text-transform: ${h2Font.case || 'none'};
        }
        h3 {
          font-family: ${h3Font.family || 'inherit'};
          font-size: ${h3Font.size_desktop || '24'}px;
          font-weight: ${h3Font.weight || '600'};
          font-style: ${h3Font.style || 'normal'};
          text-transform: ${h3Font.case || 'none'};
        }
        h4 {
          font-family: ${h4Font.family || 'inherit'};
          font-size: ${h4Font.size_desktop || '20'}px;
          font-weight: ${h4Font.weight || '600'};
          font-style: ${h4Font.style || 'normal'};
          text-transform: ${h4Font.case || 'none'};
        }
        h5 {
          font-family: ${h5Font.family || 'inherit'};
          font-size: ${h5Font.size_desktop || '18'}px;
          font-weight: ${h5Font.weight || '600'};
          font-style: ${h5Font.style || 'normal'};
          text-transform: ${h5Font.case || 'none'};
        }
        h6 {
          font-family: ${h6Font.family || 'inherit'};
          font-size: ${h6Font.size_desktop || '16'}px;
          font-weight: ${h6Font.weight || '600'};
          font-style: ${h6Font.style || 'normal'};
          text-transform: ${h6Font.case || 'none'};
        }
        a, .btn, .sidebar-link {
          font-family: ${linkFont.family || 'inherit'};
          font-size: ${linkFont.size_desktop || '16'}px;
          font-weight: ${linkFont.weight || '500'};
          font-style: ${linkFont.style || 'normal'};
          text-transform: ${linkFont.case || 'none'};
        }

        @media (max-width: 768px) {
          body {
            font-size: ${bodyFont.size_tablet || '15'}px;
          }
          h1 { font-size: ${h1Font.size_tablet || '28'}px; }
          h2 { font-size: ${h2Font.size_tablet || '24'}px; }
          h3 { font-size: ${h3Font.size_tablet || '20'}px; }
          h4 { font-size: ${h4Font.size_tablet || '18'}px; }
          h5 { font-size: ${h5Font.size_tablet || '16'}px; }
          h6 { font-size: ${h6Font.size_tablet || '14'}px; }
          a, .btn, .sidebar-link {
            font-size: ${linkFont.size_tablet || '15'}px;
          }
        }

        @media (max-width: 480px) {
          body {
            font-size: ${bodyFont.size_mobile || '14'}px;
          }
          h1 { font-size: ${h1Font.size_mobile || '24'}px; }
          h2 { font-size: ${h2Font.size_mobile || '20'}px; }
          h3 { font-size: ${h3Font.size_mobile || '18'}px; }
          h4 { font-size: ${h4Font.size_mobile || '16'}px; }
          h5 { font-size: ${h5Font.size_mobile || '14'}px; }
          h6 { font-size: ${h6Font.size_mobile || '13'}px; }
          a, .btn, .sidebar-link {
            font-size: ${linkFont.size_mobile || '14'}px;
          }
        }
      `;
    }
  }, [appearance, pathname]);

  const addPostType = async (postTypeData) => {
    const res = await fetch('/api/post-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postTypeData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create post type');
    }
    await fetchPostTypes();
  };

  const updatePostType = async (slug, postTypeData) => {
    const res = await fetch(`/api/post-types/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postTypeData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update post type');
    }
    await fetchPostTypes();
  };

  const deletePostType = async (slug) => {
    const res = await fetch(`/api/post-types/${slug}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete post type');
    }
    await loadAll(); // Re-fetch all since posts were deleted too
  };

  const addCategory = async (catData) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create category');
    }
    await fetchCategories();
  };

  const deleteCategory = async (id) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete category');
    }
    await fetchCategories();
  };

  const addTag = async (tagData) => {
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create tag');
    }
    await fetchTags();
  };

  const saveSettings = async (section, sectionSettings) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, settings: sectionSettings })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save settings');
    }
    await fetchSettings();
  };

  const saveAppearance = async (updatedData) => {
    const res = await fetch('/api/appearance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save appearance configurations');
    }
    await fetchAppearance();
  };

  return (
    <AppContext.Provider value={{
      postTypes,
      categories,
      tags,
      settings,
      appearance,
      media,
      loading,
      refreshMedia: fetchMedia,
      uploadMedia,
      deleteMedia,
      refreshPostTypes: fetchPostTypes,
      refreshCategories: fetchCategories,
      refreshTags: fetchTags,
      refreshSettings: fetchSettings,
      refreshAppearance: fetchAppearance,
      addPostType,
      updatePostType,
      deletePostType,
      addCategory,
      deleteCategory,
      addTag,
      saveSettings,
      saveAppearance,
      reloadAll: loadAll
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
