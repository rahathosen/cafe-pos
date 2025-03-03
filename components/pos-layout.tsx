"use client"

import { useState } from "react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, BarChart2, Settings } from "lucide-react"
import PosHeader from "@/components/pos-header"
import PosMenu from "@/components/pos-menu"
import PosCart from "@/components/pos-cart"
import type { CartItem, MenuItem } from "@/lib/types"
import { menuItems, categories } from "@/lib/data"

export default function PosLayout() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const addToCart = (item: MenuItem, selectedVariant?: { id: string; name: string; price: number }) => {
    const cartItemId = selectedVariant ? `${item.id}-${selectedVariant.id}` : item.id

    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === cartItemId)

    if (existingItemIndex !== -1) {
      // Item already exists, update quantity
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += 1
      setCart(updatedCart)
    } else {
      // Add new item to cart
      const basePrice = item.price
      const variantPrice = selectedVariant?.price || 0
      const totalPrice = basePrice + variantPrice

      const newCartItem: CartItem = {
        id: cartItemId,
        name: item.name,
        price: totalPrice,
        quantity: 1,
        variant: selectedVariant ? selectedVariant.name : undefined,
        image: item.image,
      }

      setCart([...cart, newCartItem])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const filteredItems = searchQuery
    ? menuItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PosHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <PosMenu categories={categories} menuItems={filteredItems} addToCart={addToCart} searchQuery={searchQuery} />
        </div>

        {isDesktop ? (
          <div className="w-[400px] border-l border-border bg-muted overflow-hidden">
            <PosCart
              items={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          </div>
        ) : (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <PosCart
                  items={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  isMobile={true}
                />
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>

      <div className="fixed bottom-4 left-4 flex flex-col space-y-2">
        <Link href="/sales" passHref>
          <Button
            size="icon"
            variant="outline"
            className="h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground"
          >
            <BarChart2 className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button
            size="icon"
            variant="outline"
            className="h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

