import React, { createContext, useContext, useReducer } from 'react';
import type { AppSettings } from '../types';

interface AppState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_USER'; payload: AppState['user'] };

const initialState: AppState = {
  settings: {
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: true,
    autoSync: true,
  },
  isLoading: false,
  error: null,
  user: null, // Will be set after auth implementation
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      updateSettings, 
      setLoading, 
      setError 
    }}>
      {children}
    </AppContext.Provider>
  );
};