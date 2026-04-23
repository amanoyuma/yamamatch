import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FavoriteButton } from "@/components/favorite-button"
import { getMountainById, getAllMountains } from "@/lib/diagnosis"
import {
  MapPin,
  Clock,
  Car,
  Train,
  Bus,
  TrendingUp,
  Calendar,
  Mountain,
  ArrowLeft,
  Lightbulb,
  Backpack,
} from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const mountains = getAllMountains()
  return mountains.map((mountain) => ({
    id: mountain.id,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const mountain = getMountainById(id)

  if (!mountain) {
    return {
      title: "山が見つかりません | 登山診断アプリ",
    }
  }

  return {
    title: `${mountain.name} | 登山診断アプリ`,
    description: mountain.description,
  }
}

function getAccessIcon(access: string) {
  switch (access) {
    case "car":
      return <Car className="h-5 w-5" />
    case "train":
      return <Train className="h-5 w-5" />
    case "bus":
      return <Bus className="h-5 w-5" />
    default:
      return <MapPin className="h-5 w-5" />
  }
}

function getLevelLabel(level: string) {
  switch (level) {
    case "beginner":
      return "初級"
    case "intermediate":
      return "中級"
    case "advanced":
      return "上級"
    default:
      return level
  }
}

function getDurationLabel(duration: string) {
  switch (duration) {
    case "short":
      return "2-3時間"
    case "medium":
      return "4-5時間"
    case "long":
      return "6時間以上"
    default:
      return duration
  }
}

function getAccessLabel(access: string) {
  switch (access) {
    case "car":
      return "車"
    case "train":
      return "電車"
    case "bus":
      return "バス"
    default:
      return access
  }
}

export default async function MountainDetailPage({ params }: PageProps) {
  const { id } = await params
  const mountain = getMountainById(id)

  if (!mountain) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/result">
            <ArrowLeft className="mr-2 h-4 w-4" />
            結果に戻る
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {getLevelLabel(mountain.level)}
              </div>
              <CardTitle className="text-2xl md:text-3xl">{mountain.name}</CardTitle>
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {mountain.area}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-secondary px-3 py-2">
              <Mountain className="mb-1 h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">標高</span>
              <span className="font-bold text-foreground">{mountain.elevation}m</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">難易度</span>
              </div>
              <span className="font-medium text-foreground">{getLevelLabel(mountain.level)}</span>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">所要時間</span>
              </div>
              <span className="font-medium text-foreground">{getDurationLabel(mountain.duration)}</span>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 flex items-center gap-2 text-primary">
                {getAccessIcon(mountain.access)}
                <span className="text-xs font-medium">アクセス</span>
              </div>
              <span className="font-medium text-foreground">{getAccessLabel(mountain.access)}</span>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">シーズン</span>
              </div>
              <span className="text-sm font-medium text-foreground">{mountain.season}</span>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">概要</h2>
            <p className="leading-relaxed text-foreground">{mountain.description}</p>
          </section>

          {mountain.tips && (
            <section className="mb-6 rounded-lg bg-accent/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-accent-foreground">
                <Lightbulb className="h-5 w-5" />
                <h2 className="font-semibold">ワンポイントアドバイス</h2>
              </div>
              <p className="text-sm text-accent-foreground">{mountain.tips}</p>
            </section>
          )}

          {mountain.gear && (
            <section className="mb-6 rounded-lg bg-secondary p-4">
              <div className="mb-2 flex items-center gap-2 text-secondary-foreground">
                <Backpack className="h-5 w-5" />
                <h2 className="font-semibold">持ち物の目安</h2>
              </div>
              <p className="text-sm text-secondary-foreground">{mountain.gear}</p>
            </section>
          )}

          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
            <FavoriteButton mountainId={mountain.id} className="flex-1" />
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                新しく診断する
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
