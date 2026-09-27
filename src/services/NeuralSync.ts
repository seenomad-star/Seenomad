
type NeuralEvent =
    | { type: 'CLAN_ACTIVITY'; payload: { clanId: string; message: string; timestamp: number } }
    | { type: 'GLOBAL_ACHIEVEMENT'; payload: { username: string; achievement: string; timestamp: number } }
    | { type: 'FRIEND_STATUS'; payload: { userId: string; status: 'online' | 'offline'; timestamp: number } }
    | { type: 'SEASON_UPDATE'; payload: { message: string; timestamp: number } };

type NeuralListener = (event: NeuralEvent) => void;

class NeuralSyncService {
    private listeners: Set<NeuralListener> = new Set();
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        this.startSimulation();
    }

    subscribe(listener: NeuralListener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private emit(event: NeuralEvent) {
        this.listeners.forEach(listener => listener(event));
    }

    private startSimulation() {
        // Simulate periodic events
        this.intervalId = setInterval(() => {
            const chance = Math.random();

            if (chance < 0.1) {
                this.emit({
                    type: 'GLOBAL_ACHIEVEMENT',
                    payload: {
                        username: `Typist_${Math.floor(Math.random() * 1000)}`,
                        achievement: 'Reached 100 WPM!',
                        timestamp: Date.now()
                    }
                });
            } else if (chance < 0.2) {
                this.emit({
                    type: 'SEASON_UPDATE',
                    payload: {
                        message: 'A new Global Challenge has appeared!',
                        timestamp: Date.now()
                    }
                });
            }
        }, 15000); // Every 15 seconds
    }

    stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    // Allow manual event emission for internal actions
    broadcast(event: NeuralEvent) {
        this.emit(event);
    }
}

export const NeuralSync = new NeuralSyncService();
