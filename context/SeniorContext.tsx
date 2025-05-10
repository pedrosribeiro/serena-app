import React, { createContext, useContext, useState } from 'react';

interface Senior {
  id: string;
  name: string;
  age: number;
}

interface SeniorContextType {
  selectedSenior: Senior | null;
  setSelectedSenior: (senior: Senior) => void;
}

const SeniorContext = createContext<SeniorContextType | undefined>(undefined);

export const SeniorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  return (
    <SeniorContext.Provider value={{ selectedSenior, setSelectedSenior }}>
      {children}
    </SeniorContext.Provider>
  );
};

export function useSenior() {
  const context = useContext(SeniorContext);
  if (!context) {
    throw new Error('useSenior must be used within a SeniorProvider');
  }
  return context;
}
