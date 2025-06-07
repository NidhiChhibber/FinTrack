import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Receipt, 
  Settings, 
  Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Accounts',
    path: '/accounts',
    icon: CreditCard,
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: Receipt,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const location = useLocation();

  const sidebarClasses = isMobile
    ? "bg-card border-t border-border p-2"
    : "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6";

  const navClasses = isMobile
    ? "flex justify-around"
    : "space-y-2";

  return (
    <aside className={sidebarClasses}>
      {/* Desktop Logo */}
      {!isMobile && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FinTrack</h1>
                <p className="text-sm text-muted-foreground">Personal Finance</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={navClasses}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: linkIsActive }) =>
                cn(
                  "flex items-center transition-colors duration-200",
                  isMobile
                    ? "flex-col p-2 rounded-lg space-y-1 min-w-0 flex-1"
                    : "space-x-3 p-3 rounded-lg",
                  linkIsActive || isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <Icon className={cn("shrink-0", isMobile ? "w-5 h-5" : "w-5 h-5")} />
              <span className={cn(
                "font-medium",
                isMobile ? "text-xs text-center" : "text-sm"
              )}>
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};