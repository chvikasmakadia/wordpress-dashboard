"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../routing';
import PublicBlockRenderer from '../components/PublicBlockRenderer';
import { Calendar, User, FileText, ArrowRight } from 'lucide-react';

export default function PublicHome({ initialData }) {
  const { settings, appearance } = useApp();
  
  const [staticPage, setStaticPage] = useState(initialData?.staticPage || null);
  const [latestPosts, setLatestPosts] = useState(initialData?.latestPosts || []);
  const [loading, setLoading] = useState(!initialData);

  const homepageDisplays = settings?.reading?.homepageDisplays || initialData?.homepageDisplays || 'latest';
  const homepagePageId = settings?.reading?.homepagePageId || initialData?.staticPage?.id || '';

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

    const loadHomeContent = async () => {
      setLoading(true);
      try {
        if (homepageDisplays === 'page' && homepagePageId) {
          // 1. Fetch static front page details
          const res = await fetch(`/api/posts/${homepagePageId}`);
          if (res.ok) {
            const pageData = await res.json();
            if (pageData.status === 'publish') {
              setStaticPage(pageData);
              setLoading(false);
              return;
            }
          }
        }

        // 2. Fallback to Latest Posts or Fetch Recent News list
        const resPosts = await fetch('/api/posts');
        if (resPosts.ok) {
          const allPosts = await resPosts.json();
          // Filter only published blog posts (post_type === 'post')
          const publishedBlogPosts = allPosts.filter(p => p.post_type === 'post' && p.status === 'publish');
          setLatestPosts(publishedBlogPosts);
        }
      } catch (err) {
        console.error('Error loading homepage content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, [homepageDisplays, homepagePageId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
        <span>Loading Site Homepage...</span>
      </div>
    );
  }

  // Render static custom page builder layouts
  if (homepageDisplays === 'page' && staticPage) {
    if (staticPage.editor_mode === 'builder' && Array.isArray(staticPage.builder_content)) {
      return (
        <div className="home-custom-layout fade-in">
          <PublicBlockRenderer 
            blocks={staticPage.builder_content} 
            appearance={appearance}
            menuItems={menuItems}
            siteLogoUrl={siteLogo}
          />
        </div>
      );
    }

    // Classic static homepage fallback
    const themeColors = appearance?.theme_options || {};
    const contentWidth = themeColors.contentWidth || '1200px';

    return (
      <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }}>
        <article className="home-classic-article fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '10px' }}>{staticPage.title}</h1>
          {staticPage.featured_image && (
            <img 
              src={staticPage.featured_image} 
              alt={staticPage.title} 
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '10px', marginBottom: '24px' }} 
            />
          )}
          <div 
            style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: staticPage.content }}
          />
        </article>
      </div>
    );
  }

  // Render recent published posts feed list
  const themeColors = appearance?.theme_options || {};
  const contentWidth = themeColors.contentWidth || '1200px';

  return (
    <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }} className="home-posts-feed fade-in">
      <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0' }}>Recent Stories & Updates</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Explore the latest posts published on our dynamic CMS website.
        </p>
      </div>

      {latestPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
          <FileText size={32} style={{ marginBottom: '8px', color: 'var(--text-muted)' }} />
          <h3>No articles published yet</h3>
          <p style={{ fontSize: '0.8rem', maxWidth: '320px', margin: '4px auto 0 auto' }}>
            Check back later, or login to the admin panel and publish a new post!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {latestPosts.map(post => (
            <article 
              key={post.id} 
              className="feed-card glass-panel"
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
                <Link to={`/posts/post/${post.id}`}>
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
                  <Link to={`/posts/post/${post.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
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
                  {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'No summary excerpt description.'}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/posts/post/${post.id}`} 
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
                    <span>Read Full Story</span>
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
