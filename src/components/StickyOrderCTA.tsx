"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StickyOrderCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on order page or admin pages
  const shouldHide = pathname === '/order' || pathname?.startsWith('/admin');

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (shouldHide) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      <Link 
        href="/order"
        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white"
      >
        <span className="text-2xl">🥡</span>
        <span className="hidden sm:inline">Order Now</span>
        <span className="sm:hidden">Order</span>
      </Link>
    </div>
  );
}
