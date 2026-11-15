export type SocialPlatform = 'telegram' | 'instagram' | 'youtube';

export type ToneOfVoice = 
  | 'expert'         // Экспертный, авторитетный
  | 'friendly'       // Дружелюбный, теплый
  | 'selling'        // Прямой продающий, оффер
  | 'provocative'    // Провокационный, привлекающий внимание
  | 'concise';       // Лаконичный, минимум воды

export type PostGoal = 
  | 'sales'          // Продажа / Оффер
  | 'engagement'     // Вовлечение в комментарии
  | 'authority'      // Демонстрация экспертности
  | 'announcement';  // Анонс события / новости

export interface PostVariant {
  id: string;
  styleName: string;         // Например: "Продающий оффер", "Сторителлинг", "Экспертный разбор"
  headline: string;          // Цепляющий хук / заголовок
  body: string;              // Основной текст поста с переносами и эмодзи
  cta: string;               // Призыв к действию
  hashtags: string[];        // Массив хэштегов (#бизнес #smm)
  hookScore?: number;        // Оценка силы хука 1..3
}

export interface GenerationParams {
  businessDescription: string;
  postIdea: string;
  platform: SocialPlatform;
  tone: ToneOfVoice;
  goal: PostGoal;
}

export interface HistoryItem {
  id: string;
  createdAt: number;
  platform: SocialPlatform;
  topic: string;
  businessDescription: string;
  variants: PostVariant[];
  selectedVariantIndex: number;
  isFavorite: boolean;
}

export interface UserSettings {
  geminiApiKey: string;
  preferredModel: string;
  savedBusinessProfile: string;
  defaultTone: ToneOfVoice;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}
