import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your financial overview and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Income</h3>
          </div>
          <div className="text-2xl font-bold">$5,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Expenses</h3>
          </div>
          <div className="text-2xl font-bold">$3,142.67</div>
          <p className="text-xs text-muted-foreground">
            +10.5% from last month
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Net Income</h3>
          </div>
          <div className="text-2xl font-bold">$2,089.22</div>
          <p className="text-xs text-muted-foreground">
            +35.2% from last month
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Net Worth</h3>
          </div>
          <div className="text-2xl font-bold">$15,234.56</div>
          <p className="text-xs text-muted-foreground">
            +12.3% from last month
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Spending Overview</h3>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart placeholder - We'll add charts next
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Grocery Store</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <span className="text-sm font-medium">-$67.89</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Salary Deposit</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <span className="text-sm font-medium text-green-600">+$2,500.00</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Coffee Shop</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <span className="text-sm font-medium">-$4.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};