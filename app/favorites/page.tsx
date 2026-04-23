"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FavoriteButton } from "@/components/favorite-button"
import { getMountainById } from "@/lib/diagnosis"
import type { Mountain } from "@/lib/types"
import { Heart, Home, MapPin, ChevronRight } from "lucide-react"

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

export default function FavoritesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [favorites, setFavorites] = useState<Mountain[]>([])
  const [mounted, setMounted] = useState(false)

  // ⭐ DBからお気に入り取得
  const loadFavorites = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("favorites")
      .select("mountain_id")
      .eq("user_id", user.id)

    if (error) {
      console.error(error)
      return
    }

    const favoriteMountains = data
      .map((f) => getMountainById(f.mountain_id))
      .filter((m): m is Mountain => m !== undefined)

    setFavorites(favoriteMountains)
  }

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/auth")
      return
    }

    setMounted(true)
    loadFavorites()

    // ⭐ お気に入り更新イベント（そのまま活かす）
    const handleFavoritesUpdate = () => loadFavorites()
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate)

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
    }
  }, [user, authLoading, router])

  if (authLoading || !mounted) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <section className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          お気に入りの山
        </h1>
        <p className="text-muted-foreground">
          {favorites.length > 0
            ? `${favorites.length}件の山が登録されています`
            : "お気に入りに登録した山がここに表示されます"}
        </p>
      </section>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="mb-6 text-muted-foreground">
            まだお気に入りの山がありません。
            <br />
            診断結果や山の詳細ページからお気に入り登録できます。
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              診断を始める
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((mountain) => (
            <Card key={mountain.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {getLevelLabel(mountain.level)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {mountain.name}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {mountain.area}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <FavoriteButton
                      mountainId={mountain.id}
                      variant="ghost"
                      showLabel={false}
                      className="h-9 w-9 p-0"
                    />

                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/mountains/${mountain.id}`}>
                        <span className="sr-only">詳細を見る</span>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            新しく診断する
          </Link>
        </Button>
      </div>
    </div>
  )
}