import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { Link } from '@tuyau/inertia/react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient, tuyauQuery as tuyau } from '~/app/tuyau'

const api = tuyau.api
export default function Home(props: { version: number }) {
  const { data } = useQuery(api.todos.$get.queryOptions())
  const { mutate: createTodo } = useMutation(
    api.todos.$post.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: api.todos.$get.queryKey() }),
    })
  )

  const { mutate: deleteTodo } = useMutation(
    api.todos[':id'].$delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.pathKey() }),
    })
  )

  const [form, setForm] = useState({ title: '', description: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTodo({ payload: { title: form.title, description: form.description } })
    setForm({ title: '', description: '' })
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
              <div>
                <div className="font-medium">{todo.title}</div>
                <div className="text-xs text-gray-500">{todo.description}</div>
              </div>
              <button
                onClick={() => deleteTodo({ params: { id: todo.id }, payload: {} })}
                className="btn btn-danger ml-4"
              >
                Delete
              </button>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="mt-6 mb-2 space-y-3">
            <div>
              <label className="font-medium block grid mb-1">
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
              <label className="font-medium block grid mb-1">
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
