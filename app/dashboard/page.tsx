import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Dashboard | POS System",
  description: "Manage menu items in the POS system",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
    </div>
  )
}

