import React from 'react';
import PostEditor from '@/pages/PostEditor';

export default async function Page({ params }) {
  const { postTypeSlug, id } = await params;
  let initialData = null;

  if (id && id !== 'new') {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
      if (res.ok) {
        initialData = await res.json();
      }
    } catch (err) {
      console.error('Error prefetching post details on server:', err);
    }
  }

  return <PostEditor initialData={initialData} />;
}
