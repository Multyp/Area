'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppletsPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/explore`);
  }, [router]);
  return;
}
