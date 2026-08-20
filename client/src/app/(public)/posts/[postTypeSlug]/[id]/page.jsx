import React from 'react';
import PublicSingle from '@/pages/PublicSingle';

export default async function Page({ params }) {
  const { id } = await params;
  let initialData = null;

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      initialData = {
        post: data
      };
    }
  } catch (err) {
    console.error('Error prefetching single post details on server:', err);
  }

  return <PublicSingle initialData={initialData} />;
}
