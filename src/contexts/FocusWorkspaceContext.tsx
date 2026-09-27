import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorkspaceTheme = 'default' | 'rainy-cafe' | 'cyberpunk-neon' | 'deep-space' | 'forest-cabin';

interface FocusWorkspaceContextType {
    activeTheme: WorkspaceTheme;
    setActiveTheme: (theme: WorkspaceTheme) => void;
    ambientVolume: number;
    setAmbientVolume: (volume: number) => void;
}

const FocusWorkspaceContext = createContext<FocusWorkspaceContextType | undefined>(undefined);

export const FocusWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTheme, setActiveTheme] = useState<WorkspaceTheme>('default');
    const [ambientVolume, setAmbientVolume] = useState(0.5);

    return (
        <FocusWorkspaceContext.Provider value={{
            activeTheme,
            setActiveTheme,
            ambientVolume,
            setAmbientVolume
        }}>
            {children}
        </FocusWorkspaceContext.Provider>
    );
};

export const useFocusWorkspace = () => {
    const context = useContext(FocusWorkspaceContext);
    if (!context) {
        throw new Error('useFocusWorkspace must be used within a FocusWorkspaceProvider');
    }
    return context;
};
