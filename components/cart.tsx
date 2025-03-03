"use client"

import { useState } from "react"
import { Trash2, Minus, Plus, Printer, CreditCard } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CartItem } from "@/lib/types"

interface CartProps {
  items: CartItem[]
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

export default function Cart({ items, updateQuantity, removeFromCart, clearCart }: CartProps) {
  const [receiptOpen, setReceiptOpen] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handlePrintReceipt = () => {
    setReceiptOpen(true)
  }

  const handlePayment = () => {
    // In a real app, this would process payment
    alert("Payment processed successfully!")
    clearCart()
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4 text-[#504B38]">Current Order</h2>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#504B38]/70">
            <p>No items in cart</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-[#504B38]">{item.name}</h3>
                        <p className="font-medium text-[#504B38]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {item.variant && <p className="text-sm text-[#504B38]/70">{item.variant}</p>}
                      <div className="flex items-center mt-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 rounded-full border-[#B9B28A]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3 text-[#504B38]" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="mx-2 text-sm text-[#504B38]">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 rounded-full border-[#B9B28A]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3 text-[#504B38]" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 ml-2 text-[#504B38]/70 hover:text-[#504B38]"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t border-[#B9B28A]">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#504B38]">Subtotal</span>
                  <span className="text-[#504B38]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#504B38]">Tax (8%)</span>
                  <span className="text-[#504B38]">${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2 bg-[#B9B28A]" />
                <div className="flex justify-between font-bold">
                  <span className="text-[#504B38]">Total</span>
                  <span className="text-[#504B38]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-[#B9B28A] text-[#504B38] hover:bg-[#B9B28A] hover:text-[#F8F3D9]"
                  onClick={handlePrintReceipt}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Receipt
                </Button>
                <Button className="bg-[#504B38] text-[#F8F3D9] hover:bg-[#504B38]/90" onClick={handlePayment}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="bg-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Receipt</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 font-mono text-sm">
            <div className="text-center">
              <h3 className="font-bold">ACME CAFE</h3>
              <p>123 Main Street</p>
              <p>City, State 12345</p>
              <p>{new Date().toLocaleString()}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div>
                      {item.name} {item.variant ? `(${item.variant})` : ""}
                    </div>
                    <div className="text-xs">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <p>Thank you for your purchase!</p>
              <p className="text-xs mt-2">Receipt #: {Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                // In a real app, this would trigger actual printing
                window.print()
              }}
              className="bg-[#504B38] text-white"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

