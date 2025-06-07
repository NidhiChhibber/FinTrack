export interface Transaction {
  plaidId: string;
  name: string;
  amount: number;
  date: string;
  category?: string;
  merchantName?: string;
  plaidItemId: number;
  plaidAccountId: number;
}