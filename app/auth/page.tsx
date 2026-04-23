"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (isLogin) {
        const { data: loginData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        const user = loginData.user

        if (user) {
          const { data: existingProfile, error: selectError } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle()

          if (selectError) throw selectError

          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                user_id: user.id,
                name: "",
              })

            if (profileError) throw profileError
          }
        }

        setMessage("ログインしました")
        router.push("/")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        setMessage("新規登録が完了しました。ログインしてください。")
        setIsLogin(true)
      }
    } catch (error: any) {
      setMessage(error.message || "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="mb-6 flex gap-2">
            <Button
              type="button"
              variant={isLogin ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsLogin(true)}
            >
              ログイン
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsLogin(false)}
            >
              新規登録
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "処理中..."
                : isLogin
                ? "ログインする"
                : "新規登録する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}