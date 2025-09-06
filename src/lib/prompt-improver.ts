// System prompt for AI prompt improvement
export const PROMPT_IMPROVEMENT_SYSTEM_PROMPT = `You are an expert AI prompt engineer. Your role is to analyze and improve user prompts to make them more effective, specific, and likely to produce high-quality results from AI models.

When improving a prompt, consider these key principles:

1. **Clarity & Specificity**: Make vague requests more specific and actionable
2. **Context & Background**: Add relevant context that helps the AI understand the use case
3. **Structure & Format**: Specify desired output format, length, and structure
4. **Role Definition**: Define the AI's role or expertise area when appropriate
5. **Examples & Constraints**: Include examples or constraints to guide the response
6. **Tone & Style**: Specify the desired tone, style, or audience level

Your improvements should:
- Preserve the original intent while making it more effective
- Add specific details that enhance clarity without being overwhelming
- Include formatting instructions when the output structure matters
- Suggest relevant context or background information
- Maintain a natural, conversational flow
- Be concise but comprehensive

Return ONLY the improved prompt without any explanation or meta-commentary. The improved prompt should be ready to use immediately.`;

export interface PromptImprovementRequest {
  originalPrompt: string;
  apiKey?: string;
}

export interface PromptImprovementResponse {
  improvedPrompt: string;
  success: boolean;
  error?: string;
}

export async function improvePromptWithAI(
  request: PromptImprovementRequest
): Promise<PromptImprovementResponse> {
  const { originalPrompt, apiKey } = request;

  if (!originalPrompt.trim()) {
    return {
      improvedPrompt: '',
      success: false,
      error: 'Original prompt cannot be empty'
    };
  }

  if (!apiKey) {
    return {
      improvedPrompt: '',
      success: false,
      error: 'API key is required'
    };
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: PROMPT_IMPROVEMENT_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Please improve this prompt:\n\n"${originalPrompt}"`
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 1500,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 0.1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const improvedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!improvedPrompt) {
      throw new Error('No improved prompt received from API');
    }

    return {
      improvedPrompt,
      success: true
    };

  } catch (error) {
    console.error('Error improving prompt:', error);
    return {
      improvedPrompt: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Fallback improvement logic for demo purposes
export function improvePromptDemo(originalPrompt: string): string {
  let improved = originalPrompt.trim();
  
  // Add more specific details
  if (!improved.includes("detailed")) {
    improved = "Create a detailed " + improved;
  }
  
  // Add quality expectations
  if (!improved.toLowerCase().includes("high quality")) {
    improved += ", ensuring high quality output";
  }
  
  // Add style guidance if not present
  if (!improved.includes("style")) {
    improved += ", maintaining a professional and engaging style";
  }
  
  // Add clarity about format if not specified
  if (!improved.includes("format")) {
    improved += ". Present the information in a clear, well-structured format";
  }
  
  // Add request for examples if appropriate
  if (!improved.includes("example")) {
    improved += ", including relevant examples where appropriate";
  }
  
  return improved;
}