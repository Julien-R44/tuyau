import { Head } from '@inertiajs/react'
import { Link } from '@tuyau/inertia/react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient, tuyauQuery as tuyau } from '~/app/tuyau'

export default function Home(props: { version: number }) {
  const { data } = useQuery(tuyau.api.todos.$get.queryOptions({}))
  const { mutate: createTodo } = useMutation(
    tuyau.api.todos.$post.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: tuyau.api.todos.$get.queryKey() })
      },
    })
  )

  const { mutate: deleteTodo } = useMutation(
    tuyau.api.todos.$delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: tuyau.api.todos.$get.queryKey() })
      },
    })
  )

  return (
    <>
      <Head title="Homepage" />

      <div className="container">
        <div className="title">AdonisJS {props.version} x Inertia x React</div>
        <Link route="posts.create">Go Post create</Link>
        <Link route="posts_comments.create" params={{ postId: 1 }}>
          Create comment for post 1
        </Link>
        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
        </span>
        <div className="mt-4">
          <h2>Todos</h2>
          {data?.map((todo) => (
            <div key={todo.id} className="todo">
              {todo.title}

              <button onClick={() => deleteTodo({ id: todo.id })} className="btn btn-danger">
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              createTodo({ title: 'foo', description: 'bar' })
            }}
            className="btn btn-primary"
          >
            Create Todo
          </button>
        </div>
      </div>
    </>
  )
}
