import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdAnalytics,
  MdClose,
  MdSettings,
} from 'react-icons/md';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', icon: <MdDashboard />, view: 'dashboard', path: '/dashboard' },
    { label: 'Transactions', icon: <MdReceiptLong />, view: 'transactions', path: '/transactions' },
    { label: 'Analytics', icon: <MdAnalytics />, view: 'analytics', path: '/analytics' },
    { label: 'Settings', icon: <MdSettings />, view: 'settings', path: '/settings' },
  ];

  return (
    <aside
      className={`
        fixed top-16 left-0 z-40 h-[calc(100%-4rem)] w-64
        bg-card text-muted-foreground
        border-r border-border
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
      `}
    >
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="flex justify-between items-center mb-6 md:mb-0">
          <button onClick={onClose} className="md:hidden text-foreground text-2xl">
            <MdClose />
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ label, icon, view, path }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => {
                onViewChange(view);
                onClose();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                ${isActive
                  ? 'bg-muted text-foreground font-semibold'
                  : 'hover:bg-muted hover:text-foreground'}`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
