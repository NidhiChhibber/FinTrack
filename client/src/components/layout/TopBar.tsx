import React from 'react';
import { Bell, User, Wallet } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../ui/button';

export const TopBar: React.FC = () => {
  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">FinTrack</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};