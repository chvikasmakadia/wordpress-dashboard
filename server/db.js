const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure database directory exists
function ensureDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial default data
const DEFAULT_DATA = {
  post_types: [
    {
      slug: 'post',
      singular: 'Post',
      plural: 'Posts',
      description: 'Standard blog posts',
      fields: [], // Built-in default fields (title, content, featured_image, category, tag) are always present
      taxonomies: ['category', 'tag']
    },
    {
      slug: 'page',
      singular: 'Page',
      plural: 'Pages',
      description: 'Static website pages',
      fields: [],
      taxonomies: []
    }
  ],
  categories: [
    { id: '1', name: 'Uncategorized', slug: 'uncategorized', description: 'Default category for posts', post_type: 'post' },
    { id: '2', name: 'News', slug: 'news', description: 'Latest updates', post_type: 'post' }
  ],
  tags: [
    { id: '1', name: 'General', slug: 'general' },
    { id: '2', name: 'Welcome', slug: 'welcome' }
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Hello World!',
      content: 'Welcome to your new WordPress-like dashboard. You can edit this post or delete it and start writing your own content!',
      post_type: 'post',
      featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      status: 'publish',
      categories: ['1'],
      tags: ['1', '2'],
      custom_fields: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'page-1',
      title: 'Sample Page',
      content: 'This is a sample page. It is different from a blog post because it stays in one place and will show up in your site navigation (in most themes).',
      post_type: 'page',
      featured_image: '',
      status: 'publish',
      categories: [],
      tags: [],
      custom_fields: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  settings: {
    general: {
      siteTitle: 'CH Dynamic Admin',
      siteTagline: 'Dynamic CMS Dashboard',
      siteUrl: 'http://localhost:5173',
      adminEmail: 'admin@example.com',
      membership: false,
      defaultRole: 'subscriber'
    },
    reading: {
      homepageDisplays: 'latest',
      homepagePageId: '',
      postsPageId: '',
      postsPerPage: 10,
      feedShowRecent: 10,
      feedFullText: true,
      searchEngineVisibility: false
    },
    writing: {
      defaultCategory: '1',
      defaultPostFormat: 'standard',
      mailServer: 'mail.example.com',
      mailPort: 110,
      mailLogin: 'login@example.com',
      mailPassword: '',
      mailCategory: '1'
    },
    discussion: {
      attemptNotify: true,
      linkNotifications: true,
      allowComments: true,
      requireNameEmail: true,
      requireLogin: false,
      closeComments: false,
      closeCommentsDays: 14,
      threadComments: true,
      threadCommentsDepth: 5,
      breakComments: false,
      anyonePostsComment: true,
      commentHeldForModeration: true,
      commentMustBeApproved: true,
      authorMustHaveApprovedComment: true,
      commentModeration: '',
      commentBlacklist: ''
    },
    permalinks: {
      structure: 'postname', // 'plain', 'day-name', 'month-name', 'numeric', 'postname', 'custom'
      customStructure: '/archives/%post_id%'
    }
  },
  appearance: {
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
      body: {
        family: 'Inter, sans-serif',
        size_desktop: '16',
        size_tablet: '15',
        size_mobile: '14',
        weight: '400',
        style: 'normal',
        case: 'none'
      },
      h1: { family: 'Outfit, sans-serif', size_desktop: '32', size_tablet: '28', size_mobile: '24', weight: '700', style: 'normal', case: 'none' },
      h2: { family: 'Outfit, sans-serif', size_desktop: '28', size_tablet: '24', size_mobile: '20', weight: '700', style: 'normal', case: 'none' },
      h3: { family: 'Outfit, sans-serif', size_desktop: '24', size_tablet: '20', size_mobile: '18', weight: '600', style: 'normal', case: 'none' },
      h4: { family: 'Outfit, sans-serif', size_desktop: '20', size_tablet: '18', size_mobile: '16', weight: '600', style: 'normal', case: 'none' },
      h5: { family: 'Outfit, sans-serif', size_desktop: '18', size_tablet: '16', size_mobile: '14', weight: '600', style: 'normal', case: 'none' },
      h6: { family: 'Outfit, sans-serif', size_desktop: '16', size_tablet: '14', size_mobile: '13', weight: '600', style: 'normal', case: 'none' },
      hyperlinks: {
        family: 'Inter, sans-serif',
        size_desktop: '16',
        size_tablet: '15',
        size_mobile: '14',
        weight: '500',
        style: 'normal',
        case: 'none'
      }
    },
    theme_options: {
      primaryColor: '#6366f1',
      accentColor: '#a855f7',
      bgColor: '#0b0f19',
      panelBgColor: '#151b2c',
      textColor: '#f8fafc',
      headerWidth: '100%',
      footerWidth: '100%',
      contentWidth: '1200px'
    },
    site_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    header_content: [],
    footer_content: []
  },
  media: [
    {
      id: 'med-1',
      name: 'abstract_shape.jpg',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      createdAt: '2026-07-28'
    },
    {
      id: 'med-2',
      name: 'office_desk.jpg',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
      createdAt: '2026-07-28'
    }
  ]
};

function readDB() {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    writeDB(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file, resetting to defaults:', err);
    writeDB(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
}

function writeDB(data) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  get: () => readDB(),
  save: (data) => writeDB(data)
};
