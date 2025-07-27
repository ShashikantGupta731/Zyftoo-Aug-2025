'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// Enhanced Admin Sidebar Component
const ModernAdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: '🏠',
      exact: true
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: '👥',
      submenu: [
        { title: 'All Users', href: '/admin/users' },
        { title: 'Add User', href: '/admin/users/create' },
        { title: 'Corporate Users', href: '/admin/users/corporate' }
      ]
    },
    {
      title: 'Product Management',
      href: '/admin/products',
      icon: '📦',
      submenu: [
        { title: 'All Products', href: '/admin/products' },
        { title: 'Add Product', href: '/admin/products/create' },
        { title: 'Categories', href: '/admin/categories' }
      ]
    },
    {
      title: 'Order Management',
      href: '/admin/orders',
      icon: '📋',
      submenu: [
        { title: 'All Orders', href: '/admin/orders' },
        { title: 'Pending Orders', href: '/admin/orders/pending' },
        { title: 'Order Reports', href: '/admin/orders/reports' }
      ]
    },
    {
      title: 'Content Management',
      href: '/admin/content',
      icon: '📝',
      submenu: [
        { title: 'Pages', href: '/admin/content/pages' },
        { title: 'Categories Section', href: '/admin/content/categories-section' },
        { title: 'Media Library', href: '/admin/content/media' }
      ]
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
      submenu: [
        { title: 'General', href: '/admin/settings/general' },
        { title: 'Email', href: '/admin/settings/email' },
        { title: 'Security', href: '/admin/settings/security' }
      ]
    }
  ];

  const isActiveRoute = (href, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-white text-xl font-semibold">Admin Panel</h1>
      </div>
      
      <nav className="mt-5 px-2">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            <Link
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isActiveRoute(item.href, item.exact)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
            
            {item.submenu && isActiveRoute(item.href) && (
              <div className="ml-6 mt-1">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className={`group flex items-center px-2 py-1 text-sm rounded-md transition-colors duration-150 ${
                      pathname === subItem.href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="absolute bottom-0 w-full p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{user?.name?.charAt(0)}</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md transition-colors duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Enhanced Admin Header Component
const ModernAdminHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">
              Centralized Admin
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome, {user?.name}
            </span>
            <button
              onClick={() => router.push('/')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Site
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Modern Centralized Admin Layout Component
const ModernAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <ModernAdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={toggleSidebar}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernAdminHeader toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;
