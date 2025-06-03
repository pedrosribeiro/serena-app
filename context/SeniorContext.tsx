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
  setSelectedSenior: (senior: Senior) => void;
  seniors: Senior[];
  setSeniors: (seniors: Senior[]) => void;
}

const SeniorContext = createContext<SeniorContextType | undefined>(undefined);

export const SeniorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  const [seniors, setSeniors] = useState<Senior[]>([]);
  return (
    <SeniorContext.Provider value={{ selectedSenior, setSelectedSenior, seniors, setSeniors }}>
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
