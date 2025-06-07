import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your app preferences and bank connections
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-center text-muted-foreground">
          Settings page coming soon...
        </p>
      </div>
    </div>
  );
};