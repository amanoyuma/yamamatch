export interface QuestionOption {
  value: string
  label: string
  description?: string
}

export interface Question {
  key: string
  title: string
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    key: "stamina",
    title: "体力レベルは？",
    options: [
      { value: "low", label: "軽め", description: "ゆっくり楽しみたい" },
      { value: "medium", label: "普通", description: "適度に汗をかきたい" },
      { value: "high", label: "しっかり", description: "がっつり登りたい" },
    ],
  },
  {
    key: "purpose",
    title: "今日の目的は？",
    options: [
      { value: "relaxation", label: "リラックス", description: "自然の中で癒されたい" },
      { value: "exercise", label: "運動", description: "体を動かしたい" },
      { value: "scenery", label: "景色", description: "絶景を楽しみたい" },
      { value: "challenge", label: "挑戦", description: "達成感を味わいたい" },
    ],
  },
  {
    key: "duration",
    title: "所要時間は？",
    options: [
      { value: "short", label: "短め", description: "2-3時間程度" },
      { value: "medium", label: "半日", description: "4-5時間程度" },
      { value: "long", label: "長め", description: "6時間以上" },
    ],
  },
  {
    key: "access",
    title: "アクセス方法は？",
    options: [
      { value: "train", label: "電車", description: "駅からアクセス" },
      { value: "bus", label: "バス", description: "バス利用" },
      { value: "car", label: "車", description: "ドライブで" },
    ],
  },
  {
    key: "mood",
    title: "今の気分は？",
    options: [
      { value: "calm", label: "穏やか", description: "静かに過ごしたい" },
      { value: "adventurous", label: "冒険", description: "ワクワクしたい" },
      { value: "social", label: "にぎやか", description: "人気スポットへ" },
    ],
  },
]
