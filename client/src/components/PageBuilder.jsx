"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  MousePointer, 
  Minus, 
  AlertTriangle,
  ArrowUp, 
  ArrowLeft, 
  ArrowDown, 
  Trash2, 
  Settings as SettingsIcon,
  Plus,
  Layers,
  UploadCloud,
  Monitor,
  Tablet as TabletIcon,
  Smartphone,
  Check,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  Menu,
  List,
  Package,
  Play,
  Sliders,
  Grid,
  RefreshCw,
  Copy,
  Clipboard
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import { SHAPE_DIVIDERS } from './ShapeDividersData';

export function renderShapeDivider(type, position, color, height, invert = false, flip = false) {
  if (!type || type === 'none') return null;

  const shapeKey = type === 'wave' ? 'waves' : type;
  const shape = SHAPE_DIVIDERS[shapeKey];

  if (!shape) return null;

  const isTop = position === 'top';
  let useNegative = false;
  let scaleYVal = 1;

  if (isTop) {
    if (invert) {
      if (shape.hasNegative) {
        useNegative = true;
        scaleYVal = 1;
      } else {
        useNegative = false;
        scaleYVal = -1;
      }
    } else {
      useNegative = false;
      scaleYVal = 1;
    }
  } else {
    if (invert) {
      useNegative = false;
      scaleYVal = 1;
    } else {
      if (shape.hasNegative) {
        useNegative = true;
        scaleYVal = 1;
      } else {
        useNegative = false;
        scaleYVal = -1;
      }
    }
  }

  let scaleXVal = flip ? -1 : 1;
  const translateVal = position === 'top' ? '-1px' : '1px';

  const svgStyle = {
    position: 'absolute',
    left: '-1px',
    right: '-1px',
    width: 'calc(100% + 2px)',
    height: `${height || 100}px`,
    overflow: 'hidden',
    lineHeight: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transform: `scaleX(${scaleXVal}) scaleY(${scaleYVal}) translateY(${translateVal})`,
    ...(position === 'top' ? { top: '-1px' } : { bottom: '-3px' })
  };

  const pathsToRender = useNegative ? shape.negativePaths : shape.paths;

  return (
    <div style={svgStyle} className={`shape-divider shape-divider-${position}`}>
      <svg viewBox={shape.viewBox} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
        {pathsToRender.map((p, idx) => (
          <path
            key={idx}
            d={p.d}
            fill={color || 'var(--bg-secondary)'}
            opacity={p.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

// Helper to parse Elementor style configurations to React style properties
export function getElementorStyles(styleObj = {}, device = 'desktop') {
  if (!styleObj || typeof styleObj !== 'object') return {};
  const styles = {};
  
  // Sizing
  if (styleObj.width !== undefined && styleObj.width !== '') {
    styles.width = String(styleObj.width).includes('%') || String(styleObj.width).includes('px') ? styleObj.width : `${styleObj.width}%`;
  }

  // Backgrounds
  if (styleObj.color) styles.color = styleObj.color;
  if (styleObj.backgroundColor) styles.backgroundColor = styleObj.backgroundColor;
  if (styleObj.backgroundImage) {
    styles.backgroundImage = `url(${styleObj.backgroundImage})`;
    styles.backgroundPosition = styleObj.backgroundPosition || 'center center';
    styles.backgroundRepeat = styleObj.backgroundRepeat || 'no-repeat';
    styles.backgroundSize = styleObj.backgroundSize || 'cover';
  }

  // Padding & Margin resolving based on responsive preview device
  const suffix = device === 'desktop' ? '_desktop' : device === 'tablet' ? '_tablet' : '_mobile';
  
  const getVal = (key) => {
    if (styleObj[`${key}${suffix}`] !== undefined && styleObj[`${key}${suffix}`] !== '') {
      return styleObj[`${key}${suffix}`];
    }
    if (device !== 'desktop') {
      if (device === 'mobile' && styleObj[`${key}_tablet`] !== undefined && styleObj[`${key}_tablet`] !== '') {
        return styleObj[`${key}_tablet`];
      }
      if (styleObj[`${key}_desktop`] !== undefined && styleObj[`${key}_desktop`] !== '') {
        return styleObj[`${key}_desktop`];
      }
    }
    return styleObj[key];
  };

  const paddingTop = getVal('paddingTop');
  const paddingRight = getVal('paddingRight');
  const paddingBottom = getVal('paddingBottom');
  const paddingLeft = getVal('paddingLeft');

  const marginTop = getVal('marginTop');
  const marginRight = getVal('marginRight');
  const marginBottom = getVal('marginBottom');
  const marginLeft = getVal('marginLeft');

  // Padding
  if (paddingTop !== undefined && paddingTop !== '') {
    styles.paddingTop = String(paddingTop).includes('px') || String(paddingTop).includes('%') ? paddingTop : `${paddingTop}px`;
  }
  if (paddingRight !== undefined && paddingRight !== '') {
    styles.paddingRight = String(paddingRight).includes('px') || String(paddingRight).includes('%') ? paddingRight : `${paddingRight}px`;
  }
  if (paddingBottom !== undefined && paddingBottom !== '') {
    styles.paddingBottom = String(paddingBottom).includes('px') || String(paddingBottom).includes('%') ? paddingBottom : `${paddingBottom}px`;
  }
  if (paddingLeft !== undefined && paddingLeft !== '') {
    styles.paddingLeft = String(paddingLeft).includes('px') || String(paddingLeft).includes('%') ? paddingLeft : `${paddingLeft}px`;
  }

  // Margin
  if (marginTop !== undefined && marginTop !== '') {
    styles.marginTop = String(marginTop).includes('px') || String(marginTop).includes('%') ? marginTop : `${marginTop}px`;
  }
  if (marginRight !== undefined && marginRight !== '') {
    styles.marginRight = String(marginRight).includes('px') || String(marginRight).includes('%') ? marginRight : `${marginRight}px`;
  }
  if (marginBottom !== undefined && marginBottom !== '') {
    styles.marginBottom = String(marginBottom).includes('px') || String(marginBottom).includes('%') ? marginBottom : `${marginBottom}px`;
  }
  if (marginLeft !== undefined && marginLeft !== '') {
    styles.marginLeft = String(marginLeft).includes('px') || String(marginLeft).includes('%') ? marginLeft : `${marginLeft}px`;
  }

  // Borders
  if (styleObj.borderType === 'none') {
    styles.borderStyle = 'none';
    styles.borderWidth = '0px';
    styles.borderColor = 'transparent';
  } else if (styleObj.borderType) {
    styles.borderStyle = styleObj.borderType;
    styles.borderColor = styleObj.borderColor || 'rgba(255,255,255,0.1)';
    
    // Four-sided border widths
    if (styleObj.borderTopWidth !== undefined && styleObj.borderTopWidth !== '') {
      styles.borderTopWidth = `${styleObj.borderTopWidth}px`;
    }
    if (styleObj.borderRightWidth !== undefined && styleObj.borderRightWidth !== '') {
      styles.borderRightWidth = `${styleObj.borderRightWidth}px`;
    }
    if (styleObj.borderBottomWidth !== undefined && styleObj.borderBottomWidth !== '') {
      styles.borderBottomWidth = `${styleObj.borderBottomWidth}px`;
    }
    if (styleObj.borderLeftWidth !== undefined && styleObj.borderLeftWidth !== '') {
      styles.borderLeftWidth = `${styleObj.borderLeftWidth}px`;
    }

    // Fallback/Legacy single border width
    if (
      (styleObj.borderTopWidth === undefined || styleObj.borderTopWidth === '') &&
      (styleObj.borderRightWidth === undefined || styleObj.borderRightWidth === '') &&
      (styleObj.borderBottomWidth === undefined || styleObj.borderBottomWidth === '') &&
      (styleObj.borderLeftWidth === undefined || styleObj.borderLeftWidth === '')
    ) {
      const borderW = styleObj.borderWidth || '1';
      styles.borderWidth = String(borderW).includes('px') ? borderW : `${borderW}px`;
    }
  }

  // Four-sided border radii
  let hasRadiusSide = false;
  if (styleObj.borderTopLeftRadius !== undefined && styleObj.borderTopLeftRadius !== '') {
    styles.borderTopLeftRadius = `${styleObj.borderTopLeftRadius}px`;
    hasRadiusSide = true;
  }
  if (styleObj.borderTopRightRadius !== undefined && styleObj.borderTopRightRadius !== '') {
    styles.borderTopRightRadius = `${styleObj.borderTopRightRadius}px`;
    hasRadiusSide = true;
  }
  if (styleObj.borderBottomRightRadius !== undefined && styleObj.borderBottomRightRadius !== '') {
    styles.borderBottomRightRadius = `${styleObj.borderBottomRightRadius}px`;
    hasRadiusSide = true;
  }
  if (styleObj.borderBottomLeftRadius !== undefined && styleObj.borderBottomLeftRadius !== '') {
    styles.borderBottomLeftRadius = `${styleObj.borderBottomLeftRadius}px`;
    hasRadiusSide = true;
  }

  // Fallback/Legacy single border radius
  if (!hasRadiusSide && styleObj.borderRadius !== undefined && styleObj.borderRadius !== '') {
    const radius = styleObj.borderRadius;
    styles.borderRadius = String(radius).includes('px') || String(radius).includes('%') ? radius : `${radius}px`;
  }

  // Box Shadow
  if (styleObj.boxShadow) {
    const x = styleObj.boxShadowX || '0';
    const y = styleObj.boxShadowY || '4';
    const blur = styleObj.boxShadowBlur || '10';
    const spread = styleObj.boxShadowSpread || '0';
    const color = styleObj.boxShadowColor || 'rgba(0,0,0,0.5)';
    styles.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }

  return styles;
}

export function LoopGridPreview({ settings, previewDevice }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const pt = settings.postType || 'post';
        const res = await fetch(`/api/posts?post_type=${pt}&status=publish`);
        if (res.ok) {
          let data = await res.json();
          data.sort((a, b) => {
            const orderMult = (settings.order || 'DESC') === 'DESC' ? -1 : 1;
            const key = settings.orderBy || 'createdAt';
            if (key === 'title') {
              return (a.title || '').localeCompare(b.title || '') * orderMult;
            }
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return (dateA - dateB) * orderMult;
          });
          const lim = parseInt(settings.limit || '6');
          data = data.slice(0, lim);
          if (active) {
            setPosts(data);
          }
        }
      } catch (e) {
        console.error('Error fetching loop posts:', e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPosts();
    return () => { active = false; };
  }, [settings.postType, settings.limit, settings.orderBy, settings.order]);

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading queried posts...</div>;
  }

  if (posts.length === 0) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No published posts found for type "{settings.postType || 'post'}".</div>;
  }

  const cols = previewDevice === 'mobile' 
    ? (settings.columnsMobile || '1') 
    : previewDevice === 'tablet' 
      ? (settings.columnsTablet || '2') 
      : (settings.columnsDesktop || '3');

  const gap = `${settings.gap || '20'}px`;

  const unit = settings.borderRadiusUnit || (settings.borderRadius ? 'px' : '%');
  const brTopLeft = settings.borderRadiusTopLeft !== undefined ? settings.borderRadiusTopLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brTopRight = settings.borderRadiusTopRight !== undefined ? settings.borderRadiusTopRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomRight = settings.borderRadiusBottomRight !== undefined ? settings.borderRadiusBottomRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomLeft = settings.borderRadiusBottomLeft !== undefined ? settings.borderRadiusBottomLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const borderRadiusStyle = `${brTopLeft}${unit} ${brTopRight}${unit} ${brBottomRight}${unit} ${brBottomLeft}${unit}`;

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, 
        gap: gap,
        width: '100%' 
      }}
    >
      {posts.map((post) => (
        <div 
          key={post.id} 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            background: 'none',
            border: 'none',
            borderRadius: '0',
            padding: '0'
          }}
        >
          {settings.showImage !== false && (post.featured_image || post.featuredImage) && (
            <img 
              src={post.featured_image || post.featuredImage} 
              alt={post.title} 
              style={{ 
                width: '100%', 
                height: `${settings.imageHeight || '200'}px`, 
                objectFit: 'cover',
                borderRadius: borderRadiusStyle
              }} 
            />
          )}
          <div style={{ padding: '12px 0 0 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {settings.showTitle !== false && (
              <h4 
                style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : '1.1em', 
                  fontWeight: '600', 
                  color: settings.titleColor || 'inherit' 
                }}
              >
                {post.title}
              </h4>
            )}
            {settings.showMeta !== false && (
              <div style={{ fontSize: '0.75em', color: settings.metaColor || 'inherit', opacity: settings.metaColor ? 1 : 0.55, marginBottom: '10px' }}>
                <span>{new Date(post.createdAt || post.created_at).toLocaleDateString()}</span>
                {post.authorName && <span style={{ marginLeft: '8px' }}>by {post.authorName}</span>}
              </div>
            )}
            {settings.showExcerpt !== false && (
              <p 
                style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: settings.excerptFontSize ? `${settings.excerptFontSize}px` : '0.85em', 
                  color: settings.excerptColor || 'inherit', 
                  opacity: settings.excerptColor ? 1 : 0.7,
                  lineHeight: '1.5',
                  flex: 1 
                }}
              >
                {(post.content || '').replace(/<[^>]*>/g, '').substring(0, parseInt(settings.excerptLength || '100'))}...
              </p>
            )}
            {settings.showButton !== false && (
              <button 
                type="button"
                style={{ 
                  marginTop: 'auto',
                  padding: '8px 16px', 
                  borderRadius: '6px', 
                  background: settings.buttonColor || '#6366f1', 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                {settings.buttonText || 'View Event'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoopCarouselPreview({ settings, previewDevice }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const pt = settings.postType || 'post';
        const res = await fetch(`/api/posts?post_type=${pt}&status=publish`);
        if (res.ok) {
          let data = await res.json();
          data.sort((a, b) => {
            const orderMult = (settings.order || 'DESC') === 'DESC' ? -1 : 1;
            const key = settings.orderBy || 'createdAt';
            if (key === 'title') {
              return (a.title || '').localeCompare(b.title || '') * orderMult;
            }
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return (dateA - dateB) * orderMult;
          });
          const lim = parseInt(settings.limit || '6');
          data = data.slice(0, lim);
          if (active) {
            setPosts(data);
          }
        }
      } catch (e) {
        console.error('Error fetching loop posts:', e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPosts();
    return () => { active = false; };
  }, [settings.postType, settings.limit, settings.orderBy, settings.order]);

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading queried posts...</div>;
  }

  if (posts.length === 0) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No published posts found for type "{settings.postType || 'post'}".</div>;
  }

  const slidesCount = previewDevice === 'mobile' 
    ? parseInt(settings.slidesToShowMobile || '1') 
    : previewDevice === 'tablet' 
      ? parseInt(settings.slidesToShowTablet || '2') 
      : parseInt(settings.slidesToShowDesktop || '3');

  const gap = `${settings.gap || '20'}px`;

  const unit = settings.borderRadiusUnit || (settings.borderRadius ? 'px' : '%');
  const brTopLeft = settings.borderRadiusTopLeft !== undefined ? settings.borderRadiusTopLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brTopRight = settings.borderRadiusTopRight !== undefined ? settings.borderRadiusTopRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomRight = settings.borderRadiusBottomRight !== undefined ? settings.borderRadiusBottomRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomLeft = settings.borderRadiusBottomLeft !== undefined ? settings.borderRadiusBottomLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const borderRadiusStyle = `${brTopLeft}${unit} ${brTopRight}${unit} ${brBottomRight}${unit} ${brBottomLeft}${unit}`;

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: gap }}>
        {posts.map((post, idx) => (
          <div 
            key={post.id || idx} 
            style={{ 
              flex: `0 0 calc(100% / ${slidesCount} - ${gap})`,
              display: 'flex',
              flexDirection: 'column',
              background: 'none',
              border: 'none',
              borderRadius: '0',
              padding: '0'
            }}
          >
            {settings.showImage !== false && (post.featured_image || post.featuredImage) && (
              <img 
                src={post.featured_image || post.featuredImage} 
                alt={post.title} 
                style={{ 
                  width: '100%', 
                  height: `${settings.imageHeight || '200'}px`, 
                  objectFit: 'cover',
                  borderRadius: borderRadiusStyle
                }} 
              />
            )}
            <div style={{ padding: '12px 0 0 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {settings.showTitle !== false && (
                <h4 
                  style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : '1.1em', 
                    fontWeight: '600', 
                    color: settings.titleColor || 'inherit' 
                  }}
                >
                  {post.title}
                </h4>
              )}
              {settings.showMeta !== false && (
                <div style={{ fontSize: '0.75em', color: settings.metaColor || 'inherit', opacity: settings.metaColor ? 1 : 0.55, marginBottom: '10px' }}>
                  <span>{new Date(post.createdAt || post.created_at).toLocaleDateString()}</span>
                  {post.authorName && <span style={{ marginLeft: '8px' }}>by {post.authorName}</span>}
                </div>
              )}
              {settings.showExcerpt !== false && (
                <p 
                  style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: settings.excerptFontSize ? `${settings.excerptFontSize}px` : '0.85em', 
                    color: settings.excerptColor || 'inherit', 
                    opacity: settings.excerptColor ? 1 : 0.7,
                    lineHeight: '1.5',
                    flex: 1 
                  }}
                >
                  {(post.content || '').replace(/<[^>]*>/g, '').substring(0, parseInt(settings.excerptLength || '100'))}...
                </p>
              )}
              {settings.showButton !== false && (
                <button 
                  type="button"
                  style={{ 
                    marginTop: 'auto',
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    background: settings.buttonColor || '#6366f1', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  {settings.buttonText || 'View Event'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PageBuilder({ isOpen, title = 'Layout Design', onChangeTitle, onClose, onPublish, blocks = [], onChange }) {
  const { appearance, postTypes } = useApp();
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [activeTab, setActiveTab] = useState('widgets'); // 'widgets' or 'settings'
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [openDropdownCol, setOpenDropdownCol] = useState(null); // Tracks which column has the "+ Add Widget" dropdown open: { sectionId, colIdx }
  const [settingsSubTab, setSettingsSubTab] = useState('content'); // 'content' or 'style'
  const [mediaSelectionContext, setMediaSelectionContext] = useState('image_url'); // 'image_url' or 'bg_image'
  const [activeColStyleIdx, setActiveColStyleIdx] = useState(null);
  const [activeSlides, setActiveSlides] = useState({}); // { [sliderId]: index }
  const [activeSlideStyleId, setActiveSlideStyleId] = useState(null); // Tracks which slide background styling is expanded
  const [activeMarqueeItemId, setActiveMarqueeItemId] = useState(null); // Tracks which marquee item has its custom icon upload active

  const [clipboardExists, setClipboardExists] = useState(false);

  React.useEffect(() => {
    try {
      setClipboardExists(!!localStorage.getItem('agy_pagebuilder_clipboard'));
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  const cloneBlockWithNewIds = (block) => {
    const newBlockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const clonedSettings = { ...(block.settings || {}) };

    if (block.type === 'section' && clonedSettings.columns) {
      clonedSettings.columns = clonedSettings.columns.map((col, cIdx) => {
        const newColId = `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${cIdx}`;
        return {
          ...col,
          id: newColId,
          blocks: (col.blocks || []).map(b => cloneBlockWithNewIds(b))
        };
      });
    }

    if (block.type === 'slider' && clonedSettings.slides) {
      clonedSettings.slides = clonedSettings.slides.map((slide, sIdx) => {
        const newSlideId = `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sIdx}`;
        return {
          ...slide,
          id: newSlideId,
          blocks: (slide.blocks || []).map(b => cloneBlockWithNewIds(b))
        };
      });
    }

    if (block.type === 'iconlist' && clonedSettings.items) {
      clonedSettings.items = clonedSettings.items.map((item, iIdx) => ({
        ...item,
        id: `li-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${iIdx}`
      }));
    }

    if (block.type === 'icon_box_marquee' && clonedSettings.items) {
      clonedSettings.items = clonedSettings.items.map((item, iIdx) => ({
        ...item,
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${iIdx}`
      }));
    }

    return {
      ...block,
      id: newBlockId,
      settings: clonedSettings
    };
  };

  const duplicateBlock = (blockId, e) => {
    if (e) e.stopPropagation();
    
    const duplicateRecursive = (list) => {
      let result = [];
      for (const b of list) {
        result.push(b);
        if (b.id === blockId) {
          result.push(cloneBlockWithNewIds(b));
        } else {
          if (b.type === 'section' && b.settings?.columns) {
            const updatedCols = b.settings.columns.map(col => ({
              ...col,
              blocks: duplicateRecursive(col.blocks || [])
            }));
            result[result.length - 1] = {
              ...b,
              settings: { ...b.settings, columns: updatedCols }
            };
          }
          if (b.type === 'slider' && b.settings?.slides) {
            const updatedSlides = b.settings.slides.map(slide => ({
              ...slide,
              blocks: duplicateRecursive(slide.blocks || [])
            }));
            result[result.length - 1] = {
              ...b,
              settings: { ...b.settings, slides: updatedSlides }
            };
          }
        }
      }
      return result;
    };

    onChange(duplicateRecursive(blocks));
  };

  const copyBlock = (block, e) => {
    if (e) e.stopPropagation();
    try {
      localStorage.setItem('agy_pagebuilder_clipboard', JSON.stringify(block));
      setClipboardExists(true);
    } catch (err) {
      console.error('Failed to copy block:', err);
    }
  };

  const pasteBlockAfter = (targetBlockId, e) => {
    if (e) e.stopPropagation();
    try {
      const clipboardData = localStorage.getItem('agy_pagebuilder_clipboard');
      if (!clipboardData) return;
      const copiedBlock = JSON.parse(clipboardData);
      const clonedBlock = cloneBlockWithNewIds(copiedBlock);

      const pasteRecursive = (list) => {
        let result = [];
        for (const b of list) {
          result.push(b);
          if (b.id === targetBlockId) {
            result.push(clonedBlock);
          } else {
            if (b.type === 'section' && b.settings?.columns) {
              const updatedCols = b.settings.columns.map(col => ({
                ...col,
                blocks: pasteRecursive(col.blocks || [])
              }));
              result[result.length - 1] = {
                ...b,
                settings: { ...b.settings, columns: updatedCols }
              };
            }
            if (b.type === 'slider' && b.settings?.slides) {
              const updatedSlides = b.settings.slides.map(slide => ({
                ...slide,
                blocks: pasteRecursive(slide.blocks || [])
              }));
              result[result.length - 1] = {
                ...b,
                settings: { ...b.settings, slides: updatedSlides }
              };
            }
          }
        }
        return result;
      };

      onChange(pasteRecursive(blocks));
    } catch (err) {
      console.error('Failed to paste block:', err);
    }
  };

  const pasteBlockIntoColumn = (sectionId, colIdx) => {
    try {
      const clipboardData = localStorage.getItem('agy_pagebuilder_clipboard');
      if (!clipboardData) return;
      const copiedBlock = JSON.parse(clipboardData);
      const clonedBlock = cloneBlockWithNewIds(copiedBlock);

      const addRecursive = (list) => {
        return list.map(b => {
          if (b.id === sectionId && b.type === 'section' && b.settings?.columns) {
            const updatedCols = b.settings.columns.map((col, idx) => {
              if (idx === colIdx) {
                return {
                  ...col,
                  blocks: [...(col.blocks || []), clonedBlock]
                };
              }
              return col;
            });
            return {
              ...b,
              settings: { ...b.settings, columns: updatedCols }
            };
          }
          if (b.type === 'section' && b.settings?.columns) {
            const updatedCols = b.settings.columns.map(col => ({
              ...col,
              blocks: addRecursive(col.blocks || [])
            }));
            return {
              ...b,
              settings: { ...b.settings, columns: updatedCols }
            };
          }
          return b;
        });
      };

      onChange(addRecursive(blocks));
    } catch (err) {
      console.error('Failed to paste block into column:', err);
    }
  };

  const pasteBlockIntoSlide = (sliderId, slideIdx) => {
    try {
      const clipboardData = localStorage.getItem('agy_pagebuilder_clipboard');
      if (!clipboardData) return;
      const copiedBlock = JSON.parse(clipboardData);
      const clonedBlock = cloneBlockWithNewIds(copiedBlock);

      const addRecursive = (list) => {
        return list.map(b => {
          if (b.id === sliderId && b.type === 'slider' && b.settings?.slides) {
            const updatedSlides = b.settings.slides.map((slide, idx) => {
              if (idx === slideIdx) {
                return {
                  ...slide,
                  blocks: [...(slide.blocks || []), clonedBlock]
                };
              }
              return slide;
            });
            return {
              ...b,
              settings: { ...b.settings, slides: updatedSlides }
            };
          }
          if (b.type === 'section' && b.settings?.columns) {
            const updatedCols = b.settings.columns.map(col => ({
              ...col,
              blocks: addRecursive(col.blocks || [])
            }));
            return {
              ...b,
              settings: { ...b.settings, columns: updatedCols }
            };
          }
          return b;
        });
      };

      onChange(addRecursive(blocks));
    } catch (err) {
      console.error('Failed to paste block into slide:', err);
    }
  };

  const pasteBlockAtRoot = () => {
    try {
      const clipboardData = localStorage.getItem('agy_pagebuilder_clipboard');
      if (!clipboardData) return;
      const copiedBlock = JSON.parse(clipboardData);
      const clonedBlock = cloneBlockWithNewIds(copiedBlock);
      onChange([...blocks, clonedBlock]);
    } catch (err) {
      console.error('Failed to paste block at root:', err);
    }
  };

  React.useEffect(() => {
    setActiveSlideStyleId(null);
  }, [activeBlockId]);

  if (!isOpen) return null;

  // Column style updater
  const updateColumnStyle = (colIdx, key, val) => {
    if (!activeBlock || !activeBlock.settings || !activeBlock.settings.columns) return;
    const newCols = [...activeBlock.settings.columns];
    const col = newCols[colIdx];
    const styleObj = col.style || {};
    newCols[colIdx] = {
      ...col,
      style: {
        ...styleObj,
        [key]: val
      }
    };
    updateBlockSettings(activeBlock.id, { columns: newCols });
  };

  // Slide style updater
  const updateSlideStyle = (slideId, key, val) => {
    const updateRecursive = (list) => {
      return list.map(b => {
        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            if (slide.id === slideId) {
              const currentStyle = slide.style || {};
              return {
                ...slide,
                style: {
                  ...currentStyle,
                  [key]: val
                }
              };
            }
            return slide;
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }
        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            if (Array.isArray(col)) {
              return updateRecursive(col);
            } else {
              return {
                ...col,
                blocks: updateRecursive(col.blocks || [])
              };
            }
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }
        return b;
      });
    };
    onChange(updateRecursive(blocks));
  };

  // Reusable style options customizer UI (like Elementor)
  const renderStyleSettings = (styleObj = {}, onChangeStyle) => {
    const handleStyleChange = (key, val) => {
      onChangeStyle(key, val);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="elementor-style-options">
        
        {/* Icon List Specific Styles */}
        {activeBlock && activeBlock.type === 'iconlist' && (
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>Icon List Styles</h4>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Icon Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control hex-input"
                  value={activeBlock.settings.iconColor || '#6366f1'}
                  onChange={e => updateBlockSettings(activeBlock.id, { iconColor: e.target.value })}
                  style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
                <input
                  type="color"
                  value={activeBlock.settings.iconColor && activeBlock.settings.iconColor.startsWith('#') ? activeBlock.settings.iconColor : '#6366f1'}
                  onChange={e => updateBlockSettings(activeBlock.id, { iconColor: e.target.value })}
                  style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sizing Settings */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>Sizing</h4>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Width (%)</label>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {styleObj.width !== undefined && styleObj.width !== '' ? `${styleObj.width}%` : '100%'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={styleObj.width !== undefined && styleObj.width !== '' ? styleObj.width : 100}
              onChange={e => handleStyleChange('width', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Background Settings */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>Background</h4>
          
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Text Color (Normal)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.color || ''}
                onChange={e => handleStyleChange('color', e.target.value)}
                placeholder="#ffffff"
                style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.color || '#ffffff'}
                onChange={e => handleStyleChange('color', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.color && (
                <button type="button" onClick={() => handleStyleChange('color', '')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>Clear</button>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.backgroundColor || ''}
                onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.backgroundColor || '#ffffff'}
                onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.backgroundColor && (
                <button type="button" onClick={() => handleStyleChange('backgroundColor', '')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>Clear</button>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Image</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <input
                type="text"
                className="form-control"
                value={styleObj.backgroundImage || ''}
                onChange={e => handleStyleChange('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ fontSize: '0.75rem', padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', flex: '1' }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setMediaSelectionContext('bg_image');
                  setMediaModalOpen(true);
                }}
                style={{ padding: '2px 8px', fontSize: '0.65rem', whiteSpace: 'nowrap' }}
              >
                Select
              </button>
            </div>
            {styleObj.backgroundImage && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <img src={styleObj.backgroundImage} alt="Preview" style={{ height: '36px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                <button type="button" onClick={() => handleStyleChange('backgroundImage', '')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.65rem', color: 'var(--color-danger)' }}>Remove</button>
              </div>
            )}
          </div>

          {styleObj.backgroundImage && (
            <>
              <div className="form-group" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Position</label>
                <select
                  className="form-control"
                  value={styleObj.backgroundPosition || 'center center'}
                  onChange={e => handleStyleChange('backgroundPosition', e.target.value)}
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="center center">Center Center</option>
                  <option value="center left">Center/Left</option>
                  <option value="center right">Center/Right</option>
                  <option value="top center">Top Center</option>
                  <option value="top left">Top/Left</option>
                  <option value="top right">Top/Right</option>
                  <option value="bottom center">Bottom Center</option>
                  <option value="bottom left">Bottom/Left</option>
                  <option value="bottom right">Bottom/Right</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Size</label>
                <select
                  className="form-control"
                  value={styleObj.backgroundSize || 'cover'}
                  onChange={e => handleStyleChange('backgroundSize', e.target.value)}
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="cover">Cover (Fits container)</option>
                  <option value="contain">Contain (Full scale)</option>
                  <option value="auto">Auto (Default size)</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group" style={{ marginTop: '12px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Background Overlay</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.overlayColor || ''}
                onChange={e => handleStyleChange('overlayColor', e.target.value)}
                placeholder="rgba(0,0,0,0.5)"
                style={{ width: '120px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.overlayColor && styleObj.overlayColor.startsWith('#') ? styleObj.overlayColor : '#000000'}
                onChange={e => handleStyleChange('overlayColor', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.overlayColor && (
                <button type="button" onClick={() => { handleStyleChange('overlayColor', ''); handleStyleChange('overlayOpacity', ''); }} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>Clear</button>
              )}
            </div>
            {styleObj.overlayColor && (
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label" style={{ fontSize: '0.65rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Overlay Opacity</span>
                  <span>{styleObj.overlayOpacity !== undefined ? styleObj.overlayOpacity : '0.5'}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={styleObj.overlayOpacity !== undefined ? styleObj.overlayOpacity : 0.5}
                  onChange={e => handleStyleChange('overlayOpacity', parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Hover Settings */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>Hover Effects</h4>
          
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Hover Background Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.hover_backgroundColor || ''}
                onChange={e => handleStyleChange('hover_backgroundColor', e.target.value)}
                placeholder="#ffffff"
                style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.hover_backgroundColor || '#ffffff'}
                onChange={e => handleStyleChange('hover_backgroundColor', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.hover_backgroundColor && (
                <button
                  type="button"
                  onClick={() => handleStyleChange('hover_backgroundColor', '')}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Hover Text Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.hover_color || ''}
                onChange={e => handleStyleChange('hover_color', e.target.value)}
                placeholder="#ffffff"
                style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.hover_color || '#ffffff'}
                onChange={e => handleStyleChange('hover_color', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.hover_color && (
                <button
                  type="button"
                  onClick={() => handleStyleChange('hover_color', '')}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Hover Border Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="form-control hex-input"
                value={styleObj.hover_borderColor || ''}
                onChange={e => handleStyleChange('hover_borderColor', e.target.value)}
                placeholder="#ffffff"
                style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
              <input
                type="color"
                value={styleObj.hover_borderColor || '#ffffff'}
                onChange={e => handleStyleChange('hover_borderColor', e.target.value)}
                style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
              />
              {styleObj.hover_borderColor && (
                <button
                  type="button"
                  onClick={() => handleStyleChange('hover_borderColor', '')}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Spacing Settings */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.05em' }}>Padding (px)</h4>
            <span className="badge badge-secondary" style={{ fontSize: '0.55rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
              {previewDevice}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {['Top', 'Right', 'Bottom', 'Left'].map(dir => {
              const suffix = previewDevice === 'desktop' ? '_desktop' : previewDevice === 'tablet' ? '_tablet' : '_mobile';
              const responsiveKey = `padding${dir}${suffix}`;
              const legacyKey = `padding${dir}`;
              const displayValue = styleObj[responsiveKey] !== undefined ? styleObj[responsiveKey] : (styleObj[legacyKey] || '');
              
              return (
                <div key={dir}>
                  <label className="form-label" style={{ fontSize: '0.65rem', textAlign: 'center', marginBottom: '2px' }}>{dir}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={displayValue}
                    onChange={e => handleStyleChange(responsiveKey, e.target.value)}
                    placeholder="0"
                    style={{ textAlign: 'center', padding: '4px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 10px 0' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.05em' }}>Margin (px)</h4>
            <span className="badge badge-secondary" style={{ fontSize: '0.55rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
              {previewDevice}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {['Top', 'Right', 'Bottom', 'Left'].map(dir => {
              const suffix = previewDevice === 'desktop' ? '_desktop' : previewDevice === 'tablet' ? '_tablet' : '_mobile';
              const responsiveKey = `margin${dir}${suffix}`;
              const legacyKey = `margin${dir}`;
              const displayValue = styleObj[responsiveKey] !== undefined ? styleObj[responsiveKey] : (styleObj[legacyKey] || '');

              return (
                <div key={dir}>
                  <label className="form-label" style={{ fontSize: '0.65rem', textAlign: 'center', marginBottom: '2px' }}>{dir}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={displayValue}
                    onChange={e => handleStyleChange(responsiveKey, e.target.value)}
                    placeholder="0"
                    style={{ textAlign: 'center', padding: '4px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Border settings */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>Border & Corners</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '8px' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ fontSize: '0.7rem' }}>Border Type</label>
              <select
                className="form-control"
                value={styleObj.borderType || 'none'}
                onChange={e => handleStyleChange('borderType', e.target.value)}
                style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="double">Double</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Border Radius (px)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { key: 'borderTopLeftRadius', label: 'Top-L' },
                { key: 'borderTopRightRadius', label: 'Top-R' },
                { key: 'borderBottomRightRadius', label: 'Bot-R' },
                { key: 'borderBottomLeftRadius', label: 'Bot-L' }
              ].map(item => (
                <div key={item.key}>
                  <label className="form-label" style={{ fontSize: '0.6rem', textAlign: 'center', marginBottom: '2px', color: 'var(--text-secondary)' }}>{item.label}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={styleObj[item.key] !== undefined ? styleObj[item.key] : (styleObj.borderRadius || '')}
                    onChange={e => handleStyleChange(item.key, e.target.value)}
                    placeholder="0"
                    style={{ textAlign: 'center', padding: '4px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {styleObj.borderType && styleObj.borderType !== 'none' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ marginBottom: '6px' }}>
                <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Border Width (px)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { key: 'borderTopWidth', label: 'Top' },
                    { key: 'borderRightWidth', label: 'Right' },
                    { key: 'borderBottomWidth', label: 'Bottom' },
                    { key: 'borderLeftWidth', label: 'Left' }
                  ].map(item => (
                    <div key={item.key}>
                      <label className="form-label" style={{ fontSize: '0.6rem', textAlign: 'center', marginBottom: '2px', color: 'var(--text-secondary)' }}>{item.label}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={styleObj[item.key] !== undefined ? styleObj[item.key] : (styleObj.borderWidth || '')}
                        onChange={e => handleStyleChange(item.key, e.target.value)}
                        placeholder="0"
                        style={{ textAlign: 'center', padding: '4px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Border Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={styleObj.borderColor || ''}
                    onChange={e => handleStyleChange('borderColor', e.target.value)}
                    placeholder="#ffffff"
                    style={{ width: '70px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', flex: 1 }}
                  />
                  <input
                    type="color"
                    value={styleObj.borderColor || '#ffffff'}
                    onChange={e => handleStyleChange('borderColor', e.target.value)}
                    style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Box Shadow settings */}
        <div>
          <label className="form-checkbox-label" style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={!!styleObj.boxShadow}
              onChange={e => handleStyleChange('boxShadow', e.target.checked)}
              style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
            />
            <span>Box Shadow</span>
          </label>

          {styleObj.boxShadow && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[['boxShadowX', 'X'], ['boxShadowY', 'Y'], ['boxShadowBlur', 'Blur'], ['boxShadowSpread', 'Spread']].map(([key, label]) => (
                  <div key={key}>
                    <label className="form-label" style={{ fontSize: '0.6rem', textAlign: 'center', marginBottom: '2px' }}>{label}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={styleObj[key] || '0'}
                      onChange={e => handleStyleChange(key, e.target.value)}
                      style={{ textAlign: 'center', padding: '4px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                    />
                  </div>
                ))}
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Shadow Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control hex-input"
                    value={styleObj.boxShadowColor || 'rgba(0,0,0,0.5)'}
                    onChange={e => handleStyleChange('boxShadowColor', e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', flex: '1' }}
                  />
                  <input
                    type="color"
                    value={styleObj.boxShadowColor && !styleObj.boxShadowColor.startsWith('rgba') ? styleObj.boxShadowColor : '#000000'}
                    onChange={e => handleStyleChange('boxShadowColor', e.target.value)}
                    style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    );
  };

  // Render hierarchical navigator outline structure
  const renderNavigatorTree = (blocksList) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {blocksList.map((block) => {
          const isSelected = activeBlockId === block.id;
          const isSection = block.type === 'section';

          return (
            <div key={block.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {/* Block element node */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBlockId(block.id);
                  setActiveTab('settings');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                  borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: '0.8rem', fontWeight: isSelected ? '600' : '500'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = isSelected ? 'var(--color-primary)' : 'var(--border-color)'}
              >
                <Layers size={12} style={{ color: isSection ? 'var(--color-primary)' : 'var(--text-secondary)' }} />
                <span style={{ color: '#fff', flex: 1 }}>{isSection ? 'Layout Row (Section)' : `${block.type.charAt(0).toUpperCase() + block.type.slice(1)} Widget`}</span>
                
                {/* Delete Widget */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* If it's a section, render its nested columns */}
              {isSection && block.settings?.columns && (
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px dashed var(--border-color)', marginLeft: '16px', marginTop: '4px' }}>
                  {block.settings.columns.map((col, cIdx) => {
                    const colId = col?.id || `col-${cIdx}`;
                    const isColSelected = activeBlockId === colId;
                    const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);

                    return (
                      <div key={colId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        
                        {/* Column element node */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBlockId(colId);
                            setActiveTab('settings');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
                            background: isColSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                            border: isColSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                            fontSize: '0.75rem', fontWeight: isColSelected ? '600' : '500'
                          }}
                        >
                          <Plus size={10} style={{ color: 'var(--color-primary)' }} />
                          <span style={{ color: 'var(--text-secondary)', flex: 1 }}>Column {cIdx + 1} ({col.width || '50'}%)</span>
                        </div>

                        {/* Column's nested child widgets */}
                        {colBlocks.length > 0 && (
                          <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '1px dashed rgba(255,255,255,0.04)', marginLeft: '12px', marginTop: '2px' }}>
                            {colBlocks.map((subBlock) => {
                              const isSubSelected = activeBlockId === subBlock.id;
                              return (
                                <div
                                  key={subBlock.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveBlockId(subBlock.id);
                                    setActiveTab('settings');
                                  }}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px',
                                    background: isSubSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.01)',
                                    border: isSubSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                                    borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                                    fontSize: '0.72rem'
                                  }}
                                >
                                  <Type size={10} style={{ color: 'var(--text-muted)' }} />
                                  <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{subBlock.type}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBlock(subBlock.id);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* If it's a slider, render its nested slides */}
              {block.type === 'slider' && block.settings?.slides && (
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px dashed var(--border-color)', marginLeft: '16px', marginTop: '4px' }}>
                  {block.settings.slides.map((slide, sIdx) => {
                    const slideId = slide.id || `slide-${sIdx}`;
                    const isSlideSelected = activeBlockId === slideId;
                    const slideBlocks = slide.blocks || [];

                    return (
                      <div key={slideId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        
                        {/* Slide element node */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlides(prev => ({ ...prev, [block.id]: sIdx }));
                            setActiveBlockId(slideId);
                            setActiveTab('settings');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
                            background: isSlideSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                            border: isSlideSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                            fontSize: '0.75rem', fontWeight: isSlideSelected ? '600' : '500'
                          }}
                        >
                          <Play size={10} style={{ color: 'var(--color-primary)' }} />
                          <span style={{ color: 'var(--text-secondary)', flex: 1 }}>Slide {sIdx + 1}</span>
                        </div>

                        {/* Slide's nested child widgets */}
                        {slideBlocks.length > 0 && (
                          <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '1px dashed rgba(255,255,255,0.04)', marginLeft: '12px', marginTop: '2px' }}>
                            {slideBlocks.map((subBlock) => {
                              const isSubSelected = activeBlockId === subBlock.id;
                              return (
                                <div
                                  key={subBlock.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSlides(prev => ({ ...prev, [block.id]: sIdx }));
                                    setActiveBlockId(subBlock.id);
                                    setActiveTab('settings');
                                  }}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px',
                                    background: isSubSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.01)',
                                    border: isSubSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                                    borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                                    fontSize: '0.72rem'
                                  }}
                                >
                                  <Type size={10} style={{ color: 'var(--text-muted)' }} />
                                  <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{subBlock.type}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBlock(subBlock.id);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Recursive finder to locate any block by ID
  const findBlockById = (blocksList, id) => {
    for (const b of blocksList) {
      if (b.id === id) return b;
      if (b.type === 'section' && b.settings?.columns) {
        for (let cIdx = 0; cIdx < b.settings.columns.length; cIdx++) {
          const col = b.settings.columns[cIdx];
          if (col && col.id === id) {
            return {
              id: col.id,
              type: 'column',
              parentSectionId: b.id,
              columnIndex: cIdx,
              settings: col
            };
          }
          const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
          const found = findBlockById(colBlocks, id);
          if (found) return found;
        }
      }
      if (b.type === 'slider' && b.settings?.slides) {
        for (let sIdx = 0; sIdx < b.settings.slides.length; sIdx++) {
          const slide = b.settings.slides[sIdx];
          if (slide && slide.id === id) {
            return {
              id: slide.id,
              type: 'slide',
              parentSliderId: b.id,
              slideIndex: sIdx,
              settings: slide
            };
          }
          const slideBlocks = slide.blocks || [];
          const found = findBlockById(slideBlocks, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const activeBlock = activeBlockId ? findBlockById(blocks, activeBlockId) : null;

  // Add block to root list
  const addBlockToRoot = (type) => {
    const defaultSettings = {
      section: {
        layoutType: 'flex',
        direction: 'row',
        gap: '20',
        justify: 'start',
        align: 'stretch',
        columns: [
          { id: `col-${Date.now()}-1`, width: '50', blocks: [] },
          { id: `col-${Date.now()}-2`, width: '50', blocks: [] }
        ]
      },
      heading: { text: 'New Heading', size: 'h2', align: 'left', color: '#ffffff' },
      text: { text: 'Click here to write paragraph text...', color: '#9ca3af', align: 'left', size: '16' },
      image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', align: 'center', width: '100' },
      button: { text: 'Learn More', url: '#', align: 'left', style: 'primary' },
      divider: { height: '30', showLine: true, lineColor: 'rgba(255,255,255,0.08)' },
      alert: { text: 'This is an alert box notification.', alertType: 'info' },
      logo: { url: '', align: 'left', width: '30' },
      menu: { menuId: '', align: 'left', color: '#ffffff', fontSize: '15' },
      iconlist: {
        items: [
          { id: 'li-1', text: 'List item feature one', icon: 'Check' },
          { id: 'li-2', text: 'List item feature two', icon: 'Check' }
        ],
        iconColor: '#6366f1',
        iconSize: '16',
        gap: '10'
      },
      iconbox: {
        icon: 'Star',
        title: 'Feature Title',
        description: 'Detail description explaining this product highlight or value proposition.',
        iconSize: '36',
        iconColor: '#6366f1',
        iconBg: '',
        align: 'center'
      },
      slider: {
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        transition: 'slide',
        slides: [
          {
            id: `slide-${Date.now()}-1`,
            style: { backgroundColor: 'rgba(255,255,255,0.03)' },
            blocks: [
              {
                id: `slide-h-${Date.now()}-1`,
                type: 'heading',
                settings: { text: 'Premium Slide Title One', size: 'h2', align: 'center', color: '#ffffff' }
              }
            ]
          },
          {
            id: `slide-${Date.now()}-2`,
            style: { backgroundColor: 'rgba(255,255,255,0.04)' },
            blocks: [
              {
                id: `slide-h-${Date.now()}-2`,
                type: 'heading',
                settings: { text: 'Premium Slide Title Two', size: 'h2', align: 'center', color: '#ffffff' }
              }
            ]
          }
        ]
      },
      carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60', caption: 'Red Running Shoe' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60', caption: 'Classic Smart Watch' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60', caption: 'Black Leather Boot' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      image_only_carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      loop_grid: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        columnsDesktop: '3',
        columnsTablet: '2',
        columnsMobile: '1',
        gap: '20',
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      },
      loop_carousel: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        gap: '20',
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      },
      icon_box_marquee: {
        items: [
          { id: 'm-1', text: 'Free Worldwide Shipping', iconType: 'lucide', icon: 'Star', customUrl: '' },
          { id: 'm-2', text: 'Secure Payments via Stripe', iconType: 'lucide', icon: 'Check', customUrl: '' },
          { id: 'm-3', text: '24/7 Premium Customer Support', iconType: 'lucide', icon: 'Globe', customUrl: '' }
        ],
        speed: '30',
        direction: 'left',
        pauseOnHover: true,
        gap: '40',
        backgroundColor: 'transparent',
        textColor: '#ffffff',
        iconColor: '#6366f1',
        iconSize: '20',
        fontSize: '14'
      }
    };

    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      settings: defaultSettings[type] || {}
    };

    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
    setActiveTab('settings');
  };

  // Add block to a specific column inside a section
  const addBlockToSection = (sectionId, columnIndex, type) => {
    const defaultSettings = {
      section: {
        layoutType: 'flex',
        columns: [
          { id: `col-${Date.now()}-1`, width: '50', blocks: [] },
          { id: `col-${Date.now()}-2`, width: '50', blocks: [] }
        ],
        direction: 'row',
        justify: 'start',
        align: 'stretch',
        gap: '20'
      },
      heading: { text: 'Column Heading', size: 'h3', align: 'left', color: '#ffffff' },
      text: { text: 'Column text content...', color: '#9ca3af', align: 'left', size: '15' },
      image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', align: 'center', width: '100' },
      button: { text: 'Click Here', url: '#', align: 'center', style: 'primary' },
      divider: { height: '20', showLine: true, lineColor: 'rgba(255,255,255,0.05)' },
      alert: { text: 'Alert notification.', alertType: 'info' },
      logo: { url: '', align: 'left', width: '30' },
      menu: { menuId: '', align: 'left', color: '#ffffff', fontSize: '15' },
      iconlist: {
        items: [
          { id: 'li-1', text: 'Column item one', icon: 'Check' },
          { id: 'li-2', text: 'Column item two', icon: 'Check' }
        ],
        iconColor: '#6366f1',
        iconSize: '16',
        gap: '10'
      },
      iconbox: {
        icon: 'Star',
        title: 'Column Feature',
        description: 'Detail explaining this specific item column.',
        iconSize: '36',
        iconColor: '#6366f1',
        iconBg: '',
        align: 'center'
      },
      slider: {
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        transition: 'slide',
        slides: [
          {
            id: `slide-${Date.now()}-1`,
            style: { backgroundColor: 'rgba(255,255,255,0.03)' },
            blocks: [
              {
                id: `slide-h-${Date.now()}-1`,
                type: 'heading',
                settings: { text: 'Premium Slide Title One', size: 'h2', align: 'center', color: '#ffffff' }
              }
            ]
          },
          {
            id: `slide-${Date.now()}-2`,
            style: { backgroundColor: 'rgba(255,255,255,0.04)' },
            blocks: [
              {
                id: `slide-h-${Date.now()}-2`,
                type: 'heading',
                settings: { text: 'Premium Slide Title Two', size: 'h2', align: 'center', color: '#ffffff' }
              }
            ]
          }
        ]
      },
      carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60', caption: 'Red Running Shoe' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60', caption: 'Classic Smart Watch' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60', caption: 'Black Leather Boot' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      image_only_carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      loop_grid: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        columnsDesktop: '3',
        columnsTablet: '2',
        columnsMobile: '1',
        gap: '20',
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      },
      loop_carousel: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        gap: '20',
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      },
      icon_box_marquee: {
        items: [
          { id: 'm-1', text: 'Free Worldwide Shipping', iconType: 'lucide', icon: 'Star', customUrl: '' },
          { id: 'm-2', text: 'Secure Payments via Stripe', iconType: 'lucide', icon: 'Check', customUrl: '' },
          { id: 'm-3', text: '24/7 Premium Customer Support', iconType: 'lucide', icon: 'Globe', customUrl: '' }
        ],
        speed: '30',
        direction: 'left',
        pauseOnHover: true,
        gap: '40',
        backgroundColor: 'transparent',
        textColor: '#ffffff',
        iconColor: '#6366f1',
        iconSize: '20',
        fontSize: '14'
      }
    };

    const newBlock = {
      id: `sub-block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      settings: defaultSettings[type] || {}
    };

    const addRecursive = (list) => {
      return list.map(b => {
        if (b.id === sectionId) {
          const newCols = [...(b.settings?.columns || [])];
          const targetCol = newCols[columnIndex];
          if (Array.isArray(targetCol)) {
            newCols[columnIndex] = [...targetCol, newBlock];
          } else {
            newCols[columnIndex] = {
              ...targetCol,
              blocks: [...(targetCol?.blocks || []), newBlock]
            };
          }
          return {
            ...b,
            settings: { ...b.settings, columns: newCols }
          };
        }

        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            const cleanBlocks = addRecursive(colBlocks);
            return Array.isArray(col) ? cleanBlocks : { ...col, blocks: cleanBlocks };
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }

        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: addRecursive(slide.blocks || [])
            };
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }

        return b;
      });
    };

    onChange(addRecursive(blocks));
    setActiveBlockId(newBlock.id);
    setActiveTab('settings');
    setOpenDropdownCol(null); // close dropdown
  };

  // Add block to a slide inside a slider
  const addBlockToSlide = (sliderId, slideIndex, type) => {
    const defaultSettings = {
      section: {
        layoutType: 'flex',
        columns: [
          { id: `col-${Date.now()}-1`, width: '50', blocks: [] },
          { id: `col-${Date.now()}-2`, width: '50', blocks: [] }
        ],
        direction: 'row',
        justify: 'start',
        align: 'stretch',
        gap: '20'
      },
      heading: { text: 'Slide Heading', size: 'h2', align: 'center', color: '#ffffff' },
      text: { text: 'Slide description goes here...', color: '#9ca3af', align: 'center', size: '16' },
      image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', align: 'center', width: '80' },
      button: { text: 'Learn More', url: '#', align: 'center', style: 'primary' },
      divider: { height: '20', showLine: true, lineColor: 'rgba(255,255,255,0.05)' },
      alert: { text: 'Slide notification.', alertType: 'info' },
      logo: { url: '', align: 'left', width: '30' },
      menu: { menuId: '', align: 'left', color: '#ffffff', fontSize: '15' },
      iconlist: {
        items: [{ id: 'li-1', text: 'Slide list item', icon: 'Check' }],
        iconColor: '#6366f1',
        iconSize: '16',
        gap: '10'
      },
      iconbox: {
        icon: 'Star',
        title: 'Feature Item',
        description: 'Detail explaining this slide feature.',
        iconSize: '36',
        iconColor: '#6366f1',
        align: 'center'
      },
      carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60', caption: 'Red Running Shoe' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60', caption: 'Classic Smart Watch' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60', caption: 'Black Leather Boot' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      image_only_carousel: {
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60' }
        ],
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        imageHeight: '220',
        borderRadiusTopLeft: '8',
        borderRadiusTopRight: '8',
        borderRadiusBottomRight: '8',
        borderRadiusBottomLeft: '8',
        gap: '15'
      },
      loop_grid: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        columnsDesktop: '3',
        columnsTablet: '2',
        columnsMobile: '1',
        gap: '20',
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      },
      loop_carousel: {
        postType: 'post',
        limit: '6',
        orderBy: 'createdAt',
        order: 'DESC',
        slidesToShowDesktop: '3',
        slidesToShowTablet: '2',
        slidesToShowMobile: '1',
        gap: '20',
        autoplay: true,
        autoplaySpeed: '5000',
        showArrows: true,
        showDots: true,
        infinite: true,
        showImage: true,
        imageHeight: '200',
        showTitle: true,
        titleColor: '#ffffff',
        showExcerpt: true,
        excerptLength: '100',
        showMeta: true,
        showButton: true,
        buttonText: 'View Event',
        buttonColor: '#6366f1'
      }
    };

    const newBlock = {
      id: `sub-block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      settings: defaultSettings[type] || {}
    };

    const addRecursive = (list) => {
      return list.map(b => {
        if (b.id === sliderId) {
          const newSlides = [...(b.settings?.slides || [])];
          const targetSlide = newSlides[slideIndex];
          newSlides[slideIndex] = {
            ...targetSlide,
            blocks: [...(targetSlide.blocks || []), newBlock]
          };
          return {
            ...b,
            settings: { ...b.settings, slides: newSlides }
          };
        }

        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            const cleanBlocks = addRecursive(colBlocks);
            return Array.isArray(col) ? cleanBlocks : { ...col, blocks: cleanBlocks };
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }

        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: addRecursive(slide.blocks || [])
            };
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }

        return b;
      });
    };

    onChange(addRecursive(blocks));
    setActiveBlockId(newBlock.id);
    setActiveTab('settings');
    setOpenDropdownCol(null);
  };

  // Move block to a slide inside a slider
  const handleMoveBlockToSlide = (draggedId, targetSliderId, targetSlideIdx, targetIndex) => {
    if (!draggedId) return;

    let draggedBlock = null;

    const removeBlockFromState = (list) => {
      const newList = [];
      for (const item of list) {
        if (item.id === draggedId) {
          draggedBlock = item;
          continue;
        }
        if (item.type === 'section' && item.settings?.columns) {
          const updatedCols = item.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            return Array.isArray(col) ? removeBlockFromState(col) : { ...col, blocks: removeBlockFromState(colBlocks) };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          });
        } else if (item.type === 'slider' && item.settings?.slides) {
          const updatedSlides = item.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: removeBlockFromState(slide.blocks || [])
            };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, slides: updatedSlides }
          });
        } else {
          newList.push(item);
        }
      }
      return newList;
    };

    const cleanedBlocks = removeBlockFromState(blocks);
    if (!draggedBlock) return;

    const addBlockToState = (list) => {
      return list.map(item => {
        if (item.id === targetSliderId) {
          const newSlides = [...item.settings.slides];
          const targetSlide = newSlides[targetSlideIdx];
          const currentBlocks = [...(targetSlide.blocks || [])];
          currentBlocks.splice(targetIndex, 0, draggedBlock);
          newSlides[targetSlideIdx] = {
            ...targetSlide,
            blocks: currentBlocks
          };
          return {
            ...item,
            settings: { ...item.settings, slides: newSlides }
          };
        }
        if (item.type === 'section' && item.settings?.columns) {
          const updatedCols = item.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            return Array.isArray(col) ? addBlockToState(col) : { ...col, blocks: addBlockToState(colBlocks) };
          });
          return {
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          };
        }
        if (item.type === 'slider' && item.settings?.slides) {
          const updatedSlides = item.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: addBlockToState(slide.blocks || [])
            };
          });
          return {
            ...item,
            settings: { ...item.settings, slides: updatedSlides }
          };
        }
        return item;
      });
    };

    const updated = addBlockToState(cleanedBlocks);
    onChange(updated);
  };

  const handleMoveBlockToColumn = (draggedId, targetSectionId, targetColIdx, targetIndex) => {
    if (!draggedId) return;

    let draggedBlock = null;

    const removeBlockFromState = (list) => {
      const newList = [];
      for (const item of list) {
        if (item.id === draggedId) {
          draggedBlock = item;
          continue; // remove it
        }

        if (item.type === 'section' && item.settings?.columns) {
          const updatedCols = item.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            const cleanBlocks = removeBlockFromState(colBlocks);
            return Array.isArray(col) ? cleanBlocks : { ...col, blocks: cleanBlocks };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          });
        } else if (item.type === 'slider' && item.settings?.slides) {
          const updatedSlides = item.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: removeBlockFromState(slide.blocks || [])
            };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, slides: updatedSlides }
          });
        } else {
          newList.push(item);
        }
      }
      return newList;
    };

    let clonedBlocks = removeBlockFromState(blocks);

    if (!draggedBlock) return;

    const insertBlockToState = (list) => {
      return list.map(item => {
        if (item.id === targetSectionId) {
          const updatedCols = item.settings.columns.map((col, idx) => {
            if (idx === targetColIdx) {
              const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
              const newBlocks = [...colBlocks];
              const idxToInsert = Math.min(Math.max(0, targetIndex), newBlocks.length);
              newBlocks.splice(idxToInsert, 0, draggedBlock);
              return Array.isArray(col) ? newBlocks : { ...col, blocks: newBlocks };
            }
            return col;
          });
          return {
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          };
        }

        if (item.type === 'section' && item.settings?.columns) {
          const updatedCols = item.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            const newBlocks = insertBlockToState(colBlocks);
            return Array.isArray(col) ? newBlocks : { ...col, blocks: newBlocks };
          });
          return {
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          };
        }

        if (item.type === 'slider' && item.settings?.slides) {
          const updatedSlides = item.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: insertBlockToState(slide.blocks || [])
            };
          });
          return {
            ...item,
            settings: { ...item.settings, slides: updatedSlides }
          };
        }

        return item;
      });
    };

    const finalBlocks = insertBlockToState(clonedBlocks);
    onChange(finalBlocks);
  };

  const handleMoveRootBlock = (draggedId, targetIndex) => {
    if (!draggedId) return;

    let draggedBlock = null;

    const removeBlockFromState = (list) => {
      const newList = [];
      for (const item of list) {
        if (item.id === draggedId) {
          draggedBlock = item;
          continue;
        }
        if (item.type === 'section' && item.settings?.columns) {
          const updatedCols = item.settings.columns.map(col => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            const cleanBlocks = removeBlockFromState(colBlocks);
            return Array.isArray(col) ? cleanBlocks : { ...col, blocks: cleanBlocks };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, columns: updatedCols }
          });
        } else if (item.type === 'slider' && item.settings?.slides) {
          const updatedSlides = item.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: removeBlockFromState(slide.blocks || [])
            };
          });
          newList.push({
            ...item,
            settings: { ...item.settings, slides: updatedSlides }
          });
        } else {
          newList.push(item);
        }
      }
      return newList;
    };

    let clonedBlocks = removeBlockFromState(blocks);
    if (!draggedBlock) return;

    const newBlocks = [...clonedBlocks];
    const idxToInsert = Math.min(Math.max(0, targetIndex), newBlocks.length);
    newBlocks.splice(idxToInsert, 0, draggedBlock);
    onChange(newBlocks);
  };

  // Update block settings recursively
  const updateBlockSettings = (blockId, newSettings) => {
    const updateRecursive = (list) => {
      return list.map(b => {
        if (b.id === blockId) {
          return {
            ...b,
            settings: { ...b.settings, ...newSettings }
          };
        }
        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            if (col && col.id === blockId) {
              return {
                ...col,
                ...newSettings
              };
            }
            if (Array.isArray(col)) {
              return updateRecursive(col);
            } else {
              return {
                ...col,
                blocks: updateRecursive(col.blocks || [])
              };
            }
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }
        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            if (slide && slide.id === blockId) {
              return {
                ...slide,
                ...newSettings
              };
            }
            return {
              ...slide,
              blocks: updateRecursive(slide.blocks || [])
            };
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }
        return b;
      });
    };
    onChange(updateRecursive(blocks));
  };

  // Delete block recursively
  const deleteBlock = (blockId, e) => {
    if (e) e.stopPropagation();
    const deleteRecursive = (list) => {
      let filtered = list.filter(b => b.id !== blockId);
      return filtered.map(b => {
        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            if (Array.isArray(col)) {
              return deleteRecursive(col);
            } else {
              return {
                ...col,
                blocks: deleteRecursive(col.blocks || [])
              };
            }
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }
        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: deleteRecursive(slide.blocks || [])
            };
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }
        return b;
      });
    };
    onChange(deleteRecursive(blocks));
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
      setActiveTab('widgets');
    }
  };

  // Move block recursively (works for root blocks and nested column blocks)
  const moveBlock = (blockId, direction, e) => {
    if (e) e.stopPropagation();
    const moveRecursive = (list) => {
      const idx = list.findIndex(b => b.id === blockId);
      if (idx !== -1) {
        const newList = [...list];
        if (direction === 'up' && idx > 0) {
          const temp = newList[idx];
          newList[idx] = newList[idx - 1];
          newList[idx - 1] = temp;
        } else if (direction === 'down' && idx < newList.length - 1) {
          const temp = newList[idx];
          newList[idx] = newList[idx + 1];
          newList[idx + 1] = temp;
        }
        return newList;
      }
      return list.map(b => {
        if (b.type === 'section' && b.settings?.columns) {
          const updatedCols = b.settings.columns.map(col => {
            if (Array.isArray(col)) {
              return moveRecursive(col);
            } else {
              return {
                ...col,
                blocks: moveRecursive(col.blocks || [])
              };
            }
          });
          return {
            ...b,
            settings: { ...b.settings, columns: updatedCols }
          };
        }
        if (b.type === 'slider' && b.settings?.slides) {
          const updatedSlides = b.settings.slides.map(slide => {
            return {
              ...slide,
              blocks: moveRecursive(slide.blocks || [])
            };
          });
          return {
            ...b,
            settings: { ...b.settings, slides: updatedSlides }
          };
        }
        return b;
      });
    };
    onChange(moveRecursive(blocks));
  };

  const handleImageFileChange = (e, blockId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlockSettings(blockId, { url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const widgetsList = [
    { type: 'section', name: 'Layout Section', icon: Layers, desc: 'Add row/column structure' },
    { type: 'heading', name: 'Heading', icon: Type, desc: 'Add eye-catching headers' },
    { type: 'text', name: 'Text Editor', icon: AlignLeft, desc: 'Add rich paragraph text' },
    { type: 'image', name: 'Image Box', icon: ImageIcon, desc: 'Embed local or web images' },
    { type: 'button', name: 'Button Link', icon: MousePointer, desc: 'Call to action button' },
    { type: 'divider', name: 'Spacer / Divider', icon: Minus, desc: 'Add space or section lines' },
    { type: 'alert', name: 'Alert Notification', icon: AlertTriangle, desc: 'Styled notifications bar' },
    { type: 'logo', name: 'Site Logo', icon: Globe, desc: 'Embed website logo' },
    { type: 'menu', name: 'Navigation Menu', icon: Menu, desc: 'Add navigation menu bar' },
    { type: 'iconlist', name: 'Icon List', icon: List, desc: 'Bullet list with custom icons' },
    { type: 'iconbox', name: 'Icon Box', icon: Package, desc: 'Hero icon with title & text' },
    { type: 'slider', name: 'Premium Slider', icon: Sliders, desc: 'Carousel slide content blocks' },
    { type: 'carousel', name: 'Image Box Carousel', icon: Sliders, desc: 'Sliding gallery of custom images with overlay text' },
    { type: 'image_only_carousel', name: 'Image Carousel', icon: Sliders, desc: 'Sliding gallery of custom images' },
    { type: 'loop_grid', name: 'Loop Grid', icon: Grid, desc: 'Grid layout of queried posts' },
    { type: 'loop_carousel', name: 'Loop Carousel', icon: RefreshCw, desc: 'Carousel layout of queried posts' },
    { type: 'icon_box_marquee', name: 'Icon Box Marquee', icon: RefreshCw, desc: 'Scrolling marquee of custom icon boxes' }
  ];

  return createPortal(
    <>
      <div style={fullScreenModalOverlayStyle}>
      
      {/* Builder Header Bar */}
      <div style={builderHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onClose} className="builder-back-btn" type="button" title="Go Back">
            <ArrowLeft size={16} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: '0', color: '#fff' }}>Visual Page Builder</h2>
            {onChangeTitle ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Title:</span>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => onChangeTitle(e.target.value)} 
                  placeholder="Enter page title..."
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    outline: 'none',
                    width: '180px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Designing: {title}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button 
            type="button" 
            onClick={onPublish} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', fontSize: '0.8rem' }}
          >
            <Check size={14} />
            <span>Publish Layout</span>
          </button>
        </div>
      </div>

      <div className="page-builder-container">
      {/* BUILDER SIDEBAR */}
      <aside className="builder-sidebar glass-panel">
        <div className="sidebar-tabs">
          <button 
            type="button" 
            className={`tab-link ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >
            <Plus size={15} />
            <span>Widgets</span>
          </button>
          <button 
            type="button" 
            className={`tab-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              if (activeBlockId) {
                setActiveTab('settings');
              } else {
                alert('Select a block on the canvas to configure its settings!');
              }
            }}
            disabled={!activeBlockId}
          >
            <SettingsIcon size={15} />
            <span>Settings</span>
          </button>
          <button 
            type="button" 
            className={`tab-link ${activeTab === 'navigator' ? 'active' : ''}`}
            onClick={() => setActiveTab('navigator')}
          >
            <Layers size={15} />
            <span>Structure</span>
          </button>
        </div>

        <div className="sidebar-content">
          {/* NAVIGATOR TAB */}
          {activeTab === 'navigator' && (
            <div className="widgets-grid fade-in" style={{ padding: '20px' }}>
              <h4 className="panel-section-title" style={{ marginBottom: '16px' }}>Layout Navigator</h4>
              {blocks.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '40px 0' }}>
                  No elements added yet. Start dragging widgets!
                </div>
              ) : (
                renderNavigatorTree(blocks)
              )}
            </div>
          )}

          {/* WIDGETS LIST TAB */}
          {activeTab === 'widgets' && (
            <div className="widgets-grid fade-in">
              <h4 className="panel-section-title">Drag & Drop Blocks</h4>
              {clipboardExists && (
                <button
                  type="button"
                  className="btn btn-accent btn-sm paste-sidebar-btn"
                  style={{ 
                    width: '100%', 
                    marginBottom: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--color-success)',
                    border: '1px dashed rgba(16, 185, 129, 0.4)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    pasteBlockAtRoot();
                  }}
                >
                  <Clipboard size={14} />
                  <span>Paste Element from Clipboard</span>
                </button>
              )}
              <div className="widgets-list">
                {widgetsList.map(w => {
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.type}
                      type="button"
                      className="widget-card glow-hover"
                      onClick={() => addBlockToRoot(w.type)}
                    >
                      <div className="widget-icon-box">
                        <Icon size={18} />
                      </div>
                      <div className="widget-info">
                        <span className="widget-name">{w.name}</span>
                        <span className="widget-desc">{w.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BLOCK SETTINGS TAB */}
          {activeTab === 'settings' && activeBlock && (
            <div className="settings-panel fade-in">
              <div className="panel-header-cpt">
                <span className="badge badge-primary">{activeBlock.type.toUpperCase()} BLOCK</span>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('widgets')}
                  style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                >
                  &larr; Widgets
                </button>
              </div>

              {/* Elementor Sub-Tabs Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('content')}
                  style={{
                    flex: 1, padding: '8px', background: 'none', border: 'none',
                    color: settingsSubTab === 'content' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    borderBottom: settingsSubTab === 'content' ? '2px solid var(--color-primary)' : 'none',
                    fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('style')}
                  style={{
                    flex: 1, padding: '8px', background: 'none', border: 'none',
                    color: settingsSubTab === 'style' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    borderBottom: settingsSubTab === 'style' ? '2px solid var(--color-primary)' : 'none',
                    fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  Style
                </button>
              </div>

              {settingsSubTab === 'content' ? (
                <>
                  {/* COLUMN SETTINGS */}
                  {activeBlock.type === 'column' && (
                    <div className="settings-fields">
                      {/* Column Width */}
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span>Column Width</span>
                          <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                            {previewDevice}
                          </span>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            className="form-control"
                            value={
                              previewDevice === 'mobile'
                                ? (activeBlock.settings.width_mobile || '100')
                                : previewDevice === 'tablet'
                                  ? (activeBlock.settings.width_tablet || activeBlock.settings.width || '100')
                                  : (activeBlock.settings.width || '50')
                            }
                            onChange={e => {
                              const val = e.target.value;
                              const targetField = previewDevice === 'mobile'
                                ? 'width_mobile'
                                : previewDevice === 'tablet'
                                  ? 'width_tablet'
                                  : 'width';
                              updateBlockSettings(activeBlock.id, { [targetField]: val });
                            }}
                            style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                          />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>%</span>
                        </div>
                      </div>

                      {/* Flex Layout Switcher */}
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={!!activeBlock.settings.flexLayout}
                            onChange={e => updateBlockSettings(activeBlock.id, { flexLayout: e.target.checked })}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                          />
                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Enable Flex Layout</span>
                        </label>
                      </div>

                      {activeBlock.settings.flexLayout && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)', marginBottom: '16px' }}>
                          
                          {/* Flex Direction */}
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Direction</label>
                            <select
                              className="form-control"
                              value={activeBlock.settings.direction || 'column'}
                              onChange={e => updateBlockSettings(activeBlock.id, { direction: e.target.value })}
                              style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            >
                              <option value="column">Column (Vertical)</option>
                              <option value="row">Row (Horizontal)</option>
                            </select>
                          </div>

                          {/* Justify Content */}
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Justify Content</label>
                            <select
                              className="form-control"
                              value={activeBlock.settings.justify || 'start'}
                              onChange={e => updateBlockSettings(activeBlock.id, { justify: e.target.value })}
                              style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            >
                              <option value="start">Flex Start (Top/Left)</option>
                              <option value="center">Center</option>
                              <option value="end">Flex End (Bottom/Right)</option>
                              <option value="between">Space Between</option>
                              <option value="around">Space Around</option>
                            </select>
                          </div>

                          {/* Align Items */}
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Align Items</label>
                            <select
                              className="form-control"
                              value={activeBlock.settings.align || 'stretch'}
                              onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                              style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            >
                              <option value="start">Flex Start (Top/Left)</option>
                              <option value="center">Center</option>
                              <option value="end">Flex End (Bottom/Right)</option>
                              <option value="stretch">Stretch</option>
                            </select>
                          </div>

                          {/* Elements Gap spacing */}
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Elements Gap (px)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={activeBlock.settings.gap || '10'}
                              onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                              style={{ fontSize: '0.75rem', padding: '4px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            />
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION SETTINGS */}
                  {activeBlock.type === 'section' && (
                    <div className="settings-fields">
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Layout Mode</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.layoutType || 'flex'}
                          onChange={e => updateBlockSettings(activeBlock.id, { layoutType: e.target.value })}
                        >
                          <option value="flex">Flexbox Layout</option>
                          <option value="grid">CSS Grid Layout</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Content Width Mode</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.contentWidthMode || 'boxed'}
                          onChange={e => updateBlockSettings(activeBlock.id, { contentWidthMode: e.target.value })}
                        >
                          <option value="boxed">Boxed (Bounded Container)</option>
                          <option value="fullwidth">Full Width (100% Stretch)</option>
                        </select>
                      </div>

                      {/* Shape Dividers */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px', marginBottom: '16px' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Top Shape Divider</label>
                        
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Type</label>
                          <select
                            className="form-control"
                            value={activeBlock.settings.shapeDividerTop || 'none'}
                            onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTop: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          >
                            <option value="none">None / Off</option>
                            <option value="mountains">Mountains</option>
                            <option value="drops">Drops</option>
                            <option value="clouds">Clouds</option>
                            <option value="zigzag">Zigzag</option>
                            <option value="pyramids">Pyramids</option>
                            <option value="triangle-asymmetrical">Triangle Asymmetrical</option>
                            <option value="tilt">Tilt</option>
                            <option value="tilt-opacity">Tilt Opacity</option>
                            <option value="fan">Fan</option>
                            <option value="curve">Curve</option>
                            <option value="curve-asymmetrical">Curve Asymmetrical</option>
                            <option value="waves">Waves</option>
                            <option value="waves-brush">Waves Brush</option>
                            <option value="waves-pattern">Waves Pattern</option>
                            <option value="split">Split</option>
                            <option value="book">Book</option>
                            <option value="arrow">Arrow</option>
                            <option value="triangle">Triangle</option>
                          </select>
                        </div>

                        {activeBlock.settings.shapeDividerTop && activeBlock.settings.shapeDividerTop !== 'none' && (
                          <>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Color</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="text"
                                  className="form-control hex-input"
                                  value={activeBlock.settings.shapeDividerTopColor || '#151b2c'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTopColor: e.target.value })}
                                  style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                                />
                                <input
                                  type="color"
                                  value={activeBlock.settings.shapeDividerTopColor && activeBlock.settings.shapeDividerTopColor.startsWith('#') ? activeBlock.settings.shapeDividerTopColor : '#151b2c'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTopColor: e.target.value })}
                                  style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Height (px)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={activeBlock.settings.shapeDividerTopHeight || '100'}
                                onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTopHeight: e.target.value })}
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                              <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={!!activeBlock.settings.shapeDividerTopInvert}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTopInvert: e.target.checked })}
                                  style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Invert</span>
                              </label>

                              <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={!!activeBlock.settings.shapeDividerTopFlip}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerTopFlip: e.target.checked })}
                                  style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Flip</span>
                              </label>
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bottom Shape Divider</label>
                        
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Type</label>
                          <select
                            className="form-control"
                            value={activeBlock.settings.shapeDividerBottom || 'none'}
                            onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottom: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          >
                            <option value="none">None / Off</option>
                            <option value="mountains">Mountains</option>
                            <option value="drops">Drops</option>
                            <option value="clouds">Clouds</option>
                            <option value="zigzag">Zigzag</option>
                            <option value="pyramids">Pyramids</option>
                            <option value="triangle-asymmetrical">Triangle Asymmetrical</option>
                            <option value="tilt">Tilt</option>
                            <option value="tilt-opacity">Tilt Opacity</option>
                            <option value="fan">Fan</option>
                            <option value="curve">Curve</option>
                            <option value="curve-asymmetrical">Curve Asymmetrical</option>
                            <option value="waves">Waves</option>
                            <option value="waves-brush">Waves Brush</option>
                            <option value="waves-pattern">Waves Pattern</option>
                            <option value="split">Split</option>
                            <option value="book">Book</option>
                            <option value="arrow">Arrow</option>
                            <option value="triangle">Triangle</option>
                          </select>
                        </div>

                        {activeBlock.settings.shapeDividerBottom && activeBlock.settings.shapeDividerBottom !== 'none' && (
                          <>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Color</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="text"
                                  className="form-control hex-input"
                                  value={activeBlock.settings.shapeDividerBottomColor || '#151b2c'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomColor: e.target.value })}
                                  style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                                />
                                <input
                                  type="color"
                                  value={activeBlock.settings.shapeDividerBottomColor && activeBlock.settings.shapeDividerBottomColor.startsWith('#') ? activeBlock.settings.shapeDividerBottomColor : '#151b2c'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomColor: e.target.value })}
                                  style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Height (px)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={activeBlock.settings.shapeDividerBottomHeight || '100'}
                                onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomHeight: e.target.value })}
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                              <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={!!activeBlock.settings.shapeDividerBottomInvert}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomInvert: e.target.checked })}
                                  style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Invert</span>
                              </label>

                              <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={!!activeBlock.settings.shapeDividerBottomFlip}
                                  onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomFlip: e.target.checked })}
                                  style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Flip</span>
                              </label>
                            </div>
                          </>
                        )}
                      </div>

                  {activeBlock.settings.layoutType === 'grid' && (
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Grid Columns (per Row)</span>
                        <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                          {previewDevice}
                        </span>
                      </label>
                      <select
                        className="form-control"
                        value={
                          previewDevice === 'mobile' 
                            ? (activeBlock.settings.gridColsMobile || '1') 
                            : previewDevice === 'tablet' 
                              ? (activeBlock.settings.gridColsTablet || activeBlock.settings.gridColsDesktop || '2')
                              : (activeBlock.settings.gridColsDesktop || '2')
                        }
                        onChange={e => {
                          const val = e.target.value;
                          const field = previewDevice === 'mobile' 
                            ? 'gridColsMobile' 
                            : previewDevice === 'tablet' 
                              ? 'gridColsTablet' 
                              : 'gridColsDesktop';
                          updateBlockSettings(activeBlock.id, { [field]: val });
                        }}
                      >
                        <option value="1">1 Column per Row</option>
                        <option value="2">2 Columns per Row</option>
                        <option value="3">3 Columns per Row</option>
                        <option value="4">4 Columns per Row</option>
                        <option value="5">5 Columns per Row</option>
                        <option value="6">6 Columns per Row</option>
                      </select>
                    </div>
                  )}

                  {/* Dynamic Columns Manager */}
                  <div className="form-group" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Columns Setup</span>
                        <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                          {previewDevice}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                        onClick={() => {
                          const newCols = [...(activeBlock.settings.columns || [])];
                          const newColId = `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
                          newCols.push({ id: newColId, width: '50', blocks: [] });
                          updateBlockSettings(activeBlock.id, { columns: newCols });
                        }}
                      >
                        <Plus size={10} style={{ marginRight: '2px' }} />
                        <span>Add Column</span>
                      </button>
                    </label>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(activeBlock.settings.columns || []).map((col, cIdx) => {
                        const colId = col?.id || `col-${cIdx}`;
                        
                        let colWidth = '';
                        if (previewDevice === 'mobile') {
                          colWidth = col?.width_mobile || '100';
                        } else if (previewDevice === 'tablet') {
                          colWidth = col?.width_tablet || col?.width || '100';
                        } else {
                          colWidth = col?.width || '50';
                        }

                        return (
                          <div key={colId} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flex: '1', fontWeight: '600' }}>
                                Column {cIdx + 1}
                              </span>
                              <input
                                type="number"
                                className="form-control"
                                value={colWidth}
                                onChange={e => {
                                  const val = e.target.value;
                                  const newCols = [...activeBlock.settings.columns];
                                  const targetField = previewDevice === 'mobile' 
                                    ? 'width_mobile' 
                                    : previewDevice === 'tablet' 
                                      ? 'width_tablet' 
                                      : 'width';

                                  if (Array.isArray(col)) {
                                    newCols[cIdx] = { id: colId, [targetField]: val, blocks: col };
                                  } else {
                                    newCols[cIdx] = { ...col, [targetField]: val };
                                  }
                                  updateBlockSettings(activeBlock.id, { columns: newCols });
                                }}
                                style={{ width: '50px', padding: '3px 6px', fontSize: '0.75rem', height: '24px', background: 'var(--bg-secondary)', textAlign: 'center', border: '1px solid var(--border-color)', color: '#fff' }}
                              />
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {activeBlock.settings.layoutType === 'flex' ? '%' : 'fr'}
                              </span>

                              {/* Style Column Toggle */}
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setActiveColStyleIdx(activeColStyleIdx === cIdx ? null : cIdx)}
                                style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                              >
                                Style
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (activeBlock.settings.columns.length <= 1) {
                                    alert('A section must contain at least one column!');
                                    return;
                                  }
                                  const newCols = activeBlock.settings.columns.filter((_, idx) => idx !== cIdx);
                                  updateBlockSettings(activeBlock.id, { columns: newCols });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                title="Delete Column"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {/* Inline Column Style Settings */}
                            {activeColStyleIdx === cIdx && (
                              <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Col {cIdx + 1} Spacing & Bg</span>
                                  <button type="button" onClick={() => setActiveColStyleIdx(null)} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>Close</button>
                                </div>
                                {renderStyleSettings(col.style || {}, (key, val) => updateColumnStyle(cIdx, key, val))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {activeBlock.settings.layoutType === 'flex' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Flex Direction</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.direction || 'row'}
                          onChange={e => updateBlockSettings(activeBlock.id, { direction: e.target.value })}
                        >
                          <option value="row">Row (Horizontal)</option>
                          <option value="column">Column (Vertical)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Justify Content</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.justify || 'start'}
                          onChange={e => updateBlockSettings(activeBlock.id, { justify: e.target.value })}
                        >
                          <option value="start">Flex Start (Left)</option>
                          <option value="center">Center</option>
                          <option value="end">Flex End (Right)</option>
                          <option value="between">Space Between</option>
                          <option value="around">Space Around</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Align Items</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.align || 'stretch'}
                          onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                        >
                          <option value="start">Flex Start (Top)</option>
                          <option value="center">Center</option>
                          <option value="end">Flex End (Bottom)</option>
                          <option value="stretch">Stretch (Fill Height)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label">Gap Spacing (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={activeBlock.settings.gap || '20'}
                      onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>0px</span>
                      <span>{activeBlock.settings.gap || '20'}px</span>
                      <span>60px</span>
                    </div>
                  </div>
                </div>
              )}

              {/* HEADING SETTINGS */}
              {activeBlock.type === 'heading' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Heading Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeBlock.settings.text}
                      onChange={e => updateBlockSettings(activeBlock.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">HTML Tag</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.size}
                      onChange={e => updateBlockSettings(activeBlock.id, { size: e.target.value })}
                    >
                      <option value="h1">H1 (Main Header)</option>
                      <option value="h2">H2 (Section Header)</option>
                      <option value="h3">H3 (Sub Header)</option>
                      <option value="h4">H4 (Small Header)</option>
                      <option value="h5">H5 (Micro Title)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Font Family</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.fontFamily || 'inherit'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontFamily: e.target.value })}
                    >
                      <option value="inherit">Inherit (Default)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Sans-Serif</option>
                      <option value="'Courier New', monospace">Courier Prime Monospace</option>
                      {(appearance?.custom_fonts || []).map(font => {
                        const displayName = font.split(',')[0].replace(/['"]/g, '');
                        return (
                          <option key={font} value={font}>{displayName}</option>
                        );
                      })}
                      {(appearance?.uploaded_fonts || []).length > 0 && (
                        <optgroup label="Uploaded Custom Fonts">
                          {Array.from(new Set((appearance.uploaded_fonts).map(f => f.family))).map(familyName => (
                            <option key={familyName} value={`'${familyName}', sans-serif`}>{familyName}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Responsive Font Size */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Font Size (px)</span>
                      <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                        {previewDevice}
                      </span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Inherited tag size"
                      value={
                        previewDevice === 'mobile'
                          ? (activeBlock.settings.fontSize_mobile || '')
                          : previewDevice === 'tablet'
                            ? (activeBlock.settings.fontSize_tablet || '')
                            : (activeBlock.settings.fontSize_desktop || '')
                      }
                      onChange={e => {
                        const val = e.target.value;
                        const field = previewDevice === 'mobile'
                          ? 'fontSize_mobile'
                          : previewDevice === 'tablet'
                            ? 'fontSize_tablet'
                            : 'fontSize_desktop';
                        updateBlockSettings(activeBlock.id, { [field]: val });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeBlock.settings.color || '#ffffff'}
                        onChange={e => updateBlockSettings(activeBlock.id, { color: e.target.value })}
                        style={{ width: '40px', height: '34px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={activeBlock.settings.color || '#ffffff'}
                        onChange={e => updateBlockSettings(activeBlock.id, { color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TEXT SETTINGS */}
              {activeBlock.type === 'text' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Body Content</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={activeBlock.settings.text}
                      onChange={e => updateBlockSettings(activeBlock.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Font Family</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.fontFamily || 'inherit'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontFamily: e.target.value })}
                    >
                      <option value="inherit">Inherit (Default)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Sans-Serif</option>
                      <option value="'Courier New', monospace">Courier Prime Monospace</option>
                      {(appearance?.custom_fonts || []).map(font => {
                        const displayName = font.split(',')[0].replace(/['"]/g, '');
                        return (
                          <option key={font} value={font}>{displayName}</option>
                        );
                      })}
                      {(appearance?.uploaded_fonts || []).length > 0 && (
                        <optgroup label="Uploaded Custom Fonts">
                          {Array.from(new Set((appearance.uploaded_fonts).map(f => f.family))).map(familyName => (
                            <option key={familyName} value={`'${familyName}', sans-serif`}>{familyName}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Responsive Font Size */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Font Size (px)</span>
                      <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                        {previewDevice}
                      </span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="16"
                      value={
                        previewDevice === 'mobile'
                          ? (activeBlock.settings.fontSize_mobile || '')
                          : previewDevice === 'tablet'
                            ? (activeBlock.settings.fontSize_tablet || '')
                            : (activeBlock.settings.fontSize_desktop || activeBlock.settings.size || '')
                      }
                      onChange={e => {
                        const val = e.target.value;
                        const field = previewDevice === 'mobile'
                          ? 'fontSize_mobile'
                          : previewDevice === 'tablet'
                            ? 'fontSize_tablet'
                            : 'fontSize_desktop';
                        
                        if (field === 'fontSize_desktop') {
                          updateBlockSettings(activeBlock.id, { fontSize_desktop: val, size: val });
                        } else {
                          updateBlockSettings(activeBlock.id, { [field]: val });
                        }
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeBlock.settings.color || '#9ca3af'}
                        onChange={e => updateBlockSettings(activeBlock.id, { color: e.target.value })}
                        style={{ width: '40px', height: '34px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={activeBlock.settings.color || '#9ca3af'}
                        onChange={e => updateBlockSettings(activeBlock.id, { color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SITE LOGO WIDGET SETTINGS */}
              {activeBlock.type === 'logo' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Logo Image Source</label>
                    {activeBlock.settings.url && (
                      <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '8px', textAlign: 'center' }}>
                        <img src={activeBlock.settings.url} alt="Logo preview" style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                      onClick={() => setMediaModalOpen(true)}
                    >
                      <UploadCloud size={14} />
                      <span>Select Logo from Library</span>
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Logo Width (%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={activeBlock.settings.width || '30'}
                      onChange={e => updateBlockSettings(activeBlock.id, { width: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>10%</span>
                      <span>{activeBlock.settings.width || '30'}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align || 'left'}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              )}

              {/* NAVIGATION MENU WIDGET SETTINGS */}
              {activeBlock.type === 'menu' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Select Menu to Display</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.menuId || ''}
                      onChange={e => updateBlockSettings(activeBlock.id, { menuId: e.target.value })}
                    >
                      <option value="">-- Choose Menu --</option>
                      {(appearance?.menus || []).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Menu Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align || 'left'}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Font Family</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.fontFamily || 'inherit'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontFamily: e.target.value })}
                    >
                      <option value="inherit">Inherit (Default)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Sans-Serif</option>
                      <option value="'Courier New', monospace">Courier Prime Monospace</option>
                      {(appearance?.custom_fonts || []).map(font => {
                        const displayName = font.split(',')[0].replace(/['"]/g, '');
                        return (
                          <option key={font} value={font}>{displayName}</option>
                        );
                      })}
                      {(appearance?.uploaded_fonts || []).length > 0 && (
                        <optgroup label="Uploaded Custom Fonts">
                          {Array.from(new Set((appearance.uploaded_fonts).map(f => f.family))).map(familyName => (
                            <option key={familyName} value={`'${familyName}', sans-serif`}>{familyName}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Link Font Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.fontSize || '15'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontSize: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Text Color</label>
                    <input
                      type="color"
                      value={activeBlock.settings.color || '#ffffff'}
                      onChange={e => updateBlockSettings(activeBlock.id, { color: e.target.value })}
                      style={{ width: '100%', height: '34px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}

              {/* ICON LIST WIDGET SETTINGS */}
              {activeBlock.type === 'iconlist' && (
                <div className="settings-fields">
                  <div className="form-group" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label className="form-label" style={{ margin: '0' }}>List Items</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                        onClick={() => {
                          const currentItems = activeBlock.settings.items || [];
                          const updated = [...currentItems, { id: `li-${Date.now()}`, text: 'New List Item', icon: 'Check' }];
                          updateBlockSettings(activeBlock.id, { items: updated });
                        }}
                      >
                        <Plus size={10} style={{ marginRight: '2px' }} />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '160px', overflowY: 'auto' }}>
                      {(activeBlock.settings.items || []).map((item, idx) => (
                        <div key={item.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <select
                            value={item.icon || 'Check'}
                            onChange={e => {
                              const newItems = [...activeBlock.settings.items];
                              newItems[idx] = { ...item, icon: e.target.value };
                              updateBlockSettings(activeBlock.id, { items: newItems });
                            }}
                            className="form-control"
                            style={{ width: '80px', fontSize: '0.75rem', padding: '3px' }}
                          >
                            <option value="Check">Check</option>
                            <option value="Star">Star</option>
                            <option value="Phone">Phone</option>
                            <option value="Mail">Mail</option>
                            <option value="MapPin">Pin</option>
                          </select>
                          <input
                            type="text"
                            value={item.text}
                            onChange={e => {
                              const newItems = [...activeBlock.settings.items];
                              newItems[idx] = { ...item, text: e.target.value };
                              updateBlockSettings(activeBlock.id, { items: newItems });
                            }}
                            className="form-control"
                            style={{ fontSize: '0.75rem', padding: '3px 6px', flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = activeBlock.settings.items.filter(x => x.id !== item.id);
                              updateBlockSettings(activeBlock.id, { items: updated });
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.iconSize || '16'}
                      onChange={e => updateBlockSettings(activeBlock.id, { iconSize: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item Gap Spacing (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.gap || '10'}
                      onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Text Font Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.fontSize || '14'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontSize: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* ICON BOX WIDGET SETTINGS */}
              {activeBlock.type === 'iconbox' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Select Icon</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.icon || 'Star'}
                      onChange={e => updateBlockSettings(activeBlock.id, { icon: e.target.value })}
                    >
                      <option value="Star">Star</option>
                      <option value="Check">Check</option>
                      <option value="Phone">Phone</option>
                      <option value="Mail">Mail</option>
                      <option value="MapPin">Map Pin</option>
                      <option value="Globe">Globe</option>
                      <option value="Layers">Layers</option>
                      <option value="Package">Package</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Heading Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeBlock.settings.title}
                      onChange={e => updateBlockSettings(activeBlock.id, { title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description Text</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={activeBlock.settings.description}
                      onChange={e => updateBlockSettings(activeBlock.id, { description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon Color</label>
                    <input
                      type="color"
                      value={activeBlock.settings.iconColor || '#6366f1'}
                      onChange={e => updateBlockSettings(activeBlock.id, { iconColor: e.target.value })}
                      style={{ width: '100%', height: '34px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', cursor: 'pointer' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon Background Shape</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.iconBg || ''}
                      onChange={e => updateBlockSettings(activeBlock.id, { iconBg: e.target.value })}
                    >
                      <option value="">Transparent / None</option>
                      <option value="circle">Solid Circle Shape</option>
                      <option value="square">Solid Square Shape</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.iconSize || '36'}
                      onChange={e => updateBlockSettings(activeBlock.id, { iconSize: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align || 'center'}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SLIDER WIDGET SETTINGS */}
              {activeBlock.type === 'slider' && (
                <div className="settings-fields">
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!activeBlock.settings.autoplay}
                        onChange={e => updateBlockSettings(activeBlock.id, { autoplay: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Autoplay Slides</span>
                    </label>
                  </div>

                  {activeBlock.settings.autoplay && (
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Autoplay Speed (ms)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.autoplaySpeed || '5000'}
                        onChange={e => updateBlockSettings(activeBlock.id, { autoplaySpeed: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Slider Height (e.g. 400px or 60vh)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeBlock.settings.height || '400px'}
                      onChange={e => updateBlockSettings(activeBlock.id, { height: e.target.value })}
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.showArrows !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { showArrows: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Show Navigation Arrows</span>
                    </label>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.showDots !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { showDots: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Show Pagination Dots</span>
                    </label>
                  </div>

                  {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Spacing</label>
                      
                      {activeBlock.settings.showArrows !== false && (
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrows Horizontal Offset: {activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '16'}px</label>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="150"
                            className="form-control-range"
                            value={activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '16'}
                            onChange={e => updateBlockSettings(activeBlock.id, { arrowsOffset: e.target.value })}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                          />
                        </div>
                      )}

                      {activeBlock.settings.showDots !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Vertical Reference</label>
                            <select
                              className="form-control"
                              value={activeBlock.settings.dotsVerticalRef || 'bottom'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsVerticalRef: e.target.value })}
                              style={{ fontSize: '0.75rem' }}
                            >
                              <option value="bottom">Bottom</option>
                              <option value="top">Top</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Vertical Offset: {activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '16'}px</label>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="250"
                              className="form-control-range"
                              value={activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '16'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsOffset: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Horizontal Offset: {activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}px</label>
                            </div>
                            <input
                              type="range"
                              min="-150"
                              max="150"
                              className="form-control-range"
                              value={activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsHorizontalOffset: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Styles</label>

                      {activeBlock.settings.showArrows !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Icon Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Background</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.arrowBgColor || '#000000'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.arrowBgColor || 'rgba(0,0,0,0.4)'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrow Border Radius: {activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}%</label>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              className="form-control-range"
                              value={activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}
                              onChange={e => updateBlockSettings(activeBlock.id, { arrowBorderRadius: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>
                        </>
                      )}

                      {activeBlock.settings.showDots !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Normal Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.dotsNormalColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.dotsNormalColor || 'rgba(255,255,255,0.4)'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Active Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Transition Effect</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.transition || 'slide'}
                      onChange={e => updateBlockSettings(activeBlock.id, { transition: e.target.value })}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <option value="slide">Slide Transition</option>
                      <option value="fade">Cross Fade Effect</option>
                    </select>
                  </div>

                  {/* Slider Bottom Shape Divider Option */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px', marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bottom Shape Divider</label>
                    
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Type</label>
                      <select
                        className="form-control"
                        value={activeBlock.settings.shapeDividerBottom || 'none'}
                        onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottom: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <option value="none">None / Off</option>
                        <option value="mountains">Mountains</option>
                        <option value="drops">Drops</option>
                        <option value="clouds">Clouds</option>
                        <option value="zigzag">Zigzag</option>
                        <option value="pyramids">Pyramids</option>
                        <option value="triangle-asymmetrical">Triangle Asymmetrical</option>
                        <option value="tilt">Tilt</option>
                        <option value="tilt-opacity">Tilt Opacity</option>
                        <option value="fan">Fan</option>
                        <option value="curve">Curve</option>
                        <option value="curve-asymmetrical">Curve Asymmetrical</option>
                        <option value="waves">Waves</option>
                        <option value="waves-brush">Waves Brush</option>
                        <option value="waves-pattern">Waves Pattern</option>
                        <option value="split">Split</option>
                        <option value="book">Book</option>
                        <option value="arrow">Arrow</option>
                        <option value="triangle">Triangle</option>
                      </select>
                    </div>

                    {activeBlock.settings.shapeDividerBottom && activeBlock.settings.shapeDividerBottom !== 'none' && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.shapeDividerBottomColor || '#151b2c'}
                              onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', padding: '4px 6px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.shapeDividerBottomColor && activeBlock.settings.shapeDividerBottomColor.startsWith('#') ? activeBlock.settings.shapeDividerBottomColor : '#151b2c'}
                              onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Shape Height (px)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.shapeDividerBottomHeight || '100'}
                            onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomHeight: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                          <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={!!activeBlock.settings.shapeDividerBottomInvert}
                              onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomInvert: e.target.checked })}
                              style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Invert</span>
                          </label>

                          <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={!!activeBlock.settings.shapeDividerBottomFlip}
                              onChange={e => updateBlockSettings(activeBlock.id, { shapeDividerBottomFlip: e.target.checked })}
                              style={{ width: '14px', height: '14px', accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Flip</span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Slides List Manager */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="form-label" style={{ margin: '0', fontWeight: 'bold' }}>Slides List</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                        onClick={() => {
                          const currentSlides = activeBlock.settings.slides || [];
                          const updated = [...currentSlides, {
                            id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                            style: { backgroundColor: 'rgba(255,255,255,0.03)' },
                            blocks: [
                              {
                                id: `slide-h-${Date.now()}`,
                                type: 'heading',
                                settings: { text: `New Slide ${currentSlides.length + 1} Heading`, size: 'h2', align: 'center', color: '#ffffff' }
                              }
                            ]
                          }];
                          updateBlockSettings(activeBlock.id, { slides: updated });
                        }}
                      >
                        <Plus size={10} style={{ marginRight: '2px' }} />
                        <span>Add Slide</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(activeBlock.settings.slides || []).map((slide, sIdx) => {
                        const isExpanded = activeSlideStyleId === slide.id;
                        const isCanvasActive = (activeSlides[activeBlock.id] || 0) === sIdx;
                        return (
                          <div key={slide.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setActiveSlides(prev => ({ ...prev, [activeBlock.id]: sIdx }))}
                                style={{
                                  flex: 1, textAlign: 'left', background: 'none', border: 'none',
                                  fontSize: '0.8rem', color: isCanvasActive ? 'var(--color-primary)' : '#fff',
                                  fontWeight: isCanvasActive ? 'bold' : 'normal', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                              >
                                <Play size={10} style={{ color: isCanvasActive ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                                <span>Slide {sIdx + 1} {isCanvasActive ? '(Active)' : ''}</span>
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '2px 6px', fontSize: '0.6rem', color: isExpanded ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                onClick={() => {
                                  setMediaSelectionContext('bg_image');
                                  setActiveSlideStyleId(isExpanded ? null : slide.id);
                                }}
                              >
                                Style
                              </button>

                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                                onClick={() => {
                                  const currentSlides = activeBlock.settings.slides || [];
                                  if (currentSlides.length <= 1) {
                                    alert('Slider must contain at least one slide!');
                                    return;
                                  }
                                  const updated = currentSlides.filter(x => x.id !== slide.id);
                                  updateBlockSettings(activeBlock.id, { slides: updated });
                                  if (isCanvasActive) {
                                    setActiveSlides(prev => ({ ...prev, [activeBlock.id]: 0 }));
                                  }
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {/* Expanded Slide background visual customizer form */}
                            {isExpanded && (
                              <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Slide {sIdx + 1} Style Settings</span>
                                  <button type="button" onClick={() => {
                                    setMediaSelectionContext('image_url');
                                    setActiveSlideStyleId(null);
                                  }} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.65rem' }}>Close</button>
                                </div>
                                {renderStyleSettings(slide.style || {}, (key, val) => updateSlideStyle(slide.id, key, val))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CAROUSEL WIDGET SETTINGS */}
              {(activeBlock.type === 'carousel' || activeBlock.type === 'image_only_carousel') && (
                <div className="settings-fields">
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.infinite !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { infinite: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Infinite Loop (Continuous Scroll)</span>
                    </label>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!activeBlock.settings.autoplay}
                        onChange={e => updateBlockSettings(activeBlock.id, { autoplay: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Autoplay Carousel</span>
                    </label>
                  </div>

                  {activeBlock.settings.autoplay && (
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Autoplay Speed (ms)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.autoplaySpeed || '5000'}
                        onChange={e => updateBlockSettings(activeBlock.id, { autoplaySpeed: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.showArrows !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { showArrows: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Show Navigation Arrows</span>
                    </label>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.showDots !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { showDots: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Show Pagination Dots</span>
                    </label>
                  </div>

                  {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Spacing</label>
                      
                      {activeBlock.settings.showArrows !== false && (
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrows Horizontal Offset: {activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '12'}px</label>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="150"
                            className="form-control-range"
                            value={activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '12'}
                            onChange={e => updateBlockSettings(activeBlock.id, { arrowsOffset: e.target.value })}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                          />
                        </div>
                      )}

                      {activeBlock.settings.showDots !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Vertical Reference</label>
                            <select
                              className="form-control"
                              value={activeBlock.settings.dotsVerticalRef || 'bottom'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsVerticalRef: e.target.value })}
                              style={{ fontSize: '0.75rem' }}
                            >
                              <option value="bottom">Bottom</option>
                              <option value="top">Top</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Vertical Offset: {activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '12'}px</label>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="250"
                              className="form-control-range"
                              value={activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '12'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsOffset: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Horizontal Offset: {activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}px</label>
                            </div>
                            <input
                              type="range"
                              min="-150"
                              max="150"
                              className="form-control-range"
                              value={activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}
                              onChange={e => updateBlockSettings(activeBlock.id, { dotsHorizontalOffset: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Styles</label>

                      {activeBlock.settings.showArrows !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Icon Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Background</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.arrowBgColor || '#000000'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.arrowBgColor || 'rgba(0,0,0,0.4)'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrow Border Radius: {activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}%</label>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              className="form-control-range"
                              value={activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}
                              onChange={e => updateBlockSettings(activeBlock.id, { arrowBorderRadius: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>
                        </>
                      )}

                      {activeBlock.settings.showDots !== false && (
                        <>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Normal Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.dotsNormalColor || '#ffffff'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.dotsNormalColor || 'rgba(255,255,255,0.4)'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Active Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                style={{ fontSize: '0.75rem', padding: '4px' }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Desktop Slides</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.slidesToShowDesktop || '3'}
                        onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowDesktop: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Tablet Slides</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.slidesToShowTablet || '2'}
                        onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowTablet: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Mobile Slides</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.slidesToShowMobile || '1'}
                        onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowMobile: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Image Height (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.imageHeight || '220'}
                        onChange={e => updateBlockSettings(activeBlock.id, { imageHeight: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Spacing Gap (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.gap || '15'}
                        onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>Border Radius (Corners)</label>
                      <select
                        value={activeBlock.settings.borderRadiusUnit || '%'}
                        onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusUnit: e.target.value })}
                        style={{ fontSize: '0.7rem', padding: '2px 4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="%">% (Percentage)</option>
                        <option value="px">px (Pixels)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TL"
                          title="Top-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopLeft !== undefined ? activeBlock.settings.borderRadiusTopLeft : (activeBlock.settings.borderRadius || '8')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TL</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TR"
                          title="Top-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopRight !== undefined ? activeBlock.settings.borderRadiusTopRight : (activeBlock.settings.borderRadius || '8')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BR"
                          title="Bottom-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomRight !== undefined ? activeBlock.settings.borderRadiusBottomRight : (activeBlock.settings.borderRadius || '8')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BL"
                          title="Bottom-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomLeft !== undefined ? activeBlock.settings.borderRadiusBottomLeft : (activeBlock.settings.borderRadius || '8')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BL</span>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Images Manager */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="form-label" style={{ margin: '0', fontWeight: 'bold' }}>Carousel Images</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                        onClick={() => {
                          setMediaSelectionContext('carousel_add');
                          setMediaModalOpen(true);
                        }}
                      >
                        <Plus size={10} style={{ marginRight: '2px' }} />
                        <span>Add Image</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(activeBlock.settings.images || []).map((img, iIdx) => (
                        <div key={img.id || iIdx} style={{ display: 'flex', gap: '8px', padding: '8px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                          <img src={img.url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          {activeBlock.type === 'carousel' ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <input 
                                type="text" 
                                placeholder="Caption..." 
                                value={img.caption || ''} 
                                onChange={e => {
                                  const current = [...(activeBlock.settings.images || [])];
                                  current[iIdx] = { ...current[iIdx], caption: e.target.value };
                                  updateBlockSettings(activeBlock.id, { images: current });
                                }}
                                style={{ fontSize: '0.7rem', padding: '2px 4px', height: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                              />
                              <input 
                                type="text" 
                                placeholder="Description..." 
                                value={img.description || ''} 
                                onChange={e => {
                                  const current = [...(activeBlock.settings.images || [])];
                                  current[iIdx] = { ...current[iIdx], description: e.target.value };
                                  updateBlockSettings(activeBlock.id, { images: current });
                                }}
                                style={{ fontSize: '0.7rem', padding: '2px 4px', height: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', marginTop: '2px' }}
                              />
                            </div>
                          ) : (
                            <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {img.url.substring(img.url.lastIndexOf('/') + 1)}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const current = (activeBlock.settings.images || []).filter(x => x.id !== img.id);
                              updateBlockSettings(activeBlock.id, { images: current });
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LOOP GRID WIDGET SETTINGS */}
              {activeBlock.type === 'loop_grid' && (
                <div className="settings-fields">
                  {/* Query Section */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Query Settings</label>
                    
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Source Post Type</label>
                      <select
                        className="form-control"
                        value={activeBlock.settings.postType || 'post'}
                        onChange={e => updateBlockSettings(activeBlock.id, { postType: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <option value="post">Posts</option>
                        <option value="page">Pages</option>
                        {(postTypes || []).map(pt => (
                          <option key={pt.slug} value={pt.slug}>{pt.plural || pt.singular || pt.name || pt.slug}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Query Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.limit || '6'}
                        onChange={e => updateBlockSettings(activeBlock.id, { limit: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Order By</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.orderBy || 'createdAt'}
                          onChange={e => updateBlockSettings(activeBlock.id, { orderBy: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <option value="createdAt">Date Created</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Order</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.order || 'DESC'}
                          onChange={e => updateBlockSettings(activeBlock.id, { order: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <option value="DESC">Descending</option>
                          <option value="ASC">Ascending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Grid Layout Section */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Grid Layout</label>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Desktop Cols</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.columnsDesktop || '3'}
                          onChange={e => updateBlockSettings(activeBlock.id, { columnsDesktop: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Tablet Cols</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.columnsTablet || '2'}
                          onChange={e => updateBlockSettings(activeBlock.id, { columnsTablet: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Mobile Cols</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.columnsMobile || '1'}
                          onChange={e => updateBlockSettings(activeBlock.id, { columnsMobile: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Column Gap Spacing (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.gap || '20'}
                        onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Card Elements Toggles */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Card Settings</label>
                    
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showImage !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showImage: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Featured Image</span>
                      </label>
                    </div>

                    {activeBlock.settings.showImage !== false && (
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Image Height (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.imageHeight || '200'}
                          onChange={e => updateBlockSettings(activeBlock.id, { imageHeight: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showTitle !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showTitle: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Post Title</span>
                      </label>
                    </div>

                    {activeBlock.settings.showTitle !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Title Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.titleColor || '#ffffff'}
                              onChange={e => updateBlockSettings(activeBlock.id, { titleColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.titleColor && activeBlock.settings.titleColor.startsWith('#') ? activeBlock.settings.titleColor : '#ffffff'}
                              onChange={e => updateBlockSettings(activeBlock.id, { titleColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Title Font Size (px)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.titleFontSize || ''}
                            onChange={e => updateBlockSettings(activeBlock.id, { titleFontSize: e.target.value })}
                            placeholder="Inherited title size"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showExcerpt !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showExcerpt: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Excerpt Content</span>
                      </label>
                    </div>

                    {activeBlock.settings.showExcerpt !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Length (chars)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.excerptLength || '100'}
                            onChange={e => updateBlockSettings(activeBlock.id, { excerptLength: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Font Size (px)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.excerptFontSize || ''}
                            onChange={e => updateBlockSettings(activeBlock.id, { excerptFontSize: e.target.value })}
                            placeholder="Inherited body size"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.excerptColor || '#9ca3af'}
                              onChange={e => updateBlockSettings(activeBlock.id, { excerptColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.excerptColor && activeBlock.settings.excerptColor.startsWith('#') ? activeBlock.settings.excerptColor : '#9ca3af'}
                              onChange={e => updateBlockSettings(activeBlock.id, { excerptColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showMeta !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showMeta: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Meta (Date & Author)</span>
                      </label>
                    </div>

                    {activeBlock.settings.showMeta !== false && (
                      <div className="form-group" style={{ marginBottom: '12px', marginLeft: '24px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Meta Color</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            className="form-control hex-input"
                            value={activeBlock.settings.metaColor || '#6b7280'}
                            onChange={e => updateBlockSettings(activeBlock.id, { metaColor: e.target.value })}
                            style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                          />
                          <input
                            type="color"
                            value={activeBlock.settings.metaColor && activeBlock.settings.metaColor.startsWith('#') ? activeBlock.settings.metaColor : '#6b7280'}
                            onChange={e => updateBlockSettings(activeBlock.id, { metaColor: e.target.value })}
                            style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showButton !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showButton: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Action Button</span>
                      </label>
                    </div>

                    {activeBlock.settings.showButton !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Button Text</label>
                          <input
                            type="text"
                            className="form-control"
                            value={activeBlock.settings.buttonText || 'View Event'}
                            onChange={e => updateBlockSettings(activeBlock.id, { buttonText: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Button Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.buttonColor || '#6366f1'}
                              onChange={e => updateBlockSettings(activeBlock.id, { buttonColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.buttonColor && activeBlock.settings.buttonColor.startsWith('#') ? activeBlock.settings.buttonColor : '#6366f1'}
                              onChange={e => updateBlockSettings(activeBlock.id, { buttonColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>Border Radius (Corners)</label>
                      <select
                        value={activeBlock.settings.borderRadiusUnit || '%'}
                        onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusUnit: e.target.value })}
                        style={{ fontSize: '0.7rem', padding: '2px 4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="%">% (Percentage)</option>
                        <option value="px">px (Pixels)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TL"
                          title="Top-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopLeft !== undefined ? activeBlock.settings.borderRadiusTopLeft : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TL</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TR"
                          title="Top-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopRight !== undefined ? activeBlock.settings.borderRadiusTopRight : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BR"
                          title="Bottom-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomRight !== undefined ? activeBlock.settings.borderRadiusBottomRight : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BL"
                          title="Bottom-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomLeft !== undefined ? activeBlock.settings.borderRadiusBottomLeft : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LOOP CAROUSEL WIDGET SETTINGS */}
              {activeBlock.type === 'loop_carousel' && (
                <div className="settings-fields">
                  {/* Query Section */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Query Settings</label>
                    
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Source Post Type</label>
                      <select
                        className="form-control"
                        value={activeBlock.settings.postType || 'post'}
                        onChange={e => updateBlockSettings(activeBlock.id, { postType: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <option value="post">Posts</option>
                        <option value="page">Pages</option>
                        {(postTypes || []).map(pt => (
                          <option key={pt.slug} value={pt.slug}>{pt.plural || pt.singular || pt.name || pt.slug}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Query Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.limit || '6'}
                        onChange={e => updateBlockSettings(activeBlock.id, { limit: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Order By</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.orderBy || 'createdAt'}
                          onChange={e => updateBlockSettings(activeBlock.id, { orderBy: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <option value="createdAt">Date Created</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Order</label>
                        <select
                          className="form-control"
                          value={activeBlock.settings.order || 'DESC'}
                          onChange={e => updateBlockSettings(activeBlock.id, { order: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <option value="DESC">Descending</option>
                          <option value="ASC">Ascending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Layout Section */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Carousel Layout</label>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Desktop Slides</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.slidesToShowDesktop || '3'}
                          onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowDesktop: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Tablet Slides</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.slidesToShowTablet || '2'}
                          onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowTablet: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Mobile Slides</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.slidesToShowMobile || '1'}
                          onChange={e => updateBlockSettings(activeBlock.id, { slidesToShowMobile: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Slides Spacing Gap (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activeBlock.settings.gap || '20'}
                        onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.infinite !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { infinite: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Infinite Loop (Continuous Scroll)</span>
                      </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!activeBlock.settings.autoplay}
                          onChange={e => updateBlockSettings(activeBlock.id, { autoplay: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Autoplay Loop Carousel</span>
                      </label>
                    </div>

                    {activeBlock.settings.autoplay && (
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Autoplay Speed (ms)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.autoplaySpeed || '5000'}
                          onChange={e => updateBlockSettings(activeBlock.id, { autoplaySpeed: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showArrows !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showArrows: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Arrows</span>
                      </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showDots !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showDots: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Dots</span>
                      </label>
                    </div>

                    {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                      <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Spacing</label>
                        
                        {activeBlock.settings.showArrows !== false && (
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrows Horizontal Offset: {activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '12'}px</label>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="150"
                              className="form-control-range"
                              value={activeBlock.settings.arrowsOffset !== undefined ? activeBlock.settings.arrowsOffset : '12'}
                              onChange={e => updateBlockSettings(activeBlock.id, { arrowsOffset: e.target.value })}
                              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                          </div>
                        )}

                        {activeBlock.settings.showDots !== false && (
                          <>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Vertical Reference</label>
                              <select
                                className="form-control"
                                value={activeBlock.settings.dotsVerticalRef || 'bottom'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsVerticalRef: e.target.value })}
                                style={{ fontSize: '0.75rem' }}
                              >
                                <option value="bottom">Bottom</option>
                                <option value="top">Top</option>
                              </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Vertical Offset: {activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '12'}px</label>
                              </div>
                              <input
                                type="range"
                                min="-100"
                                max="250"
                                className="form-control-range"
                                value={activeBlock.settings.dotsOffset !== undefined ? activeBlock.settings.dotsOffset : '12'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsOffset: e.target.value })}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Dots Horizontal Offset: {activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}px</label>
                              </div>
                              <input
                                type="range"
                                min="-150"
                                max="150"
                                className="form-control-range"
                                value={activeBlock.settings.dotsHorizontalOffset !== undefined ? activeBlock.settings.dotsHorizontalOffset : '0'}
                                onChange={e => updateBlockSettings(activeBlock.id, { dotsHorizontalOffset: e.target.value })}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {(activeBlock.settings.showArrows !== false || activeBlock.settings.showDots !== false) && (
                      <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '12px', marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Navigation Styles</label>

                        {activeBlock.settings.showArrows !== false && (
                          <>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Icon Color</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="color"
                                  value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                  style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  value={activeBlock.settings.arrowIconColor || '#ffffff'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { arrowIconColor: e.target.value })}
                                  style={{ fontSize: '0.75rem', padding: '4px' }}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Arrow Background</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="color"
                                  value={activeBlock.settings.arrowBgColor || '#000000'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                  style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  value={activeBlock.settings.arrowBgColor || 'rgba(0,0,0,0.4)'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { arrowBgColor: e.target.value })}
                                  style={{ fontSize: '0.75rem', padding: '4px' }}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Arrow Border Radius: {activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}%</label>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                className="form-control-range"
                                value={activeBlock.settings.arrowBorderRadius !== undefined ? activeBlock.settings.arrowBorderRadius : '50'}
                                onChange={e => updateBlockSettings(activeBlock.id, { arrowBorderRadius: e.target.value })}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                              />
                            </div>
                          </>
                        )}

                        {activeBlock.settings.showDots !== false && (
                          <>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Normal Color</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="color"
                                  value={activeBlock.settings.dotsNormalColor || '#ffffff'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                  style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  value={activeBlock.settings.dotsNormalColor || 'rgba(255,255,255,0.4)'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { dotsNormalColor: e.target.value })}
                                  style={{ fontSize: '0.75rem', padding: '4px' }}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '12px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Dots Active Color</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="color"
                                  value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                  style={{ width: '32px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  value={activeBlock.settings.dotsActiveColor || '#6366f1'}
                                  onChange={e => updateBlockSettings(activeBlock.id, { dotsActiveColor: e.target.value })}
                                  style={{ fontSize: '0.75rem', padding: '4px' }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Elements Toggles */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Card Settings</label>
                    
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showImage !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showImage: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Featured Image</span>
                      </label>
                    </div>

                    {activeBlock.settings.showImage !== false && (
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Image Height (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={activeBlock.settings.imageHeight || '200'}
                          onChange={e => updateBlockSettings(activeBlock.id, { imageHeight: e.target.value })}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showTitle !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showTitle: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Post Title</span>
                      </label>
                    </div>

                    {activeBlock.settings.showTitle !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Title Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.titleColor || '#ffffff'}
                              onChange={e => updateBlockSettings(activeBlock.id, { titleColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.titleColor && activeBlock.settings.titleColor.startsWith('#') ? activeBlock.settings.titleColor : '#ffffff'}
                              onChange={e => updateBlockSettings(activeBlock.id, { titleColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Title Font Size (px)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.titleFontSize || ''}
                            onChange={e => updateBlockSettings(activeBlock.id, { titleFontSize: e.target.value })}
                            placeholder="Inherited title size"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showExcerpt !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showExcerpt: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Excerpt Content</span>
                      </label>
                    </div>

                    {activeBlock.settings.showExcerpt !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Length (chars)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.excerptLength || '100'}
                            onChange={e => updateBlockSettings(activeBlock.id, { excerptLength: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Font Size (px)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={activeBlock.settings.excerptFontSize || ''}
                            onChange={e => updateBlockSettings(activeBlock.id, { excerptFontSize: e.target.value })}
                            placeholder="Inherited body size"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Excerpt Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.excerptColor || '#9ca3af'}
                              onChange={e => updateBlockSettings(activeBlock.id, { excerptColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.excerptColor && activeBlock.settings.excerptColor.startsWith('#') ? activeBlock.settings.excerptColor : '#9ca3af'}
                              onChange={e => updateBlockSettings(activeBlock.id, { excerptColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showMeta !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showMeta: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Meta (Date & Author)</span>
                      </label>
                    </div>

                    {activeBlock.settings.showMeta !== false && (
                      <div className="form-group" style={{ marginBottom: '12px', marginLeft: '24px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Meta Color</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            className="form-control hex-input"
                            value={activeBlock.settings.metaColor || '#6b7280'}
                            onChange={e => updateBlockSettings(activeBlock.id, { metaColor: e.target.value })}
                            style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                          />
                          <input
                            type="color"
                            value={activeBlock.settings.metaColor && activeBlock.settings.metaColor.startsWith('#') ? activeBlock.settings.metaColor : '#6b7280'}
                            onChange={e => updateBlockSettings(activeBlock.id, { metaColor: e.target.value })}
                            style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={activeBlock.settings.showButton !== false}
                          onChange={e => updateBlockSettings(activeBlock.id, { showButton: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Show Action Button</span>
                      </label>
                    </div>

                    {activeBlock.settings.showButton !== false && (
                      <>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Button Text</label>
                          <input
                            type="text"
                            className="form-control"
                            value={activeBlock.settings.buttonText || 'View Event'}
                            onChange={e => updateBlockSettings(activeBlock.id, { buttonText: e.target.value })}
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Button Color</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-control hex-input"
                              value={activeBlock.settings.buttonColor || '#6366f1'}
                              onChange={e => updateBlockSettings(activeBlock.id, { buttonColor: e.target.value })}
                              style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                            />
                            <input
                              type="color"
                              value={activeBlock.settings.buttonColor && activeBlock.settings.buttonColor.startsWith('#') ? activeBlock.settings.buttonColor : '#6366f1'}
                              onChange={e => updateBlockSettings(activeBlock.id, { buttonColor: e.target.value })}
                              style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>Border Radius (Corners)</label>
                      <select
                        value={activeBlock.settings.borderRadiusUnit || '%'}
                        onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusUnit: e.target.value })}
                        style={{ fontSize: '0.7rem', padding: '2px 4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="%">% (Percentage)</option>
                        <option value="px">px (Pixels)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TL"
                          title="Top-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopLeft !== undefined ? activeBlock.settings.borderRadiusTopLeft : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TL</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="TR"
                          title="Top-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusTopRight !== undefined ? activeBlock.settings.borderRadiusTopRight : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusTopRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>TR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BR"
                          title="Bottom-Right Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomRight !== undefined ? activeBlock.settings.borderRadiusBottomRight : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomRight: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BR</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          placeholder="BL"
                          title="Bottom-Left Corner"
                          className="form-control"
                          value={activeBlock.settings.borderRadiusBottomLeft !== undefined ? activeBlock.settings.borderRadiusBottomLeft : (activeBlock.settings.borderRadius || '12')}
                          onChange={e => updateBlockSettings(activeBlock.id, { borderRadiusBottomLeft: e.target.value })}
                          style={{ fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}
                        />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '2px' }}>BL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ICON BOX MARQUEE SETTINGS */}
              {activeBlock.type === 'icon_box_marquee' && (
                <div className="settings-fields">
                  {/* Items list */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ margin: '0', fontWeight: 'bold' }}>Marquee Items</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                        onClick={() => {
                          const currentItems = activeBlock.settings.items || [];
                          const updated = [...currentItems, { id: `m-${Date.now()}`, text: 'New Highlight', iconType: 'lucide', icon: 'Star', customUrl: '' }];
                          updateBlockSettings(activeBlock.id, { items: updated });
                        }}
                      >
                        <Plus size={10} style={{ marginRight: '2px' }} />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                      {(activeBlock.settings.items || []).map((item, idx) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <select
                              value={item.iconType || 'lucide'}
                              onChange={e => {
                                const newItems = [...activeBlock.settings.items];
                                newItems[idx] = { ...item, iconType: e.target.value };
                                updateBlockSettings(activeBlock.id, { items: newItems });
                              }}
                              className="form-control"
                              style={{ width: '90px', fontSize: '0.75rem', padding: '3px' }}
                            >
                              <option value="lucide">Lucide Icon</option>
                              <option value="custom">SVG / Image</option>
                            </select>

                            {item.iconType === 'custom' ? (
                              <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                                <input
                                  type="text"
                                  placeholder="SVG/Image URL..."
                                  value={item.customUrl || ''}
                                  onChange={e => {
                                    const newItems = [...activeBlock.settings.items];
                                    newItems[idx] = { ...item, customUrl: e.target.value };
                                    updateBlockSettings(activeBlock.id, { items: newItems });
                                  }}
                                  className="form-control"
                                  style={{ fontSize: '0.75rem', padding: '3px 6px', flex: 1 }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                                  onClick={() => {
                                    setMediaSelectionContext('marquee_icon_select');
                                    setActiveMarqueeItemId(item.id);
                                    setMediaModalOpen(true);
                                  }}
                                >
                                  Upload
                                </button>
                              </div>
                            ) : (
                              <select
                                value={item.icon || 'Star'}
                                onChange={e => {
                                  const newItems = [...activeBlock.settings.items];
                                  newItems[idx] = { ...item, icon: e.target.value };
                                  updateBlockSettings(activeBlock.id, { items: newItems });
                                }}
                                className="form-control"
                                style={{ flex: 1, fontSize: '0.75rem', padding: '3px' }}
                              >
                                <option value="Star">Star</option>
                                <option value="Check">Check</option>
                                <option value="Phone">Phone</option>
                                <option value="Mail">Mail</option>
                                <option value="MapPin">Map Pin</option>
                                <option value="Globe">Globe</option>
                                <option value="Layers">Layers</option>
                                <option value="Package">Package</option>
                                <option value="Heart">Heart</option>
                                <option value="Smile">Smile</option>
                                <option value="Shield">Shield</option>
                                <option value="Activity">Activity</option>
                                <option value="Info">Info</option>
                              </select>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const updated = activeBlock.settings.items.filter(x => x.id !== item.id);
                                updateBlockSettings(activeBlock.id, { items: updated });
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Text Description..."
                            value={item.text}
                            onChange={e => {
                              const newItems = [...activeBlock.settings.items];
                              newItems[idx] = { ...item, text: e.target.value };
                              updateBlockSettings(activeBlock.id, { items: newItems });
                            }}
                            className="form-control"
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marquee settings */}
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Scroll Duration / Speed (s): {activeBlock.settings.speed || '30'}s</label>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      className="form-control-range"
                      value={activeBlock.settings.speed || '30'}
                      onChange={e => updateBlockSettings(activeBlock.id, { speed: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Scroll Direction</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.direction || 'left'}
                      onChange={e => updateBlockSettings(activeBlock.id, { direction: e.target.value })}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <option value="left">Left to Right (Scroll Left)</option>
                      <option value="right">Right to Left (Scroll Right)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.pauseOnHover !== false}
                        onChange={e => updateBlockSettings(activeBlock.id, { pauseOnHover: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.85rem' }}>Pause On Hover</span>
                    </label>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Spacing / Item Gap: {activeBlock.settings.gap !== undefined ? activeBlock.settings.gap : '40'}px</label>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      className="form-control-range"
                      value={activeBlock.settings.gap !== undefined ? activeBlock.settings.gap : '40'}
                      onChange={e => updateBlockSettings(activeBlock.id, { gap: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  {/* Colors and styling */}
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control hex-input"
                        placeholder="transparent"
                        value={activeBlock.settings.backgroundColor !== undefined ? activeBlock.settings.backgroundColor : 'transparent'}
                        onChange={e => updateBlockSettings(activeBlock.id, { backgroundColor: e.target.value })}
                        style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                      />
                      <input
                        type="color"
                        value={activeBlock.settings.backgroundColor && activeBlock.settings.backgroundColor.startsWith('#') ? activeBlock.settings.backgroundColor : '#1f2937'}
                        onChange={e => updateBlockSettings(activeBlock.id, { backgroundColor: e.target.value })}
                        style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Text Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control hex-input"
                        value={activeBlock.settings.textColor || '#ffffff'}
                        onChange={e => updateBlockSettings(activeBlock.id, { textColor: e.target.value })}
                        style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                      />
                      <input
                        type="color"
                        value={activeBlock.settings.textColor && activeBlock.settings.textColor.startsWith('#') ? activeBlock.settings.textColor : '#ffffff'}
                        onChange={e => updateBlockSettings(activeBlock.id, { textColor: e.target.value })}
                        style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Icon Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control hex-input"
                        value={activeBlock.settings.iconColor || '#6366f1'}
                        onChange={e => updateBlockSettings(activeBlock.id, { iconColor: e.target.value })}
                        style={{ width: '100px', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', textAlign: 'center' }}
                      />
                      <input
                        type="color"
                        value={activeBlock.settings.iconColor && activeBlock.settings.iconColor.startsWith('#') ? activeBlock.settings.iconColor : '#6366f1'}
                        onChange={e => updateBlockSettings(activeBlock.id, { iconColor: e.target.value })}
                        style={{ width: '28px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Icon Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.iconSize || '20'}
                      onChange={e => updateBlockSettings(activeBlock.id, { iconSize: e.target.value })}
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Text Font Size (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBlock.settings.fontSize || '14'}
                      onChange={e => updateBlockSettings(activeBlock.id, { fontSize: e.target.value })}
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              )}

              {/* IMAGE SETTINGS */}
              {activeBlock.type === 'image' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Image Source</label>
                    {activeBlock.settings.url && (
                      <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '8px', textAlign: 'center' }}>
                        <img src={activeBlock.settings.url} alt="Image preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                      onClick={() => setMediaModalOpen(true)}
                    >
                      <UploadCloud size={14} />
                      <span>Select Image from Library</span>
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Width (%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={activeBlock.settings.width || '100'}
                      onChange={e => updateBlockSettings(activeBlock.id, { width: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>10%</span>
                      <span>{activeBlock.settings.width || '100'}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTON SETTINGS */}
              {activeBlock.type === 'button' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Button Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeBlock.settings.text}
                      onChange={e => updateBlockSettings(activeBlock.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Button URL / Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeBlock.settings.url}
                      onChange={e => updateBlockSettings(activeBlock.id, { url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alignment</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.align}
                      onChange={e => updateBlockSettings(activeBlock.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Button Type</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.btnType || 'default'}
                      onChange={e => updateBlockSettings(activeBlock.id, { btnType: e.target.value })}
                    >
                      <option value="default">Default (Primary)</option>
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Emerald)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="danger">Danger (Rose)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Button Style</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.btnStyle || 'solid'}
                      onChange={e => updateBlockSettings(activeBlock.id, { btnStyle: e.target.value })}
                    >
                      <option value="solid">Solid (Filled)</option>
                      <option value="outline">Outline (Ghost)</option>
                      <option value="flat">Text Link (Flat)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DIVIDER SETTINGS */}
              {activeBlock.type === 'divider' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Height Spacer (px)</label>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={activeBlock.settings.height || '30'}
                      onChange={e => updateBlockSettings(activeBlock.id, { height: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>10px</span>
                      <span>{activeBlock.settings.height || '30'}px</span>
                      <span>120px</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={activeBlock.settings.showLine}
                        onChange={e => updateBlockSettings(activeBlock.id, { showLine: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span>Show Divider Line</span>
                    </label>
                  </div>

                  {activeBlock.settings.showLine && (
                    <div className="form-group">
                      <label className="form-label">Line Color</label>
                      <input
                        type="color"
                        value={activeBlock.settings.lineColor || 'rgba(255,255,255,0.08)'}
                        onChange={e => updateBlockSettings(activeBlock.id, { lineColor: e.target.value })}
                        style={{ width: '100%', height: '34px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ALERT SETTINGS */}
              {activeBlock.type === 'alert' && (
                <div className="settings-fields">
                  <div className="form-group">
                    <label className="form-label">Notification Text</label>
                    <textarea
                      className="form-control"
                      value={activeBlock.settings.text}
                      onChange={e => updateBlockSettings(activeBlock.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alert Type Theme</label>
                    <select
                      className="form-control"
                      value={activeBlock.settings.alertType}
                      onChange={e => updateBlockSettings(activeBlock.id, { alertType: e.target.value })}
                    >
                      <option value="success">Success Green</option>
                      <option value="info">Info Indigo</option>
                      <option value="warning">Warning Orange</option>
                      <option value="danger">Danger Red</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          ) : (
                <div className="settings-fields" style={{ padding: '16px 20px' }}>
                  {renderStyleSettings(
                    activeBlock.type === 'column' || activeBlock.type === 'slide'
                      ? (activeBlock.settings.style || {})
                      : (activeBlock.settings.customStyle || {}),
                    (key, val) => {
                      if (activeBlock.type === 'column' || activeBlock.type === 'slide') {
                        const currentStyle = activeBlock.settings.style || {};
                        updateBlockSettings(activeBlock.id, {
                          style: {
                            ...currentStyle,
                            [key]: val
                          }
                        });
                      } else {
                        const currentStyle = activeBlock.settings.customStyle || {};
                        updateBlockSettings(activeBlock.id, {
                          customStyle: {
                            ...currentStyle,
                            [key]: val
                          }
                        });
                      }
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <MediaLibraryModal 
          isOpen={mediaModalOpen}
          onClose={() => setMediaModalOpen(false)}
          onSelect={(asset) => {
            if (activeSlideStyleId) {
              updateSlideStyle(activeSlideStyleId, 'backgroundImage', asset.url);
            } else if (mediaSelectionContext === 'bg_image') {
              if (activeBlock?.type === 'column') {
                const currentStyle = activeBlock.settings.style || {};
                updateBlockSettings(activeBlock.id, {
                  style: {
                    ...currentStyle,
                    backgroundImage: asset.url
                  }
                });
              } else {
                const currentStyle = activeBlock.settings.customStyle || {};
                updateBlockSettings(activeBlock.id, {
                  customStyle: {
                    ...currentStyle,
                    backgroundImage: asset.url
                  }
                });
              }
            } else if (mediaSelectionContext === 'carousel_add') {
              const currentImages = activeBlock?.settings?.images || [];
              updateBlockSettings(activeBlock.id, {
                images: [
                  ...currentImages,
                  { id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, url: asset.url, caption: asset.name || '' }
                ]
              });
            } else if (mediaSelectionContext === 'marquee_icon_select') {
              const currentItems = activeBlock?.settings?.items || [];
              const updated = currentItems.map(item => {
                if (item.id === activeMarqueeItemId) {
                  return { ...item, customUrl: asset.url };
                }
                return item;
              });
              updateBlockSettings(activeBlock.id, { items: updated });
            } else {
              updateBlockSettings(activeBlock.id, { url: asset.url });
            }
            setMediaModalOpen(false);
          }}
        />
      </aside>

      {/* CANVAS MAIN CONTAINER (WITH DEVICE RENDER FRAMING) */}
      <div className="builder-canvas-wrapper">
        {/* RESPONSIVE PREVIEW CONTROLLER */}
        <div className="responsive-preview-bar">
          <button 
            type="button" 
            title="Desktop Mode"
            className={`preview-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('desktop')}
          >
            <Monitor size={15} />
            <span>Desktop</span>
          </button>
          <button 
            type="button" 
            title="Tablet Mode"
            className={`preview-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('tablet')}
          >
            <TabletIcon size={15} />
            <span>Tablet</span>
          </button>
          <button 
            type="button" 
            title="Mobile Mode"
            className={`preview-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobile')}
          >
            <Smartphone size={15} />
            <span>Mobile</span>
          </button>
        </div>

        {/* DYNAMIC CANVAS AREA */}
        <div className={`builder-canvas-area device-${previewDevice}`}>
          {blocks.length === 0 ? (
            <div className="canvas-placeholder">
              <div className="placeholder-icon">
                <Layers size={36} />
              </div>
              <h3>Your Visual Canvas is Empty</h3>
              <p style={{ marginBottom: '20px' }}>Select widgets from the sidebar or insert a Layout Section to arrange columns.</p>
              {renderCanvasEndControls()}
            </div>
          ) : (
            <div className="canvas-blocks">
              <DropZone sectionId="root" colIdx={-1} index={0} onMove={(draggedId) => handleMoveRootBlock(draggedId, 0)} />
              {blocks.map((block, idx) => {
                const isActive = block.id === activeBlockId;
                
                // RENDER BLOCKS
                return (
                  <React.Fragment key={block.id}>
                    {renderBlockRow(block, idx, isActive, false, null, null)}
                    <DropZone sectionId="root" colIdx={-1} index={idx + 1} onMove={(draggedId) => handleMoveRootBlock(draggedId, idx + 1)} />
                  </React.Fragment>
                );
              })}
              {renderCanvasEndControls()}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

    <style>{`
        .builder-back-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .builder-back-btn:hover {
          color: #fff;
          border-color: var(--color-primary);
          background-color: var(--bg-tertiary);
        }

        .page-builder-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          height: calc(100vh - 60px);
          background-color: var(--bg-secondary);
        }

        /* Sidebar Styling */
        .builder-sidebar {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 130px);
          position: sticky;
          top: 90px;
          overflow: hidden;
          z-index: 10;
        }
        .sidebar-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
        }
        .tab-link {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.75rem;
          transition: all var(--transition-fast);
        }
        .tab-link:hover {
          color: #fff;
          background-color: rgba(255,255,255,0.02);
        }
        .tab-link.active {
          color: var(--color-primary);
          border-bottom: 2px solid var(--color-primary);
          background-color: var(--bg-secondary);
        }
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
        }
        .panel-section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .widgets-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .widget-card {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: #fff;
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
        }
        .widget-card:hover {
          background-color: var(--bg-accent);
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .widget-icon-box {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: rgba(99, 102, 241, 0.1);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .widget-name {
          display: block;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .widget-desc {
          display: block;
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 1px;
        }

        /* Settings fields */
        .panel-header-cpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-color);
        }
        .settings-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Canvas Wrapper & Preview controls */
        .builder-canvas-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          min-height: calc(100vh - 130px);
        }

        .responsive-preview-bar {
          display: flex;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 4px;
          border-radius: var(--radius-md);
          gap: 4px;
        }
        .preview-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: none;
          border: none;
          font-size: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .preview-btn:hover {
          color: #fff;
          background-color: var(--bg-tertiary);
        }
        .preview-btn.active {
          color: #fff;
          background: var(--color-primary);
        }

        /* Canvas area with device sizes */
        .builder-canvas-area {
          width: 100%;
          background-color: #ffffff;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0;
          flex: 1;
          overflow-y: auto;
          transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
          box-shadow: 0 10px 40px -15px rgba(0,0,0,0.6);
        }
        
        .builder-canvas-area.device-desktop {
          max-width: 100%;
        }
        .builder-canvas-area.device-tablet {
          max-width: 768px;
          border-color: var(--color-primary);
          border-style: solid;
        }
        .builder-canvas-area.device-mobile {
          max-width: 390px;
          border-color: var(--color-secondary);
          border-style: solid;
          padding: 16px;
        }

        .canvas-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          padding: 100px 20px;
        }
        .placeholder-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .canvas-placeholder h3 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 6px;
        }
        .canvas-placeholder p {
          font-size: 0.8rem;
          max-width: 300px;
        }

        /* Canvas blocks */
        .canvas-blocks {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .canvas-block-row {
          position: relative;
          padding: 10px;
          background-color: transparent;
          border: 1px dashed transparent;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .canvas-block-row:hover {
          border-color: rgba(99, 102, 241, 0.45);
          background-color: rgba(99, 102, 241, 0.015);
        }
        .canvas-block-row.active {
          border-color: var(--color-primary);
          border-style: solid;
          background-color: rgba(99, 102, 241, 0.03);
          box-shadow: var(--glow-primary);
        }

        /* Hover actions toolbar */
        .block-toolbar {
          position: absolute;
          top: -12px;
          right: 12px;
          display: none;
          align-items: center;
          gap: 6px;
          z-index: 100;
        }
        .canvas-block-row:hover > .block-toolbar,
        .canvas-block-row.active > .block-toolbar {
          display: flex;
        }
        .block-label-badge {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.6rem;
          text-transform: uppercase;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
        }
        .block-toolbar-actions {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          display: flex;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .block-toolbar-actions button {
          background: none;
          border: none;
          border-right: 1px solid var(--border-color);
          padding: 4px 6px;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .block-toolbar-actions button:last-child {
          border-right: none;
        }
        .block-toolbar-actions button:hover:not(:disabled) {
          color: #fff;
          background-color: var(--bg-accent);
        }
        .block-toolbar-actions button:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .block-toolbar-actions button.btn-delete:hover {
          background-color: var(--color-danger);
          color: #fff;
        }

        /* Section Layout Canvas */
        .builder-section-columns {
          display: grid;
          width: 100%;
        }
        .builder-column-box {
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: var(--radius-sm);
          padding: 0px;
          background-color: transparent;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .builder-column-box:hover {
          border-color: rgba(99, 102, 241, 0.3);
          background-color: rgba(99, 102, 241, 0.005);
        }
        .column-placeholder-clean {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          background-color: rgba(255, 255, 255, 0.01);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .column-placeholder-clean:hover {
          border-color: var(--color-primary);
          background-color: rgba(99, 102, 241, 0.04);
        }
        .column-placeholder-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.35);
          transition: all 0.2s ease;
        }
        .column-placeholder-clean:hover .column-placeholder-icon {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background-color: rgba(99, 102, 241, 0.08);
          transform: scale(1.08);
        }

        /* Sub Add Button styling */
        .add-widget-dropdown-container {
          position: relative;
          margin-top: auto;
          padding-top: 8px;
        }
        .btn-add-sub-widget {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 100%;
          padding: 6px;
          border: 1px dashed var(--border-color);
          background: rgba(255,255,255,0.01);
          color: var(--text-secondary);
          font-size: 0.7rem;
          font-weight: 500;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-add-sub-widget:hover {
          border-color: var(--color-primary);
          color: #fff;
          background-color: var(--bg-accent);
        }
        .sub-widget-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 25px rgba(0,0,0,0.8);
          z-index: 9999999 !important;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .builder-column-box, .builder-section-columns, .canvas-block-row, .builder-section-wrapper, .builder-slider-preview-canvas, .builder-slide-container-canvas, .canvas-block-content {
          overflow: visible !important;
        }
        .sub-widget-opt {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 10px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.75rem;
          text-align: left;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .sub-widget-opt:hover {
          background-color: var(--bg-accent);
          color: #fff;
        }
      `}</style>
    </>,
    document.body
  );

  function renderCanvasEndControls() {
    return (
      <div 
        className="canvas-end-controls"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '30px auto',
          padding: '20px',
          border: '2px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.01)',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            type="button"
            title="Add Layout Section"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'transform 0.2s'
            }}
            onClick={() => addBlockToRoot('section')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={18} />
          </button>

          {clipboardExists && (
            <button
              type="button"
              title="Paste Section/Element"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.2s'
              }}
              onClick={() => pasteBlockAtRoot()}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Clipboard size={16} />
            </button>
          )}
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {clipboardExists ? 'Add Section or Paste Element' : 'Add New Section'}
        </span>
      </div>
    );
  };

  // Helper block renderer (recursive renderer)
  function renderBlockRow(block, idx, isActive, isNested = false, sectionId = null, colIdx = null) {
    let previewElement = null;
    const { settings = {} } = block;

    const renderLucideIcon = (iconName, props) => {
      const iconsMap = {
        Check,
        Star,
        Phone,
        Mail,
        MapPin,
        Globe,
        Layers,
        Package
      };
      const SelectedIcon = iconsMap[iconName] || Star;
      return <SelectedIcon {...props} />;
    };

    if (block.type === 'heading') {
      const HeaderTag = settings.size || 'h2';
      
      // Resolve responsive font size
      let customFontSize = '';
      if (previewDevice === 'mobile') {
        customFontSize = settings.fontSize_mobile || settings.fontSize_desktop;
      } else if (previewDevice === 'tablet') {
        customFontSize = settings.fontSize_tablet || settings.fontSize_desktop;
      } else {
        customFontSize = settings.fontSize_desktop;
      }

      const styleObj = {
        textAlign: settings.align || 'left',
        color: settings.color || '#fff',
        margin: '0',
        wordBreak: 'break-word',
        lineHeight: '1.2',
        fontFamily: settings.fontFamily || 'inherit'
      };

      if (customFontSize) {
        styleObj.fontSize = `${customFontSize}px`;
      }

      previewElement = (
        <HeaderTag style={styleObj}>
          {settings.text || 'Heading Block'}
        </HeaderTag>
      );
    }

    else if (block.type === 'text') {
      let customFontSize = '';
      if (previewDevice === 'mobile') {
        customFontSize = settings.fontSize_mobile || settings.fontSize_tablet || settings.fontSize_desktop || settings.size || '16';
      } else if (previewDevice === 'tablet') {
        customFontSize = settings.fontSize_tablet || settings.fontSize_desktop || settings.size || '16';
      } else {
        customFontSize = settings.fontSize_desktop || settings.size || '16';
      }

      previewElement = (
        <p style={{ 
          textAlign: settings.align || 'left', 
          color: settings.color || '#9ca3af', 
          fontSize: `${customFontSize}px`, 
          fontFamily: settings.fontFamily || 'inherit',
          margin: '0', 
          lineHeight: '1.6', 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word' 
        }}>
          {settings.text || 'Paragraph Text Block'}
        </p>
      );
    }

    else if (block.type === 'image') {
      previewElement = (
        <div style={{ display: 'flex', justifyContent: settings.align === 'left' ? 'flex-start' : settings.align === 'right' ? 'flex-end' : 'center' }}>
          {settings.url ? (
            <img src={settings.url} alt="Canvas element" style={{ width: `${settings.width || '100'}%`, height: 'auto', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }} />
          ) : (
            <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No image loaded
            </div>
          )}
        </div>
      );
    }

    else if (block.type === 'button') {
      const finalBtnType = settings.btnType || (settings.style === 'danger' ? 'danger' : settings.style === 'success' ? 'success' : 'default');
      const finalBtnStyle = settings.btnStyle || (settings.style === 'secondary' ? 'outline' : 'solid');

      const colors = {
        default: { main: '#6366f1', hover: '#4f46e5', text: '#ffffff' },
        info: { main: '#0ea5e9', hover: '#0284c7', text: '#ffffff' },
        success: { main: '#10b981', hover: '#059669', text: '#ffffff' },
        warning: { main: '#f59e0b', hover: '#d97706', text: '#ffffff' },
        danger: { main: '#f43f5e', hover: '#e11d48', text: '#ffffff' }
      };

      const scheme = colors[finalBtnType] || colors.default;
      const btnClass = `btn btn-custom-${block.id}`;

      const presetStyle = {
        padding: '10px 24px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '0.875rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        borderWidth: '2px',
        borderStyle: 'solid',
        backgroundColor: finalBtnStyle === 'solid' ? scheme.main : 'transparent',
        borderColor: finalBtnStyle === 'outline' ? scheme.main : 'transparent',
        color: finalBtnStyle === 'solid' ? scheme.text : scheme.main,
        paddingLeft: finalBtnStyle === 'flat' ? '0px' : '24px',
        paddingRight: finalBtnStyle === 'flat' ? '0px' : '24px',
        transition: 'all 0.2s ease-in-out'
      };

      const customStyle = getElementorStyles(settings.customStyle || {}, previewDevice);

      previewElement = (
        <div style={{ display: 'flex', justifyContent: settings.align === 'left' ? 'flex-start' : settings.align === 'right' ? 'flex-end' : 'center' }}>
          <style>{`
            .btn-preview-${block.id} {
              transition: all 0.2s ease-in-out !important;
            }
            .btn-preview-${block.id}:hover {
              background-color: ${finalBtnStyle === 'solid' ? scheme.hover : finalBtnStyle === 'outline' ? scheme.main : 'transparent'} !important;
              color: ${finalBtnStyle === 'outline' ? '#ffffff' : finalBtnStyle === 'flat' ? scheme.hover : '#ffffff'} !important;
              border-color: ${finalBtnStyle === 'outline' ? scheme.main : 'transparent'} !important;
              text-decoration: ${finalBtnStyle === 'flat' ? 'underline' : 'none'} !important;
            }
          `}</style>
          <a 
            href={settings.url || '#'} 
            onClick={e => e.preventDefault()} 
            className={`${btnClass} btn-preview-${block.id}`} 
            style={{ ...presetStyle, ...customStyle, width: undefined }}
          >
            {settings.text || 'Button Link'}
          </a>
        </div>
      );
    }

    else if (block.type === 'divider') {
      previewElement = (
        <div style={{ height: `${settings.height || '30'}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {settings.showLine && (
            <hr style={{ width: '100%', border: 'none', borderTop: `1px solid ${settings.lineColor || 'rgba(255,255,255,0.08)'}` }} />
          )}
        </div>
      );
    }

    else if (block.type === 'alert') {
      let alertColor = 'rgba(99, 102, 241, 0.1)';
      let textColor = '#818cf8';
      let borderColor = 'rgba(99, 102, 241, 0.2)';

      if (settings.alertType === 'success') {
        alertColor = 'rgba(16, 185, 129, 0.1)';
        textColor = '#34d399';
        borderColor = 'rgba(16, 185, 129, 0.2)';
      } else if (settings.alertType === 'warning') {
        alertColor = 'rgba(245, 158, 11, 0.1)';
        textColor = '#fbbf24';
        borderColor = 'rgba(245, 158, 11, 0.2)';
      } else if (settings.alertType === 'danger') {
        alertColor = 'rgba(239, 68, 68, 0.1)';
        textColor = '#f87171';
        borderColor = 'rgba(239, 68, 68, 0.2)';
      }

      previewElement = (
        <div style={{ padding: '12px 16px', backgroundColor: alertColor, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} />
          <span>{settings.text || 'Alert notification banner.'}</span>
        </div>
      );
    }

    else if (block.type === 'logo') {
      const logoSrc = settings.url || appearance?.site_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60';
      previewElement = (
        <div style={{ display: 'flex', justifyContent: settings.align === 'left' ? 'flex-start' : settings.align === 'right' ? 'flex-end' : 'center' }}>
          <img src={logoSrc} alt="Site Logo" style={{ width: `${settings.width || '30'}%`, height: 'auto', objectFit: 'contain' }} />
        </div>
      );
    }

    else if (block.type === 'menu') {
      const selectedMenu = (appearance?.menus || []).find(m => m.id === settings.menuId);
      const menuItems = selectedMenu?.items || [];
      previewElement = (
        <div style={{ display: 'flex', justifyContent: settings.align === 'left' ? 'flex-start' : settings.align === 'right' ? 'flex-end' : 'center', width: '100%' }}>
          {menuItems.length === 0 ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No menu selected / empty menu</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              {menuItems.map(item => (
                <span 
                  key={item.id} 
                  style={{ 
                    fontSize: `${settings.fontSize || '15'}px`, 
                    color: settings.color || '#fff', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    fontFamily: settings.fontFamily || 'inherit',
                    marginLeft: `${item.indent * 10}px` 
                  }}
                >
                  {item.title}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    else if (block.type === 'icon_box_marquee') {
      const items = settings.items || [];
      const speed = parseInt(settings.speed || '30');
      const direction = settings.direction || 'left';
      const gap = parseInt(settings.gap !== undefined ? settings.gap : '40');
      const iconSize = parseInt(settings.iconSize || '20');
      const fontSize = parseInt(settings.fontSize || '14');
      const bg = settings.backgroundColor || 'transparent';
      const textCol = settings.textColor || '#ffffff';
      const iconCol = settings.iconColor || '#6366f1';
      const pauseOnHover = settings.pauseOnHover !== false;
      const customMarqueeStyles = getElementorStyles(settings.customStyle || {}, previewDevice);

      const marqueeList = [...items, ...items];
      const animName = `marquee-${block.id}`;
      const keyframes = direction === 'left' 
        ? `@keyframes ${animName} { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`
        : `@keyframes ${animName} { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }`;

      previewElement = (
        <div style={{ width: '100%', overflow: 'hidden', background: bg, padding: '12px 0', position: 'relative', ...customMarqueeStyles }}>
          <style>{`
            ${keyframes}
            .marquee-track-${block.id} {
              display: flex;
              width: max-content;
              animation: ${animName} ${speed}s linear infinite;
            }
            ${pauseOnHover ? `.marquee-track-${block.id}:hover { animation-play-state: paused; }` : ''}
          `}</style>
          
          <div className={`marquee-track-${block.id}`}>
            {marqueeList.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  paddingRight: `${gap}px`,
                  color: textCol,
                  fontSize: `${fontSize}px`,
                  whiteSpace: 'nowrap'
                }}
              >
                {item.iconType === 'custom' ? (
                  item.customUrl ? (
                    <img 
                      src={item.customUrl} 
                      alt="" 
                      style={{ width: `${iconSize}px`, height: `${iconSize}px`, objectFit: 'contain' }} 
                    />
                  ) : null
                ) : (
                  <span style={{ color: iconCol, display: 'flex', alignItems: 'center' }}>
                    {renderLucideIcon(item.icon || 'Star', { size: iconSize })}
                  </span>
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    else if (block.type === 'iconlist') {
      const listItems = settings.items || [];
      const customIconlistStyles = getElementorStyles(settings.customStyle || {}, previewDevice);
      previewElement = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${settings.gap || '10'}px`, ...customIconlistStyles }}>
          {listItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: settings.iconColor || '#6366f1', display: 'flex', alignItems: 'center' }}>
                {renderLucideIcon(item.icon, { size: parseInt(settings.iconSize || '16') })}
              </span>
              <span style={{ fontSize: `${settings.fontSize || '14'}px`, color: customIconlistStyles.color || 'var(--text-secondary)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      );
    }

    else if (block.type === 'iconbox') {
      const isSquareBg = settings.iconBg === 'square';
      const isCircleBg = settings.iconBg === 'circle';
      const iconSizeVal = parseInt(settings.iconSize || '36');
      
      const iconWrapperStyle = (isSquareBg || isCircleBg) ? {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${iconSizeVal * 1.6}px`,
        height: `${iconSizeVal * 1.6}px`,
        borderRadius: isCircleBg ? '50%' : '8px',
        backgroundColor: `${settings.iconColor || '#6366f1'}15`, // transparent tint
        color: settings.iconColor || '#6366f1',
        marginBottom: '12px'
      } : {
        color: settings.iconColor || '#6366f1',
        display: 'inline-flex',
        marginBottom: '12px'
      };

      previewElement = (
        <div style={{ textAlign: settings.align || 'center', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: settings.align === 'left' ? 'flex-start' : settings.align === 'right' ? 'flex-end' : 'center' }}>
          <div style={iconWrapperStyle}>
            {renderLucideIcon(settings.icon, { size: iconSizeVal })}
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#fff', fontWeight: '600' }}>{settings.title}</h4>
          <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{settings.description}</p>
        </div>
      );
    }

    else if (block.type === 'slider') {
      const slides = settings.slides || [];
      const activeIdx = activeSlides[block.id] || 0;
      const currentSlide = slides[activeIdx];

      const customSliderStyles = getElementorStyles(settings.customStyle || {}, previewDevice);
      previewElement = (
        <div 
          className="builder-slider-preview-canvas" 
          style={{ 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '8px', 
            padding: '16px', 
            width: '100%', 
            position: 'relative',
            overflow: 'hidden',
            ...customSliderStyles
          }}
        >
          {settings.customStyle?.overlayColor && (
            <div 
              className="slider-parent-bg-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.customStyle.overlayColor,
                opacity: settings.customStyle.overlayOpacity !== undefined ? settings.customStyle.overlayOpacity : 0.5,
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: '8px'
              }}
            />
          )}

          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            {/* Active slide picker dots / tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Slide:</span>
              {slides.map((slide, sIdx) => (
                <button
                  key={slide.id || sIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlides(prev => ({ ...prev, [block.id]: sIdx }));
                  }}
                  style={{
                    padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px',
                    border: '1px solid',
                    borderColor: activeIdx === sIdx ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                    background: activeIdx === sIdx ? 'rgba(99, 102, 241, 0.15)' : 'none',
                    color: activeIdx === sIdx ? 'var(--color-primary)' : '#ccc',
                    cursor: 'pointer'
                  }}
                >
                  {sIdx + 1}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Autoplay: {settings.autoplay ? `On (${settings.autoplaySpeed || 5000}ms)` : 'Off'}
            </span>
          </div>

          {/* Active Slide Canvas Drop Zone */}
          {currentSlide ? (
            <div 
              className="builder-slide-container-canvas"
              style={{
                padding: '40px 60px',
                borderRadius: '6px',
                minHeight: settings.height || '400px',
                height: settings.height || '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                ...getElementorStyles(currentSlide.style || currentSlide.customStyle || {}, previewDevice),
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {(currentSlide.style?.overlayColor || currentSlide.customStyle?.overlayColor) && (
                <div 
                  className="slide-bg-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: currentSlide.style?.overlayColor || currentSlide.customStyle?.overlayColor,
                    opacity: (currentSlide.style?.overlayOpacity !== undefined ? currentSlide.style.overlayOpacity : currentSlide.customStyle?.overlayOpacity) !== undefined ? (currentSlide.style?.overlayOpacity !== undefined ? currentSlide.style.overlayOpacity : currentSlide.customStyle?.overlayOpacity) : 0.5,
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '6px'
                  }}
                />
              )}

              <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                {(currentSlide.blocks || []).length === 0 ? (
                  <div 
                    className="column-placeholder-clean"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const draggedId = e.dataTransfer.getData('text/plain');
                      handleMoveBlockToSlide(draggedId, block.id, activeIdx, 0);
                    }}
                  >
                    <div className="column-placeholder-icon">
                      <Plus size={14} />
                    </div>
                  </div>
                ) : (
                  <>
                    <DropZone sectionId={block.id} colIdx={activeIdx} index={0} onMove={handleMoveBlockToSlide} />
                    {(currentSlide.blocks || []).map((subBlock, sbIdx) => {
                      const isSubActive = subBlock.id === activeBlockId;
                      return (
                        <React.Fragment key={subBlock.id}>
                          {renderBlockRow(subBlock, sbIdx, isSubActive, true, block.id, activeIdx)}
                          <DropZone sectionId={block.id} colIdx={activeIdx} index={sbIdx + 1} onMove={handleMoveBlockToSlide} />
                        </React.Fragment>
                      );
                    })}
                  </>
                )}

                {/* Slide block creation trigger */}
                <div style={{ marginTop: '12px', textAlign: 'center', position: 'relative' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.65rem', height: '24px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownCol(
                        openDropdownCol?.sectionId === block.id && openDropdownCol?.colIdx === activeIdx
                          ? null
                          : { sectionId: block.id, colIdx: activeIdx, isSlide: true }
                      );
                    }}
                  >
                    <Plus size={10} style={{ marginRight: '3px' }} />
                    <span>Add Widget to Slide</span>
                  </button>

                  {openDropdownCol?.sectionId === block.id && openDropdownCol?.colIdx === activeIdx && openDropdownCol?.isSlide && (
                    <div className="sub-widget-dropdown fade-in" style={{ left: '50%', transform: 'translateX(-50%)', top: '100%', zIndex: 1000, position: 'absolute', marginTop: '4px' }}>
                      {clipboardExists && (
                        <button
                          type="button"
                          className="sub-widget-opt"
                          style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '4px', paddingBottom: '8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            pasteBlockIntoSlide(block.id, activeIdx);
                            setOpenDropdownCol(null);
                          }}
                        >
                          <Clipboard size={12} style={{ color: 'var(--color-success)' }} />
                          <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>Paste Copied Element</span>
                        </button>
                      )}
                      {widgetsList.filter(w => w.type !== 'section' && w.type !== 'slider').map(w => {
                        const WidgetIcon = w.icon;
                        return (
                          <button
                            key={w.type}
                            type="button"
                            className="sub-widget-opt"
                            onClick={(e) => {
                              e.stopPropagation();
                              addBlockToSlide(block.id, activeIdx, w.type);
                            }}
                          >
                            <WidgetIcon size={12} style={{ color: 'var(--color-primary)' }} />
                            <span>{w.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No slides configured. Add slide in settings.
            </div>
          )}
          </div>
          {renderShapeDivider(settings.shapeDividerTop, 'top', settings.shapeDividerTopColor, settings.shapeDividerTopHeight, settings.shapeDividerTopInvert, settings.shapeDividerTopFlip)}
          {renderShapeDivider(settings.shapeDividerBottom, 'bottom', settings.shapeDividerBottomColor, settings.shapeDividerBottomHeight, settings.shapeDividerBottomInvert, settings.shapeDividerBottomFlip)}
        </div>
      );
    }

    else if (block.type === 'carousel' || block.type === 'image_only_carousel') {
      const images = settings.images || [];
      const carouselGap = `${settings.gap || '15'}px`;
      const carouselHeight = `${settings.imageHeight || '220'}px`;
      
      const unit = settings.borderRadiusUnit || (settings.borderRadius ? 'px' : '%');
      const brTopLeft = settings.borderRadiusTopLeft !== undefined ? settings.borderRadiusTopLeft : (settings.borderRadius || (unit === '%' ? '0' : '8'));
      const brTopRight = settings.borderRadiusTopRight !== undefined ? settings.borderRadiusTopRight : (settings.borderRadius || (unit === '%' ? '0' : '8'));
      const brBottomRight = settings.borderRadiusBottomRight !== undefined ? settings.borderRadiusBottomRight : (settings.borderRadius || (unit === '%' ? '0' : '8'));
      const brBottomLeft = settings.borderRadiusBottomLeft !== undefined ? settings.borderRadiusBottomLeft : (settings.borderRadius || (unit === '%' ? '0' : '8'));
      const carouselRadius = `${brTopLeft}${unit} ${brTopRight}${unit} ${brBottomRight}${unit} ${brBottomLeft}${unit}`;

      previewElement = (
        <div style={{ padding: '10px 0', width: '100%', overflowX: 'auto' }}>
          {images.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', color: 'var(--text-muted)' }}>
              No images added. Click settings to add images.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: carouselGap, paddingBottom: '8px' }}>
              {images.map((img, idx) => (
                <div 
                  key={img.id || idx} 
                  style={{ 
                    flex: `0 0 calc(100% / ${previewDevice === 'mobile' ? (settings.slidesToShowMobile || '1') : previewDevice === 'tablet' ? (settings.slidesToShowTablet || '2') : (settings.slidesToShowDesktop || '3')} - ${carouselGap})`,
                    position: 'relative',
                    borderRadius: carouselRadius,
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption || ''} 
                    style={{ 
                      width: '100%', 
                      height: carouselHeight, 
                      objectFit: 'cover' 
                    }} 
                  />
                  {block.type === 'carousel' && (img.caption || img.description) && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '8px 12px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {img.caption && <div style={{ fontSize: '0.8rem', fontWeight: '600', textAlign: 'center' }}>{img.caption}</div>}
                      {img.description && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: '1.2' }}>{img.description}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    else if (block.type === 'loop_grid') {
      previewElement = <LoopGridPreview settings={settings} previewDevice={previewDevice} />;
    }

    else if (block.type === 'loop_carousel') {
      previewElement = <LoopCarouselPreview settings={settings} previewDevice={previewDevice} />;
    }

    else if (block.type === 'section') {
      // SECTION RENDER (ROWS & COLUMNS)
      const colsList = settings.columns || [];
      const gapSpacing = `${settings.gap || '20'}px`;
      
      const getGridColsTemplate = () => {
        let n = 2;
        if (previewDevice === 'mobile') {
          n = parseInt(settings.gridColsMobile || '1');
        } else if (previewDevice === 'tablet') {
          n = parseInt(settings.gridColsTablet || settings.gridColsDesktop || '2');
        } else {
          n = parseInt(settings.gridColsDesktop || '2');
        }

        const tracks = [];
        for (let i = 0; i < n; i++) {
          const col = colsList[i];
          let trackWidth = '1';
          if (col) {
            trackWidth = previewDevice === 'mobile' 
              ? (col.width_mobile || '1') 
              : previewDevice === 'tablet' 
                ? (col.width_tablet || col.width || '1')
                : (col.width || '1');
          }
          tracks.push(`${trackWidth}fr`);
        }
        return tracks.join(' ');
      };

      const customSectionStyles = getElementorStyles(settings.customStyle || {}, previewDevice);
      const outerSectionStyles = {
        width: '100%',
        position: 'relative',
        overflow: 'hidden', // Contain shape dividers neatly
        ...customSectionStyles
      };

      const isFullWidth = settings.contentWidthMode === 'fullwidth';
      const inlineStyle = settings.layoutType === 'grid' ? {
        display: 'grid',
        gridTemplateColumns: getGridColsTemplate(),
        gap: gapSpacing,
        width: '100%',
        maxWidth: isFullWidth ? '100%' : '1200px',
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2
      } : {
        display: 'flex',
        flexDirection: settings.direction || 'row',
        gap: gapSpacing,
        justifyContent: settings.justify === 'start' ? 'flex-start' : settings.justify === 'end' ? 'flex-end' : settings.justify === 'between' ? 'space-between' : settings.justify === 'around' ? 'space-around' : 'center',
        alignItems: settings.align || 'stretch',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: isFullWidth ? '100%' : '1200px',
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2
      };

      const gapOffset = colsList.length > 1 ? (parseInt(settings.gap || '20') * (colsList.length - 1)) / colsList.length : 0;

      previewElement = (
        <div className="builder-section-wrapper" style={outerSectionStyles}>
          {renderShapeDivider(settings.shapeDividerTop, 'top', settings.shapeDividerTopColor, settings.shapeDividerTopHeight, settings.shapeDividerTopInvert, settings.shapeDividerTopFlip)}
          {renderShapeDivider(settings.shapeDividerBottom, 'bottom', settings.shapeDividerBottomColor, settings.shapeDividerBottomHeight, settings.shapeDividerBottomInvert, settings.shapeDividerBottomFlip)}
          
          {settings.customStyle?.overlayColor && (
            <div 
              className="section-bg-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.customStyle.overlayColor,
                opacity: settings.customStyle.overlayOpacity !== undefined ? settings.customStyle.overlayOpacity : 0.5,
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: settings.customStyle.borderRadius ? `${settings.customStyle.borderRadius}px` : 'inherit'
              }}
            />
          )}

          <div className="builder-section-columns" style={inlineStyle}>
            {colsList.map((col, cIdx) => {
            const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
            
            // Resolve responsive width
            let colWidth = '50';
            if (previewDevice === 'mobile') {
              colWidth = col?.width_mobile || '100';
            } else if (previewDevice === 'tablet') {
              colWidth = col?.width_tablet || col?.width || '100';
            } else {
              colWidth = col?.width || '50';
            }
            
            const isColSelected = activeBlockId === (col?.id || `col-${cIdx}`);
            const customColStyles = getElementorStyles(col?.style || {}, previewDevice);
            const colFlexStyles = col?.flexLayout ? {
              display: 'flex',
              flexDirection: col.direction || 'column',
              justifyContent: col.justify === 'start' ? 'flex-start' : col.justify === 'end' ? 'flex-end' : col.justify === 'between' ? 'space-between' : col.justify === 'around' ? 'space-around' : 'center',
              alignItems: col.align || 'stretch',
              gap: `${col.gap || '10'}px`
            } : {};

            const colStyle = {
              position: 'relative',
              ...(settings.layoutType === 'flex' ? (
                settings.direction === 'column' || colWidth === '100' ? {
                  width: '100%',
                  flex: '0 0 100%',
                  maxWidth: '100%',
                  outline: isColSelected ? '2px solid var(--color-primary)' : 'none',
                  outlineOffset: '-2px',
                  ...customColStyles
                } : {
                  flex: `0 0 calc(${colWidth}% - ${gapOffset}px)`,
                  maxWidth: `calc(${colWidth}% - ${gapOffset}px)`,
                  outline: isColSelected ? '2px solid var(--color-primary)' : 'none',
                  outlineOffset: '-2px',
                  ...customColStyles
                }
              ) : {
                outline: isColSelected ? '2px solid var(--color-primary)' : 'none',
                outlineOffset: '-2px',
                ...customColStyles
              })
            };

            const isHorizontal = col?.flexLayout && col.direction === 'row';
            const innerColContentStyle = {
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              display: col?.flexLayout ? 'flex' : 'block',
              ...(col?.flexLayout ? {
                flexDirection: col.direction || 'column',
                justifyContent: col.justify === 'start' ? 'flex-start' : col.justify === 'end' ? 'flex-end' : col.justify === 'between' ? 'space-between' : col.justify === 'around' ? 'space-around' : 'center',
                alignItems: col.align || 'stretch',
                gap: `${col.gap || '10'}px`,
                flexWrap: col.flexWrap || 'nowrap',
                flex: 1
              } : {})
            };

            return (
              <div 
                key={col?.id || `col-${cIdx}`} 
                className="builder-column-box"
                style={colStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBlockId(col?.id || `col-${cIdx}`);
                  setActiveTab('settings');
                  setSettingsSubTab('content');
                }}
              >
                {col?.style?.overlayColor && (
                  <div 
                    className="column-bg-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: col.style.overlayColor,
                      opacity: col.style.overlayOpacity !== undefined ? col.style.overlayOpacity : 0.5,
                      zIndex: 1,
                      pointerEvents: 'none',
                      borderRadius: col.style.borderRadius ? `${col.style.borderRadius}px` : 'inherit'
                    }}
                  />
                )}
                
                <div style={innerColContentStyle}>
                  {colBlocks.length === 0 ? (
                    <div 
                      className="column-placeholder-clean"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const draggedId = e.dataTransfer.getData('text/plain');
                        handleMoveBlockToColumn(draggedId, block.id, cIdx, 0);
                      }}
                    >
                      <div className="column-placeholder-icon">
                        <Plus size={14} />
                      </div>
                    </div>
                ) : (
                  <>
                    <DropZone sectionId={block.id} colIdx={cIdx} index={0} onMove={handleMoveBlockToColumn} isHorizontal={isHorizontal} />
                    {colBlocks.map((subBlock, sIdx) => {
                      const isSubActive = subBlock.id === activeBlockId;
                      return (
                        <React.Fragment key={subBlock.id}>
                          {renderBlockRow(subBlock, sIdx, isSubActive, true, block.id, cIdx)}
                          <DropZone sectionId={block.id} colIdx={cIdx} index={sIdx + 1} onMove={handleMoveBlockToColumn} isHorizontal={isHorizontal} />
                        </React.Fragment>
                      );
                    })}
                  </>
                )}

                {/* Sub Add Button widget dropdown */}
                <div className="add-widget-dropdown-container">
                  <button 
                    type="button" 
                    className="btn-add-sub-widget"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownCol(
                        openDropdownCol?.sectionId === block.id && openDropdownCol?.colIdx === cIdx 
                          ? null 
                          : { sectionId: block.id, colIdx: cIdx }
                      );
                    }}
                  >
                    <Plus size={10} />
                    <span>Add Widget</span>
                  </button>

                  {openDropdownCol?.sectionId === block.id && openDropdownCol?.colIdx === cIdx && (
                    <div className="sub-widget-dropdown fade-in">
                      {clipboardExists && (
                        <button
                          type="button"
                          className="sub-widget-opt"
                          style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '4px', paddingBottom: '8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            pasteBlockIntoColumn(block.id, cIdx);
                            setOpenDropdownCol(null);
                          }}
                        >
                          <Clipboard size={12} style={{ color: 'var(--color-success)' }} />
                          <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>Paste Copied Element</span>
                        </button>
                      )}
                      {widgetsList.map(w => {
                        const WidgetIcon = w.icon;
                        return (
                          <button
                            key={w.type}
                            type="button"
                            className="sub-widget-opt"
                            onClick={(e) => {
                              e.stopPropagation();
                              addBlockToSection(block.id, cIdx, w.type);
                            }}
                          >
                            <WidgetIcon size={12} style={{ color: 'var(--color-primary)' }} />
                            <span>{w.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    );
  }

  const customStyles = block.settings?.customStyle || {};
  const blockRowStyle = {
    padding: isNested ? '0' : (block.type === 'section' ? '8px' : '14px'),
    borderStyle: 'solid',
    cursor: 'grab',
    boxSizing: 'border-box'
  };

  // Apply custom width to the outer block row element (except layout sections)
  if (block.type !== 'section' && customStyles.width !== undefined && customStyles.width !== '') {
    blockRowStyle.width = `${customStyles.width}%`;
  }

  const hoverBC = customStyles.hover_backgroundColor;
  const hoverC = customStyles.hover_color;
  const hoverBorderC = customStyles.hover_borderColor;
  const hasHoverStyles = hoverBC || hoverC || hoverBorderC;
  const hoverSelector = block.type === 'button' ? `.hover-block-${block.id} a:hover` : `.hover-block-${block.id}:hover`;

  return (
    <div 
      key={block.id}
      className={`canvas-block-row ${isActive ? 'active' : ''}`}
      style={blockRowStyle}
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', block.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveBlockId(block.id);
        setActiveTab('settings');
      }}
    >
      {hasHoverStyles && (
        <style>{`
          ${hoverSelector} {
            ${hoverBC ? `background-color: ${hoverBC} !important;` : ''}
            ${hoverC ? `color: ${hoverC} !important;` : ''}
            ${hoverBorderC ? `border-color: ${hoverBorderC} !important;` : ''}
          }
        `}</style>
      )}

      {/* Visual block content preview */}
      <div 
        className={`canvas-block-content hover-block-${block.id}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...(block.type !== 'section' && block.type !== 'button' ? (() => {
            const styles = getElementorStyles(block.settings?.customStyle || {}, previewDevice);
            return { ...styles, width: undefined };
          })() : {})
        }}
      >
        {block.settings?.customStyle?.overlayColor && (
          <div 
            className="block-bg-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: block.settings.customStyle.overlayColor,
              opacity: block.settings.customStyle.overlayOpacity !== undefined ? block.settings.customStyle.overlayOpacity : 0.5,
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
        )}
        
        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          {previewElement}
        </div>
      </div>

        {/* Floating actions overlay toolbar */}
        <div className="block-toolbar">
          <span className="block-label-badge" style={{ backgroundColor: block.type === 'section' ? 'var(--color-primary)' : 'var(--bg-secondary)', color: '#fff' }}>
            {block.type === 'section' ? 'layout row' : block.type}
          </span>
          <div className="block-toolbar-actions">
            <button 
              type="button" 
              title="Move Up" 
              disabled={idx === 0} 
              onClick={(e) => moveBlock(block.id, 'up', e)}
            >
              <ArrowUp size={11} />
            </button>
            <button 
              type="button" 
              title="Move Down" 
              disabled={false} // recursive length is check-less here for simplicity
              onClick={(e) => moveBlock(block.id, 'down', e)}
            >
              <ArrowDown size={11} />
            </button>
            <button 
              type="button" 
              title="Edit Settings" 
              onClick={(e) => {
                e.stopPropagation();
                setActiveBlockId(block.id);
                setActiveTab('settings');
              }}
            >
              <SettingsIcon size={11} />
            </button>
            <button 
              type="button" 
              title="Copy Element" 
              onClick={(e) => copyBlock(block, e)}
            >
              <Copy size={11} />
            </button>
            <button 
              type="button" 
              title="Duplicate Element" 
              onClick={(e) => duplicateBlock(block.id, e)}
            >
              <Layers size={11} />
            </button>
            {clipboardExists && (
              <button 
                type="button" 
                title="Paste Element After" 
                onClick={(e) => pasteBlockAfter(block.id, e)}
              >
                <Clipboard size={11} style={{ color: 'var(--color-success)' }} />
              </button>
            )}
            <button 
              type="button" 
              title="Delete Element" 
              className="btn-delete"
              onClick={(e) => deleteBlock(block.id, e)}
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const fullScreenModalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'var(--bg-primary)',
  zIndex: 999999,
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden'
};

const builderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  background: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-color)',
  height: '60px',
  flexShrink: 0
};

const DropZone = ({ sectionId, colIdx, index, onMove, isHorizontal }) => {
  const [isOver, setIsOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const draggedId = e.dataTransfer.getData('text/plain');
        onMove(draggedId, sectionId, colIdx, index);
      }}
      style={isHorizontal ? {
        width: isOver ? '28px' : '8px',
        height: 'auto',
        minHeight: '40px',
        alignSelf: 'stretch',
        margin: '0 4px',
        backgroundColor: isOver ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
        border: isOver ? '1px dashed var(--color-primary)' : 'none',
        borderRadius: '4px',
        transition: 'all 0.15s ease',
        zIndex: 50
      } : {
        height: isOver ? '28px' : '6px',
        margin: '2px 0',
        backgroundColor: isOver ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
        border: isOver ? '1px dashed var(--color-primary)' : 'none',
        borderRadius: '4px',
        transition: 'all 0.15s ease',
        zIndex: 50
      }}
    />
  );
};
