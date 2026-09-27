
export type AIProviderId = 'openai' | 'google' | 'xai' | 'deepseek' | 'anthropic';

export interface AIModel {
    id: string;
    name: string;
    provider: AIProviderId;
    description?: string;
    contextWindow?: number;
}

export interface AIProviderConfig {
    apiKey: string;
    baseUrl?: string; // For compatible APIs (like DeepSeek/Grok needing custom endpoints)
}

export interface AICompletionRequest {
    modelId: string;
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface AIProvider {
    id: AIProviderId;
    name: string;
    description: string;

    // Check if configured (has key)
    isConfigured(): boolean;

    // Set configuration
    configure(config: AIProviderConfig): void;

    // Get available models
    getModels(): Promise<AIModel[]>;

    // Generate text
    generateText(request: AICompletionRequest): Promise<string>;

    // Stream text (optional support)
    streamText?(request: AICompletionRequest): AsyncGenerator<string, void, unknown>;
}
