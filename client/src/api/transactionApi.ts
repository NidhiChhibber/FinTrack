// src/api/transactionApi.ts
import { Transaction } from "../types/transaction";

// --- Utility Functions ---

async function postJson<T>(url: string, body: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`POST ${url} failed: ${response.statusText}`);
  }

  return response.json();
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.statusText}`);
  }

  return response.json();
}

// --- API Functions ---

export async function getTransactions(startDate?: string, endDate?: string): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return getJson<Transaction[]>(`/api/transactions?${params.toString()}`);
}

export async function deleteTransaction(plaidId: string | number): Promise<void> {
  const res = await fetch(`/api/transactions/by-plaid-id/${plaidId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE failed for plaidId ${plaidId}: ${res.statusText}`);
  }
}

export async function syncTransactionsFromBank(userId: string): Promise<Transaction[]> {
  return postJson<Transaction[]>("/api/plaid/sync_transactions", { user_id: userId });
}

export async function updateTransactionCategory(plaidId: string, category: string): Promise<Transaction> {
  const res = await fetch(`/api/transactions/by-plaid-id/${plaidId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update category for ${plaidId}: ${res.statusText}`);
  }

  return res.json();
}
