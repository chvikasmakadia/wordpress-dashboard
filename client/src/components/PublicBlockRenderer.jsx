"use client";

import React from 'react';
import * as Lucide from 'lucide-react';
import { SHAPE_DIVIDERS } from './ShapeDividersData';

// Helper to dynamically resolve and render Lucide Icons by name
const renderLucideIcon = (iconName, props = {}) => {
  if (!iconName) return null;
  const IconComponent = Lucide[iconName];
  return IconComponent ? <IconComponent {...props} /> : null;
};

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
export function getElementorStyles(styleObj = {}) {
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

  // Padding (Baseline / Non-responsive fallback values)
  if (styleObj.paddingTop !== undefined && styleObj.paddingTop !== '') {
    styles.paddingTop = String(styleObj.paddingTop).includes('px') || String(styleObj.paddingTop).includes('%') ? styleObj.paddingTop : `${styleObj.paddingTop}px`;
  }
  if (styleObj.paddingRight !== undefined && styleObj.paddingRight !== '') {
    styles.paddingRight = String(styleObj.paddingRight).includes('px') || String(styleObj.paddingRight).includes('%') ? styleObj.paddingRight : `${styleObj.paddingRight}px`;
  }
  if (styleObj.paddingBottom !== undefined && styleObj.paddingBottom !== '') {
    styles.paddingBottom = String(styleObj.paddingBottom).includes('px') || String(styleObj.paddingBottom).includes('%') ? styleObj.paddingBottom : `${styleObj.paddingBottom}px`;
  }
  if (styleObj.paddingLeft !== undefined && styleObj.paddingLeft !== '') {
    styles.paddingLeft = String(styleObj.paddingLeft).includes('px') || String(styleObj.paddingLeft).includes('%') ? styleObj.paddingLeft : `${styleObj.paddingLeft}px`;
  }

  // Margin (Baseline / Non-responsive fallback values)
  if (styleObj.marginTop !== undefined && styleObj.marginTop !== '') {
    styles.marginTop = String(styleObj.marginTop).includes('px') || String(styleObj.marginTop).includes('%') ? styleObj.marginTop : `${styleObj.marginTop}px`;
  }
  if (styleObj.marginRight !== undefined && styleObj.marginRight !== '') {
    styles.marginRight = String(styleObj.marginRight).includes('px') || String(styleObj.marginRight).includes('%') ? styleObj.marginRight : `${styleObj.marginRight}px`;
  }
  if (styleObj.marginBottom !== undefined && styleObj.marginBottom !== '') {
    styles.marginBottom = String(styleObj.marginBottom).includes('px') || String(styleObj.marginBottom).includes('%') ? styleObj.marginBottom : `${styleObj.marginBottom}px`;
  }
  if (styleObj.marginLeft !== undefined && styleObj.marginLeft !== '') {
    styles.marginLeft = String(styleObj.marginLeft).includes('px') || String(styleObj.marginLeft).includes('%') ? styleObj.marginLeft : `${styleObj.marginLeft}px`;
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

export function renderResponsiveStyles(id, styleObj = {}, blockType = '', blockSettings = {}) {
  if (!styleObj || typeof styleObj !== 'object') return null;
  
  const getVal = (key, device) => {
    const suffix = device === 'desktop' ? '_desktop' : device === 'tablet' ? '_tablet' : '_mobile';
    const val = styleObj[`${key}${suffix}`] !== undefined && styleObj[`${key}${suffix}`] !== '' ? styleObj[`${key}${suffix}`] : '';
    if (val === '') return '';
    return String(val).includes('px') || String(val).includes('%') ? val : `${val}px`;
  };

  const getFallbackVal = (key, device) => {
    const val = getVal(key, device);
    if (val !== '') return val;
    if (device === 'mobile') {
      const tabVal = getVal(key, 'tablet');
      if (tabVal !== '') return tabVal;
    }
    if (device === 'tablet' || device === 'mobile') {
      const deskVal = getVal(key, 'desktop');
      if (deskVal !== '') return deskVal;
    }
    // Final fallback to default non-responsive property
    const defVal = styleObj[key] !== undefined && styleObj[key] !== '' ? styleObj[key] : '';
    if (defVal === '') return '';
    return String(defVal).includes('px') || String(defVal).includes('%') ? defVal : `${defVal}px`;
  };

  const dPT = getFallbackVal('paddingTop', 'desktop');
  const dPR = getFallbackVal('paddingRight', 'desktop');
  const dPB = getFallbackVal('paddingBottom', 'desktop');
  const dPL = getFallbackVal('paddingLeft', 'desktop');
  const dMT = getFallbackVal('marginTop', 'desktop');
  const dMR = getFallbackVal('marginRight', 'desktop');
  const dMB = getFallbackVal('marginBottom', 'desktop');
  const dML = getFallbackVal('marginLeft', 'desktop');

  const tPT = getFallbackVal('paddingTop', 'tablet');
  const tPR = getFallbackVal('paddingRight', 'tablet');
  const tPB = getFallbackVal('paddingBottom', 'tablet');
  const tPL = getFallbackVal('paddingLeft', 'tablet');
  const tMT = getFallbackVal('marginTop', 'tablet');
  const tMR = getFallbackVal('marginRight', 'tablet');
  const tMB = getFallbackVal('marginBottom', 'tablet');
  const tML = getFallbackVal('marginLeft', 'tablet');

  const mPT = getFallbackVal('paddingTop', 'mobile');
  const mPR = getFallbackVal('paddingRight', 'mobile');
  const mPB = getFallbackVal('paddingBottom', 'mobile');
  const mPL = getFallbackVal('paddingLeft', 'mobile');
  const mMT = getFallbackVal('marginTop', 'mobile');
  const mMR = getFallbackVal('marginRight', 'mobile');
  const mMB = getFallbackVal('marginBottom', 'mobile');
  const mML = getFallbackVal('marginLeft', 'mobile');
  const hoverBC = styleObj.hover_backgroundColor;
  const hoverC = styleObj.hover_color;
  const hoverBorderC = styleObj.hover_borderColor;
  const hasHover = hoverBC || hoverC || hoverBorderC;

  // Typography settings from blockSettings
  const fsDesk = blockSettings.fontSize_desktop || (blockType === 'text' ? blockSettings.size : '') || '';
  const fsTab = blockSettings.fontSize_tablet || '';
  const fsMob = blockSettings.fontSize_mobile || '';
  const fontFamily = blockSettings.fontFamily || '';
  const color = blockSettings.color || '';

  // Verify if any responsive styling or hover styling actually exists before printing a style tag
  if (!dPT && !dPR && !dPB && !dPL && !dMT && !dMR && !dMB && !dML &&
      !tPT && !tPR && !tPB && !tPL && !tMT && !tMR && !tMB && !tML &&
      !mPT && !mPR && !mPB && !mPL && !mMT && !mMR && !mMB && !mML &&
      !fsDesk && !fsTab && !fsMob && !fontFamily && !color &&
      !hasHover) {
    return null;
  }

  let css = `
    .el-${id} {
      ${dPT ? `padding-top: ${dPT} !important;` : ''}
      ${dPR ? `padding-right: ${dPR} !important;` : ''}
      ${dPB ? `padding-bottom: ${dPB} !important;` : ''}
      ${dPL ? `padding-left: ${dPL} !important;` : ''}
      ${dMT ? `margin-top: ${dMT} !important;` : ''}
      ${dMR ? `margin-right: ${dMR} !important;` : ''}
      ${dMB ? `margin-bottom: ${dMB} !important;` : ''}
      ${dML ? `margin-left: ${dML} !important;` : ''}
      ${fsDesk ? `font-size: ${fsDesk}px !important;` : ''}
      ${fontFamily && fontFamily !== 'inherit' ? `font-family: ${fontFamily} !important;` : ''}
      ${color ? `color: ${color} !important;` : ''}
    }
    @media (max-width: 768px) {
      .el-${id} {
        ${tPT ? `padding-top: ${tPT} !important;` : ''}
        ${tPR ? `padding-right: ${tPR} !important;` : ''}
        ${tPB ? `padding-bottom: ${tPB} !important;` : ''}
        ${tPL ? `padding-left: ${tPL} !important;` : ''}
        ${tMT ? `margin-top: ${tMT} !important;` : ''}
        ${tMR ? `margin-right: ${tMR} !important;` : ''}
        ${tMB ? `margin-bottom: ${tMB} !important;` : ''}
        ${tML ? `margin-left: ${tML} !important;` : ''}
        ${fsTab ? `font-size: ${fsTab}px !important;` : ''}
      }
    }
    @media (max-width: 480px) {
      .el-${id} {
        ${mPT ? `padding-top: ${mPT} !important;` : ''}
        ${mPR ? `padding-right: ${mPR} !important;` : ''}
        ${mPB ? `padding-bottom: ${mPB} !important;` : ''}
        ${mPL ? `padding-left: ${mPL} !important;` : ''}
        ${mMT ? `margin-top: ${mMT} !important;` : ''}
        ${mMR ? `margin-right: ${mMR} !important;` : ''}
        ${mMB ? `margin-bottom: ${mMB} !important;` : ''}
        ${mML ? `margin-left: ${mML} !important;` : ''}
        ${fsMob ? `font-size: ${fsMob}px !important;` : ''}
      }
    }
  `;

  if (hasHover) {
    const hoverSelector = blockType === 'button' ? `.el-${id} a:hover` : `.el-${id}:hover`;
    css += `
      ${hoverSelector} {
        ${hoverBC ? `background-color: ${hoverBC} !important;` : ''}
        ${hoverC ? `color: ${hoverC} !important;` : ''}
        ${hoverBorderC ? `border-color: ${hoverBorderC} !important;` : ''}
      }
    `;
  }

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function PublicLoopGrid({ settings, customBlockStyles, renderLucideIcon }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
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
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPosts();
    return () => { active = false; };
  }, [settings.postType, settings.limit, settings.orderBy, settings.order]);

  const [colsCount, setColsCount] = React.useState(3);

  const colsDesktop = parseInt(settings.columnsDesktop || '3');
  const colsTablet = parseInt(settings.columnsTablet || '2');
  const colsMobile = parseInt(settings.columnsMobile || '1');

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setColsCount(colsMobile);
      } else if (window.innerWidth <= 1024) {
        setColsCount(colsTablet);
      } else {
        setColsCount(colsDesktop);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [colsDesktop, colsTablet, colsMobile]);

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (posts.length === 0) return null;

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
        gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`, 
        gap: gap,
        width: '100%',
        marginBottom: '24px',
        ...customBlockStyles
      }}
    >
      {posts.map((post) => (
        <a 
          key={post.id} 
          href={`/posts/${post.post_type || 'post'}/${post.id}`}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            transition: 'transform 0.2s',
            background: 'none',
            border: 'none',
            borderRadius: '0',
            padding: '0'
          }}
          className="loop-grid-card"
        >
          {settings.showImage !== false && post.featured_image && (
            <img 
              src={post.featured_image} 
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
                  fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : '1.15em', 
                  fontWeight: '600', 
                  color: settings.titleColor || 'inherit' 
                }}
              >
                {post.title}
              </h4>
            )}
            {settings.showMeta !== false && (
              <div style={{ fontSize: '0.75em', color: settings.metaColor || 'inherit', opacity: settings.metaColor ? 1 : 0.55, marginBottom: '12px' }}>
                <span>{new Date(post.createdAt || post.created_at).toLocaleDateString()}</span>
                {post.authorName && <span style={{ marginLeft: '8px' }}>by {post.authorName}</span>}
              </div>
            )}
            {settings.showExcerpt !== false && (
              <p 
                style={{ 
                  margin: '0 0 20px 0', 
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
              <span 
                style={{ 
                  marginTop: 'auto',
                  padding: '8px 20px', 
                  borderRadius: '6px', 
                  background: settings.buttonColor || '#6366f1', 
                  color: '#fff', 
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  alignSelf: 'flex-start',
                  display: 'inline-block'
                }}
              >
                {settings.buttonText || 'View Event'}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

export function PublicLoopCarousel({ settings, customBlockStyles, renderLucideIcon }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [transitionEnabled, setTransitionEnabled] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
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
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPosts();
    return () => { active = false; };
  }, [settings.postType, settings.limit, settings.orderBy, settings.order]);

  const slidesToShowDesktop = parseInt(settings.slidesToShowDesktop || '3');
  const slidesToShowTablet = parseInt(settings.slidesToShowTablet || '2');
  const slidesToShowMobile = parseInt(settings.slidesToShowMobile || '1');

  const [slidesCount, setSlidesCount] = React.useState(slidesToShowDesktop);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setSlidesCount(slidesToShowMobile);
      } else if (window.innerWidth <= 1024) {
        setSlidesCount(slidesToShowTablet);
      } else {
        setSlidesCount(slidesToShowDesktop);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShowDesktop, slidesToShowTablet, slidesToShowMobile]);

  const autoplay = settings.autoplay !== false;
  const autoplaySpeed = parseInt(settings.autoplaySpeed || '5000');
  const showArrows = settings.showArrows !== false;
  const showDots = settings.showDots !== false;
  const infinite = settings.infinite !== false && posts.length > slidesCount;

  React.useEffect(() => {
    if (infinite && posts.length > 0) {
      setCurrentIdx(posts.length);
    }
  }, [posts.length, infinite]);

  React.useEffect(() => {
    if (!infinite || posts.length === 0) return;
    // Safety check: if currentIdx is significantly out of bounds (e.g. background tab throttled onTransitionEnd)
    if (currentIdx > posts.length * 2 + 1) {
      setTransitionEnabled(false);
      setCurrentIdx(posts.length);
    }
  }, [currentIdx, posts.length, infinite]);

  React.useEffect(() => {
    if (!transitionEnabled) {
      const frame = requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [transitionEnabled]);

  React.useEffect(() => {
    if (!autoplay || posts.length <= slidesCount) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => prev + 1);
    }, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, posts.length, slidesCount]);

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (posts.length === 0) return null;

  const displayPosts = infinite ? [...posts, ...posts, ...posts] : posts;

  const gap = `${settings.gap || '20'}px`;
  
  const unit = settings.borderRadiusUnit || (settings.borderRadius ? 'px' : '%');
  const brTopLeft = settings.borderRadiusTopLeft !== undefined ? settings.borderRadiusTopLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brTopRight = settings.borderRadiusTopRight !== undefined ? settings.borderRadiusTopRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomRight = settings.borderRadiusBottomRight !== undefined ? settings.borderRadiusBottomRight : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const brBottomLeft = settings.borderRadiusBottomLeft !== undefined ? settings.borderRadiusBottomLeft : (settings.borderRadius || (unit === '%' ? '0' : '12'));
  const borderRadiusStyle = `${brTopLeft}${unit} ${brTopRight}${unit} ${brBottomRight}${unit} ${brBottomLeft}${unit}`;

  const maxIndex = Math.max(0, posts.length - slidesCount);
  const safeIdx = infinite ? currentIdx : Math.min(currentIdx, maxIndex);

  const handleTransitionEnd = () => {
    if (!infinite || posts.length === 0) return;
    if (currentIdx >= posts.length * 2) {
      setTransitionEnabled(false);
      setCurrentIdx(currentIdx - posts.length);
    } else if (currentIdx <= 0) {
      setTransitionEnabled(false);
      setCurrentIdx(currentIdx + posts.length);
    }
  };

  const dotsCount = infinite ? posts.length : Math.max(0, posts.length - slidesCount + 1);
  const activeDot = infinite ? (currentIdx % posts.length) : safeIdx;

  return (
    <div 
      className={`premium-loop-carousel-container`}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'visible',
        marginBottom: '40px',
        boxSizing: 'border-box',
        ...customBlockStyles
      }}
    >
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div 
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'flex',
            flexShrink: 0,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
            transform: `translateX(-${safeIdx * (100 / displayPosts.length)}%)`,
            width: `${(displayPosts.length / slidesCount) * 100}%`
          }}
        >
        {displayPosts.map((post, idx) => (
          <div 
            key={post.id ? `${post.id}-${idx}` : idx} 
            style={{ 
              flex: `0 0 ${100 / displayPosts.length}%`,
              padding: `0 calc(${gap} / 2)`,
              boxSizing: 'border-box'
            }}
          >
            <a 
              href={`/posts/${post.post_type || 'post'}/${post.id}`}
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'transform 0.2s',
                height: '100%',
                background: 'none',
                border: 'none',
                borderRadius: '0',
                padding: '0'
              }}
              className="loop-grid-card"
            >
              {settings.showImage !== false && post.featured_image && (
                <img 
                  src={post.featured_image} 
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
                      fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : '1.15em', 
                      fontWeight: '600', 
                      color: settings.titleColor || 'inherit' 
                    }}
                  >
                    {post.title}
                  </h4>
                )}
                {settings.showMeta !== false && (
                  <div style={{ fontSize: '0.75em', color: settings.metaColor || 'inherit', opacity: settings.metaColor ? 1 : 0.55, marginBottom: '12px' }}>
                    <span>{new Date(post.createdAt || post.created_at).toLocaleDateString()}</span>
                    {post.authorName && <span style={{ marginLeft: '8px' }}>by {post.authorName}</span>}
                  </div>
                )}
                {settings.showExcerpt !== false && (
                  <p 
                    style={{ 
                      margin: '0 0 20px 0', 
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
                  <span 
                    style={{ 
                      marginTop: 'auto',
                      padding: '8px 20px', 
                      borderRadius: '6px', 
                      background: settings.buttonColor || '#6366f1', 
                      color: '#fff', 
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      alignSelf: 'flex-start',
                      display: 'inline-block'
                    }}
                  >
                    {settings.buttonText || 'View Event'}
                  </span>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>

      {/* Controls */}
      {showArrows && posts.length > slidesCount && (
        <>
          <button
            type="button"
            onClick={() => {
              if (infinite) {
                setCurrentIdx(prev => prev - 1);
              } else {
                setCurrentIdx(prev => Math.max(0, prev - 1));
              }
            }}
            disabled={!infinite && safeIdx === 0}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '12'}px`,
              transform: 'translateY(-50%)',
              background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
              border: 'none',
              borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: settings.arrowIconColor || '#fff',
              cursor: (!infinite && safeIdx === 0) ? 'not-allowed' : 'pointer',
              opacity: (!infinite && safeIdx === 0) ? 0.3 : 1,
              zIndex: 10
            }}
          >
            {renderLucideIcon('ChevronLeft', { size: 18 })}
          </button>
          <button
            type="button"
            onClick={() => {
              if (infinite) {
                setCurrentIdx(prev => prev + 1);
              } else {
                setCurrentIdx(prev => Math.min(maxIndex, prev + 1));
              }
            }}
            disabled={!infinite && safeIdx === maxIndex}
            style={{
              position: 'absolute',
              top: '50%',
              right: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '12'}px`,
              transform: 'translateY(-50%)',
              background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
              border: 'none',
              borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: settings.arrowIconColor || '#fff',
              cursor: (!infinite && safeIdx === maxIndex) ? 'not-allowed' : 'pointer',
              opacity: (!infinite && safeIdx === maxIndex) ? 0.3 : 1,
              zIndex: 10
            }}
          >
            {renderLucideIcon('ChevronRight', { size: 18 })}
          </button>
        </>
      )}

      {showDots && posts.length > slidesCount && (
        <div 
          style={{
            position: 'absolute',
            top: settings.dotsVerticalRef === 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '12'}px` : undefined,
            bottom: settings.dotsVerticalRef !== 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '12'}px` : undefined,
            left: `calc(50% + ${settings.dotsHorizontalOffset !== undefined ? parseInt(settings.dotsHorizontalOffset) : 0}px)`,
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            zIndex: 10
          }}
        >
          {Array.from({ length: dotsCount }).map((_, dIdx) => (
            <button
              key={dIdx}
              type="button"
              onClick={() => {
                if (infinite) {
                  setCurrentIdx(posts.length + dIdx);
                } else {
                  setCurrentIdx(dIdx);
                }
              }}
              style={{
                border: 'none',
                padding: '0',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: activeDot === dIdx ? (settings.dotsActiveColor || 'var(--color-primary)') : (settings.dotsNormalColor || 'rgba(255,255,255,0.4)'),
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicBlockRenderer({ blocks = [], appearance = {}, menuItems = [], siteLogoUrl = '', context = 'content' }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        const settings = block.settings || {};
        // 1. Fetch Block Style override config
        const customBlockStyles = getElementorStyles(settings.customStyle || {});

        // 1. HEADING WIDGET
        if (block.type === 'heading') {
          const Tag = settings.size || 'h2'; // h1, h2, h3, h4, h5, h6
          const align = settings.align || 'left';
          const color = settings.color || '#ffffff';
          
          const headingStyle = {
            textAlign: align,
            color: color,
            margin: '0 0 16px 0',
            fontFamily: settings.fontFamily || 'var(--font-title)',
            fontWeight: '700',
            lineHeight: '1.25',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type, settings)}
              <Tag style={headingStyle} className={`rendered-heading font-${Tag} el-${block.id}`}>
                {settings.text || 'Heading Title'}
              </Tag>
            </React.Fragment>
          );
        }

        // 2. TEXT WIDGET
        if (block.type === 'text') {
          const align = settings.align || 'left';
          const color = settings.color || '#9ca3af';
          const size = settings.size || '16';

          const textStyle = {
            textAlign: align,
            color: color,
            fontSize: `${size}px`,
            fontFamily: settings.fontFamily || 'inherit',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type, settings)}
              <div 
                style={textStyle} 
                className={`rendered-text-block el-${block.id}`}
                dangerouslySetInnerHTML={{ __html: settings.text || 'Paragraph text content' }}
              />
            </React.Fragment>
          );
        }

        // 3. IMAGE WIDGET
        if (block.type === 'image') {
          const align = settings.align || 'center';
          const width = settings.width || '100';

          const wrapperStyle = {
            display: 'flex',
            justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            marginBottom: '16px',
            ...customBlockStyles
          };

          const imgStyle = {
            maxWidth: '100%',
            width: `${width}%`,
            height: 'auto',
            borderRadius: '8px',
            objectFit: 'cover'
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={wrapperStyle} className={`rendered-image-wrapper el-${block.id}`}>
                {settings.url ? (
                  <img src={settings.url} alt="Widget Graphic" style={imgStyle} />
                ) : (
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: '8px', width: '100%', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Empty Image Placeholder
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        }

        // 4. BUTTON WIDGET
        if (block.type === 'button') {
          const align = settings.align || 'left';
          const legacyStyle = {};
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

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <style>{`
                .btn-custom-${block.id} {
                  transition: all 0.2s ease-in-out !important;
                }
                .btn-custom-${block.id}:hover {
                  background-color: ${finalBtnStyle === 'solid' ? scheme.hover : finalBtnStyle === 'outline' ? scheme.main : 'transparent'} !important;
                  color: ${finalBtnStyle === 'outline' ? '#ffffff' : finalBtnStyle === 'flat' ? scheme.hover : '#ffffff'} !important;
                  border-color: ${finalBtnStyle === 'outline' ? scheme.main : 'transparent'} !important;
                  text-decoration: ${finalBtnStyle === 'flat' ? 'underline' : 'none'} !important;
                }
              `}</style>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
                  width: customBlockStyles.width
                }} 
                className={`rendered-button-wrapper el-${block.id}`}
              >
                <a 
                  href={settings.url || '#'} 
                  className={btnClass}
                  style={{ ...legacyStyle, ...presetStyle, ...customBlockStyles, width: undefined }}
                >
                  {settings.text || 'Click Here'}
                </a>
              </div>
            </React.Fragment>
          );
        }

        // 5. DIVIDER WIDGET
        if (block.type === 'divider') {
          const height = parseInt(settings.height || '30');
          const showLine = settings.showLine !== false;
          const lineColor = settings.lineColor || 'rgba(255,255,255,0.08)';

          const spacerStyle = {
            height: `${height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={spacerStyle} className={`rendered-divider-wrapper el-${block.id}`}>
              {showLine && (
                <div style={{ width: '100%', borderTop: `1px solid ${lineColor}` }} />
              )}
            </div>
          </React.Fragment>
          );
        }

        // 6. ALERT WIDGET
        if (block.type === 'alert') {
          const alertType = settings.alertType || 'info';
          const alertColors = {
            info: { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)', text: '#818cf8' },
            success: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' },
            warning: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' },
            danger: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' }
          };

          const activeColors = alertColors[alertType] || alertColors.info;

          const alertStyle = {
            padding: '12px 16px',
            backgroundColor: activeColors.bg,
            border: `1px solid ${activeColors.border}`,
            borderRadius: '8px',
            color: activeColors.text,
            fontSize: '0.85rem',
            lineHeight: '1.5',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={alertStyle} className={`rendered-alert alert-${alertType} el-${block.id}`}>
              <span>{settings.text || 'Alert notification message.'}</span>
            </div>
          </React.Fragment>
          );
        }

        // 7. SITE LOGO WIDGET
        if (block.type === 'logo') {
          const align = settings.align || 'left';
          const width = settings.width || '40';
          const activeLogo = settings.url || siteLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60';

          const wrapperStyle = {
            display: 'flex',
            justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={wrapperStyle} className={`rendered-logo-wrapper el-${block.id}`}>
              <a href="/">
                <img 
                  src={activeLogo} 
                  alt="Site Brand Logo" 
                  style={{ width: `${width}%`, height: 'auto', borderRadius: '4px', display: 'block' }} 
                />
              </a>
            </div>
          </React.Fragment>
          );
        }

        // 8. NAVIGATION MENU WIDGET
        if (block.type === 'menu') {
          const align = settings.align || 'left';
          const wrapperStyle = {
            display: 'flex',
            justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={wrapperStyle} className={`rendered-menu-wrapper el-${block.id}`}>
              <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                {menuItems.map(item => (
                  <a 
                    key={item.id} 
                    href={item.url || '#'} 
                    style={{
                      fontSize: settings.fontSize ? `${settings.fontSize}px` : '0.85rem',
                      fontWeight: '600',
                      color: settings.color || 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontFamily: settings.fontFamily || 'inherit',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.color = settings.color || 'var(--text-secondary)'}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </React.Fragment>
          );
        }

        // 9. ICON LIST WIDGET
        if (block.type === 'iconlist') {
          const align = settings.align || 'left';
          const listItems = settings.items || [];
          const listStyle = {
            display: 'flex',
            flexDirection: 'column',
            gap: `${settings.gap || '8'}px`,
            listStyle: 'none',
            padding: '0',
            margin: '0 0 16px 0',
            alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <ul style={listStyle} className={`rendered-icon-list el-${block.id}`}>
              {listItems.map((item, iIdx) => (
                <li 
                  key={item.id || iIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: `${settings.fontSize || '14'}px`,
                    color: customBlockStyles.color || 'var(--text-secondary)'
                  }}
                >
                  {renderLucideIcon(item.icon || 'Check', { size: parseInt(settings.iconSize || '16'), style: { color: settings.iconColor || 'var(--color-primary)', flexShrink: 0 } })}
                  <span>{item.text || 'List element line item'}</span>
                </li>
              ))}
            </ul>
          </React.Fragment>
          );
        }

        // 10. ICON BOX WIDGET
        if (block.type === 'iconbox') {
          const align = settings.align || 'center';
          const iconSizeVal = parseInt(settings.iconSize || '24');
          const isCircleBg = settings.iconBgType === 'circle';

          const iconWrapperStyle = isCircleBg ? {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${iconSizeVal * 1.6}px`,
            height: `${iconSizeVal * 1.6}px`,
            borderRadius: '50%',
            backgroundColor: `${settings.iconColor || '#6366f1'}15`,
            color: settings.iconColor || '#6366f1',
            marginBottom: '12px'
          } : {
            color: settings.iconColor || '#6366f1',
            display: 'inline-flex',
            marginBottom: '12px'
          };

          const cardStyle = {
            textAlign: align,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            marginBottom: '16px',
            ...customBlockStyles
          };

          return (
            <React.Fragment key={block.id}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
              <div style={cardStyle} className={`rendered-icon-box el-${block.id}`}>
              <div style={iconWrapperStyle}>
                {renderLucideIcon(settings.icon || 'Sparkles', { size: iconSizeVal })}
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#fff', fontWeight: '600' }}>
                {settings.title || 'Icon Box Title'}
              </h4>
              <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {settings.description || 'Description details of the icon box widget.'}
              </p>
            </div>
          </React.Fragment>
          );
        }

        // 11. SECTION WIDGET (COLUMNS CONTAINER)
        if (block.type === 'section') {
          const colsList = settings.columns || [];

          let gapSpacing = `${settings.gap || '20'}px`;

          if (settings.contentWidthMode === 'fullwidth') {
             gapSpacing = `${ '0'}px`;
          }
          

          // Resolve outer section style (Full Width background container)
          const outerStyle = {
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            ...customBlockStyles
          };

          // Resolve inner columns row container style (Centered, bounded width)
          let maxWidthVal = settings.contentWidthMode === 'fullwidth' ? '100%' : 'var(--content-width)';
          if (settings.contentWidthMode !== 'fullwidth') {
            if (context === 'header') maxWidthVal = 'var(--header-width)';
            else if (context === 'footer') maxWidthVal = 'var(--footer-width)';
          }

          const innerStyle = settings.layoutType === 'grid' ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${colsList.length}, 1fr)`,
            gap: gapSpacing,
            width: '100%',
            maxWidth: maxWidthVal,
            margin: '0 auto',
            padding: settings.contentWidthMode === 'fullwidth' ? '0 0px' : '0 0px',
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
            maxWidth: maxWidthVal,
            margin: '0 auto',
            padding: settings.contentWidthMode === 'fullwidth' ? '0 0px' : '0 0px',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 2
          };

          return (
            <div key={block.id} style={outerStyle} className={`rendered-section-wrapper el-${block.id}`}>
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
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

              <div style={innerStyle} className="rendered-section-row">
                {colsList.map((col, cIdx) => {
                  const colBlocks = Array.isArray(col) ? col : (col?.blocks || []);
                  const colWidth = col?.width || '50';

                  // Fetch Column Custom Styles
                  const customColStyles = getElementorStyles(col?.style || {});

                  // Build column layout structure (Flex vs standard stacked)
                  const colFlexStyles = col?.flexLayout ? {
                    display: 'flex',
                    flexDirection: col.direction || 'column',
                    justifyContent: col.justify === 'start' ? 'flex-start' : col.justify === 'end' ? 'flex-end' : col.justify === 'between' ? 'space-between' : col.justify === 'around' ? 'space-around' : 'center',
                    alignItems: col.align || 'stretch',
                    gap: `${col.gap || '10'}px`
                  } : {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  };

                  const colStyle = {
                    position: 'relative',
                    ...(settings.layoutType === 'flex' ? {
                      flex: `0 0 calc(${colWidth}% - ${gapSpacing})`,
                      maxWidth: `${colWidth}%`,
                      ...customColStyles
                    } : {
                      flex: 1,
                      ...customColStyles
                    })
                  };

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
                    <div key={col?.id || `col-${cIdx}`} style={colStyle} className={`rendered-column el-${col?.id || `col-${cIdx}`}`}>
                      {renderResponsiveStyles(col?.id || `col-${cIdx}`, col?.style)}
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
                        <PublicBlockRenderer 
                          blocks={colBlocks} 
                          appearance={appearance}
                          menuItems={menuItems}
                          siteLogoUrl={siteLogoUrl}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 12. SLIDER WIDGET
        if (block.type === 'slider') {
          const slides = settings.slides || [];
          const autoplay = settings.autoplay !== false;
          const autoplaySpeed = parseInt(settings.autoplaySpeed || '5000');
          const showArrows = settings.showArrows !== false;
          const showDots = settings.showDots !== false;
          const transitionType = settings.transition || 'slide';

          const [currentIdx, setCurrentIdx] = React.useState(0);

          React.useEffect(() => {
            if (!autoplay || slides.length <= 1) return;
            const interval = setInterval(() => {
              setCurrentIdx((prev) => (prev + 1) % slides.length);
            }, autoplaySpeed);
            return () => clearInterval(interval);
          }, [autoplay, autoplaySpeed, slides.length]);

          if (slides.length === 0) return null;

          const handlePrev = (e) => {
            e.stopPropagation();
            setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
          };

          const handleNext = (e) => {
            e.stopPropagation();
            setCurrentIdx((prev) => (prev + 1) % slides.length);
          };

          return (
            <div 
              key={block.id} 
              className={`premium-slider-container el-${block.id}`}
              style={{
                position: 'relative',
                width: '100%',
                overflow: 'visible',
                marginBottom: '40px',
                boxSizing: 'border-box',
                ...customBlockStyles
              }}
            >
              {renderResponsiveStyles(block.id, settings.customStyle, block.type)}
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

              <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px', minHeight: settings.height || '400px', height: settings.height || '400px', position: 'relative' }}>
                {/* Slides Viewport */}
                <div 
                  className="premium-slider-viewport"
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: settings.height || '400px',
                    height: settings.height || '400px',
                    display: transitionType === 'slide' ? 'flex' : 'block',
                    transition: transitionType === 'slide' ? 'transform 0.5s ease-in-out' : 'none',
                    transform: transitionType === 'slide' ? `translateX(-${currentIdx * 100}%)` : 'none',
                    zIndex: 2
                  }}
                >
                {slides.map((slide, sIdx) => {
                  const slideStyles = getElementorStyles(slide.style || slide.customStyle || {});
                  const slideContainerStyle = transitionType === 'slide' ? {
                    flex: '0 0 100%',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '40px 60px',
                    minHeight: settings.height || '400px',
                    height: settings.height || '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    ...slideStyles
                  } : {
                    position: sIdx === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: settings.height || '400px',
                    boxSizing: 'border-box',
                    padding: '40px 60px',
                    minHeight: settings.height || '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: currentIdx === sIdx ? 1 : 0,
                    pointerEvents: currentIdx === sIdx ? 'auto' : 'none',
                    transition: 'opacity 0.6s ease-in-out',
                    zIndex: currentIdx === sIdx ? 2 : 1,
                    overflow: 'hidden',
                    ...slideStyles
                  };

                  return (
                    <div 
                      key={slide.id || sIdx} 
                      className={`premium-slider-slide el-${slide.id || sIdx} ${currentIdx === sIdx ? 'active' : ''}`}
                      style={slideContainerStyle}
                    >
                      {renderResponsiveStyles(slide.id || sIdx, slide.style || slide.customStyle, 'slide')}
                      {(slide.style?.overlayColor || slide.customStyle?.overlayColor) && (
                        <div 
                          className="slide-bg-overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: slide.style?.overlayColor || slide.customStyle?.overlayColor,
                            opacity: (slide.style?.overlayOpacity !== undefined ? slide.style.overlayOpacity : slide.customStyle?.overlayOpacity) !== undefined ? (slide.style?.overlayOpacity !== undefined ? slide.style.overlayOpacity : slide.customStyle?.overlayOpacity) : 0.5,
                            zIndex: 1,
                            pointerEvents: 'none'
                          }}
                        />
                      )}

                      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                        <PublicBlockRenderer 
                          blocks={slide.blocks || []} 
                          appearance={appearance}
                          menuItems={menuItems}
                          siteLogoUrl={siteLogoUrl}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Navigation Arrows */}
              {showArrows && slides.length > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={handlePrev}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '16'}px`,
                      transform: 'translateY(-50%)',
                      background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
                      color: settings.arrowIconColor || '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = settings.arrowBgColor || 'rgba(0,0,0,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.background = settings.arrowBgColor || 'rgba(0,0,0,0.4)'}
                  >
                    {renderLucideIcon('ChevronLeft', { size: 18 })}
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '16'}px`,
                      transform: 'translateY(-50%)',
                      background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
                      color: settings.arrowIconColor || '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = settings.arrowBgColor || 'rgba(0,0,0,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.background = settings.arrowBgColor || 'rgba(0,0,0,0.4)'}
                  >
                    {renderLucideIcon('ChevronRight', { size: 18 })}
                  </button>
                </>
              )}

              {/* Navigation Dots */}
              {showDots && slides.length > 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    top: settings.dotsVerticalRef === 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '16'}px` : undefined,
                    bottom: settings.dotsVerticalRef !== 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '16'}px` : undefined,
                    left: `calc(50% + ${settings.dotsHorizontalOffset !== undefined ? parseInt(settings.dotsHorizontalOffset) : 0}px)`,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10
                  }}
                >
                  {slides.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIdx(sIdx);
                      }}
                      style={{
                        border: 'none',
                        padding: '0',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: currentIdx === sIdx ? (settings.dotsActiveColor || 'var(--color-primary)') : (settings.dotsNormalColor || 'rgba(255,255,255,0.4)'),
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    />
                  ))}
                </div>
              )}
              {renderShapeDivider(settings.shapeDividerTop, 'top', settings.shapeDividerTopColor, settings.shapeDividerTopHeight, settings.shapeDividerTopInvert, settings.shapeDividerTopFlip)}
              {renderShapeDivider(settings.shapeDividerBottom, 'bottom', settings.shapeDividerBottomColor, settings.shapeDividerBottomHeight, settings.shapeDividerBottomInvert, settings.shapeDividerBottomFlip)}
            </div>
          );
        }

        // 13. IMAGE CAROUSEL
        if (block.type === 'carousel' || block.type === 'image_only_carousel') {
          const images = settings.images || [];
          const autoplay = settings.autoplay !== false;
          const autoplaySpeed = parseInt(settings.autoplaySpeed || '5000');
          const showArrows = settings.showArrows !== false;
          const showDots = settings.showDots !== false;
          
          const [currentIdx, setCurrentIdx] = React.useState(0);
          const [transitionEnabled, setTransitionEnabled] = React.useState(true);

          const slidesDesktop = parseInt(settings.slidesToShowDesktop || '3');
          const slidesTablet = parseInt(settings.slidesToShowTablet || '2');
          const slidesMobile = parseInt(settings.slidesToShowMobile || '1');

          const [slidesCount, setSlidesCount] = React.useState(slidesDesktop);

          React.useEffect(() => {
            const handleResize = () => {
              if (window.innerWidth <= 600) {
                setSlidesCount(slidesMobile);
              } else if (window.innerWidth <= 1024) {
                setSlidesCount(slidesTablet);
              } else {
                setSlidesCount(slidesDesktop);
              }
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
          }, [slidesDesktop, slidesTablet, slidesMobile]);

          const infinite = settings.infinite !== false;

          React.useEffect(() => {
            if (infinite && images.length > 0) {
              setCurrentIdx(images.length);
            }
          }, [images.length, infinite]);

          React.useEffect(() => {
            if (!transitionEnabled) {
              const frame = requestAnimationFrame(() => {
                setTransitionEnabled(true);
              });
              return () => cancelAnimationFrame(frame);
            }
          }, [transitionEnabled]);

          React.useEffect(() => {
            if (!autoplay || images.length <= slidesCount) return;
            const interval = setInterval(() => {
              setCurrentIdx(prev => prev + 1);
            }, autoplaySpeed);
            return () => clearInterval(interval);
          }, [autoplay, autoplaySpeed, images.length, slidesCount]);

          if (images.length === 0) return null;

          const displayImages = infinite ? [...images, ...images, ...images] : images;

          const carouselGap = `${settings.gap || '15'}px`;
          const carouselHeight = `${settings.imageHeight || '220'}px`;
          
          const unit = settings.borderRadiusUnit || (settings.borderRadius ? 'px' : '%');
          const brTopLeft = settings.borderRadiusTopLeft !== undefined ? settings.borderRadiusTopLeft : (settings.borderRadius || (unit === '%' ? '0' : '8'));
          const brTopRight = settings.borderRadiusTopRight !== undefined ? settings.borderRadiusTopRight : (settings.borderRadius || (unit === '%' ? '0' : '8'));
          const brBottomRight = settings.borderRadiusBottomRight !== undefined ? settings.borderRadiusBottomRight : (settings.borderRadius || (unit === '%' ? '0' : '8'));
          const brBottomLeft = settings.borderRadiusBottomLeft !== undefined ? settings.borderRadiusBottomLeft : (settings.borderRadius || (unit === '%' ? '0' : '8'));
          const carouselRadius = `${brTopLeft}${unit} ${brTopRight}${unit} ${brBottomRight}${unit} ${brBottomLeft}${unit}`;

          const maxIndex = Math.max(0, images.length - slidesCount);
          const safeIdx = infinite ? currentIdx : Math.min(currentIdx, maxIndex);

          const handleTransitionEnd = () => {
            if (!infinite || images.length === 0) return;
            if (currentIdx >= images.length * 2) {
              setTransitionEnabled(false);
              setCurrentIdx(currentIdx - images.length);
            } else if (currentIdx <= 0) {
              setTransitionEnabled(false);
              setCurrentIdx(currentIdx + images.length);
            }
          };

          const dotsCount = infinite ? images.length : Math.max(0, images.length - slidesCount + 1);
          const activeDot = infinite ? (currentIdx % images.length) : safeIdx;

          return (
            <div 
              key={block.id}
              className={`premium-carousel-container el-${block.id}`}
              style={{
                position: 'relative',
                width: '100%',
                overflow: 'visible',
                marginBottom: '40px',
                boxSizing: 'border-box',
                ...customBlockStyles
              }}
            >
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <div 
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    display: 'flex',
                    flexShrink: 0,
                    transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
                    transform: `translateX(-${safeIdx * (100 / displayImages.length)}%)`,
                    width: `${(displayImages.length / slidesCount) * 100}%`
                  }}
                >
                {displayImages.map((img, idx) => (
                  <div 
                    key={img.id ? `${img.id}-${idx}` : idx} 
                    style={{ 
                      flex: `0 0 ${100 / displayImages.length}%`,
                      padding: `0 calc(${carouselGap} / 2)`,
                      boxSizing: 'border-box',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={img.caption || ''} 
                      style={{ 
                        width: '100%', 
                        height: carouselHeight, 
                        objectFit: 'cover',
                        borderRadius: carouselRadius 
                      }} 
                    />
                    {block.type === 'carousel' && (img.caption || img.description) && (
                      <div style={{ position: 'absolute', bottom: 0, left: `calc(${carouselGap} / 2)`, right: `calc(${carouselGap} / 2)`, background: 'rgba(0,0,0,0.7)', padding: '8px 12px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '2px', borderBottomLeftRadius: `${brBottomLeft}px`, borderBottomRightRadius: `${brBottomRight}px` }}>
                        {img.caption && <div style={{ fontSize: '0.8rem', fontWeight: '600', textAlign: 'center' }}>{img.caption}</div>}
                        {img.description && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: '1.2' }}>{img.description}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

              {showArrows && images.length > slidesCount && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (infinite) {
                        setCurrentIdx(prev => prev - 1);
                      } else {
                        setCurrentIdx(prev => Math.max(0, prev - 1));
                      }
                    }}
                    disabled={!infinite && safeIdx === 0}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '12'}px`,
                      transform: 'translateY(-50%)',
                      background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
                      border: 'none',
                      borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: settings.arrowIconColor || '#fff',
                      cursor: (!infinite && safeIdx === 0) ? 'not-allowed' : 'pointer',
                      opacity: (!infinite && safeIdx === 0) ? 0.3 : 1,
                      zIndex: 10
                    }}
                  >
                    {renderLucideIcon('ChevronLeft', { size: 18 })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (infinite) {
                        setCurrentIdx(prev => prev + 1);
                      } else {
                        setCurrentIdx(prev => Math.min(maxIndex, prev + 1));
                      }
                    }}
                    disabled={!infinite && safeIdx === maxIndex}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: `${settings.arrowsOffset !== undefined ? settings.arrowsOffset : '12'}px`,
                      transform: 'translateY(-50%)',
                      background: settings.arrowBgColor || 'rgba(0,0,0,0.4)',
                      border: 'none',
                      borderRadius: settings.arrowBorderRadius !== undefined ? `${settings.arrowBorderRadius}%` : '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: settings.arrowIconColor || '#fff',
                      cursor: (!infinite && safeIdx === maxIndex) ? 'not-allowed' : 'pointer',
                      opacity: (!infinite && safeIdx === maxIndex) ? 0.3 : 1,
                      zIndex: 10
                    }}
                  >
                    {renderLucideIcon('ChevronRight', { size: 18 })}
                  </button>
                </>
              )}

              {showDots && images.length > slidesCount && (
                <div 
                  style={{
                    position: 'absolute',
                    top: settings.dotsVerticalRef === 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '12'}px` : undefined,
                    bottom: settings.dotsVerticalRef !== 'top' ? `${settings.dotsOffset !== undefined ? settings.dotsOffset : '12'}px` : undefined,
                    left: `calc(50% + ${settings.dotsHorizontalOffset !== undefined ? parseInt(settings.dotsHorizontalOffset) : 0}px)`,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 10
                  }}
                >
                  {Array.from({ length: dotsCount }).map((_, dIdx) => (
                    <button
                      key={dIdx}
                      type="button"
                      onClick={() => {
                        if (infinite) {
                          setCurrentIdx(images.length + dIdx);
                        } else {
                          setCurrentIdx(dIdx);
                        }
                      }}
                      style={{
                        border: 'none',
                        padding: '0',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeDot === dIdx ? (settings.dotsActiveColor || 'var(--color-primary)') : (settings.dotsNormalColor || 'rgba(255,255,255,0.4)'),
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }

        // 14. LOOP GRID
        if (block.type === 'loop_grid') {
          return (
            <PublicLoopGrid 
              key={block.id}
              settings={settings}
              customBlockStyles={customBlockStyles}
              renderLucideIcon={renderLucideIcon}
            />
          );
        }

        // 15. LOOP CAROUSEL
        if (block.type === 'loop_carousel') {
          return (
            <PublicLoopCarousel 
              key={block.id}
              settings={settings}
              customBlockStyles={customBlockStyles}
              renderLucideIcon={renderLucideIcon}
            />
          );
        }

        return null;
      })}
    </>
  );
}
