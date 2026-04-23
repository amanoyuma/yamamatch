import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain, Home } from "lucide-react"

export default function MountainNotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-muted p-3">
          <Mountain className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-foreground">
          山が見つかりません
        </h1>
        <p className="mb-6 text-muted-foreground">
          指定された山は存在しないか、削除された可能性があります
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            トップへ戻る
          </Link>
        </Button>
      </div>
    </div>
  )
}
