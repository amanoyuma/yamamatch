"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "./question-card"
import { questions } from "@/lib/questions"
import { diagnose } from "@/lib/diagnosis"
import type { DiagnosisAnswers } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function DiagnosisForm() {
  const router = useRouter()
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    stamina: null,
    purpose: null,
    duration: null,
    access: null,
    mood: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = (key: keyof DiagnosisAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredKeys = Object.entries(answers)
      .filter(([, value]) => value === null)
      .map(([key]) => key)

    if (unansweredKeys.length > 0) {
      setError("すべての質問に回答してください")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await diagnose(answers)
      if (!result) {
        setError("条件に合う山が見つかりませんでした")
        setIsLoading(false)
        return
      }

      // Store result in sessionStorage for the result page
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result))
      sessionStorage.setItem("diagnosisAnswers", JSON.stringify(answers))

      router.push("/result")
    } catch {
      setError("エラーが発生しました。もう一度お試しください。")
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnswers({
      stamina: null,
      purpose: null,
      duration: null,
      access: null,
      mood: null,
    })
    setError(null)
  }

  const answeredCount = Object.values(answers).filter((v) => v !== null).length
  const totalQuestions = questions.length

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.key}
          question={question}
          questionNumber={index + 1}
          selectedValue={answers[question.key as keyof DiagnosisAnswers]}
          onSelect={(value) => handleSelect(question.key as keyof DiagnosisAnswers, value)}
        />
      ))}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-center text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          回答済み: {answeredCount} / {totalQuestions}
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            リセット
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                診断中...
              </>
            ) : (
              "診断する"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
