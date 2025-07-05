import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { tuyauQuery } from '~/app/tuyau'

export default function PostsIndex() {
  const [category, setCategory] = useState('all')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery(
      tuyauQuery.api.posts.$get.infiniteQueryOptions(
        {
          payload: { category, limit: 10 },
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          initialPageParam: 0,
        }
      )
    )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Head title="Posts - Loading" />
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Head title="Posts - Error" />
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error loading posts</h2>
            <p className="text-red-600 mt-1">{error?.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? []
  const totalPosts = data?.pages[0]?.total ?? 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head title="Infinite Posts" />

      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Infinite Posts Demo</h1>
          <p className="text-gray-600 mb-6">
            Showing {allPosts.length} of {totalPosts} posts.
          </p>

          {/* Category Filter */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Posts</option>
              <option value="0">Category 1</option>
              <option value="1">Category 2</option>
              <option value="2">Category 3</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {allPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          {hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </button>
          ) : (
            <p className="text-gray-500 py-4">reached the end! No more posts to load.</p>
          )}
        </div>

        {/* Debug Information */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Pages loaded:</strong> {data?.pages.length}
            </p>
            <p>
              <strong>Posts loaded:</strong> {allPosts.length}
            </p>
            <p>
              <strong>Total posts:</strong> {totalPosts}
            </p>
            <p>
              <strong>Has next page:</strong> {hasNextPage ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Is fetching:</strong> {isFetchingNextPage ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Current category:</strong> {category}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
