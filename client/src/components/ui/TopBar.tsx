// TopBar.tsx
import React from 'react';
import { MdMenu } from 'react-icons/md';
import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 top-bar-background flex items-center justify-between px-6">
      <ThemeToggle />
    </header>
  );
};

export default TopBar;
