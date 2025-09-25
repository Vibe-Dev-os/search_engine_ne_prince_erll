import Link from "next/link"
import { Film, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <div className="p-4 bg-muted rounded-full">
            <Film className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Movie Not Found</h2>
          <p className="text-muted-foreground">The movie you're looking for doesn't exist or has been removed.</p>
        </div>

        <Link href="/">
          <Button className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>
    </div>
  )
}
