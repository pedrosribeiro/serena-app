import React, { createContext, useContext, useState } from 'react';

interface Senior {
  id: string;
  name: string;
  age: number;
  // Permite outros campos vindos da API
  [key: string]: any;
}

interface SeniorContextType {
  selectedSenior: Senior | null;
  setSelectedSenior: (senior: Senior | null) => void;
  seniors: Senior[];
  setSeniors: (seniors: Senior[]) => void;
  resetState: () => void;
}

const SeniorContext = createContext<SeniorContextType | undefined>(undefined);

export const SeniorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  const [seniors, setSeniors] = useState<Senior[]>([]);

  const resetState = () => {
    setSelectedSenior(null);
    setSeniors([]);
  };

  return (
    <SeniorContext.Provider value={{ selectedSenior, setSelectedSenior, seniors, setSeniors, resetState }}>
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
