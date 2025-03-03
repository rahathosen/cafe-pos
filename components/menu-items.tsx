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

interface MenuItemsProps {
  items: MenuItem[]
  addToCart: (item: MenuItem, selectedVariant?: { id: string; name: string; price: number }) => void
}

export default function MenuItems({ items, addToCart }: MenuItemsProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const handleItemClick = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item)
      setSelectedVariant(item.variants[0].id)
    } else {
      addToCart(item)
    }
  }

  const handleAddToCart = () => {
    if (selectedItem && selectedVariant) {
      const variant = selectedItem.variants?.find((v) => v.id === selectedVariant)
      if (variant) {
        addToCart(selectedItem, variant)
      }
      setSelectedItem(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-[#F8F3D9] border-[#B9B28A]"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative h-36">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#504B38]">{item.name}</h3>
                  <p className="text-sm text-[#504B38]/80">${item.price.toFixed(2)}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-[#B9B28A] text-[#F8F3D9] hover:bg-[#504B38]"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleItemClick(item)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variant Selection Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="bg-[#F8F3D9] border-[#B9B28A]">
          <DialogHeader>
            <DialogTitle className="text-[#504B38]">Select Options</DialogTitle>
          </DialogHeader>

          {selectedItem && selectedItem.variants && (
            <div className="py-4">
              <h3 className="font-medium text-lg text-[#504B38] mb-2">{selectedItem.name}</h3>

              <RadioGroup value={selectedVariant || ""} onValueChange={setSelectedVariant} className="space-y-2">
                {selectedItem.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center space-x-2 border border-[#B9B28A] p-2 rounded-md">
                    <RadioGroupItem value={variant.id} id={variant.id} className="text-[#504B38]" />
                    <Label htmlFor={variant.id} className="flex-1 text-[#504B38]">
                      {variant.name}
                    </Label>
                    <span className="text-[#504B38]">${(selectedItem.price + variant.price).toFixed(2)}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleAddToCart} className="bg-[#504B38] text-[#F8F3D9] hover:bg-[#504B38]/90">
              Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

