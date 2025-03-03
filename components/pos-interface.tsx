"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import MenuItems from "@/components/menu-items"
import Cart from "@/components/cart"
import type { CartItem, MenuItem, ProductCategory } from "@/lib/types"

export default function PosInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Sample categories and menu items
  const categories: ProductCategory[] = [
    { id: "1", name: "Hot Drinks" },
    { id: "2", name: "Cold Drinks" },
    { id: "3", name: "Pastries" },
    { id: "4", name: "Sandwiches" },
    { id: "5", name: "Desserts" },
  ]

  const menuItems: MenuItem[] = [
    {
      id: "101",
      name: "Cappuccino",
      price: 4.5,
      categoryId: "1",
      image: "/images/cappuccino.jpg",
      variants: [
        { id: "v1", name: "Small", price: 0 },
        { id: "v2", name: "Medium", price: 0.5 },
        { id: "v3", name: "Large", price: 1.0 },
      ],
    },
    {
      id: "102",
      name: "Latte",
      price: 4.0,
      categoryId: "1",
      image: "/images/latte.jpg",
      variants: [
        { id: "v1", name: "Small", price: 0 },
        { id: "v2", name: "Medium", price: 0.5 },
        { id: "v3", name: "Large", price: 1.0 },
      ],
    },
    {
      id: "103",
      name: "Espresso",
      price: 3.0,
      categoryId: "1",
      image: "/images/espresso.jpg",
      variants: [
        { id: "v1", name: "Single", price: 0 },
        { id: "v2", name: "Double", price: 1.5 },
      ],
    },
    {
      id: "201",
      name: "Iced Coffee",
      price: 4.5,
      categoryId: "2",
      image: "/images/iced-coffee.jpg",
      variants: [
        { id: "v1", name: "Small", price: 0 },
        { id: "v2", name: "Medium", price: 0.5 },
        { id: "v3", name: "Large", price: 1.0 },
      ],
    },
    {
      id: "202",
      name: "Iced Tea",
      price: 3.5,
      categoryId: "2",
      image: "/images/iced-tea.jpg",
      variants: [
        { id: "v1", name: "Small", price: 0 },
        { id: "v2", name: "Medium", price: 0.5 },
        { id: "v3", name: "Large", price: 1.0 },
      ],
    },
    {
      id: "301",
      name: "Croissant",
      price: 3.5,
      categoryId: "3",
      image: "/images/croissant.jpg",
    },
    {
      id: "302",
      name: "Pain au Chocolat",
      price: 4.0,
      categoryId: "3",
      image: "/images/pain-au-chocolat.jpg",
    },
    {
      id: "401",
      name: "Chicken Sandwich",
      price: 6.5,
      categoryId: "4",
      image: "/images/chicken-sandwich.jpg",
    },
    {
      id: "402",
      name: "Veggie Sandwich",
      price: 5.5,
      categoryId: "4",
      image: "/images/veggie-sandwich.jpg",
    },
    {
      id: "501",
      name: "Chocolate Cake",
      price: 5.0,
      categoryId: "5",
      image: "/images/chocolate-cake.jpg",
    },
    {
      id: "502",
      name: "Cheesecake",
      price: 5.5,
      categoryId: "5",
      image: "/images/cheesecake.jpg",
    },
  ]

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
    <div className="flex flex-col md:flex-row h-screen">
      {/* Menu Section */}
      <div className="flex-1 p-4 bg-[#F8F3D9] overflow-hidden flex flex-col">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold text-[#504B38] mr-4">Menu</h1>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#504B38]" />
            <Input
              placeholder="Search menu..."
              className="pl-8 bg-[#EBE5C2] border-[#B9B28A] text-[#504B38]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue={categories[0].id} className="flex-1 flex flex-col">
          <TabsList className="bg-[#EBE5C2] border border-[#B9B28A] mb-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-[#B9B28A] data-[state=active]:text-[#F8F3D9]"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1">
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0 h-full">
                <MenuItems
                  items={filteredItems.filter((item) => item.categoryId === category.id)}
                  addToCart={addToCart}
                />
              </TabsContent>
            ))}

            {searchQuery && (
              <div className="mt-0 h-full">
                <MenuItems items={filteredItems} addToCart={addToCart} />
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-96 bg-[#EBE5C2] border-l border-[#B9B28A] p-4 overflow-hidden flex flex-col">
        <Cart items={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />
      </div>
    </div>
  )
}

