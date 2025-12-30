import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { skipToken, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import { query, queryClient, urlFor } from '~/tuyau'

export default function Posts() {
  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState<number | undefined>()
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')

  // Test: Infinite Query with query params
  const postsQuery = useInfiniteQuery(
    query.posts.list.infiniteQueryOptions(
      { query: { search: search || undefined, authorId: authorFilter, limit: 5 } },
      {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.meta.nextPage,
        pageParamKey: 'page',
      }
    )
  )

  // Test: Single post query with route param
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const singlePostQuery = useQuery(
    query.posts.show.queryOptions(
      selectedPostId ? { params: { id: selectedPostId.toString() } } : skipToken,
      { enabled: !!selectedPostId }
    )
  )

  // Test: Create mutation with body payload
  const createPost = useMutation(
    query.posts.store.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.posts.list.pathKey() })
        setNewPostTitle('')
        setNewPostContent('')
      },
    })
  )

  // Test: Update mutation with route param + body
  const updatePost = useMutation(
    query.posts.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.posts.list.pathKey() })
        if (selectedPostId) {
          queryClient.invalidateQueries({
            queryKey: query.posts.show.queryKey({ params: { id: selectedPostId.toString() } }),
          })
        }
      },
    })
  )

  // Test: Delete mutation with route param
  const deletePost = useMutation(
    query.posts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.posts.list.pathKey() })
        setSelectedPostId(null)
      },
    })
  )

  // Test: Direct urlFor usage
  const postUrl = urlFor.get('posts.show', { id: '1' }).url

  const allPosts = postsQuery.data?.pages.flatMap((page) => page.posts) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
              📝 Posts Demo
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Infinite Query & Mutations</h1>
          <p className="text-slate-400">
            Testing infinite scroll, CRUD operations, and query invalidation
          </p>
        </div>

        {/* URL Builder Card */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400">🔗</span>
            <h3 className="text-sm font-semibold text-white">URL Builder Test</h3>
          </div>
          <code className="text-sm text-slate-300 font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
            {postUrl}
          </code>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>
            <select
              value={authorFilter || ''}
              onChange={(e) => setAuthorFilter(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">All authors</option>
              <option value="1">Author 1</option>
              <option value="2">Author 2</option>
              <option value="3">Author 3</option>
            </select>
            {(search || authorFilter) && (
              <button
                onClick={() => {
                  setSearch('')
                  setAuthorFilter(undefined)
                }}
                className="px-4 py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Posts List
                {postsQuery.data && (
                  <span className="text-slate-400 font-normal">
                    ({postsQuery.data.pages[0]?.meta.total || 0} total)
                  </span>
                )}
              </h2>
              {postsQuery.isFetching && !postsQuery.isFetchingNextPage && (
                <div className="flex items-center gap-2 text-purple-400 text-sm">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Refreshing...
                </div>
              )}
            </div>

            {postsQuery.isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-slate-400">Loading posts...</span>
                </div>
              </div>
            )}

            {postsQuery.isError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400">Error: {(postsQuery.error as any).message}</p>
              </div>
            )}

            <div className="space-y-3">
              {allPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPostId === post.id
                      ? 'bg-purple-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{post.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs">
                        #{post.id}
                      </span>
                      <span className="text-xs text-slate-500">Author {post.authorId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {postsQuery.hasNextPage && (
              <button
                onClick={() => postsQuery.fetchNextPage()}
                disabled={postsQuery.isFetchingNextPage}
                className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {postsQuery.isFetchingNextPage ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Loading more...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Load More Posts
                  </>
                )}
              </button>
            )}

            {!postsQuery.hasNextPage && allPosts.length > 0 && (
              <p className="text-center text-slate-500 text-sm py-2">✨ You've seen all posts</p>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Post Detail */}
            {selectedPostId && singlePostQuery.data?.post && (
              <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Post Details
                  </h2>
                </div>
                <div className="p-4">
                  {singlePostQuery.isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {singlePostQuery.data.post.title}
                      </h3>
                      <p className="text-slate-300 mb-4">{singlePostQuery.data.post.content}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <span>Author ID: {singlePostQuery.data.post.authorId}</span>
                        <span>•</span>
                        <span>Post #{singlePostQuery.data.post.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updatePost.mutate({
                              params: { id: selectedPostId.toString() },
                              body: { title: `[Updated] ${singlePostQuery.data.post!.title}` },
                            })
                          }
                          disabled={updatePost.isPending}
                          className="flex-1 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {updatePost.isPending ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          )}
                          Update
                        </button>
                        <button
                          onClick={() =>
                            deletePost.mutate({ params: { id: selectedPostId.toString() } })
                          }
                          disabled={deletePost.isPending}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          {deletePost.isPending ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Create Post Form */}
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Create New Post
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="Enter post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Content</label>
                  <textarea
                    placeholder="Write your post content..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
                  />
                </div>
                <button
                  onClick={() =>
                    createPost.mutate({
                      body: {
                        title: newPostTitle,
                        content: newPostContent,
                        authorId: 1,
                      },
                    })
                  }
                  disabled={createPost.isPending || !newPostTitle || !newPostContent}
                  className="w-full py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createPost.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Post
                    </>
                  )}
                </button>
                {createPost.isError && (
                  <p className="text-red-400 text-sm text-center">Failed to create post</p>
                )}
                {createPost.isSuccess && (
                  <p className="text-emerald-400 text-sm text-center">Post created successfully!</p>
                )}
              </div>
            </div>

            {/* Query Keys Debug */}
            <details className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <summary className="p-4 cursor-pointer text-sm font-medium text-slate-400 hover:text-white transition-colors">
                🔧 Debug: Query Keys
              </summary>
              <div className="px-4 pb-4">
                <pre className="text-xs text-slate-400 overflow-auto p-3 rounded-lg bg-black/30 font-mono">
                  {JSON.stringify(
                    {
                      'pathKey()': query.posts.list.pathKey(),
                      'queryKey()': query.posts.list.queryKey(),
                      'show.queryKey({id:"1"})': query.posts.show.queryKey({
                        params: { id: '1' },
                      }),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
