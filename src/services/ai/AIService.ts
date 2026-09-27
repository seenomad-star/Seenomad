import { AIProvider, AIProviderId, AICompletionRequest, AIProviderConfig, AIModel } from './types';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { DeepSeekProvider } from './providers/DeepSeekProvider';
import { GrokProvider } from './providers/GrokProvider';

class AIService {
    private static instance: AIService;
    private providers: Map<AIProviderId, AIProvider> = new Map();
    private activeProviderId: AIProviderId = 'openai';

    private constructor() {
        // Initialize providers
        this.registerProvider(new OpenAIProvider());
        this.registerProvider(new GeminiProvider());
        this.registerProvider(new DeepSeekProvider());
        this.registerProvider(new GrokProvider());

        // Load config from localStorage
        this.loadConfig();
    }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private registerProvider(provider: AIProvider) {
        this.providers.set(provider.id, provider);
    }

    private loadConfig() {
        try {
            const storedConfig = localStorage.getItem('ai-service-config');
            if (storedConfig) {
                const config = JSON.parse(storedConfig);

                // Load provider configs
                if (config.providers) {
                    Object.entries(config.providers).forEach(([providerId, providerConfig]) => {
                        const provider = this.providers.get(providerId as AIProviderId);
                        if (provider) {
                            provider.configure(providerConfig as AIProviderConfig);
                        }
                    });
                }

                // Load active provider
                if (config.activeProviderId && this.providers.has(config.activeProviderId)) {
                    this.activeProviderId = config.activeProviderId;
                }
            }
        } catch (error) {
            console.error('Failed to load AI config:', error);
        }
    }

    public saveConfig(providerId: AIProviderId, config: AIProviderConfig) {
        const provider = this.providers.get(providerId);
        if (provider) {
            provider.configure(config);

            // Persist to local storage
            const rawConfig = localStorage.getItem('ai-service-config');
            const currentConfig = rawConfig ? JSON.parse(rawConfig) : { providers: {}, activeProviderId: 'openai' };

            if (!currentConfig.providers) currentConfig.providers = {};
            currentConfig.providers[providerId] = config;

            localStorage.setItem('ai-service-config', JSON.stringify(currentConfig));
        }
    }

    public setActiveProvider(id: AIProviderId) {
        if (!this.providers.has(id)) {
            throw new Error(`Provider ${id} not found`);
        }
        this.activeProviderId = id;

        // Persist active provider change
        const rawConfig = localStorage.getItem('ai-service-config');
        const currentConfig = rawConfig ? JSON.parse(rawConfig) : { providers: {}, activeProviderId: id };
        currentConfig.activeProviderId = id;
        localStorage.setItem('ai-service-config', JSON.stringify(currentConfig));
    }

    public getActiveProviderId(): AIProviderId {
        return this.activeProviderId;
    }

    public getProvider(id: AIProviderId): AIProvider | undefined {
        return this.providers.get(id);
    }

    public getAllProviders(): AIProvider[] {
        return Array.from(this.providers.values());
    }

    public async getAvailableModels(): Promise<AIModel[]> {
        const models: AIModel[] = [];
        for (const provider of this.providers.values()) {
            if (provider.isConfigured()) {
                try {
                    const providerModels = await provider.getModels();
                    models.push(...providerModels);
                } catch (error) {
                    console.error(`Error fetching models for ${provider.name}:`, error);
                }
            }
        }
        return models;
    }

    public async generateText(request: AICompletionRequest): Promise<string> {
        try {
            // If request specifies a model, try to use its provider
            let providerId = this.activeProviderId;
            if (request.modelId && request.modelId.includes(':')) {
                const requestedProviderId = request.modelId.split(':')[0] as AIProviderId;
                // Map internal IDs if necessary (e.g. google vs gemini)
                if (this.providers.has(requestedProviderId)) {
                    providerId = requestedProviderId;
                }
            }

            const provider = this.providers.get(providerId);
            if (!provider || !provider.isConfigured()) {
                throw new Error(`AI Provider ${providerId} is not configured with an API key.`);
            }

            return await provider.generateText(request);
        } catch (error: any) {
            console.error('AI Generation Error:', error);
            throw new Error(error.message || 'Failed to generate text. Check your API key settings.');
        }
    }
}

export const aiService = AIService.getInstance();
