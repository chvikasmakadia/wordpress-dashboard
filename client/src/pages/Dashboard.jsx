"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from '../routing';
import { 
  FileText, 
  File, 
  Database, 
  Plus, 
  Settings, 
  PenTool, 
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { postTypes, settings } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    post: 0,
    page: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const posts = await res.json();
          // Count by post_type
          const counts = {};
          postTypes.forEach(pt => {
            counts[pt.slug] = 0;
          });
          posts.forEach(p => {
            if (counts[p.post_type] !== undefined) {
              counts[p.post_type]++;
            } else {
              counts[p.post_type] = 1;
            }
          });
          setStats(counts);
          setRecentPosts(posts.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    if (postTypes.length > 0) {
      fetchStats();
    }
  }, [postTypes]);

  const handleQuickDraftSubmit = async (e) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    setDrafting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftTitle,
          content: draftContent,
          post_type: 'post',
          status: 'draft'
        })
      });

      if (res.ok) {
        setDraftTitle('');
        setDraftContent('');
        // Refresh recent posts
        const postsRes = await fetch('/api/posts');
        if (postsRes.ok) {
          const posts = await postsRes.json();
          setRecentPosts(posts.slice(0, 5));
          // Update stats
          const counts = { ...stats };
          counts.post = (counts.post || 0) + 1;
          setStats(counts);
        }
      }
    } catch (err) {
      console.error('Error saving quick draft:', err);
    } finally {
      setDrafting(false);
    }
  };

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Welcome to your dynamic WordPress-style administration panel.
          </p>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="admin-grid" style={{ marginBottom: '30px' }}>
        {postTypes.map(pt => {
          let Icon = Database;
          if (pt.slug === 'post') Icon = FileText;
          if (pt.slug === 'page') Icon = File;

          const count = stats[pt.slug] || 0;

          return (
            <div key={pt.slug} className="glass-panel stat-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="stat-icon-wrapper" style={{
                background: pt.slug === 'post' ? 'var(--bg-accent)' : pt.slug === 'page' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(20, 184, 166, 0.1)',
                border: `1px solid ${pt.slug === 'post' ? 'rgba(99, 102, 241, 0.2)' : pt.slug === 'page' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(20, 184, 166, 0.2)'}`,
                color: pt.slug === 'post' ? 'var(--color-primary)' : pt.slug === 'page' ? 'var(--color-secondary)' : 'var(--color-accent)',
                width: '54px', height: '54px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{count}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{pt.plural}</p>
                <Link to={`/admin/posts/${pt.slug}`} style={{ fontSize: '0.75rem', marginTop: '6px', display: 'inline-block' }}>
                  View All &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
        {/* RECENT ACTIVITY */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Recent Activity</span>
            </h2>
            <Link to="/admin/posts/post" className="btn btn-secondary btn-sm">
              All Content
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No content created yet.
            </div>
          ) : (
            <div className="recent-posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentPosts.map(post => {
                const pt = postTypes.find(type => type.slug === post.post_type);
                return (
                  <div key={post.id} className="recent-post-row" style={{
                    display: 'flex', alignItems: 'center', justifyBetween: 'space-between',
                    padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        <Link to={`/admin/edit/${post.post_type}/${post.id}`}>{post.title}</Link>
                      </h4>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Type: <strong style={{ color: 'var(--text-secondary)' }}>{pt?.singular || post.post_type}</strong></span>
                        <span>&bull;</span>
                        <span>Date: {new Date(post.created_at).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span className={`badge ${post.status === 'publish' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link to={`/admin/edit/${post.post_type}/${post.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUICK DRAFT */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={18} style={{ color: 'var(--color-secondary)' }} />
            <span>Quick Draft</span>
          </h2>
          <form onSubmit={handleQuickDraftSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="What's on your mind?"
                style={{ minHeight: '120px' }}
                value={draftContent}
                onChange={e => setDraftContent(e.target.value)}
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Saved drafts appear in Posts.
              </span>
              <button type="submit" className="btn btn-primary btn-sm" disabled={drafting}>
                {drafting ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
