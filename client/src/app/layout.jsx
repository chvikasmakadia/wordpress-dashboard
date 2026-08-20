import React from 'react';
import { AppProvider } from '../context/AppContext';
import '../index.css';
import '../App.css';

export default async function RootLayout({ children }) {
  let initialSettings = null;
  let initialAppearance = null;
  let initialPostTypes = [];

  try {
    const [settingsRes, appearanceRes, postTypesRes] = await Promise.all([
      fetch('http://localhost:5000/api/settings', { cache: 'no-store' }),
      fetch('http://localhost:5000/api/appearance', { cache: 'no-store' }),
      fetch('http://localhost:5000/api/post-types', { cache: 'no-store' })
    ]);
    if (settingsRes.ok) initialSettings = await settingsRes.json();
    if (appearanceRes.ok) initialAppearance = await appearanceRes.json();
    if (postTypesRes.ok) initialPostTypes = await postTypesRes.json();
  } catch (err) {
    console.error('Error prefetching config on server:', err);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider
          initialSettings={initialSettings}
          initialAppearance={initialAppearance}
          initialPostTypes={initialPostTypes}
        >
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
