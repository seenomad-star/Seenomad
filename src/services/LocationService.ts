
const CACHE_KEY = 'user_location_country';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface LocationData {
    country: string;
    timestamp: number;
}

export const LocationService = {
    getUserLocation: async (): Promise<string | null> => {
        try {
            // Check cache first
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data: LocationData = JSON.parse(cached);
                if (Date.now() - data.timestamp < CACHE_EXPIRY) {
                    return data.country;
                }
            }

            // Fetch from API
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const country = data.country_name || null;

            if (country) {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    country,
                    timestamp: Date.now()
                }));
            }

            return country;

        } catch (error) {
            console.warn('Failed to fetch user location:', error);
            return null;
        }
    }
};
