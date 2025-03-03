"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { MenuItem } from "@/lib/types"

interface ProductCardProps {
  item: MenuItem
  addToCart: (item: MenuItem, selectedVariant?: { id: string; name: string; price: number }) => void
}

export default function ProductCard({ item, addToCart }: ProductCardProps) {
  const [showVariants, setShowVariants] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    item.variants && item.variants.length > 0 ? item.variants[0].id : null,
  )

  const handleItemClick = () => {
    if (item.variants && item.variants.length > 0) {
      setShowVariants(true)
    } else {
      addToCart(item)
    }
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      const variant = item.variants?.find((v) => v.id === selectedVariant)
      if (variant) {
        addToCart(item, variant)
      }
    }
    setShowVariants(false)
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-border group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={handleItemClick}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
        <CardContent className="p-3" onClick={handleItemClick}>
          <div className="cursor-pointer">
            <h3 className="font-medium line-clamp-1">{item.name}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
              {item.variants && item.variants.length > 0 && (
                <p className="text-xs text-muted-foreground">Options available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariants} onOpenChange={setShowVariants}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Base price: ${item.price.toFixed(2)}</p>
              </div>
            </div>

            {item.variants && (
              <RadioGroup value={selectedVariant || ""} onValueChange={setSelectedVariant} className="space-y-2">
                {item.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center space-x-2 border border-border p-3 rounded-md">
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label htmlFor={variant.id} className="flex-1 cursor-pointer">
                      {variant.name}
                    </Label>
                    <span className="text-sm font-medium">
                      ${variant.price > 0 ? `+${variant.price.toFixed(2)}` : "No extra charge"}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleAddToCart}>Add to Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

