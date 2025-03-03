import type { Metadata } from "next"
import SalesHistory from "@/components/sales-history"

export const metadata: Metadata = {
  title: "Sales History | POS System",
  description: "View and manage sales history",
}

export default function SalesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Sales History</h1>
      <SalesHistory />
    </div>
  )
}

