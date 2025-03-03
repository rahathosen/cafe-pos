export interface ProductCategory {
  id: string
  name: string
  icon?: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  price: number
  categoryId: string
  image: string
  description?: string
  variants?: ProductVariant[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  variant?: string
  image?: string
}

