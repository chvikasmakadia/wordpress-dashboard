const fs = require('fs');
const path = require('path');
const dbPostgres = require('./db_postgres');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

async function runMigration() {
  console.log('--- Database Migration Starter ---');
  
  // 1. Initialize PostgreSQL Tables
  console.log('1. Connecting to PostgreSQL and initializing schemas...');
  try {
    await dbPostgres.init();
    console.log('   Schemas established successfully.');
  } catch (err) {
    console.error('   FATAL: Could not connect to PostgreSQL. Check your credentials in .env.');
    console.error(err);
    process.exit(1);
  }

  // 2. Read the local JSON file database
  if (!fs.existsSync(DB_FILE)) {
    console.log(`2. Notice: JSON database file not found at ${DB_FILE}. Nothing to migrate.`);
    process.exit(0);
  }

  let data;
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('2. Error: Failed to parse JSON database file:', err);
    process.exit(1);
  }

  console.log(`2. Parsed JSON db.json containing:`);
  console.log(`   - Post Types: ${data.post_types?.length || 0}`);
  console.log(`   - Categories: ${data.categories?.length || 0}`);
  console.log(`   - Tags: ${data.tags?.length || 0}`);
  console.log(`   - Posts: ${data.posts?.length || 0}`);
  console.log(`   - Media: ${data.media?.length || 0}`);

  // 3. Migrate Post Types
  if (Array.isArray(data.post_types)) {
    console.log('3. Migrating Post Types...');
    for (const pt of data.post_types) {
      try {
        await dbPostgres.query(
          'INSERT INTO post_types (slug, singular, plural, description, fields, taxonomies) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING',
          [pt.slug, pt.singular, pt.plural, pt.description || '', JSON.stringify(pt.fields || []), JSON.stringify(pt.taxonomies || [])]
        );
      } catch (err) {
        console.error(`   Error migrating post type "${pt.slug}":`, err.message);
      }
    }
  }

  // 4. Migrate Categories
  if (Array.isArray(data.categories)) {
    console.log('4. Migrating Categories...');
    for (const cat of data.categories) {
      try {
        await dbPostgres.query(
          'INSERT INTO categories (id, name, slug, description, post_type) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
          [cat.id, cat.name, cat.slug, cat.description || '', cat.post_type || 'post']
        );
      } catch (err) {
        console.error(`   Error migrating category "${cat.name}":`, err.message);
      }
    }
  }

  // 5. Migrate Tags
  if (Array.isArray(data.tags)) {
    console.log('5. Migrating Tags...');
    for (const tag of data.tags) {
      try {
        await dbPostgres.query(
          'INSERT INTO tags (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
          [tag.id, tag.name, tag.slug]
        );
      } catch (err) {
        console.error(`   Error migrating tag "${tag.name}":`, err.message);
      }
    }
  }

  // 6. Migrate Posts
  if (Array.isArray(data.posts)) {
    console.log('6. Migrating Posts...');
    for (const post of data.posts) {
      try {
        await dbPostgres.query(
          `INSERT INTO posts (id, title, content, post_type, featured_image, status, categories, tags, custom_fields, editor_mode, builder_content, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING`,
          [
            post.id, post.title, post.content || '', post.post_type, post.featured_image || '', post.status || 'draft',
            JSON.stringify(post.categories || []), JSON.stringify(post.tags || []), JSON.stringify(post.custom_fields || {}),
            post.editor_mode || 'classic', JSON.stringify(post.builder_content || []),
            post.created_at || new Date().toISOString(), post.updated_at || new Date().toISOString()
          ]
        );
      } catch (err) {
        console.error(`   Error migrating post "${post.title}":`, err.message);
      }
    }
  }

  // 7. Migrate Settings
  if (data.settings && typeof data.settings === 'object') {
    console.log('7. Migrating settings groups...');
    for (const [key, value] of Object.entries(data.settings)) {
      try {
        await dbPostgres.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
          [key, JSON.stringify(value)]
        );
      } catch (err) {
        console.error(`   Error migrating settings key "${key}":`, err.message);
      }
    }
  }

  // 8. Migrate Appearance
  if (data.appearance && typeof data.appearance === 'object') {
    console.log('8. Migrating appearance items...');
    for (const [key, value] of Object.entries(data.appearance)) {
      try {
        await dbPostgres.query(
          'INSERT INTO appearance (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
          [key, JSON.stringify(value)]
        );
      } catch (err) {
        console.error(`   Error migrating appearance key "${key}":`, err.message);
      }
    }
  }

  // 9. Migrate Media
  if (Array.isArray(data.media)) {
    console.log('9. Migrating Media records...');
    for (const med of data.media) {
      try {
        await dbPostgres.query(
          'INSERT INTO media (id, name, url, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [med.id, med.name, med.url, med.createdAt || new Date().toISOString()]
        );
      } catch (err) {
        console.error(`   Error migrating media file "${med.name}":`, err.message);
      }
    }
  }

  console.log('--- Migration completed successfully! ---');
  await dbPostgres.pool.end();
}

runMigration().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
