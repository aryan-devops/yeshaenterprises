import { login } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="size-10 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg text-lg">
              Y
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Identity Verification</CardTitle>
          <CardDescription className="text-center">
            Sign in using your authorized YESHA Connect credentials.
          </CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            {message && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">User ID</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="e.g. aryan05"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-2">
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Verify Credentials
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
