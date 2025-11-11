import { query, queryClient } from '~/tuyau'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data } = useQuery(query.users.list.queryOptions())
  const addUser = useMutation(
    query.users.store.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.users.list.queryKey() })
      },
    })
  )
  const deleteUser = useMutation(
    query.users.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: query.users.list.queryKey() })
      },
    })
  )

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Users List</h1>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-2">
            <span>{user.email}</span>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              onClick={() => deleteUser.mutate({ params: { id: user.id.toString() } })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mt-8">Add User</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => addUser.mutate({})}
      >
        Add Random User
      </button>
    </div>
  )
}
