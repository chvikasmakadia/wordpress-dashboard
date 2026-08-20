import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import PostList from './pages/PostList';
import PostEditor from './pages/PostEditor';
import PostTypeBuilder from './pages/PostTypeBuilder';
import CategoriesManager from './pages/CategoriesManager';
import Settings from './pages/Settings';
import AppearanceMenus from './pages/AppearanceMenus';
import AppearanceFonts from './pages/AppearanceFonts';
import AppearanceThemeOptions from './pages/AppearanceThemeOptions';
import AppearanceHeaderFooter from './pages/AppearanceHeaderFooter';
import MediaManager from './pages/MediaManager';

// Public Frontend Imports
import PublicLayout from './components/PublicLayout';
import PublicHome from './pages/PublicHome';
import PublicSingle from './pages/PublicSingle';
import PublicArchive from './pages/PublicArchive';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Frontend Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="posts/:postTypeSlug" element={<PublicArchive />} />
            <Route path="posts/:postTypeSlug/:id" element={<PublicSingle />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Dashboard Home */}
            <Route index element={<Dashboard />} />
            <Route path="media" element={<MediaManager />} />
            
            {/* Post Lists by Post Type */}
            <Route path="posts/:postTypeSlug" element={<PostList />} />
            
            {/* Add New / Edit Posts */}
            <Route path="edit/:postTypeSlug/:id" element={<PostEditor />} />
            <Route path="edit/:postTypeSlug" element={<Navigate to="new" replace />} />
            
            {/* Categories Manager for Post Type */}
            <Route path="categories/:postTypeSlug" element={<CategoriesManager />} />
            
            {/* Custom Post Type Builder */}
            <Route path="builder" element={<PostTypeBuilder />} />
            
            {/* Settings Tab Routing */}
            <Route path="settings/:tab" element={<Settings />} />
            <Route path="settings" element={<Navigate to="general" replace />} />

            {/* Appearance Menus, Fonts, and Colors */}
            <Route path="appearance/menus" element={<AppearanceMenus />} />
            <Route path="appearance/fonts" element={<AppearanceFonts />} />
            <Route path="appearance/theme-options" element={<AppearanceThemeOptions />} />
            <Route path="appearance/header-footer" element={<AppearanceHeaderFooter />} />
            
            {/* Catch-all Admin Redirect */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Catch-all Public Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
