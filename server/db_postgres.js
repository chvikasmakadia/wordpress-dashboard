require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'wordpress_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Helper to run query
async function query(text, params) {
  return pool.query(text, params);
}

// Initialize PostgreSQL Tables
async function init() {
  // First, verify database exists
  const dbName = process.env.DB_NAME || 'wordpress_dashboard';
  const masterClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    await masterClient.connect();
    const checkRes = await masterClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (checkRes.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await masterClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } catch (err) {
    console.error('Warning during database existence check:', err.message);
  } finally {
    await masterClient.end().catch(() => {});
  }

  await query(`
    CREATE TABLE IF NOT EXISTS post_types (
        slug VARCHAR(50) PRIMARY KEY,
        singular VARCHAR(100) NOT NULL,
        plural VARCHAR(100) NOT NULL,
        description TEXT,
        fields JSONB DEFAULT '[]'::jsonb,
        taxonomies JSONB DEFAULT '[]'::jsonb
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        description TEXT,
        post_type VARCHAR(50)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tags (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        post_type VARCHAR(50) NOT NULL,
        featured_image TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        categories JSONB DEFAULT '[]'::jsonb,
        tags JSONB DEFAULT '[]'::jsonb,
        custom_fields JSONB DEFAULT '{}'::jsonb,
        editor_mode VARCHAR(50) DEFAULT 'classic',
        builder_content JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS appearance (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE
    );
  `);
}

// -------------------------------------------------------------
// POST TYPES OPERATIONS
// -------------------------------------------------------------
async function getPostTypes() {
  const res = await query('SELECT * FROM post_types');
  return res.rows;
}

async function createPostType({ slug, singular, plural, description, fields, taxonomies }) {
  await query(
    'INSERT INTO post_types (slug, singular, plural, description, fields, taxonomies) VALUES ($1, $2, $3, $4, $5, $6)',
    [slug, singular, plural, description || '', JSON.stringify(fields || []), JSON.stringify(taxonomies || [])]
  );
  return { slug, singular, plural, description, fields, taxonomies };
}

async function updatePostType(slug, { singular, plural, description, fields, taxonomies }) {
  await query(
    'UPDATE post_types SET singular = $1, plural = $2, description = $3, fields = $4, taxonomies = $5 WHERE slug = $6',
    [singular, plural, description, JSON.stringify(fields), JSON.stringify(taxonomies), slug]
  );
}

async function deletePostType(slug) {
  await query('DELETE FROM post_types WHERE slug = $1', [slug]);
}

// -------------------------------------------------------------
// CATEGORIES OPERATIONS
// -------------------------------------------------------------
async function getCategories(post_type) {
  let res;
  if (post_type) {
    res = await query('SELECT * FROM categories WHERE post_type = $1', [post_type]);
  } else {
    res = await query('SELECT * FROM categories');
  }
  return res.rows;
}

async function createCategory({ id, name, slug, description, post_type }) {
  await query(
    'INSERT INTO categories (id, name, slug, description, post_type) VALUES ($1, $2, $3, $4, $5)',
    [id, name, slug, description || '', post_type || 'post']
  );
}

async function updateCategory(id, { name, slug, description, post_type }) {
  await query(
    'UPDATE categories SET name = $1, slug = $2, description = $3, post_type = $4 WHERE id = $5',
    [name, slug, description, post_type, id]
  );
}

async function deleteCategory(id) {
  await query('DELETE FROM categories WHERE id = $1', [id]);
}

// -------------------------------------------------------------
// TAGS OPERATIONS
// -------------------------------------------------------------
async function getTags() {
  const res = await query('SELECT * FROM tags');
  return res.rows;
}

async function createTag({ id, name, slug }) {
  await query(
    'INSERT INTO tags (id, name, slug) VALUES ($1, $2, $3)',
    [id, name, slug]
  );
}

async function updateTag(id, { name, slug }) {
  await query(
    'UPDATE tags SET name = $1, slug = $2 WHERE id = $3',
    [name, slug, id]
  );
}

async function deleteTag(id) {
  await query('DELETE FROM tags WHERE id = $1', [id]);
}

// -------------------------------------------------------------
// POSTS OPERATIONS
// -------------------------------------------------------------
async function getPosts({ post_type, category, search, status } = {}) {
  let sql = 'SELECT * FROM posts WHERE 1=1';
  const params = [];
  let paramIdx = 1;

  if (post_type) {
    sql += ` AND post_type = $${paramIdx++}`;
    params.push(post_type);
  }
  if (status) {
    sql += ` AND status = $${paramIdx++}`;
    params.push(status);
  }
  if (category) {
    sql += ` AND categories @> $${paramIdx++}`;
    params.push(JSON.stringify([category]));
  }
  if (search) {
    sql += ` AND (LOWER(title) LIKE $${paramIdx} OR LOWER(content) LIKE $${paramIdx})`;
    params.push(`%${search.toLowerCase()}%`);
    paramIdx++;
  }

  sql += ' ORDER BY created_at DESC';

  const res = await query(sql, params);
  return res.rows;
}

async function getPostById(id) {
  const res = await query('SELECT * FROM posts WHERE id = $1', [id]);
  return res.rows[0] || null;
}

async function createPost({ id, title, content, post_type, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content }) {
  await query(
    `INSERT INTO posts (id, title, content, post_type, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content, created_at, updated_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
    [
      id, title, content || '', post_type, featured_image || '', status || 'draft',
      JSON.stringify(categories || []), JSON.stringify(tags || []), JSON.stringify(custom_fields || {}),
      editor_mode || 'classic', JSON.stringify(builder_content || [])
    ]
  );
}

async function updatePost(id, { title, content, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content }) {
  await query(
    `UPDATE posts SET title = $1, content = $2, featured_image = $3, status = $4, categories = $5, tags = $6, custom_fields = $7, editor_mode = $8, builder_content = $9, updated_at = NOW() 
     WHERE id = $10`,
    [
      title, content, featured_image, status, JSON.stringify(categories), JSON.stringify(tags),
      JSON.stringify(custom_fields), editor_mode, JSON.stringify(builder_content), id
    ]
  );
}

async function deletePost(id) {
  await query('DELETE FROM posts WHERE id = $1', [id]);
}

async function deletePostsByPostType(post_type) {
  await query('DELETE FROM posts WHERE post_type = $1', [post_type]);
}

// -------------------------------------------------------------
// SETTINGS OPERATIONS
// -------------------------------------------------------------
async function getSettings() {
  const res = await query('SELECT * FROM settings');
  const settingsObj = {};
  res.rows.forEach(row => {
    settingsObj[row.key] = row.value;
  });
  return settingsObj;
}

async function saveSettings(key, value) {
  await query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    [key, JSON.stringify(value)]
  );
}

// -------------------------------------------------------------
// APPEARANCE OPERATIONS
// -------------------------------------------------------------
async function getAppearance() {
  const res = await query('SELECT * FROM appearance');
  const appearanceObj = {};
  res.rows.forEach(row => {
    appearanceObj[row.key] = row.value;
  });
  return appearanceObj;
}

async function saveAppearance(key, value) {
  await query(
    'INSERT INTO appearance (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    [key, JSON.stringify(value)]
  );
}

// -------------------------------------------------------------
// MEDIA OPERATIONS
// -------------------------------------------------------------
async function getMedia() {
  const res = await query('SELECT * FROM media ORDER BY created_at DESC');
  return res.rows;
}

async function addMedia({ id, name, url }) {
  await query(
    'INSERT INTO media (id, name, url, created_at) VALUES ($1, $2, $3, NOW())',
    [id, name, url]
  );
}

async function deleteMedia(id) {
  await query('DELETE FROM media WHERE id = $1', [id]);
}

module.exports = {
  pool,
  query,
  init,
  getPostTypes,
  createPostType,
  updatePostType,
  deletePostType,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  deletePostsByPostType,
  getSettings,
  saveSettings,
  getAppearance,
  saveAppearance,
  getMedia,
  addMedia,
  deleteMedia,
};
