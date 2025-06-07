import React, { useEffect, useRef } from 'react';
import { createLinkToken, exchangePublicToken } from '../../api/plaidApi';
import { retrainModel } from '../../api/mlApi';

const Settings: React.FC = () => {
  const handlerRef = useRef<any>(null);

  useEffect(() => {
    async function setupPlaid() {
      try {
        const res = await createLinkToken();
        handlerRef.current = (window as any).Plaid.create({
          token: res.link_token,
          onSuccess: async (public_token: string, metadata: any) => {
            try {
              await exchangePublicToken(public_token, metadata);
              console.log('Access token saved');
            } catch (err) {
              console.error('Exchange failed', err);
            }
          },
          onExit: (err: any, metadata: any) => {
            console.log('User exited:', err, metadata);
          },
        });
      } catch (err) {
        console.error('Failed to create link token:', err);
      }
    }

    setupPlaid();
  }, []);

  const launchLink = () => {
    if (handlerRef.current) {
      handlerRef.current.open();
    } else {
      console.warn('Plaid not ready yet');
    }
  };

  const handleRetrainModel = async () => {
    retrainModel();
};

  const sandboxAutoConnect = async () => {
    try {
      const res = await fetch('/api/plaid/sandbox_auto_connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      console.log('Sandbox connected:', data);
      alert('Sandbox connection complete. Transactions synced.');
    } catch (err) {
      console.error('Sandbox auto-connect failed:', err);
      alert('Failed to simulate bank connection');
    }
  };

  return (
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Settings</h2>

    <button
      onClick={launchLink}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Connect to Bank
    </button>

    {import.meta.env.MODE === 'development' && (
      <>
        <button
          onClick={sandboxAutoConnect}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          Sandbox: Auto-Connect Bank
        </button>

        <button
          onClick={handleRetrainModel}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
        Retrain ML Model
        </button>
      </>
    )}
  </div>
);
}

export default Settings;
