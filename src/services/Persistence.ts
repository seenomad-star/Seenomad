

/**
 * PersistenceService
 * Abstraction layer for data storage.
 * Supports Hybrid persistence: local storage + Cloud cloud fallback.
 */
class PersistenceService {
    async save(key: string, data: any): Promise<void> {
        try {
            // Always save to localStorage for local-first experience
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving to storage [${key}]:`, e);
        }
    }

    async load<T>(key: string, defaultValue: T): Promise<T> {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return defaultValue;
            return JSON.parse(stored) as T;
        } catch (e) {
            console.error(`Error loading from storage [${key}]:`, e);
            return defaultValue;
        }
    }

    // syncToCloud removed for loginless architecture

    async clear(key: string): Promise<void> {
        localStorage.removeItem(key);
    }
}

export const Storage = new PersistenceService();
