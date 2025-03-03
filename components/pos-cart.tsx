"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Trash2,
  Minus,
  Plus,
  Printer,
  CreditCard,
  X,
  Percent,
  DollarSign,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { CartItem } from "@/lib/types";

interface PosCartProps {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isMobile?: boolean;
}

export default function PosCart({
  items,
  updateQuantity,
  removeFromCart,
  clearCart,
  isMobile = false,
}: PosCartProps) {
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "flat">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState<string>("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount =
    discountType === "percentage"
      ? (Number.parseFloat(discountValue) / 100) * subtotal
      : Number.parseFloat(discountValue) || 0;

  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.08; // 8% tax
  const total = discountedSubtotal + tax;

  const { toast } = useToast();

  const handlePrintReceipt = () => {
    setReceiptOpen(true);
  };

  const handlePayment = () => {
    const receipt = {
      id: Date.now().toString(),
      items,
      subtotal,
      discount: {
        type: discountType,
        value: Number.parseFloat(discountValue) || 0,
        amount: discount,
      },
      tax,
      total,
      date: new Date().toISOString(),
    };

    // Save the receipt to local storage
    const existingReceipts = JSON.parse(
      localStorage.getItem("receipts") || "[]"
    );
    localStorage.setItem(
      "receipts",
      JSON.stringify([...existingReceipts, receipt])
    );

    toast({
      title: "Payment Successful",
      description: `Receipt #${receipt.id} has been saved.`,
    });

    clearCart();
    setDiscountValue("");
  };

  const handleDiscountChange = (value: string) => {
    // Only allow numbers and a single decimal point
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value) || value === "") {
      setDiscountValue(value);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {isMobile && (
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <h2 className="text-xl font-bold">Your Order</h2>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        )}

        <div className={`p-4 ${!isMobile ? "border-b border-border" : ""}`}>
          <h2 className={`${isMobile ? "sr-only" : "text-xl font-bold mb-2"}`}>
            Current Order
          </h2>
          {!isMobile && items.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add items from the menu to get started
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3">
                    {item.image && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate pr-4">
                            {item.name}
                          </h3>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {item.variant}
                            </p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-none rounded-l-md"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-none rounded-r-md"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card">
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount Section */}
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="discount"
                    className="text-sm text-muted-foreground"
                  >
                    Discount
                  </Label>
                  <div className="flex space-x-2">
                    <RadioGroup
                      value={discountType}
                      onValueChange={(value) =>
                        setDiscountType(value as "percentage" | "flat")
                      }
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage">
                          <Percent className="h-4 w-4" />
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="flat" id="flat" />
                        <Label htmlFor="flat">
                          <DollarSign className="h-4 w-4" />
                        </Label>
                      </div>
                    </RadioGroup>
                    <Input
                      id="discount"
                      type="text"
                      value={discountValue}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={handlePrintReceipt}
                  className="h-11"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Receipt
                </Button>
                <Button onClick={handlePayment} className="h-11">
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
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Receipt</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 font-mono text-sm">
            <div className="text-center">
              <h3 className="font-bold">CAFÉ POS</h3>
              <p>123 Main Street</p>
              <p>City, State 12345</p>
              <p>{new Date().toLocaleString()}</p>
              <p className="text-xs mt-1">
                Order #: {Math.floor(Math.random() * 10000)}
              </p>
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
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>
                    Discount (
                    {discountType === "percentage"
                      ? `${discountValue}%`
                      : `$${discountValue}`}
                    )
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
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
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                // In a real app, this would trigger actual printing
                window.print();
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
