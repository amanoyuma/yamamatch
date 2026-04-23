import { DiagnosisForm } from "@/components/diagnosis-form"
import { Compass } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Compass className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
          あなたにぴったりの山を見つけよう
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground text-pretty">
          5つの質問に答えるだけで、今日の気分や体力に合った登山先をおすすめします
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <DiagnosisForm />
      </section>
    </div>
  )
}
