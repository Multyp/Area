'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const OAuthRedirect: React.FC = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  useEffect(() => {
    if (window.opener && url) {
      window.opener.postMessage({ oauth_redirect_url: url }, window.location.origin);
      window.close();
    }
  }, [url]);

  return (
    <div>
      <p>Logged in successfully, Redirecting...</p>
    </div>
  );
};

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthRedirect />
    </Suspense>
  );
}
