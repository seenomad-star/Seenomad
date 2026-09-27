import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface PulseEvent {
    id: string;
    message: string;
    type: 'achievement' | 'milestone' | 'system' | 'social';
}

interface UniversePulseContextType {
    events: PulseEvent[];
    addEvent: (message: string, type: PulseEvent['type']) => void;
}

const UniversePulseContext = createContext<UniversePulseContextType | undefined>(undefined);

export const UniversePulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<PulseEvent[]>([
        { id: '1', message: '2,401 users currently in "SSC Mission"', type: 'social' },
        { id: '2', message: 'System Load: Optimal (42.1ms Latency)', type: 'system' },
        { id: '3', message: 'New Record: JohnD set 154 WPM in USA Global', type: 'achievement' }
    ]);

    const addEvent = useCallback((message: string, type: PulseEvent['type']) => {
        const newEvent: PulseEvent = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type
        };
        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, []);

    // Simulate real-time activity
    useEffect(() => {
        const interval = setInterval(() => {
            const randomType = ['achievement', 'social', 'milestone'][Math.floor(Math.random() * 3)] as PulseEvent['type'];
            const names = ['Alpha', 'Nova', 'Cyber', 'Ghost', 'Elite', 'Vikas', 'Priya', 'Rahul'];
            const name = names[Math.floor(Math.random() * names.length)];

            let msg = '';
            if (randomType === 'achievement') {
                msg = `${name} just hit ${Math.floor(Math.random() * 50) + 80} WPM in ${['English', 'Hindi', 'Tamil'][Math.floor(Math.random() * 3)]}`;
            } else if (randomType === 'social') {
                msg = `${name} earned a new "Speed Demon" badge`;
            } else {
                msg = `New Career Mission started by ${name} in Sector-7`;
            }

            addEvent(msg, randomType);
        }, 15000); // New event every 15 seconds

        return () => clearInterval(interval);
    }, [addEvent]);

    return (
        <UniversePulseContext.Provider value={{ events, addEvent }}>
            {children}
        </UniversePulseContext.Provider>
    );
};

export const useUniversePulse = () => {
    const context = useContext(UniversePulseContext);
    if (!context) {
        throw new Error('useUniversePulse must be used within a UniversePulseProvider');
    }
    return context;
};
