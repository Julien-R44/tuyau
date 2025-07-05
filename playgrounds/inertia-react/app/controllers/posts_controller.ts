import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

const POSTS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  content: `This is the content of post ${i + 1}. Lorem ipsum dolor sit amet.`,
  author: `Author ${(i % 10) + 1}`,
  createdAt: new Date(2024, 0, 1 + i),
}))

export default class PostsController {
  /**
   * Display the Inertia page for posts
   */
  async indexPage({ inertia }: HttpContext) {
    return inertia.render('posts/index')
  }

  /**
   * Display a paginated list of posts for infinite query
   */
  static validator = vine.compile(
    vine.object({
      cursor: vine.number().optional(),
      limit: vine.number().optional(),
      category: vine.enum(['all', '0', '1', '2']).optional(),
    })
  )

  async index({ request }: HttpContext) {
    const payload = await request.validateUsing(PostsController.validator)
    const cursor = Number(payload.cursor ?? 0)
    const limit = Number(payload.limit ?? 10)
    const category = payload.category ?? 'all'

    let filteredPosts = POSTS
    if (category !== 'all') {
      filteredPosts = POSTS.filter((post) => post.id % 3 === Number.parseInt(category))
    }

    const startIndex = cursor
    const endIndex = startIndex + limit
    const posts = filteredPosts.slice(startIndex, endIndex)

    const hasMore = endIndex < filteredPosts.length
    const nextCursor = hasMore ? endIndex : null

    return { posts, nextCursor, hasMore, total: filteredPosts.length }
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('posts/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({}: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const post = POSTS.find((p) => p.id === Number(params.id))
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}
