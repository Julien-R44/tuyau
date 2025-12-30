import vine from '@vinejs/vine'
import { type HttpContext } from '@adonisjs/core/http'

const products: Array<{
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}> = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
  { id: 2, name: 'Keyboard', price: 79, category: 'electronics', inStock: true },
  { id: 3, name: 'Mouse', price: 29, category: 'electronics', inStock: false },
  { id: 4, name: 'T-Shirt', price: 25, category: 'clothing', inStock: true },
  { id: 5, name: 'Jeans', price: 59, category: 'clothing', inStock: true },
  { id: 6, name: 'Book', price: 15, category: 'books', inStock: true },
]

export default class ProductsController {
  static searchValidator = vine.create({
    headers: vine
      .object({
        'x-api-key': vine.string(),
      })
      .optional(),

    params: vine
      .object({
        category: vine.string().optional(),
      })
      .optional(),

    q: vine.string().optional(),
    category: vine.string().optional(),
    minPrice: vine.number().optional(),
    maxPrice: vine.number().optional(),
    inStock: vine.boolean().optional(),
  })

  static createValidator = vine.create({
    name: vine.string().minLength(2).maxLength(100),
    price: vine.number().positive(),
    category: vine.string(),
    inStock: vine.boolean().optional(),
  })

  /**
   * Search products with multiple query params
   */
  async search({ request }: HttpContext) {
    const { q, category, minPrice, maxPrice, inStock } = await request.validateUsing(
      ProductsController.searchValidator
    )

    let filtered = [...products]

    if (q) {
      const searchLower = q.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchLower))
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice)
    }

    if (inStock !== undefined) {
      filtered = filtered.filter((p) => p.inStock === inStock)
    }

    return {
      products: filtered,
      total: filtered.length,
      filters: { q, category, minPrice, maxPrice, inStock },
    }
  }

  /**
   * Get a single product
   */
  show({ params }: HttpContext) {
    const product = products.find((p) => p.id === Number(params.id))
    if (!product) {
      return { error: 'Product not found' }
    }
    return { product }
  }

  /**
   * Get products by category (nested route param)
   */
  byCategory({ params }: HttpContext) {
    const filtered = products.filter((p) => p.category === params.category)
    return { products: filtered, category: params.category }
  }

  /**
   * Create a product
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(ProductsController.createValidator)

    const newProduct = {
      id: products.length + 1,
      inStock: true,
      ...payload,
    }
    products.push(newProduct)

    return { product: newProduct, success: true }
  }

  /**
   * Delete a product
   */
  delete({ params }: HttpContext) {
    const index = products.findIndex((p) => p.id === Number(params.id))
    if (index === -1) {
      return { error: 'Product not found', success: false }
    }

    products.splice(index, 1)
    return { success: true }
  }

  /**
   * Get categories list
   */
  categories() {
    const uniqueCategories = [...new Set(products.map((p) => p.category))]
    return { categories: uniqueCategories }
  }
}
