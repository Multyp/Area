// Global imports
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, ReactNode, useState, ChangeEvent } from 'react';
import axios from 'axios';

interface MyAppletContextType {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleRemoveAction: () => void;
  handleRemoveReaction: () => void;
  actionService: string | null;
  setActionService: (service: string | null) => void;
  actionTrigger: string | null;
  setActionTrigger: (trigger: string | null) => void;
  actionConnected: boolean;
  setActionConnected: (connected: boolean) => void;
  reactionService: string | null;
  setReactionService: (service: string | null) => void;
  reactionTrigger: string | null;
  setReactionTrigger: (trigger: string | null) => void;
  reactionConnected: boolean;
  setReactionConnected: (connected: boolean) => void;
  activeStep: number;
  handleStep: (step: number) => void;
  reactionFields: any;
  setReactionFields: (fields: any) => void;
  dataServices: { name: string; description: string }[];
  isLoadingServices: boolean;
  errorServices: Error | null;
  dataActionTriggers: { name: string; description: string; required_fields: Record<string, string> }[];
  isLoadingActionTriggers: boolean;
  errorActionTriggers: Error | null;
  dataReactionTriggers: { name: string; description: string; required_fields: Record<string, string> }[];
  isLoadingReactionTriggers: boolean;
  errorReactionTriggers: Error | null;
  search: string;
  setSearch: (search: string) => void;
  dataApplets: any[];
  isLoadingApplets: boolean;
  errorApplets: Error | null;
  name: string;
  handleSetName: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCreateApplet: () => Promise<boolean>;
}

const initialState: MyAppletContextType = {
  open: false,
  handleOpen: () => {},
  handleClose: () => {},
  handleRemoveAction: () => {},
  handleRemoveReaction: () => {},
  actionService: null,
  setActionService: () => {},
  actionTrigger: null,
  setActionTrigger: () => {},
  actionConnected: false,
  setActionConnected: () => {},
  reactionService: null,
  setReactionService: () => {},
  reactionTrigger: null,
  setReactionTrigger: () => {},
  reactionConnected: false,
  setReactionConnected: () => {},
  activeStep: 0,
  handleStep: () => {},
  reactionFields: {},
  setReactionFields: () => {},
  dataServices: [],
  isLoadingServices: false,
  errorServices: null,
  dataActionTriggers: [],
  isLoadingActionTriggers: false,
  errorActionTriggers: null,
  dataReactionTriggers: [],
  isLoadingReactionTriggers: false,
  errorReactionTriggers: null,
  search: '',
  setSearch: () => {},
  dataApplets: [],
  isLoadingApplets: false,
  errorApplets: null,
  name: '',
  handleSetName: () => {},
  handleCreateApplet: async () => false,
};

const MyAppletContext = createContext<MyAppletContextType>(initialState);

type MyAppletProviderProps = {
  children: ReactNode;
  token: any;
};

function MyAppletProvider({ children, token }: MyAppletProviderProps) {
  const [open, setOpen] = useState(initialState.open);
  const [activeStep, setActiveStep] = useState(initialState.activeStep);
  const [actionService, setActionService] = useState<string | null>(initialState.actionService);
  const [actionTrigger, setActionTrigger] = useState<string | null>(initialState.actionTrigger);
  const [actionConnected, setActionConnected] = useState<boolean>(false);
  const [reactionService, setReactionService] = useState<string | null>(initialState.reactionService);
  const [reactionTrigger, setReactionTrigger] = useState<string | null>(initialState.reactionTrigger);
  const [reactionConnected, setReactionConnected] = useState<boolean>(false);
  const [reactionFields, setReactionFields] = useState<any>({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleRemoveAction = () => {
    setActionService(null);
    setActionTrigger(null);
    setActionConnected(false);
  };

  const handleRemoveReaction = () => {
    setReactionService(null);
    setReactionTrigger(null);
    setReactionConnected(false);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(initialState.activeStep);
    handleRemoveAction();
    handleRemoveReaction();
  };

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const {
    data: dataServices,
    isLoading: isLoadingServices,
    error: errorServices,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`);
      if (response.status === 200) {
        return response.data.services;
      }
      return [];
    },
  });

  const {
    data: dataActionTriggers,
    isLoading: isLoadingActionTriggers,
    error: errorActionTriggers,
  } = useQuery({
    queryKey: ['action_triggers'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${actionService}/actions`);
      if (response.status === 200) {
        return response.data.actions;
      }
      return [];
    },
    enabled: actionService !== null,
  });

  const {
    data: dataReactionTriggers,
    isLoading: isLoadingReactionTriggers,
    error: errorReactionTriggers,
  } = useQuery({
    queryKey: ['reaction_triggers'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${reactionService}/reactions`);
      if (response.status === 200) {
        return response.data.reactions;
      }
      return [];
    },
    enabled: reactionService !== null,
  });

  const [search, setSearch] = useState('');

  const {
    data: dataApplets,
    isLoading: isLoadingApplets,
    error: errorApplets,
  } = useQuery({
    queryKey: ['applets'],
    queryFn: async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/custom_applets`, {
        token: token,
      });
      if (response.status === 200) {
        return response.data.applets;
      }
      return [];
    },
  });

  const [name, setName] = useState('');
  const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreateApplet = async () => {
    try {
      if (!token || !name || !actionTrigger || !reactionTrigger) {
        return false;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create_custom_applet`, {
        token: token,
        name: name,
        action: {
          service_name: actionService,
          name: actionTrigger,
        },
        reaction: {
          service_name: reactionService,
          name: reactionTrigger,
          fields: reactionFields,
        },
      });
      if (response.status === 201) {
        handleClose();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <MyAppletContext.Provider
      value={{
        open,
        handleOpen,
        handleClose,
        handleRemoveAction,
        handleRemoveReaction,
        actionService,
        setActionService,
        actionTrigger,
        setActionTrigger,
        actionConnected,
        setActionConnected,
        reactionService,
        setReactionService,
        reactionTrigger,
        setReactionTrigger,
        reactionConnected,
        setReactionConnected,
        reactionFields,
        setReactionFields,
        activeStep,
        handleStep,
        dataServices,
        isLoadingServices,
        errorServices,
        dataActionTriggers,
        isLoadingActionTriggers,
        errorActionTriggers,
        dataReactionTriggers,
        isLoadingReactionTriggers,
        errorReactionTriggers,
        search,
        setSearch,
        dataApplets,
        isLoadingApplets,
        errorApplets,
        name,
        handleSetName,
        handleCreateApplet,
      }}
    >
      {children}
    </MyAppletContext.Provider>
  );
}

const useMyApplet = () => useContext(MyAppletContext);

export { MyAppletProvider, useMyApplet };
