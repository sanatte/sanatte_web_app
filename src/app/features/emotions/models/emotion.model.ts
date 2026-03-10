export type EmotionValence =
  | 'Positive Valence'
  | 'Negative Valence'
  | 'High Arousal'
  | 'Low Arousal'
  | 'Neutral';

export type EmotionStatus = 'active' | 'inactive';

export interface Emotion {
  id: string;
  name: string;
  category?: EmotionValence;
  description: string;
  icon: string;
  status: EmotionStatus;
  created_at?: string;
  last_update?: string;
}

export interface CreateEmotionRequest {
  name: string;
  category?: EmotionValence;
  description: string;
  icon: string;
  status?: EmotionStatus;
}

export interface UpdateEmotionRequest {
  name?: string;
  category?: EmotionValence;
  description?: string;
  icon?: string;
  status?: EmotionStatus;
}

export const EMOTION_VALENCES: EmotionValence[] = [
  'Positive Valence',
  'Negative Valence',
  'High Arousal',
  'Low Arousal',
  'Neutral',
];
