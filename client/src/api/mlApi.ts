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


export async function retrainModel<T = unknown>(): Promise<T> {
  return postJson<T>('/api/ml/retrain-model', {});
}