"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { MenuItem } from "@/lib/types"
import { categories } from "@/lib/data"

export default function Dashboard() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
    setItems(storedItems)
  }, [])

  const saveItems = (newItems: MenuItem[]) => {
    localStorage.setItem("menuItems", JSON.stringify(newItems))
    setItems(newItems)
  }

  const handleAddItem = (newItem: MenuItem) => {
    const updatedItems = [...items, { ...newItem, id: Date.now().toString() }]
    saveItems(updatedItems)
    setIsAddDialogOpen(false)
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the menu.`,
    })
  }

  const handleUpdateItem = (updatedItem: MenuItem) => {
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    saveItems(updatedItems)
    setIsEditDialogOpen(false)
    toast({
      title: "Item Updated",
      description: `${updatedItem.name} has been updated.`,
    })
  }

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    saveItems(updatedItems)
    toast({
      title: "Item Deleted",
      description: "The item has been removed from the menu.",
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>{categories.find((c) => c.id === item.categoryId)?.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setCurrentItem(item)
                    setIsEditDialogOpen(true)
                  }}
                >
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddItem}
        title="Add New Item"
      />

      <ItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateItem}
        title="Edit Item"
        item={currentItem}
      />
    </div>
  )
}

interface ItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
  title: string
  item?: MenuItem | null
}

function ItemDialog({ isOpen, onClose, onSave, title, item }: ItemDialogProps) {
  const [name, setName] = useState(item?.name || "")
  const [price, setPrice] = useState(item?.price.toString() || "")
  const [categoryId, setCategoryId] = useState(item?.categoryId || "")
  const [image, setImage] = useState(item?.image || "")

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(item.price.toString())
      setCategoryId(item.categoryId)
      setImage(item.image)
    } else {
      setName("")
      setPrice("")
      setCategoryId("")
      setImage("")
    }
  }, [item])

  const handleSave = () => {
    onSave({
      id: item?.id || "",
      name,
      price: Number.parseFloat(price),
      categoryId,
      image,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

