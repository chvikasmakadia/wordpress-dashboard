"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../routing';
import { useApp } from '../context/AppContext';
import PublicBlockRenderer from '../components/PublicBlockRenderer';
import { Calendar, User, ArrowLeft, Tag, Info } from 'lucide-react';

export default function PublicSingle({ initialData }) {
  const { postTypeSlug, id } = useParams();
  const { postTypes, appearance } = useApp();

  const [post, setPost] = useState(initialData?.post || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(initialData?.post ? '' : '');

  const currentPostType = postTypes.find(pt => pt.slug === postTypeSlug);

  // Get primary menu for renderer context
  const primaryMenu = appearance?.menus?.find(m => m.location === 'primary') || appearance?.menus?.[0];
  const menuItems = primaryMenu?.items || [];
  const siteLogo = appearance?.site_logo || '';

  const isFirstMount = React.useRef(true);

  useEffect(() => {
    if (initialData && isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const fetchPostDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'publish') {
            setPost(data);
          } else {
            setError('This page is currently saved as a draft and is not public.');
          }
        } else {
          setError('The requested article or page was not found.');
        }
      } catch (err) {
        console.error('Error loading article details:', err);
        setError('Network error fetching article details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
        <span>Loading Content...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', margin: '0 0 10px 0' }}>Unable to Load Page</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
          {error || 'The page configuration is invalid or missing.'}
        </p>
        <Link to="/" className="btn btn-primary">Back to Homepage</Link>
      </div>
    );
  }

  // 1. RENDER VISUAL PAGE BUILDER BLOCKS
  if (post.editor_mode === 'builder' && Array.isArray(post.builder_content)) {
    const themeColors = appearance?.theme_options || {};
    const contentWidth = themeColors.contentWidth || '1200px';

    return (
      <div className="single-post-custom fade-in">
        {/* Back Link - bounded inside contentWidth for alignment */}
        <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <ArrowLeft size={12} />
            <span>Back to Home</span>
          </Link>
        </div>

        <PublicBlockRenderer 
          blocks={post.builder_content} 
          appearance={appearance}
          menuItems={menuItems}
          siteLogoUrl={siteLogo}
        />
      </div>
    );
  }

  // 2. RENDER CLASSIC EDITOR CONTENT
  const customFieldsMap = currentPostType?.fields || [];
  const hasCustomFields = customFieldsMap.length > 0 && post.custom_fields && Object.keys(post.custom_fields).length > 0;

  const themeColors = appearance?.theme_options || {};
  const contentWidth = themeColors.contentWidth || '1200px';

  return (
    <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }}>
      <article className="single-post-classic fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={12} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Info */}
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.25' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={13} style={{ color: 'var(--color-secondary)' }} />
            By Admin
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
            <Tag size={13} style={{ color: 'var(--color-primary)' }} />
            {currentPostType?.singular || postTypeSlug}
          </span>
        </div>
      </header>

      {/* Featured Graphic */}
      {post.featured_image && (
        <div style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <img 
            src={post.featured_image} 
            alt={post.title} 
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} 
          />
        </div>
      )}

      {/* Content Body */}
      <div 
        className="rendered-classic-content"
        style={{
          fontSize: '1.05rem',
          lineHeight: '1.75',
          color: 'var(--text-secondary)',
          marginBottom: '40px'
        }}
        dangerouslySetInnerHTML={{ __html: post.content || '<p>No content description.</p>' }}
      />

      {/* Dynamic Custom Fields Panel */}
      {hasCustomFields && (
        <section 
          className="custom-fields-panel glass-panel"
          style={{
            padding: '24px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            marginTop: '40px'
          }}
        >
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Specifications & Details</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {customFieldsMap.map(field => {
              const val = post.custom_fields[field.id];
              if (val === undefined || val === '') return null;

              return (
                <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {field.label}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
                    {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  </div>
  );
}
