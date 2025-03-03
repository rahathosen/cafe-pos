import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PosHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function PosHeader({ searchQuery, setSearchQuery }: PosHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Café POS</h1>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}

