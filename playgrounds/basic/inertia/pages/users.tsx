import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { query, queryClient } from '~/tuyau'

export default function Users() {
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [editingUser, setEditingUser] = useState<{
    id: number
    fullName: string
    email: string
  } | null>(null)

  // Fetch all users
  const usersQuery = useQuery(query.users.list.queryOptions())

  // Create mutation
  const createUser = useMutation(
    query.users.store.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.users.list.pathKey() })
        setNewUserName('')
        setNewUserEmail('')
        setNewUserPassword('')
      },
    })
  )

  // Update mutation
  const updateUser = useMutation(
    query.users.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.users.list.pathKey() })
        setEditingUser(null)
      },
    })
  )

  // Delete mutation
  const deleteUser = useMutation(
    query.users.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.users.list.pathKey() })
      },
    })
  )

  const users = usersQuery.data?.users.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
              👥 Users Demo
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Transformers Demo</h1>
          <p className="text-slate-400">
            Testing data transformation with{' '}
            <code className="px-2 py-0.5 rounded bg-white/10 text-blue-300">UserTransformer</code>
          </p>
        </div>

        {/* Transformer Info Card */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-400">🔄</span>
            <h3 className="text-sm font-semibold text-white">Transformer Details</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Transformer Class</p>
              <code className="text-sm text-blue-300 font-mono">UserTransformer</code>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Selected Fields</p>
              <code className="text-sm text-emerald-300 font-mono">
                id, fullName, email, createdAt, updatedAt
              </code>
            </div>
          </div>
          <div className="mt-3 p-3 bg-black/30 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Example Output</p>
            <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
              {`{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-11-06T12:00:00.000Z",
  "updatedAt": "2024-12-01T12:00:00.000Z"
}`}
            </pre>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Users List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Users List
                {usersQuery.data && (
                  <span className="text-slate-400 font-normal">({users.length} total)</span>
                )}
              </h2>
              {usersQuery.isFetching && (
                <div className="flex items-center gap-2 text-blue-400 text-sm">
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
                  Fetching...
                </div>
              )}
            </div>

            {users.length === 0 ? (
              <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-4xl mb-4 block">👤</span>
                <p className="text-slate-400">No users yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    {editingUser?.id === user.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingUser.fullName}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Full Name"
                        />
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Email"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateUser.mutate({
                                params: { id: editingUser!.id.toString() },
                                body: {
                                  fullName: editingUser!.fullName,
                                  email: editingUser!.email,
                                },
                              })
                            }
                            disabled={updateUser.isPending}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {updateUser.isPending ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.fullName?.charAt(0).toUpperCase() ||
                              user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{user.fullName || 'No name'}</h3>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                            <div className="flex gap-4 mt-1 text-xs text-slate-500">
                              <span>ID: {user.id}</span>
                              <span>Created: {new Date(user.createdAt!).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setEditingUser({
                                id: user.id,
                                fullName: user.fullName || '',
                                email: user.email,
                              })
                            }
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                          >
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
                          </button>
                          <button
                            onClick={() =>
                              deleteUser.mutate({ params: { id: user.id.toString() } })
                            }
                            disabled={deleteUser.isPending}
                            className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          >
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
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create User Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs">
                  +
                </span>
                Create User
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>
                <button
                  onClick={() =>
                    createUser.mutate({
                      body: {
                        fullName: newUserName,
                        email: newUserEmail,
                        password: newUserPassword,
                      },
                    })
                  }
                  disabled={
                    createUser.isPending || !newUserName || !newUserEmail || !newUserPassword
                  }
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createUser.isPending ? (
                    <span className="flex items-center justify-center gap-2">
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
                    </span>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>

              {createUser.isError && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-red-300 text-sm">
                    Error creating user. Make sure email is valid.
                  </p>
                </div>
              )}

              {/* API Response */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Raw Transformed Response
                </h4>
                <pre className="p-3 rounded-lg bg-black/30 text-xs text-slate-300 font-mono overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(usersQuery.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
