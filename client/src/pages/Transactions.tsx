import React from 'react';

export const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all your transactions
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-center text-muted-foreground">
          Transactions page coming soon...
        </p>
      </div>
    </div>
  );
};