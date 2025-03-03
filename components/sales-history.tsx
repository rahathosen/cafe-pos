"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Receipt {
  id: string
  items: any[]
  subtotal: number
  discount: {
    type: "percentage" | "flat"
    value: number
    amount: number
  }
  tax: number
  total: number
  date: string
}

export default function SalesHistory() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]")
    setReceipts(storedReceipts)
  }, [])

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
  }

  const handleModifyReceipt = (id: string) => {
    // In a real application, you'd implement the logic to modify the receipt
    // For this example, we'll just navigate to a hypothetical edit page
    router.push(`/sales/edit/${id}`)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>{receipt.id}</TableCell>
              <TableCell>{new Date(receipt.date).toLocaleString()}</TableCell>
              <TableCell>${receipt.total?.toFixed(2) ?? "N/A"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewReceipt(receipt)}>
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleModifyReceipt(receipt.id)}>
                  Modify
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt #{selectedReceipt?.id}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc list-inside">
                  {selectedReceipt?.items?.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} - ${item.price?.toFixed(2) ?? "N/A"} x {item.quantity}
                    </li>
                  )) ?? "No items"}
                </ul>
              </div>
              <div>
                <p>Subtotal: ${selectedReceipt?.subtotal?.toFixed(2) ?? "N/A"}</p>
                <p>
                  Discount: ${selectedReceipt?.discount?.amount?.toFixed(2) ?? "N/A"}(
                  {selectedReceipt?.discount?.type === "percentage"
                    ? `${selectedReceipt?.discount?.value}%`
                    : `$${selectedReceipt?.discount?.value?.toFixed(2) ?? "N/A"}`}
                  )
                </p>
                <p>Tax: ${selectedReceipt?.tax?.toFixed(2) ?? "N/A"}</p>
                <p className="font-semibold">Total: ${selectedReceipt?.total?.toFixed(2) ?? "N/A"}</p>
              </div>
              <p>Date: {selectedReceipt?.date ? new Date(selectedReceipt.date).toLocaleString() : "N/A"}</p>
            </div>
          </ScrollArea>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

