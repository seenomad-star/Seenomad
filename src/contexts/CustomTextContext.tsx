import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CustomTextConfig {
  text: string;
  isActive: boolean;
}

interface CustomTextContextType {
  customText: CustomTextConfig;
  setCustomText: (text: string) => void;
  activateCustomText: () => void;
  setAndActivate: (text: string) => void;
  clearCustomText: () => void;
}

const CustomTextContext = createContext<CustomTextContextType | undefined>(undefined);

export const CustomTextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customText, setCustomTextState] = useState<CustomTextConfig>({
    text: "",
    isActive: false,
  });

  const setCustomText = (text: string) => {
    setCustomTextState({ text, isActive: false });
  };

  const activateCustomText = () => {
    setCustomTextState((prev) => {
      if (prev.text.trim()) {
        return { ...prev, isActive: true };
      }
      return prev;
    });
  };

  const setAndActivate = (text: string) => {
    if (text.trim()) {
      setCustomTextState({ text: text.trim(), isActive: true });
    }
  };

  const clearCustomText = () => {
    setCustomTextState({ text: "", isActive: false });
  };

  return (
    <CustomTextContext.Provider value={{ customText, setCustomText, activateCustomText, setAndActivate, clearCustomText }}>
      {children}
    </CustomTextContext.Provider>
  );
};

export const useCustomText = () => {
  const context = useContext(CustomTextContext);
  if (!context) {
    throw new Error("useCustomText must be used within a CustomTextProvider");
  }
  return context;
};
