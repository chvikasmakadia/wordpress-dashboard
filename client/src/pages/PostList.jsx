"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '../routing';
import { useApp } from '../context/AppContext';
import { Plus, Search, Copy, Trash2, Edit3, Loader2 } from 'lucide-react';

export default function PostList() {
  const { postTypeSlug } = useParams();
  const { postTypes, categories, reloadAll } = useApp();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Find current post type details
  const currentPostType = postTypes.find(pt => pt.slug === postTypeSlug);

  const fetchPosts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const queryParams = new URLSearchParams({ post_type: postTypeSlug });
      if (statusFilter) queryParams.append('status', statusFilter);
      if (catFilter) queryParams.append('category', catFilter);
      if (search) queryParams.append('search', search);

      const res = await fetch(`/api/posts?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        setErrorMessage('Failed to load posts.');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setErrorMessage('Network error fetching posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postTypeSlug) {
      fetchPosts();
    }
  }, [postTypeSlug, statusFilter, catFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleDuplicate = async (id) => {
    setDuplicatingId(id);
    try {
      const res = await fetch(`/api/posts/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        // Refresh posts list
        await fetchPosts();
      } else {
        alert('Failed to duplicate post.');
      }
    } catch (err) {
      console.error('Error duplicating post:', err);
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!currentPostType) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Post Type Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>The post type you are looking for does not exist.</p>
        <Link to="/admin" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Dashboard</Link>
      </div>
    );
  }

  // Check if categories are supported for this post type
  const hasCategories = currentPostType.taxonomies?.includes('category');

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{currentPostType.plural}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage all your {currentPostType.plural.toLowerCase()} here.
          </p>
        </div>
        <Link to={`/admin/edit/${postTypeSlug}/new`} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New {currentPostType.singular}</span>
        </Link>
      </div>

      {errorMessage && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {errorMessage}
        </div>
      )}

      {/* FILTER BAR */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status select */}
          <select 
            className="form-control" 
            style={{ width: '150px', padding: '8px 12px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="publish">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Category select (if taxonomy category is active) */}
          {hasCategories && (
            <select 
              className="form-control" 
              style={{ width: '180px', padding: '8px 12px' }}
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.filter(c => (c.post_type || 'post') === postTypeSlug).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', width: '320px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={`Search ${currentPostType.plural.toLowerCase()}...`}
            style={{ padding: '8px 12px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '8px 12px' }}>
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* POSTS TABLE */}
      <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '10px', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={24} />
            <span>Loading {currentPostType.plural.toLowerCase()}...</span>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            No {currentPostType.plural.toLowerCase()} found. <Link to={`/admin/edit/${postTypeSlug}/new`}>Create one now</Link>!
          </div>
        ) : (
          <div className="admin-table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  {hasCategories && <th>Categories</th>}
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => {
                  // Get post categories
                  const postCats = post.categories
                    ? categories.filter(c => post.categories.includes(c.id)).map(c => c.name).join(', ')
                    : '';

                  return (
                    <tr key={post.id}>
                      <td style={{ fontWeight: '500' }}>
                        <Link to={`/admin/edit/${postTypeSlug}/${post.id}`} style={{ color: '#fff', fontSize: '0.95rem' }}>
                          {post.title}
                        </Link>
                        
                        {/* WP Hover Action Links */}
                        <div className="row-actions">
                          <Link to={`/admin/edit/${postTypeSlug}/${post.id}`}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Edit3 size={11} /> Edit
                            </span>
                          </Link>
                          
                          <button 
                            onClick={() => handleDuplicate(post.id)}
                            disabled={duplicatingId === post.id}
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Copy size={11} /> {duplicatingId === post.id ? 'Duplicating...' : 'Duplicate'}
                            </span>
                          </button>

                          <button 
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="action-danger"
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Trash2 size={11} /> Trash
                            </span>
                          </button>
                        </div>
                      </td>
                      {hasCategories && (
                        <td>
                          {postCats || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      )}
                      <td>
                        <span className={`badge ${post.status === 'publish' ? 'badge-success' : 'badge-warning'}`}>
                          {post.status === 'publish' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(post.created_at).toLocaleDateString()}
                          <br />
                          {post.status === 'publish' ? 'Published' : 'Last Modified'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
