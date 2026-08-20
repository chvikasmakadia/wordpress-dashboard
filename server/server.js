const express = require('express');
const cors = require('cors');
const pgDb = require('./db_postgres');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize PostgreSQL and fail fast if unavailable
pgDb.init()
  .then(() => {
    console.log('PostgreSQL database connected and initialized successfully.');
    // Start Server only after db successfully initializes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('FATAL ERROR: PostgreSQL connection failed. Server cannot start.');
    console.error(err.stack || err);
    process.exit(1);
  });

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// -------------------------------------------------------------
// POST TYPES API
// -------------------------------------------------------------

// Get all post types
app.get('/api/post-types', async (req, res) => {
  try {
    const pts = await pgDb.getPostTypes();
    res.json(pts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post type
app.post('/api/post-types', async (req, res) => {
  const { slug, singular, plural, description, fields, taxonomies } = req.body;
  
  if (!slug || !singular || !plural) {
    return res.status(400).json({ error: 'Slug, Singular label, and Plural label are required.' });
  }

  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!normalizedSlug) {
    return res.status(400).json({ error: 'Invalid slug. Only letters, numbers, hyphens, and underscores are allowed.' });
  }

  try {
    const pts = await pgDb.getPostTypes();
    if (pts.some(pt => pt.slug === normalizedSlug)) {
      return res.status(400).json({ error: `Post type with slug "${normalizedSlug}" already exists.` });
    }
    const newPostType = await pgDb.createPostType({
      slug: normalizedSlug,
      singular,
      plural,
      description: description || '',
      fields: fields || [],
      taxonomies: taxonomies || ['category', 'tag']
    });
    res.status(201).json(newPostType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing post type
app.put('/api/post-types/:slug', async (req, res) => {
  const { slug } = req.params;
  const { singular, plural, description, fields, taxonomies } = req.body;

  if (slug === 'post' || slug === 'page') {
    return res.status(400).json({ error: 'Default post types (post, page) cannot be modified.' });
  }

  try {
    const pts = await pgDb.getPostTypes();
    const existing = pts.find(pt => pt.slug === slug);
    if (!existing) {
      return res.status(404).json({ error: `Post type "${slug}" not found.` });
    }
    const updated = {
      singular: singular || existing.singular,
      plural: plural || existing.plural,
      description: description !== undefined ? description : existing.description,
      fields: fields || existing.fields,
      taxonomies: taxonomies || existing.taxonomies
    };
    await pgDb.updatePostType(slug, updated);
    res.json({ slug, ...updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post type
app.delete('/api/post-types/:slug', async (req, res) => {
  const { slug } = req.params;

  if (slug === 'post' || slug === 'page') {
    return res.status(400).json({ error: 'Default post types (post, page) cannot be deleted.' });
  }

  try {
    const pts = await pgDb.getPostTypes();
    const index = pts.findIndex(pt => pt.slug === slug);
    if (index === -1) {
      return res.status(404).json({ error: `Post type "${slug}" not found.` });
    }
    await pgDb.deletePostType(slug);
    await pgDb.deletePostsByPostType(slug);
    res.json({ message: `Post type "${slug}" and its posts successfully deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POSTS API
// -------------------------------------------------------------

// Get posts, with optional filters
app.get('/api/posts', async (req, res) => {
  const { post_type, category, search, status } = req.query;
  try {
    const results = await pgDb.getPosts({ post_type, category, search, status });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await pgDb.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
  const { title, content, post_type, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (!post_type) {
    return res.status(400).json({ error: 'Post type is required.' });
  }

  try {
    const pts = await pgDb.getPostTypes();
    if (!pts.some(pt => pt.slug === post_type)) {
      return res.status(400).json({ error: `Invalid post type: "${post_type}"` });
    }
    const newId = generateId();
    const newPost = {
      id: newId,
      title,
      content: content || '',
      post_type,
      featured_image: featured_image || '',
      status: status || 'draft',
      categories: categories || [],
      tags: tags || [],
      custom_fields: custom_fields || {},
      editor_mode: editor_mode || 'classic',
      builder_content: builder_content || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await pgDb.createPost(newPost);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content } = req.body;

  try {
    const existing = await pgDb.getPostById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    const updated = {
      title: title !== undefined ? title : existing.title,
      content: content !== undefined ? content : existing.content,
      featured_image: featured_image !== undefined ? featured_image : existing.featured_image,
      status: status !== undefined ? status : existing.status,
      categories: categories !== undefined ? categories : existing.categories,
      tags: tags !== undefined ? tags : existing.tags,
      custom_fields: custom_fields !== undefined ? custom_fields : existing.custom_fields,
      editor_mode: editor_mode !== undefined ? editor_mode : existing.editor_mode,
      builder_content: builder_content !== undefined ? builder_content : existing.builder_content
    };
    await pgDb.updatePost(id, updated);
    res.json({ id, ...updated, updated_at: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Duplicate a post or page
app.post('/api/posts/:id/duplicate', async (req, res) => {
  const { id } = req.params;
  
  try {
    const sourcePost = await pgDb.getPostById(id);
    if (!sourcePost) {
      return res.status(404).json({ error: 'Post to duplicate not found.' });
    }
    const duplicatedPost = {
      ...sourcePost,
      id: generateId(),
      title: `${sourcePost.title} (Copy)`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await pgDb.createPost(duplicatedPost);
    res.status(201).json(duplicatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await pgDb.getPostById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    await pgDb.deletePost(id);
    res.json({ message: 'Post successfully deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CATEGORIES & TAGS API
// -------------------------------------------------------------

// Get categories
app.get('/api/categories', async (req, res) => {
  const { post_type } = req.query;
  try {
    const cats = await pgDb.getCategories(post_type);
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add category
app.post('/api/categories', async (req, res) => {
  const { name, slug, description, post_type } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const targetPostType = post_type || 'post';
  const normalizedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');

  try {
    const cats = await pgDb.getCategories();
    if (cats.some(c => c.slug === normalizedSlug && (c.post_type || 'post') === targetPostType)) {
      return res.status(400).json({ error: `Category slug "${normalizedSlug}" already exists for post type "${targetPostType}".` });
    }
    const newCat = {
      id: generateId(),
      name,
      slug: normalizedSlug,
      description: description || '',
      post_type: targetPostType
    };
    await pgDb.createCategory(newCat);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;

  if (id === '1') {
    return res.status(400).json({ error: 'Uncategorized category cannot be deleted.' });
  }

  try {
    const cats = await pgDb.getCategories();
    if (!cats.some(c => c.id === id)) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    await pgDb.deleteCategory(id);
    
    // Clean up posts category list
    const posts = await pgDb.getPosts();
    for (const p of posts) {
      if (p.categories && p.categories.includes(id)) {
        const filtered = p.categories.filter(catId => catId !== id);
        if (filtered.length === 0 && p.post_type === 'post') {
          filtered.push('1'); // Default uncategorized
        }
        await pgDb.updatePost(p.id, { ...p, categories: filtered });
      }
    }
    res.json({ message: 'Category successfully deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tags
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await pgDb.getTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add tag
app.post('/api/tags', async (req, res) => {
  const { name, slug } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Tag name is required.' });
  }

  const normalizedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');

  try {
    const tags = await pgDb.getTags();
    if (tags.some(t => t.slug === normalizedSlug)) {
      return res.status(400).json({ error: `Tag slug "${normalizedSlug}" already exists.` });
    }
    const newTag = {
      id: generateId(),
      name,
      slug: normalizedSlug
    };
    await pgDb.createTag(newTag);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// SETTINGS API
// -------------------------------------------------------------

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const settingsObj = await pgDb.getSettings();
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save settings
app.post('/api/settings', async (req, res) => {
  const { section, settings } = req.body; // e.g. section = 'general'
  if (!section || !settings) {
    return res.status(400).json({ error: 'Section and settings object are required.' });
  }

  try {
    const allSettings = await pgDb.getSettings();
    const existingSection = allSettings[section] || {};
    const merged = {
      ...existingSection,
      ...settings
    };
    await pgDb.saveSettings(section, merged);
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// APPEARANCE API
// -------------------------------------------------------------

// Get appearance configurations
app.get('/api/appearance', async (req, res) => {
  try {
    const appearance = await pgDb.getAppearance();
    if (Object.keys(appearance).length === 0) {
      const defaultAppearance = {
        menus: [
          {
            id: 'menu-1',
            name: 'Header Navigation',
            location: 'primary',
            items: [
              { id: 'item-1', type: 'page', targetId: 'page-1', title: 'Sample Page', url: '/posts/page/page-1' }
            ]
          }
        ],
        custom_fonts: [
          'Inter, sans-serif',
          'Outfit, sans-serif',
          "'Playfair Display', serif",
          "'Lora', serif",
          'system-ui, -apple-system, sans-serif'
        ],
        fonts: {
          body: { family: 'Inter, sans-serif', size_desktop: '16', size_tablet: '15', size_mobile: '14', weight: '400', style: 'normal', case: 'none' },
          h1: { family: 'Outfit, sans-serif', size_desktop: '32', size_tablet: '28', size_mobile: '24', weight: '700', style: 'normal', case: 'none' },
          h2: { family: 'Outfit, sans-serif', size_desktop: '28', size_tablet: '24', size_mobile: '20', weight: '700', style: 'normal', case: 'none' },
          h3: { family: 'Outfit, sans-serif', size_desktop: '24', size_tablet: '20', size_mobile: '18', weight: '600', style: 'normal', case: 'none' },
          h4: { family: 'Outfit, sans-serif', size_desktop: '20', size_tablet: '18', size_mobile: '16', weight: '600', style: 'normal', case: 'none' },
          h5: { family: 'Outfit, sans-serif', size_desktop: '18', size_tablet: '16', size_mobile: '14', weight: '600', style: 'normal', case: 'none' },
          h6: { family: 'Outfit, sans-serif', size_desktop: '16', size_tablet: '14', size_mobile: '13', weight: '600', style: 'normal', case: 'none' },
          hyperlinks: { family: 'Inter, sans-serif', size_desktop: '16', size_tablet: '15', size_mobile: '14', weight: '500', style: 'normal', case: 'none' }
        },
        theme_options: {
          primaryColor: '#6366f1',
          accentColor: '#a855f7',
          bgColor: '#0b0f19',
          panelBgColor: '#151b2c',
          textColor: '#f8fafc'
        },
        site_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
        header_content: [],
        footer_content: [],
        uploaded_fonts: []
      };
      for (const [k, v] of Object.entries(defaultAppearance)) {
        await pgDb.saveAppearance(k, v);
      }
      return res.json(defaultAppearance);
    }
    res.json(appearance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appearance configurations
app.put('/api/appearance', async (req, res) => {
  const { menus, fonts, theme_options, custom_fonts, uploaded_fonts, header_content, footer_content, site_logo } = req.body;
  
  try {
    if (menus !== undefined) await pgDb.saveAppearance('menus', menus);
    if (fonts !== undefined) await pgDb.saveAppearance('fonts', fonts);
    if (theme_options !== undefined) await pgDb.saveAppearance('theme_options', theme_options);
    if (custom_fonts !== undefined) await pgDb.saveAppearance('custom_fonts', custom_fonts);
    if (uploaded_fonts !== undefined) await pgDb.saveAppearance('uploaded_fonts', uploaded_fonts);
    if (header_content !== undefined) await pgDb.saveAppearance('header_content', header_content);
    if (footer_content !== undefined) await pgDb.saveAppearance('footer_content', footer_content);
    if (site_logo !== undefined) await pgDb.saveAppearance('site_logo', site_logo);
    
    const updated = await pgDb.getAppearance();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// MEDIA LIBRARY API
// -------------------------------------------------------------

// GET media items list
app.get('/api/media', async (req, res) => {
  try {
    const media = await pgDb.getMedia();
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST media item upload
app.post('/api/media', async (req, res) => {
  const { name, url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL or base64 data is required' });
  }

  const newId = `med-${Date.now()}`;
  const newMedia = {
    id: newId,
    name: name || `upload-${Date.now().toString().slice(-4)}.png`,
    url,
    createdAt: new Date().toISOString().split('T')[0]
  };

  try {
    await pgDb.addMedia(newMedia);
    res.json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE media item
app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const media = await pgDb.getMedia();
    const exists = media.some(m => m.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Media item not found' });
    }
    await pgDb.deleteMedia(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
