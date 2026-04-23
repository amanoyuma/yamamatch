"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MountainCard } from "@/components/mountain-card"
import type { DiagnosisResult } from "@/lib/types"
import { RefreshCw, Home, AlertCircle } from "lucide-react"

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("diagnosisResult")
    
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult))
      } catch {
        setResult(null)
      }
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-muted p-3">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">
            診断結果がありません
          </h1>
          <p className="mb-6 text-muted-foreground">
            まずは診断を行ってください
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              診断ページへ
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <section className="mb-8 text-center">
        <p className="mb-2 text-sm font-medium text-primary">診断完了</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          おすすめの山
        </h1>
      </section>

      <section className="mb-8">
        <MountainCard
          mountain={result.mountain}
          score={result.score}
          reason={result.reason}
        />

        {result.weather && (
  <section className="mb-8 rounded-2xl border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-bold text-foreground">今日の天気情報</h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-sm text-muted-foreground">気温</p>
        <p className="text-lg font-semibold">{result.weather.temperature}℃</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">降水確率</p>
        <p className="text-lg font-semibold">{result.weather.precipitationProbability}%</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">降水量</p>
        <p className="text-lg font-semibold">{result.weather.precipitation} mm</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">風速</p>
        <p className="text-lg font-semibold">{result.weather.windSpeed} km/h</p>
      </div>
    </div>

    <p className="mt-4 text-sm text-muted-foreground">
      {result.weather.weatherNote}
    </p>
    <p className="mt-2 text-xs text-muted-foreground">
      天気データ: Open-Meteo
    </p>
  </section>
)}
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.removeItem("diagnosisResult")
            sessionStorage.removeItem("diagnosisAnswers")
            router.push("/")
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          もう一度診断する
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            トップへ戻る
          </Link>
        </Button>
      </section>
    </div>
  )
}
