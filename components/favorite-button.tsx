"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"

interface FavoriteButtonProps {
  mountainId: string
  variant?: "default" | "outline" | "ghost"
  showLabel?: boolean
  className?: string
}

export function FavoriteButton({
  mountainId,
  variant = "outline",
  showLabel = true,
  className,
}: FavoriteButtonProps) {
  const { user } = useAuth()

  const [isFavorite, setIsFavorite] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  // ⭐ 初期状態：DBからお気に入りか確認
  useEffect(() => {
    const fetchFavorite = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("mountain_id", mountainId)
        .maybeSingle()

      if (error) {
        console.error(error)
        return
      }

      setIsFavorite(!!data)
      setMounted(true)
    }

    fetchFavorite()
  }, [user, mountainId])

  // ⭐ 登録 / 削除
  const toggleFavorite = async () => {
    if (!user) return

    setLoading(true)

    try {
      if (isFavorite) {
        // 削除
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("mountain_id", mountainId)

        if (error) throw error

        setIsFavorite(false)
      } else {
        // 登録
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          mountain_id: mountainId,
        })

        if (error) throw error

        setIsFavorite(true)
      }

      // ⭐ 一覧更新通知
      window.dispatchEvent(new CustomEvent("favoritesUpdated"))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <Button variant={variant} className={className} disabled>
        <Heart className={cn("h-4 w-4", showLabel && "mr-2")} />
        {showLabel && "お気に入り"}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        isFavorite && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          showLabel && "mr-2",
          isFavorite && "fill-current"
        )}
      />
      {showLabel && (isFavorite ? "お気に入り解除" : "お気に入り")}
    </Button>
  )
}