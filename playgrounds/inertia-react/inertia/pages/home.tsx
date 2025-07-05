import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { Link } from '@tuyau/inertia/react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient, useTuyau } from '~/app/tuyau'

export default function Home(props: { version: number }) {
  const tuyau = useTuyau().api

  const { data } = useQuery(tuyau.todos.$get.queryOptions())
  const { mutate: createTodo } = useMutation(
    tuyau.todos.$post.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.todos.$get.queryKey() }),
    })
  )

  const { mutate: updateTodo } = useMutation(
    tuyau.todos[':id'].$put.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.todos.$get.queryKey() }),
    })
  )

  const { mutate: deleteTodo } = useMutation(
    tuyau.todos[':id'].$delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.todos.$get.queryKey() }),
    })
  )

  const [form, setForm] = useState({ title: '', description: '' })
  const [editingTodo, setEditingTodo] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTodo({ payload: { title: form.title, description: form.description } })
    setForm({ title: '', description: '' })
  }

  const handleEditSubmit = (e: React.FormEvent, todoId: number) => {
    e.preventDefault()
    updateTodo({
      params: { id: todoId },
      payload: { title: editForm.title, description: editForm.description },
    })
    setEditingTodo(null)
    setEditForm({ title: '', description: '' })
  }

  const startEditing = (todo: any) => {
    setEditingTodo(todo.id)
    setEditForm({ title: todo.title, description: todo.description })
  }

  const cancelEditing = () => {
    setEditingTodo(null)
    setEditForm({ title: '', description: '' })
  }

  return (
    <>
      <Head title="Homepage" />

      <header className="bg-gradient-to-r from-blue-500 to-sky-400 text-white py-12 rounded-xl mb-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold m-0">AdonisJS {props.version} × Inertia × React</h1>
        <p className="text-lg mt-4 opacity-90">
          A modern, fully type-safe stack for building fast and elegant web apps.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <section className="mb-8">
          <nav className="flex gap-4 mb-3">
            <Link route="posts.create" className="bg-green-400 p-2 rounded text-white">
              Create a post
            </Link>
            <Link
              route="posts_comments.create"
              params={{ postId: 1 }}
              className="btn btn-secondary"
            >
              Comment on post #1
            </Link>
          </nav>
          <span className="text-sm text-gray-700">
            Discover AdonisJS and Inertia.js in the&nbsp;
            <a
              href="https://docs.adonisjs.com/guides/inertia"
              target="_blank"
              rel="noopener"
              className="text-blue-600 underline"
            >
              official documentation
            </a>
            .
          </span>
        </section>

        <section className="mt-4 bg-gray-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📝</span> Todos
          </h2>
          {data?.length === 0 && <div className="text-gray-400 mb-4">No todos yet. Add one!</div>}
          {data?.map((todo) => (
            <div
              key={todo.id}
              className="todo flex items-center justify-between bg-white rounded-md px-4 py-2 mb-2 shadow-sm"
            >
              {editingTodo === todo.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, todo.id)} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="flex-1 px-2 py-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="flex-1 px-2 py-1 border rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-medium">{todo.title}</div>
                    <div className="text-xs text-gray-500">{todo.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo({ params: { id: todo.id }, payload: {} })}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="mt-6 mb-2 space-y-3">
            <div>
              <label className="font-medium grid mb-1">
                Title
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="form-control border mt-1"
                  required
                />
              </label>
            </div>
            <div>
              <label className="font-medium grid mb-1">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control border mt-1 min-h-[48px]"
                  required
                />
              </label>
            </div>
            <button type="submit" className="bg-green-400 p-2 rounded text-white">
              Add a todo
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
