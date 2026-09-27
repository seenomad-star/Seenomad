
import { AIProvider, AIProviderConfig, AIModel, AICompletionRequest, AIProviderId } from '../types';

export class DeepSeekProvider implements AIProvider {
    id: AIProviderId = 'deepseek';
    name = 'DeepSeek';
    description = 'DeepSeek Coder and Chat models';

    private apiKey: string = '';
    // DeepSeek is often OpenAI compatible
    private baseUrl: string = 'https://api.deepseek.com/v1';

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
            { id: 'deepseek:deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', contextWindow: 32000 },
            { id: 'deepseek:deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', contextWindow: 32000 },
        ];
    }

    async generateText(request: AICompletionRequest): Promise<string> {
        if (!this.isConfigured()) throw new Error('DeepSeek API key not configured');

        const modelId = request.modelId.replace('deepseek:', '');

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
                throw new Error(error.error?.message || 'DeepSeek API Error');
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('DeepSeek Generation Error:', error);
            throw error;
        }
    }
}
