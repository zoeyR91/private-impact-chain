import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">Private Impact Chain</h1>
            <p className="text-sm text-gray-600">FHE-Encrypted Charity Impact Tracking</p>
          </div>
        </div>
      </div>
    </header>
  );
};
