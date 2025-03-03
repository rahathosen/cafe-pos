import type { Metadata } from "next"
import PosLayout from "@/components/pos-layout"

export const metadata: Metadata = {
  title: "POS System",
  description: "A modern point of sale system built with Next.js and shadcn/ui",
}

export default function Home() {
  return <PosLayout />
}

