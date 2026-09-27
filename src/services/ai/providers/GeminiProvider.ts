
import { AIProvider, AIProviderConfig, AIModel, AICompletionRequest, AIProviderId } from '../types';

export class GeminiProvider implements AIProvider {
    id: AIProviderId = 'google';
    name = 'Google Gemini';
    description = 'Gemini 1.5 Pro and Flash models';

    private apiKey: string = '';
    // Google uses a different base URL structure usually, but we can standardise on the REST endpoint
    private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    configure(config: AIProviderConfig): void {
        this.apiKey = config.apiKey;
    }

    async getModels(): Promise<AIModel[]> {
        if (!this.isConfigured()) return [];

        return [
            { id: 'google:gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', contextWindow: 1000000 },
            { id: 'google:gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', contextWindow: 1000000 },
            { id: 'google:gemini-pro', name: 'Gemini Pro', provider: 'google', contextWindow: 32000 },
        ];
    }

    async generateText(request: AICompletionRequest): Promise<string> {
        if (!this.isConfigured()) throw new Error('Gemini API key not configured');

        const modelId = request.modelId.replace('google:', '');

        // Construct URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=API_KEY
        const url = `${this.baseUrl}/${modelId}:generateContent?key=${this.apiKey}`;

        try {
            const contents = [
                ...(request.systemPrompt ? [{ role: 'model', parts: [{ text: "System instruction: " + request.systemPrompt }] }] : []), // Gemini is strict about system prompts in REST sometimes, keeping it simple as user message prepended or mapped if supported
                { role: 'user', parts: [{ text: request.prompt }] }
            ];

            // Better system prompt handling for Gemini 1.5
            const body = {
                contents: [{ role: 'user', parts: [{ text: (request.systemPrompt ? `System: ${request.systemPrompt}\n\n` : '') + request.prompt }] }],
                generationConfig: {
                    temperature: request.temperature ?? 0.7,
                    maxOutputTokens: request.maxTokens
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error) {
            console.error('Gemini Generation Error:', error);
            throw error;
        }
    }
}
