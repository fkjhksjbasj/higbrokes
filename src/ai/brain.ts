import axios from 'axios';
import { config } from '../config';

export async function think(systemPrompt: string, userMessage: string): Promise<string> {
  const model = config.replicateModel || 'openai/gpt-4o-mini';

  const response = await axios.post(
    `https://api.replicate.com/v1/models/${model}/predictions`,
    {
      input: {
        prompt: userMessage,
        max_completion_tokens: 1024,
        temperature: 0.7,
        top_p: 1,
        system_prompt: systemPrompt,
        presence_penalty: 0,
        frequency_penalty: 0,
      },
    },
    {
      headers: {
        'Authorization': `Token ${config.replicateApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Poll for completion
  let prediction = response.data;
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const statusResponse = await axios.get(prediction.urls.get, {
      headers: { 'Authorization': `Token ${config.replicateApiKey}` },
    });
    prediction = statusResponse.data;
  }

  if (prediction.status === 'failed') {
    throw new Error('LLM prediction failed: ' + (prediction.error || 'unknown'));
  }

  return Array.isArray(prediction.output) ? prediction.output.join('') : String(prediction.output);
}

export async function getAgentDecision(systemPrompt: string, stateContext: string): Promise<any> {
  const raw = await think(systemPrompt, stateContext);

  // Extract JSON from response (handle markdown code blocks)
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Find the first { and last } to extract JSON
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No JSON found in LLM response: ' + raw.substring(0, 200));
  }

  try {
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (error) {
    throw new Error('Invalid JSON from LLM: ' + cleaned.substring(start, Math.min(start + 200, end + 1)));
  }
}
