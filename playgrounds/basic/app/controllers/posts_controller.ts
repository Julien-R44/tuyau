import vine from '@vinejs/vine'
import { type HttpContext } from '@adonisjs/core/http'

const posts: Array<{ id: number; title: string; content: string; authorId: number }> = [
  { id: 1, title: 'First Post', content: 'Hello World', authorId: 1 },
  { id: 2, title: 'Second Post', content: 'Lorem ipsum', authorId: 1 },
  { id: 3, title: 'Third Post', content: 'Dolor sit amet', authorId: 2 },
  { id: 4, title: 'Fourth Post', content: 'Consectetur adipiscing', authorId: 1 },
  { id: 5, title: 'Fifth Post', content: 'Sed do eiusmod', authorId: 2 },
  { id: 6, title: 'Sixth Post', content: 'Tempor incididunt', authorId: 1 },
  { id: 7, title: 'Seventh Post', content: 'Ut labore et dolore', authorId: 2 },
  { id: 8, title: 'Eighth Post', content: 'Magna aliqua', authorId: 1 },
  { id: 9, title: 'Ninth Post', content: 'Ut enim ad minim', authorId: 2 },
  { id: 10, title: 'Tenth Post', content: 'Veniam quis nostrud', authorId: 1 },
]

export default class PostsController {
  static listValidator = vine.create({
    page: vine.number().optional(),
    limit: vine.number().optional(),
    search: vine.string().optional(),
    authorId: vine.number().optional(),
  })

  static createValidator = vine.create({
    title: vine.string().minLength(3).maxLength(100),
    content: vine.string().minLength(10),
    authorId: vine.number(),
  })

  static updateValidator = vine.create({
    title: vine.string().minLength(3).maxLength(100).optional(),
    content: vine.string().minLength(10).optional(),
  })

  /**
   * List posts with pagination and filtering (for infinite query testing)
   */
  async list({ request }: HttpContext) {
    const {
      page = 1,
      limit = 3,
      search,
      authorId,
    } = await request.validateUsing(PostsController.listValidator)

    let filteredPosts = [...posts]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower),
      )
    }

    if (authorId) {
      filteredPosts = filteredPosts.filter((p) => p.authorId === authorId)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
    const hasNextPage = endIndex < filteredPosts.length

    return {
      posts: paginatedPosts,
      meta: {
        currentPage: page,
        perPage: limit,
        total: filteredPosts.length,
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
      },
    }
  }

  /**
   * Get a single post by ID
   */
  show({ params }: HttpContext) {
    const post = posts.find((p) => p.id === Number(params.id))
    if (!post) {
      return { error: 'Post not found' }
    }
    return { post }
  }

  /**
   * Create a new post
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(PostsController.createValidator)

    console.log('Creating post with payload:', payload)
    const newPost = {
      id: posts.length + 1,
      ...payload,
    }
    posts.push(newPost)

    return { post: newPost, success: true }
  }

  /**
   * Update an existing post
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(PostsController.updateValidator)
    const postIndex = posts.findIndex((p) => p.id === Number(params.id))

    if (postIndex === -1) {
      return { error: 'Post not found', success: false }
    }

    posts[postIndex] = { ...posts[postIndex], ...payload }
    return { post: posts[postIndex], success: true }
  }

  /**
   * Delete a post
   */
  delete({ params }: HttpContext) {
    const postIndex = posts.findIndex((p) => p.id === Number(params.id))
    if (postIndex === -1) {
      return { error: 'Post not found', success: false }
    }

    posts.splice(postIndex, 1)
    return { success: true }
  }
}
