async function postJson<T>(url: string, body: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to POST ${url}: ${response.statusText}`);
  }
  return response.json();
}

export async function createLinkToken(): Promise<{ link_token: string }> {
  return postJson<{ link_token: string }>('/api/plaid/create_link_token', {});
}

export async function exchangePublicToken(
  public_token: string,
  metadata: any
): Promise<{ access_token: string; item_id: string }> {
  return postJson<{ access_token: string; item_id: string }>('/api/plaid/exchange_public_token', {
    public_token,
    metadata,
  });
}

export async function syncTransactions(userId: string): Promise<any[]> {
  return postJson<any[]>('/api/plaid/sync_transactions', {
    user_id: userId
  });
}
