import { Settings } from './settings-provider';
import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const SettingsContext = createContext({} as Settings);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};
