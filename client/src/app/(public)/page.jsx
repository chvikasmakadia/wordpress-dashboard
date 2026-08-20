import React from 'react';
import PublicHome from '@/pages/PublicHome';

export default async function Page() {
  let initialData = null;

  try {
    const settingsRes = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      const homepageDisplays = settings?.reading?.homepageDisplays || 'latest';
      const homepagePageId = settings?.reading?.homepagePageId || '';

      if (homepageDisplays === 'page' && homepagePageId) {
        const pageRes = await fetch(`http://localhost:5000/api/posts/${homepagePageId}`, { cache: 'no-store' });
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          if (pageData.status === 'publish') {
            initialData = {
              homepageDisplays: 'page',
              staticPage: pageData,
              latestPosts: []
            };
          }
        }
      }

      if (!initialData) {
        const postsRes = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });
        if (postsRes.ok) {
          const allPosts = await postsRes.json();
          const latestPosts = allPosts.filter(p => p.post_type === 'post' && p.status === 'publish');
          initialData = {
            homepageDisplays: 'latest',
            staticPage: null,
            latestPosts
          };
        }
      }
    }
  } catch (err) {
    console.error('Error prefetching homepage data on server:', err);
  }

  return <PublicHome initialData={initialData} />;
}
