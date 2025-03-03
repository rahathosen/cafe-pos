"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import ProductCard from "@/components/product-card"
import type { MenuItem, ProductCategory } from "@/lib/types"

interface PosMenuProps {
  categories: ProductCategory[]
  menuItems: MenuItem[]
  addToCart: (item: MenuItem, selectedVariant?: { id: string; name: string; price: number }) => void
  searchQuery: string
}

export default function PosMenu({ categories, menuItems, addToCart, searchQuery }: PosMenuProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <Tabs
          defaultValue={categories[0].id}
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <div className="border-b border-border">
            <ScrollArea className="w-full whitespace-nowrap pb-3">
              <TabsList className="h-10 bg-transparent p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="h-9 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
            {searchQuery ? (
              <div className="pt-6 px-2">
                <h2 className="text-lg font-medium mb-4">Search Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {menuItems.length > 0 ? (
                    menuItems.map((item) => <ProductCard key={item.id} item={item} addToCart={addToCart} />)
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground py-12">
                      No items found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="pt-6 px-2 m-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {menuItems
                      .filter((item) => item.categoryId === category.id)
                      .map((item) => (
                        <ProductCard key={item.id} item={item} addToCart={addToCart} />
                      ))}
                  </div>
                </TabsContent>
              ))
            )}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}

