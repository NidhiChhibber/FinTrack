// src/features/settings/PlaidLink.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createLinkToken, exchangePublicToken } from '../../api/plaidApi';

const PlaidLink: React.FC = () => {
  const handlerRef = useRef<any>(null);
  const [linkToken, setLinkToken] = useState('');

  useEffect(() => {
    async function setup() {
      try {
        const res = await createLinkToken();
        setLinkToken(res.link_token);

        handlerRef.current = (window as any).Plaid.create({
          token: res.link_token,
          onSuccess: async (public_token: string, metadata: any) => {
            try {
              await exchangePublicToken(public_token, metadata);
              console.log('Plaid linked');
            } catch (err) {
              console.error('Exchange failed', err);
            }
          },
          onExit: (err: any, metadata: any) => {
            console.log('Exited Plaid:', err, metadata);
          },
        });
      } catch (err) {
        console.error('Failed to create link token', err);
      }
    }

    setup();
  }, []);

  const handleConnect = () => {
    if (handlerRef.current) {
      handlerRef.current.open();
    }
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Connect to Bank
      </button>
    </div>
  );
};

export default PlaidLink;
