
import { AIProvider, AIProviderConfig, AIModel, AICompletionRequest, AIProviderId } from '../types';

export class OpenAIProvider implements AIProvider {
    id: AIProviderId = 'openai';
    name = 'OpenAI';
    description = 'ChatGPT models (GPT-4o, GPT-3.5)';

    private apiKey: string = '';
    private baseUrl: string = 'https://api.openai.com/v1';

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    configure(config: AIProviderConfig): void {
        this.apiKey = config.apiKey;
        if (config.baseUrl) {
            this.baseUrl = config.baseUrl;
        }
    }

    async getModels(): Promise<AIModel[]> {
        if (!this.isConfigured()) return [];

        // In a real app we might fetch from API, but for simplicity/speed we can hardcode common ones
        // or fetch if we want to be dynamic. Let's hardcode for stability first.
        return [
            { id: 'openai:gpt-4o', name: 'GPT-4o', provider: 'openai', contextWindow: 128000 },
            { id: 'openai:gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000 },
            { id: 'openai:gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', contextWindow: 16000 },
        ];
    }

    async generateText(request: AICompletionRequest): Promise<string> {
        if (!this.isConfigured()) throw new Error('OpenAI API key not configured');

        // Remove provider prefix if present
        const modelId = request.modelId.replace('openai:', '');

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [
                        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
                        { role: 'user', content: request.prompt }
                    ],
                    temperature: request.temperature ?? 0.7,
                    max_tokens: request.maxTokens
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenAI API Error');
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('OpenAI Generation Error:', error);
            throw error;
        }
    }
}
