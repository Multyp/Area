// Global imports
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createContext, useContext, ReactNode, useState } from 'react';
import axios from 'axios';

interface ServiceContextType {
  dataService: any;
  isLoadingService: boolean;
  errorService: any;
}

const initialServiceContext: ServiceContextType = {
  dataService: null,
  isLoadingService: false,
  errorService: null,
};

const ServiceContext = createContext<ServiceContextType>(initialServiceContext);

type ServiceProviderProps = {
  service_name: string;
  children: ReactNode;
};

function ServiceProvider({ service_name, children }: ServiceProviderProps) {
  const {
    data: dataService,
    isLoading: isLoadingService,
    error: errorService,
  } = useQuery({
    queryKey: ['service', service_name],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/${service_name}`);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    },
  });

  return (
    <ServiceContext.Provider
      value={{
        dataService,
        isLoadingService,
        errorService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

const useService = () => useContext(ServiceContext);

export { ServiceProvider, useService };
