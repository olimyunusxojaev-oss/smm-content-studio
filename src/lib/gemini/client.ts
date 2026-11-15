import { GenerationParams, PostVariant } from '@/types/post';
import { buildSystemPrompt } from './prompts';

export interface StreamCallbacks {
  onChunk: (accumulatedText: string, partialVariants: Partial<PostVariant>[]) => void;
  onComplete: (variants: PostVariant[]) => void;
  onError: (error: Error) => void;
}

/**
 * Validate a Gemini API key with a minimal request
 */
export async function testGeminiApiKey(apiKey: string, model: string = 'gemini-2.0-flash'): Promise<{ valid: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { valid: false, message: 'Ключ слишком короткий или пустой' };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'ping' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `Ошибка сервера (${response.status})`;
      if (response.status === 400 || response.status === 403) {
        return { valid: false, message: 'Неверный API-ключ Gemini или доступ ограничен' };
      }
      return { valid: false, message: msg };
    }

    return { valid: true, message: 'Ключ успешно проверен и активен' };
  } catch (err: unknown) {
    const error = err as Error;
    return { valid: false, message: error.message || 'Сетевая ошибка проверки ключа' };
  }
}

/**
 * Stream post variants generation directly from Gemini API
 */
export async function streamPostGeneration(
  params: GenerationParams,
  apiKey: string,
  model: string = 'gemini-2.0-flash',
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    callbacks.onError(new Error('API-ключ Gemini не найден. Пожалуйста, укажите его в настройках.'));
    return;
  }

  const systemPrompt = buildSystemPrompt(params);
  const userPrompt = `Тема / идея поста: "${params.postIdea}"\nСгенерируй 3 готовых варианта по инструкции.`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errorMessage = errJson.error?.message || `Ошибка запроса к Gemini (${response.status})`;
      if (response.status === 400 || response.status === 403) {
        throw new Error('Неверный API ключ Gemini. Проверьте ключ в настройках (⚙️).');
      } else if (response.status === 429) {
        throw new Error('Превышен лимит запросов Gemini API. Подождите пару секунд и повторите.');
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('Потоковый ответ Gemini пуст.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const textPart = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            accumulatedText += textPart;

            // Extract partial variants for live progressive fade-up
            const partials = extractPartialVariants(accumulatedText);
            callbacks.onChunk(accumulatedText, partials);
          } catch {
            // Partial JSON chunk line
          }
        }
      }
    }

    // Finished streaming, parse final variants
    const finalVariants = parseFinalVariants(accumulatedText);
    callbacks.onComplete(finalVariants);
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') {
      return; // Canceled cleanly
    }
    callbacks.onError(err as Error);
  }
}

/**
 * Robust JSON parser with fallback cleanup
 */
function parseFinalVariants(rawText: string): PostVariant[] {
  let cleaned = rawText.trim();
  // Strip Markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    const data = JSON.parse(cleaned);
    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      return data.variants.map((v: Partial<PostVariant>, index: number) => ({
        id: v.id || `v${index + 1}`,
        styleName: v.styleName || `Вариант ${index + 1}`,
        headline: v.headline || 'Заголовок поста',
        body: v.body || 'Текст поста формируется...',
        cta: v.cta || 'Подписывайтесь!',
        hashtags: Array.isArray(v.hashtags) ? v.hashtags : ['#бизнес'],
        hookScore: v.hookScore || (index === 0 ? 3 : index === 1 ? 3 : 2)
      }));
    }
  } catch (e) {
    console.warn('Direct JSON parse failed, trying partial extraction...', e);
  }

  // Fallback if JSON format was slightly distorted
  return fallbackRegexParser(rawText);
}

/**
 * Lightweight partial extractor for live streaming UI
 */
function extractPartialVariants(text: string): Partial<PostVariant>[] {
  const variants: Partial<PostVariant>[] = [];
  
  // Quick regex matches for headline, body, cta during stream
  const headlineMatches = Array.from(text.matchAll(/"headline"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"?/g));
  const bodyMatches = Array.from(text.matchAll(/"body"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"?/g));
  const ctaMatches = Array.from(text.matchAll(/"cta"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"?/g));

  const count = Math.max(headlineMatches.length, bodyMatches.length, 1);
  for (let i = 0; i < count; i++) {
    variants.push({
      headline: headlineMatches[i]?.[1]?.replace(/\\n/g, '\n') || '',
      body: bodyMatches[i]?.[1]?.replace(/\\n/g, '\n') || '',
      cta: ctaMatches[i]?.[1] || '',
      styleName: i === 0 ? 'Продающий оффер' : i === 1 ? 'Сторителлинг' : 'Экспертный разбор'
    });
  }

  return variants;
}

/**
 * Safe fallback regex parser
 */
function fallbackRegexParser(text: string): PostVariant[] {
  const fallbackStyles = ['Продающий оффер', 'Сторителлинг', 'Экспертный разбор'];
  const headlines = Array.from(text.matchAll(/"headline"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)).map(m => m[1]);
  const bodies = Array.from(text.matchAll(/"body"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)).map(m => m[1].replace(/\\n/g, '\n'));
  const ctas = Array.from(text.matchAll(/"cta"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)).map(m => m[1]);

  const variants: PostVariant[] = [];
  const total = Math.max(headlines.length, 1);

  for (let i = 0; i < Math.min(total, 3); i++) {
    variants.push({
      id: `v${i + 1}`,
      styleName: fallbackStyles[i] || `Вариант ${i + 1}`,
      headline: headlines[i] || '🚀 Готовый пост для соцсетей',
      body: bodies[i] || text.slice(0, 300),
      cta: ctas[i] || 'Оставляйте комментарий ниже!',
      hashtags: ['#smm', '#контент', '#продвижение'],
      hookScore: 3
    });
  }

  return variants;
}
