import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useQuery, useMutation, skipToken } from '@tanstack/react-query'

import { query, queryClient, urlFor } from '~/tuyau'

export default function Products() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [inStockOnly, setInStockOnly] = useState(false)

  // Test: Query with body params
  const productsSearch = useQuery(
    query.products.search.queryOptions({
      query: {
        q: searchQuery || undefined,
        category: category || undefined,
        minPrice,
        maxPrice,
        inStock: inStockOnly || undefined,
      },
    }),
  )

  // Test: Categories query (no params)
  const categoriesQuery = useQuery(query.products.categories.queryOptions())

  // Test: Products by category with route param
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const byCategoryQuery = useQuery(
    query.products.byCategory.queryOptions(
      selectedCategory ? { params: { category: selectedCategory } } : skipToken,
    ),
  )

  // Test: Single product with route param
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const productQuery = useQuery(
    query.products.show.queryOptions(
      selectedProductId ? { params: { id: selectedProductId.toString() } } : skipToken,
    ),
  )

  // Test: Create product mutation
  const createProduct = useMutation(
    query.products.store.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(query.products.search.pathFilter())
        queryClient.invalidateQueries(query.products.categories.pathFilter())
      },
    }),
  )

  // Test: Delete product mutation
  const deleteProduct = useMutation(
    query.products.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(query.products.search.pathFilter())
        setSelectedProductId(null)
      },
    }),
  )

  // Test: Direct URL building
  const productUrl = urlFor.get('products.show', { id: '42' }).url
  const categoryUrl = urlFor.get('products.by_category', { category: 'electronics' }).url

  const hasActiveFilters = searchQuery || category || minPrice || maxPrice || inStockOnly

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
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
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium">
              🛍️ Products Demo
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Query Params & Filters</h1>
          <p className="text-slate-400">Testing search, filtering, route params, and skipToken</p>
        </div>

        {/* URL Builder Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">🔗</span>
              <h3 className="text-sm font-semibold text-white">products.show</h3>
            </div>
            <code className="text-sm text-slate-300 font-mono bg-black/30 px-3 py-1.5 rounded-lg block truncate">
              {productUrl}
            </code>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-400">🔗</span>
              <h3 className="text-sm font-semibold text-white">products.byCategory</h3>
            </div>
            <code className="text-sm text-slate-300 font-mono bg-black/30 px-3 py-1.5 rounded-lg block truncate">
              {categoryUrl}
            </code>
          </div>
        </div>

        {/* Search Filters */}
        <div className="mb-6 p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Search Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategory('')
                  setMinPrice(undefined)
                  setMaxPrice(undefined)
                  setInStockOnly(false)
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">All categories</option>
              {categoriesQuery.data?.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min $"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/30 text-emerald-500 focus:ring-emerald-500/50"
              />
              <span className="text-sm text-white">In stock</span>
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Results */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Results
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                  {productsSearch.data?.total || 0}
                </span>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {productsSearch.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-emerald-500" viewBox="0 0 24 24">
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
                )}

                <div className="space-y-2">
                  {productsSearch.data?.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProductId === product.id
                          ? 'bg-emerald-500/20 border border-emerald-500/50'
                          : 'bg-black/20 border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-medium text-white truncate">{product.name}</h4>
                          <p className="text-xs text-slate-400">{product.category}</p>
                        </div>
                        <span className="text-emerald-400 font-semibold ml-2">
                          ${product.price}
                        </span>
                      </div>
                      <div className="mt-2">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            In stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {productsSearch.data?.products.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Browser */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Categories
                  <span className="text-xs text-slate-400 font-normal">(Route Params)</span>
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {categoriesQuery.data?.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-purple-500/20 border border-purple-500/50 text-white'
                          : 'bg-black/20 border border-transparent hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="capitalize">{cat}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${selectedCategory === cat ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-medium text-white mb-3 capitalize">
                      {selectedCategory} Products
                    </h4>
                    {byCategoryQuery.isLoading ? (
                      <div className="flex justify-center py-4">
                        <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
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
                      <ul className="space-y-2">
                        {byCategoryQuery.data?.products.map((p) => (
                          <li key={p.id} className="flex justify-between text-sm">
                            <span className="text-slate-300">{p.name}</span>
                            <span className="text-purple-400">${p.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Detail & Create */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Detail */}
            {selectedProductId && productQuery.data?.product && (
              <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Product Detail
                  </h2>
                </div>
                <div className="p-4">
                  {productQuery.isLoading ? (
                    <div className="flex justify-center py-8">
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
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {productQuery.data.product.name}
                          </h3>
                          <p className="text-sm text-slate-400 capitalize">
                            {productQuery.data.product.category}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs">
                          #{productQuery.data.product.id}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-400 mb-4">
                        ${productQuery.data.product.price}
                      </div>
                      <div className="mb-4">
                        {productQuery.data.product.inStock ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          deleteProduct.mutate({ params: { id: selectedProductId.toString() } })
                        }
                        disabled={deleteProduct.isPending}
                        className="w-full py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {deleteProduct.isPending ? (
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
                        Delete Product
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Create Product */}
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Add Product
                </h2>
              </div>
              <div className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = e.target as HTMLFormElement
                    const formData = new FormData(form)
                    createProduct.mutate({
                      body: {
                        name: formData.get('name') as string,
                        price: Number(formData.get('price')),
                        category: formData.get('category') as string,
                        inStock: formData.get('inStock') === 'on',
                      },
                    })
                    form.reset()
                  }}
                  className="space-y-4"
                >
                  <input
                    name="name"
                    placeholder="Product name"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <input
                    name="category"
                    placeholder="Category"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 cursor-pointer">
                    <input
                      name="inStock"
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-white">In stock</span>
                  </label>
                  <button
                    type="submit"
                    disabled={createProduct.isPending}
                    className="w-full py-3 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createProduct.isPending ? (
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
                        Add Product
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Debug */}
            <details className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <summary className="p-4 cursor-pointer text-sm font-medium text-slate-400 hover:text-white transition-colors">
                🔧 Debug: Query Keys
              </summary>
              <div className="px-4 pb-4">
                <pre className="text-xs text-slate-400 overflow-auto p-3 rounded-lg bg-black/30 font-mono">
                  {JSON.stringify(
                    {
                      'pathKey()': query.products.search.pathKey(),
                      'pathFilter()': query.products.search.pathFilter(),
                      'queryKey()': query.products.search.queryKey(),
                    },
                    null,
                    2,
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
