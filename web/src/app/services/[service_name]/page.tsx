'use client';

// Scoped imports
import Layout from '@/layout';
import { ServiceProvider } from '@/contexts/app/ServiceContext';
import ServiceHeader from '@/components/app/service/Header';

interface ServicePageProps {
  params: {
    service_name: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <Layout>
      <ServiceProvider service_name={params.service_name}>
        <ServiceHeader />
      </ServiceProvider>
    </Layout>
  );
}
