import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define age ranges and their corresponding groups
export const ageRanges = ['6-8', '9-11', '12-14'] as const;
export type AgeRange = typeof ageRanges[number];

export const ageRangeToGroup: Record<AgeRange, 'young' | 'middle' | 'older'> = {
  '6-8': 'young',
  '9-11': 'middle',
  '12-14': 'older',
};

// Define the shape of the context
interface AgeGroupContextType {
  ageRange: AgeRange;
  ageGroup: 'young' | 'middle' | 'older';
  setAgeRange: (range: AgeRange) => void;
}

// Create the context with default values
const AgeGroupContext = createContext<AgeGroupContextType>({
  ageRange: '6-8',
  ageGroup: 'young',
  setAgeRange: () => {},
});

// Custom hook for using the age group context
export const useAgeGroup = () => useContext(AgeGroupContext);

// Provider component
interface AgeGroupProviderProps {
  children: ReactNode;
}

export const AgeGroupProvider = ({ children }: AgeGroupProviderProps) => {
  const [ageRange, setAgeRange] = useState<AgeRange>('6-8');
  const ageGroup = ageRangeToGroup[ageRange];

  return (
    <AgeGroupContext.Provider
      value={{
        ageRange,
        ageGroup,
        setAgeRange,
      }}
    >
      {children}
    </AgeGroupContext.Provider>
  );
};

export default AgeGroupContext;
