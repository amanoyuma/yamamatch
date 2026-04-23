"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  mountainId: string
  variant?: "default" | "outline" | "ghost"
  showLabel?: boolean
  className?: string
}

function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setFavorites(favorites: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

export function FavoriteButton({
  mountainId,
  variant = "outline",
  showLabel = true,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const favorites = getFavorites()
    setIsFavorite(favorites.includes(mountainId))
  }, [mountainId])

  const toggleFavorite = () => {
    const favorites = getFavorites()
    let newFavorites: string[]

    if (favorites.includes(mountainId)) {
      newFavorites = favorites.filter((id) => id !== mountainId)
    } else {
      newFavorites = [...favorites, mountainId]
    }

    setFavorites(newFavorites)
    setIsFavorite(newFavorites.includes(mountainId))

    // Dispatch custom event for other components to update
    window.dispatchEvent(new CustomEvent("favoritesUpdated"))
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
