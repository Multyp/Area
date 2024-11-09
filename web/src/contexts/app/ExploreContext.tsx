// Global imports
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createContext, useContext, ReactNode, useState } from 'react';
import axios from 'axios';

// Scoped imports
import useToken from '@/hooks/useToken';

const ExploreContext = createContext<any>({});

type ExploreProviderProps = {
  children: ReactNode;
};

function ExploreProvider({ children }: ExploreProviderProps) {
  const token = useToken();
  const { data: dataExplore, isLoading: isLoadingExplore } = useQuery({
    queryKey: ['explore'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/explore`, {
          params: { token },
        });

        if (response.status === 200) {
          return response.data.data;
        }

        return null;
      } catch (error) {
        console.error('Error fetching explore data:', error);
        return null;
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  const handleCreateApplet = async ({
    token,
    appletName,
    selectedService1,
    selectedAction1,
    selectedService2,
    selectedAction2,
    fields,
  }: {
    token: any;
    appletName: string;
    selectedService1: string;
    selectedAction1: string;
    selectedService2: string;
    selectedAction2: string;
    fields: Map<string, string>;
  }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create_custom_applet`, {
        token,
        name: appletName,
        action: {
          service_name: selectedService1,
          name: selectedAction1,
        },
        reaction: {
          service_name: selectedService2,
          name: selectedAction2,
          fields: Object.fromEntries(fields),
        },
      });
      if (response.status === 201) {
        console.log('Applet created:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error creating applet:', error);
    }
  };

  return (
    <ExploreContext.Provider
      value={{
        dataExplore,
        isLoadingExplore,
        search,
        setSearch,
        open,
        handleToggle,
        handleCreateApplet,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
}

const useExplore = () => useContext(ExploreContext);

export { ExploreProvider, useExplore };
