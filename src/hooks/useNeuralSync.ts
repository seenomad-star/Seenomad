
import { useEffect, useState } from 'react';
import { NeuralSync } from '@/services/NeuralSync';

export function useNeuralSync() {
    const [lastEvent, setLastEvent] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = NeuralSync.subscribe((event) => {
            setLastEvent(event);
            setHistory(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
        });

        return () => { unsubscribe(); };
    }, []);

    return { lastEvent, history };
}
