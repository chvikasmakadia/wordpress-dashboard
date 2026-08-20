"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../routing';
import { useApp } from '../context/AppContext';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';

export default function PublicArchive({ initialData }) {
  const { postTypeSlug } = useParams();
  const { postTypes } = useApp();

  const [posts, setPosts] = useState(initialData?.posts || []);
  const [loading, setLoading] = useState(!initialData);

  const currentPostType = postTypes.find(pt => pt.slug === postTypeSlug);

  const isFirstMount = React.useRef(true);

  useEffect(() => {
    if (initialData && isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const fetchArchivePosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          // Filter published items matching this post type
          const filtered = data.filter(p => p.post_type === postTypeSlug && p.status === 'publish');
          setPosts(filtered);
        }
      } catch (err) {
        console.error('Error fetching archive posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postTypeSlug) {
      fetchArchivePosts();
    }
  }, [postTypeSlug]);

  if (!currentPostType) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
        <h3>Archive Not Found</h3>
        <p style={{ color: 'var(--text-muted)' }}>The post type archive you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
        <span>Loading {currentPostType.plural}...</span>
      </div>
    );
  }

  const themeColors = appearance?.theme_options || {};
  const contentWidth = themeColors.contentWidth || '1200px';

  return (
    <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }} className="archive-posts-container fade-in">
      <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0' }}>{currentPostType.plural} Archive</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Browse all published {currentPostType.plural.toLowerCase()} from our site.
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border-color)', borderRadius: '10px', color: 'var(--text-muted)' }}>
          <FileText size={32} style={{ marginBottom: '8px' }} />
          <h3>No {currentPostType.plural.toLowerCase()} found</h3>
          <p style={{ fontSize: '0.8rem', maxWidth: '320px', margin: '4px auto 0 auto' }}>
            Check back later, or publish new drafts from the dashboard!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {posts.map(post => (
            <article 
              key={post.id}
              className="archive-card glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {post.featured_image ? (
                <Link to={`/posts/${postTypeSlug}/${post.id}`}>
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} 
                  />
                </Link>
              ) : (
                <div style={{ width: '100%', height: '180px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <FileText size={32} />
                </div>
              )}

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={11} />
                    Admin
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  <Link to={`/posts/${postTypeSlug}/${post.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 20px 0',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'No description summary.'}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/posts/${postTypeSlug}/${post.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--color-primary)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
