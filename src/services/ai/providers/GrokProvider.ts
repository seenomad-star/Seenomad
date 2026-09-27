
import { AIProvider, AIProviderConfig, AIModel, AICompletionRequest, AIProviderId } from '../types';

export class GrokProvider implements AIProvider {
    id: AIProviderId = 'xai';
    name = 'Grok (xAI)';
    description = 'Grok-1 and future models';

    private apiKey: string = '';
    // xAI is OpenAI compatible
    private baseUrl: string = 'https://api.x.ai/v1';

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

        return [
            { id: 'xai:grok-beta', name: 'Grok Beta', provider: 'xai', contextWindow: 128000 },
            { id: 'xai:grok-vision-beta', name: 'Grok Vision Beta', provider: 'xai', contextWindow: 128000 },
        ];
    }

    async generateText(request: AICompletionRequest): Promise<string> {
        if (!this.isConfigured()) throw new Error('Grok API key not configured');

        const modelId = request.modelId.replace('xai:', '');

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
                throw new Error(error.error?.message || 'Grok API Error');
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Grok Generation Error:', error);
            throw error;
        }
    }
}
