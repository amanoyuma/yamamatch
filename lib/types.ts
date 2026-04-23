export interface Mountain {
  id: string
  name: string
  area: string
  level: "beginner" | "intermediate" | "advanced"
  duration: "short" | "medium" | "long"
  access: "car" | "train" | "bus"
  season: string
  description: string
  elevation?: number
  tips?: string
  gear?: string
  latitude: number
  longitude: number
}

export interface WeatherSummary {
  temperature: number
  precipitationProbability: number
  precipitation: number
  windSpeed: number
  hikingScore: number
  weatherNote: string
}

export interface DiagnosisAnswers {
  stamina: "low" | "medium" | "high" | null
  purpose: "relaxation" | "exercise" | "scenery" | "challenge" | null
  duration: "short" | "medium" | "long" | null
  access: "car" | "train" | "bus" | null
  mood: "calm" | "adventurous" | "social" | null
}

export interface DiagnosisResult {
  mountain: Mountain
  score: number
  reason: string
   weather?: WeatherSummary
}

export type QuestionKey = keyof DiagnosisAnswers
