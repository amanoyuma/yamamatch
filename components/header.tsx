"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mountain, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/AuthContext"

export function Header() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-medium text-foreground">
          <Mountain className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">登山診断アプリ</span>
        </Link>

        <nav className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link
                href="/favorites"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                <span>お気に入り</span>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth">ログイン</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth">新規登録</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}