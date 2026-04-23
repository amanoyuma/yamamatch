"use client"

import { cn } from "@/lib/utils"
import type { Question } from "@/lib/questions"

interface QuestionCardProps {
  question: Question
  selectedValue: string | null
  onSelect: (value: string) => void
  questionNumber: number
}

export function QuestionCard({ question, selectedValue, onSelect, questionNumber }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">
        <span className="text-primary mr-2">Q{questionNumber}.</span>
        {question.title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selectedValue === option.value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-foreground"
            )}
          >
            <span className="font-medium">{option.label}</span>
            {option.description && (
              <span className="text-sm text-muted-foreground">{option.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
