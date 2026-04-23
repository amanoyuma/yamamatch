"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FavoriteButton } from "./favorite-button"
import type { Mountain } from "@/lib/types"
import { MapPin, Clock, Car, Train, Bus, TrendingUp, Calendar, ChevronRight } from "lucide-react"

interface MountainCardProps {
  mountain: Mountain
  score?: number
  reason?: string
  showActions?: boolean
}

function getAccessIcon(access: string) {
  switch (access) {
    case "car":
      return <Car className="h-4 w-4" />
    case "train":
      return <Train className="h-4 w-4" />
    case "bus":
      return <Bus className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
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

export function MountainCard({ mountain, score, reason, showActions = true }: MountainCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl">{mountain.name}</CardTitle>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {mountain.area}
            </p>
          </div>
          {score !== undefined && (
            <div className="flex flex-col items-center rounded-lg bg-primary px-3 py-1.5 text-primary-foreground">
              <span className="text-xs font-medium">スコア</span>
              <span className="text-lg font-bold">{score}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>{getLevelLabel(mountain.level)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{getDurationLabel(mountain.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {getAccessIcon(mountain.access)}
            <span>{getAccessLabel(mountain.access)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="truncate">{mountain.season}</span>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-foreground">{mountain.description}</p>

        {reason && (
          <div className="mb-4 rounded-lg bg-accent/30 p-3">
            <p className="text-sm font-medium text-accent-foreground">
              おすすめ理由: {reason}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href={`/mountains/${mountain.id}`}>
                詳細を見る
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <FavoriteButton mountainId={mountain.id} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
