"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    return pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <nav className="flex gap-6 text-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/admin" 
          className={`border-b-2 py-3 ${isActive('/admin') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Overview
        </Link>
        <Link 
          href="/admin/today" 
          className={`border-b-2 py-3 ${isActive('/admin/today') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Today
        </Link>
        <Link 
          href="/admin/orders" 
          className={`border-b-2 py-3 ${isActive('/admin/orders') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Orders
        </Link>
        <Link 
          href="/admin/items" 
          className={`border-b-2 py-3 ${isActive('/admin/items') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Items
        </Link>
        <Link 
          href="/admin/customers" 
          className={`border-b-2 py-3 ${isActive('/admin/customers') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Customers
        </Link>
        <Link 
          href="/admin/revenue" 
          className={`border-b-2 py-3 ${isActive('/admin/revenue') ? 'border-red-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
        >
          Revenue
        </Link>
      </nav>
    </div>
  );
}
