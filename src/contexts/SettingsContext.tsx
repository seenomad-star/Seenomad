import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SettingsState {
    soundEnabled: boolean;
    volume: number;
    fontFamily: string;
    fontSize: number;
    wordCount: number;
    smoothCaret: boolean;
    liveWPM: boolean;
    dailyReminder: boolean;
    achievementNotifications: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
    soundEnabled: true,
    volume: 70,
    fontFamily: 'jetbrains',
    fontSize: 24,
    wordCount: 30,
    smoothCaret: true,
    liveWPM: true,
    dailyReminder: false,
    achievementNotifications: true,
};

interface SettingsContextType {
    settings: SettingsState;
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(() => {
        const saved = localStorage.getItem('typingos_settings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    useEffect(() => {
        localStorage.setItem('typingos_settings', JSON.stringify(settings));

        // Apply visual settings to document element or body
        document.documentElement.style.setProperty('--typing-font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--typing-font-family',
            settings.fontFamily === 'jetbrains' ? '"JetBrains Mono", monospace' :
                settings.fontFamily === 'fira' ? '"Fira Code", monospace' : '"Source Code Pro", monospace'
        );
    }, [settings]);

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
