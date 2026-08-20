"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../routing';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Save, Info } from 'lucide-react';

export default function Settings() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { settings, saveSettings, categories } = useApp();

  const activeTab = tab || 'general';

  // Local state for all fields
  const [general, setGeneral] = useState({
    siteTitle: '', siteTagline: '', siteUrl: '', adminEmail: '', membership: false, defaultRole: 'subscriber'
  });
  const [reading, setReading] = useState({
    homepageDisplays: 'latest', homepagePageId: '', postsPageId: '', postsPerPage: 10, feedShowRecent: 10, feedFullText: true, searchEngineVisibility: false
  });
  const [writing, setWriting] = useState({
    defaultCategory: '1', defaultPostFormat: 'standard', mailServer: '', mailPort: 110, mailLogin: '', mailPassword: '', mailCategory: '1'
  });
  const [discussion, setDiscussion] = useState({
    attemptNotify: true, linkNotifications: true, allowComments: true, requireNameEmail: true, requireLogin: false, closeComments: false, closeCommentsDays: 14, threadComments: true, threadCommentsDepth: 5, breakComments: false, anyonePostsComment: true, commentHeldForModeration: true, commentMustBeApproved: true, authorMustHaveApprovedComment: true, commentModeration: '', commentBlacklist: ''
  });
  const [permalinks, setPermalinks] = useState({
    structure: 'postname', customStructure: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [pagesList, setPagesList] = useState([]);

  // Sync settings from global state to local state on load
  useEffect(() => {
    if (settings) {
      if (settings.general) setGeneral(settings.general);
      if (settings.reading) setReading(settings.reading);
      if (settings.writing) setWriting(settings.writing);
      if (settings.discussion) setDiscussion(settings.discussion);
      if (settings.permalinks) setPermalinks(settings.permalinks);
    }
  }, [settings]);

  // Load pages list dynamically for reading settings dropdown
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/posts?post_type=page');
        if (res.ok) {
          const data = await res.json();
          setPagesList(data);
        }
      } catch (err) {
        console.error('Error fetching pages for settings:', err);
      }
    };
    fetchPages();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      let dataToSave = {};
      if (activeTab === 'general') dataToSave = general;
      if (activeTab === 'reading') dataToSave = reading;
      if (activeTab === 'writing') dataToSave = writing;
      if (activeTab === 'discussion') dataToSave = discussion;
      if (activeTab === 'permalinks') dataToSave = permalinks;

      await saveSettings(activeTab, dataToSave);
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'writing', name: 'Writing' },
    { id: 'reading', name: 'Reading' },
    { id: 'discussion', name: 'Discussion' },
    { id: 'permalinks', name: 'Permalinks' }
  ];

  if (!settings) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Configure global website preferences, reader permissions, and permalinks.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          {errorMsg}
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="settings-tabs-container" style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => navigate(`/admin/settings/${t.id}`)}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            style={{
              padding: '8px 16px', background: activeTab === t.id ? 'var(--bg-accent)' : 'none',
              border: activeTab === t.id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
              borderRadius: 'var(--radius-md)', color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: activeTab === t.id ? '600' : '500', fontSize: '0.875rem', transition: 'all var(--transition-fast)'
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '24px', maxWidth: '800px' }}>
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Site Title</label>
              <input
                type="text"
                className="form-control"
                value={general.siteTitle}
                onChange={e => setGeneral({ ...general, siteTitle: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-control"
                value={general.siteTagline}
                onChange={e => setGeneral({ ...general, siteTagline: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                In a few words, explain what this site is about.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Site Address (URL)</label>
              <input
                type="url"
                className="form-control"
                value={general.siteUrl}
                onChange={e => setGeneral({ ...general, siteUrl: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Administration Email Address</label>
              <input
                type="email"
                className="form-control"
                value={general.adminEmail}
                onChange={e => setGeneral({ ...general, adminEmail: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Membership</label>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={general.membership}
                  onChange={e => setGeneral({ ...general, membership: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span>Anyone can register</span>
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">New User Default Role</label>
              <select
                className="form-control"
                value={general.defaultRole}
                onChange={e => setGeneral({ ...general, defaultRole: e.target.value })}
              >
                <option value="subscriber">Subscriber</option>
                <option value="contributor">Contributor</option>
                <option value="author">Author</option>
                <option value="editor">Editor</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>
          </div>
        )}

        {/* WRITING TAB */}
        {activeTab === 'writing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Default Post Category</label>
              <select
                className="form-control"
                value={writing.defaultCategory}
                onChange={e => setWriting({ ...writing, defaultCategory: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Default Post Format</label>
              <select
                className="form-control"
                value={writing.defaultPostFormat}
                onChange={e => setWriting({ ...writing, defaultPostFormat: e.target.value })}
              >
                <option value="standard">Standard</option>
                <option value="aside">Aside</option>
                <option value="chat">Chat</option>
                <option value="gallery">Gallery</option>
                <option value="link">Link</option>
                <option value="image">Image</option>
                <option value="quote">Quote</option>
                <option value="status">Status</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <h3 style={{ fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              Post via Email
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              To send posts to your site by email, you must set up a secret email account with POP3 access.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Mail Server</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="mail.example.com"
                  value={writing.mailServer}
                  onChange={e => setWriting({ ...writing, mailServer: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Port</label>
                <input
                  type="number"
                  className="form-control"
                  value={writing.mailPort}
                  onChange={e => setWriting({ ...writing, mailPort: parseInt(e.target.value) || 110 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Login Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={writing.mailLogin}
                  onChange={e => setWriting({ ...writing, mailLogin: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={writing.mailPassword}
                  onChange={e => setWriting({ ...writing, mailPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* READING TAB */}
        {activeTab === 'reading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Your homepage displays</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="homepageDisplays"
                    checked={reading.homepageDisplays === 'latest'}
                    onChange={() => setReading({ ...reading, homepageDisplays: 'latest' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Your latest posts</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="homepageDisplays"
                    checked={reading.homepageDisplays === 'page'}
                    onChange={() => setReading({ ...reading, homepageDisplays: 'page' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>A static page (select below)</span>
                </label>
              </div>
            </div>

            {reading.homepageDisplays === 'page' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingLeft: '24px', borderLeft: '2px solid var(--border-color)' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Homepage</label>
                  <select
                    className="form-control"
                    value={reading.homepagePageId}
                    onChange={e => setReading({ ...reading, homepagePageId: e.target.value })}
                  >
                    <option value="">-- Select Page --</option>
                    {pagesList.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Posts page</label>
                  <select
                    className="form-control"
                    value={reading.postsPageId}
                    onChange={e => setReading({ ...reading, postsPageId: e.target.value })}
                  >
                    <option value="">-- Select Page --</option>
                    {pagesList.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Blog pages show at most</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '80px' }}
                  value={reading.postsPerPage}
                  onChange={e => setReading({ ...reading, postsPerPage: parseInt(e.target.value) || 10 })}
                />
                <span>posts</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Syndication feeds show the most recent</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '80px' }}
                  value={reading.feedShowRecent}
                  onChange={e => setReading({ ...reading, feedShowRecent: parseInt(e.target.value) || 10 })}
                />
                <span>items</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">For each article in a feed, show</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="feedText"
                    checked={reading.feedFullText}
                    onChange={() => setReading({ ...reading, feedFullText: true })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Full text</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="feedText"
                    checked={!reading.feedFullText}
                    onChange={() => setReading({ ...reading, feedFullText: false })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Excerpt</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label">Search engine visibility</label>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={reading.searchEngineVisibility}
                  onChange={e => setReading({ ...reading, searchEngineVisibility: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span>Discourage search engines from indexing this site</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                It is up to search engines to honor this request.
              </p>
            </div>
          </div>
        )}

        {/* DISCUSSION TAB */}
        {activeTab === 'discussion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Default article settings</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.attemptNotify}
                    onChange={e => setDiscussion({ ...discussion, attemptNotify: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Attempt to notify any blogs linked to from the post</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.linkNotifications}
                    onChange={e => setDiscussion({ ...discussion, linkNotifications: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Allow link notifications from other blogs (pingbacks and trackbacks) on new articles</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.allowComments}
                    onChange={e => setDiscussion({ ...discussion, allowComments: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Allow people to submit comments on new posts</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label">Other comment settings</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.requireNameEmail}
                    onChange={e => setDiscussion({ ...discussion, requireNameEmail: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Comment author must fill out name and email</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.requireLogin}
                    onChange={e => setDiscussion({ ...discussion, requireLogin: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Users must be registered and logged in to comment</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label">Email me whenever</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.anyonePostsComment}
                    onChange={e => setDiscussion({ ...discussion, anyonePostsComment: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Anyone posts a comment</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.commentHeldForModeration}
                    onChange={e => setDiscussion({ ...discussion, commentHeldForModeration: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>A comment is held for moderation</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label className="form-label">Before a comment appears</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.commentMustBeApproved}
                    onChange={e => setDiscussion({ ...discussion, commentMustBeApproved: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Comment must be manually approved</span>
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={discussion.authorMustHaveApprovedComment}
                    onChange={e => setDiscussion({ ...discussion, authorMustHaveApprovedComment: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Comment author must have a previously approved comment</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PERMALINKS TAB */}
        {activeTab === 'permalinks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Common Settings</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'plain'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'plain' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Plain <code style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>http://localhost:5173/?p=123</code></span>
                </label>

                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'day-name'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'day-name' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Day and name <code style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>http://localhost:5173/2026/07/28/sample-post/</code></span>
                </label>

                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'month-name'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'month-name' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Month and name <code style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>http://localhost:5173/2026/07/sample-post/</code></span>
                </label>

                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'numeric'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'numeric' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Numeric <code style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>http://localhost:5173/archives/123</code></span>
                </label>

                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'postname'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'postname' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Post name <code style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>http://localhost:5173/sample-post/</code></span>
                </label>

                <label className="form-checkbox-label">
                  <input
                    type="radio"
                    name="permalinkStructure"
                    checked={permalinks.structure === 'custom'}
                    onChange={() => setPermalinks({ ...permalinks, structure: 'custom' })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Custom Structure</span>
                </label>
              </div>
            </div>

            {permalinks.structure === 'custom' && (
              <div className="form-group" style={{ marginBottom: '0', paddingLeft: '24px', borderLeft: '2px solid var(--border-color)' }}>
                <label className="form-label">Custom Permalink Structure</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="/archives/%post_id%"
                  value={permalinks.customStructure}
                  onChange={e => setPermalinks({ ...permalinks, customStructure: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {/* SAVE BUTTON */}
        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
