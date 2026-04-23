import type { Mountain, DiagnosisAnswers, DiagnosisResult } from "./types"
import { mountains } from "./mountains-data"

function calculateScore(mountain: Mountain, answers: DiagnosisAnswers): number {
  let score = 0

  // Stamina scoring
  if (answers.stamina === "low") {
    if (mountain.level === "beginner") score += 10
    else if (mountain.level === "intermediate") score += 3
    else score -= 5
  } else if (answers.stamina === "medium") {
    if (mountain.level === "intermediate") score += 10
    else if (mountain.level === "beginner") score += 5
    else score += 2
  } else if (answers.stamina === "high") {
    if (mountain.level === "advanced") score += 10
    else if (mountain.level === "intermediate") score += 5
    else score += 2
  }

  // Duration scoring
  if (answers.duration === mountain.duration) {
    score += 10
  } else if (
    (answers.duration === "short" && mountain.duration === "medium") ||
    (answers.duration === "medium" && mountain.duration === "short") ||
    (answers.duration === "medium" && mountain.duration === "long") ||
    (answers.duration === "long" && mountain.duration === "medium")
  ) {
    score += 4
  }

  // Access scoring
  if (answers.access === mountain.access) {
    score += 8
  } else {
    score += 2
  }

  // Purpose scoring
  if (answers.purpose === "relaxation") {
    if (mountain.level === "beginner") score += 6
    if (mountain.duration === "short") score += 4
  } else if (answers.purpose === "exercise") {
    if (mountain.level === "intermediate" || mountain.level === "advanced") score += 6
    if (mountain.duration === "medium" || mountain.duration === "long") score += 4
  } else if (answers.purpose === "scenery") {
    // Mountains with good views get bonus
    const scenicMountains = ["高尾山", "金時山", "大山", "筑波山", "陣馬山"]
    if (scenicMountains.includes(mountain.name)) score += 8
  } else if (answers.purpose === "challenge") {
    if (mountain.level === "advanced") score += 8
    else if (mountain.level === "intermediate") score += 4
  }

  // Mood scoring
  if (answers.mood === "calm") {
    if (mountain.level === "beginner") score += 4
    const calmMountains = ["御岳山", "三頭山"]
    if (calmMountains.includes(mountain.name)) score += 4
  } else if (answers.mood === "adventurous") {
    if (mountain.level === "advanced") score += 6
    else if (mountain.level === "intermediate") score += 3
  } else if (answers.mood === "social") {
    // Popular mountains are good for social moods
    const popularMountains = ["高尾山", "筑波山", "金時山", "鍋割山"]
    if (popularMountains.includes(mountain.name)) score += 6
  }

  return score
}

function generateReason(
  mountain: Mountain,
  answers: DiagnosisAnswers,
  weatherNote?: string
): string {
  const reasons: string[] = []

  if (answers.stamina === "low" && mountain.level === "beginner") {
    reasons.push("初心者向けで体力的にも安心")
  } else if (answers.stamina === "high" && mountain.level === "advanced") {
    reasons.push("本格的な登山で体力を存分に発揮できます")
  } else if (answers.stamina === "medium" && mountain.level === "intermediate") {
    reasons.push("適度な運動量で楽しめます")
  }

  if (answers.duration === mountain.duration) {
    const durationText =
      answers.duration === "short" ? "短時間" : answers.duration === "medium" ? "半日程度" : "しっかり"
    reasons.push(`${durationText}で楽しめる行程です`)
  }

  if (answers.purpose === "scenery") {
    reasons.push("素晴らしい景色が楽しめます")
  } else if (answers.purpose === "relaxation") {
    reasons.push("リラックスしながら自然を満喫できます")
  } else if (answers.purpose === "exercise") {
    reasons.push("良い運動になります")
  } else if (answers.purpose === "challenge") {
    reasons.push("達成感を味わえます")
  }

  if (answers.access === mountain.access) {
    const accessText = answers.access === "car" ? "車" : answers.access === "train" ? "電車" : "バス"
    reasons.push(`${accessText}でのアクセスが便利`)
  }

  const baseReason =
  reasons.length > 0 ? reasons.join("。") + "。" : "あなたの条件にぴったりの山です。"

return weatherNote ? `${baseReason} ${weatherNote}` : baseReason
}

async function fetchWeatherForMountain(mountain: Mountain) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${mountain.latitude}` +
    `&longitude=${mountain.longitude}` +
    `&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m` +
    `&forecast_days=1` +
    `&timezone=Asia%2FTokyo`

  const res = await fetch(url, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("天気情報の取得に失敗しました")
  }

  const data = await res.json()

  const temperature = data.hourly.temperature_2m[9] ?? data.hourly.temperature_2m[0] ?? 0
  const precipitationProbability =
    data.hourly.precipitation_probability[9] ?? data.hourly.precipitation_probability[0] ?? 0
  const precipitation = data.hourly.precipitation[9] ?? data.hourly.precipitation[0] ?? 0
  const windSpeed = data.hourly.wind_speed_10m[9] ?? data.hourly.wind_speed_10m[0] ?? 0

  return {
    temperature,
    precipitationProbability,
    precipitation,
    windSpeed,
  }
}

function calculateWeatherScore(weather: {
  temperature: number
  precipitationProbability: number
  precipitation: number
  windSpeed: number
}) {
  let weatherScore = 0
  const notes: string[] = []

  if (weather.precipitationProbability >= 70) {
    weatherScore -= 12
    notes.push("降水確率が高めです")
  } else if (weather.precipitationProbability >= 40) {
    weatherScore -= 6
    notes.push("天気がやや不安定です")
  } else {
    weatherScore += 4
    notes.push("天気は比較的安定しています")
  }

  if (weather.precipitation >= 2) {
    weatherScore -= 8
    notes.push("雨量が多めです")
  } else if (weather.precipitation > 0) {
    weatherScore -= 3
    notes.push("弱い雨の可能性があります")
  } else {
    weatherScore += 2
  }

  if (weather.windSpeed >= 30) {
    weatherScore -= 10
    notes.push("風がかなり強い予報です")
  } else if (weather.windSpeed >= 20) {
    weatherScore -= 5
    notes.push("やや風が強めです")
  } else {
    weatherScore += 3
  }

  if (weather.temperature < 5) {
    weatherScore -= 4
    notes.push("気温が低いため防寒が必要です")
  } else if (weather.temperature >= 10 && weather.temperature <= 22) {
    weatherScore += 4
    notes.push("歩きやすい気温です")
  } else if (weather.temperature >= 30) {
    weatherScore -= 4
    notes.push("暑さ対策が必要です")
  }

  return {
    weatherScore,
    weatherNote: notes.join("。") + "。",
  }
}

export async function diagnose(answers: DiagnosisAnswers): Promise<DiagnosisResult | null> {
  const hasAllAnswers = Object.values(answers).every((value) => value !== null)
  if (!hasAllAnswers) {
    return null
  }

  let bestMountain: Mountain | null = null
  let bestScore = -Infinity
  let bestWeather:
    | {
        temperature: number
        precipitationProbability: number
        precipitation: number
        windSpeed: number
      }
    | undefined
  let bestWeatherNote = ""

  for (const mountain of mountains) {
    const baseScore = calculateScore(mountain, answers)

    try {
      const weather = await fetchWeatherForMountain(mountain)
      const { weatherScore, weatherNote } = calculateWeatherScore(weather)

      const totalScore = baseScore + weatherScore

      if (totalScore > bestScore) {
        bestScore = totalScore
        bestMountain = mountain
        bestWeather = weather
        bestWeatherNote = weatherNote
      }
    } catch {
      if (baseScore > bestScore) {
        bestScore = baseScore
        bestMountain = mountain
        bestWeather = undefined
        bestWeatherNote = ""
      }
    }
  }

  if (!bestMountain) {
    return null
  }

  return {
    mountain: bestMountain,
    score: bestScore,
    reason: generateReason(bestMountain, answers, bestWeatherNote),
    weather: bestWeather
      ? {
          temperature: bestWeather.temperature,
          precipitationProbability: bestWeather.precipitationProbability,
          precipitation: bestWeather.precipitation,
          windSpeed: bestWeather.windSpeed,
          hikingScore: Math.max(0, Math.min(100, bestScore)),
          weatherNote: bestWeatherNote,
        }
      : undefined,
  }
}

export function getMountainById(id: string): Mountain | undefined {
  return mountains.find((m) => m.id === id)
}

export function getAllMountains(): Mountain[] {
  return mountains
}
