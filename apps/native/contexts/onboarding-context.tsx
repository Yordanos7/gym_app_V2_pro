import { createContext, useContext, useState, ReactNode } from "react";

type OnboardingData = {
  goal: string;
  level: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  equipment: string[];
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    goal: "",
    level: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    equipment: [],
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
