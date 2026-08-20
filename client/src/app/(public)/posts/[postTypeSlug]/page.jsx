import React from 'react';
import PublicArchive from '@/pages/PublicArchive';

export default async function Page({ params }) {
  const { postTypeSlug } = await params;
  let initialData = null;

  try {
    const postsRes = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });
    if (postsRes.ok) {
      const allPosts = await postsRes.json();
      const filtered = allPosts.filter(p => p.post_type === postTypeSlug && p.status === 'publish');
      initialData = {
        posts: filtered
      };
    }
  } catch (err) {
    console.error('Error prefetching archive posts on server:', err);
  }

  return <PublicArchive initialData={initialData} />;
}
