---
summary: React integration with TanStack Query for Tuyau
---

# React

The `@tuyau/react-query` package provides a seamless integration between Tuyau and TanStack React Query, offering type-safe query and mutation options that work natively with React Query hooks.

## Installation

Install the required dependencies:

```bash
npm install @tuyau/react-query @tanstack/react-query
# or
pnpm add @tuyau/react-query @tanstack/react-query
```

## Setup

The setup differs depending on whether you're building a Single Page Application (SPA) or a server-rendered application (SSR). With SSR, it's crucial to create a new QueryClient for each request to prevent users from sharing the same cache.

First, make sure to follow the steps described in the [Installation guide](../installation.md) to generate and import the Tuyau client, then proceed with the setup based on your application type.

### SPA setup

Once you've completed the Tuyau installation, set up React Query in your application:

```ts
// lib/tuyau.ts
import { createTuyau } from '@tuyau/client'
import { QueryClient } from '@tanstack/react-query'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

import { api } from '@my-monorepo/server/api'

export const queryClient = new QueryClient()
export const client = createTuyau({ api, baseUrl: `http://localhost:3333` })
export const tuyau = createTuyauReactQueryClient({ client, queryClient })
```

Then set up your app with the React Query provider:

```tsx
// app.tsx
import { queryClient } from './lib/tuyau'
import { QueryClientProvider } from '@tanstack/react-query'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```

### SSR setup

For SSR applications, you need to create a new QueryClient for each request. Use React Context to provide the QueryClient to your components.

Make sure to also read the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup) for more details on SSR setup.

```tsx
// lib/tuyau.ts
export const client = createTuyau({
  api,
  baseUrl: import.meta.env.VITE_API_URL || `http://localhost:3333`,
})

export const {
  TuyauProvider,
  useTuyau,
  useTuyauClient,
} = createTuyauContext<typeof api>()
```

```tsx
// app.tsx
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { client } from './lib/tuyau'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function App() {
  const queryClient = getQueryClient()
  const [tuyau] = useState(() => createTuyauReactQueryClient({ client, queryClient }))

  return (
    <QueryClientProvider client={queryClient}>
      <TuyauQueryProvider client={tuyau} queryClient={queryClient}>
        {/* Your app here */}
      </TuyauQueryProvider>
    </QueryClientProvider>
  )
}
```

## Checking everything is working

You should now be able to use Tuyau with TanStack Query in your React application. To verify everything is working, create a simple component that fetches data from your API:

```tsx
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTuyau } from '../lib/tuyau'

export default function UserList() {
  const tuyau = useTuyau() // use `import { tuyau } from './utils/tuyau'` if you're using the SPA setup

  const userQuery = useQuery(tuyau.user.$get.queryOptions())
  const userCreator = useMutation(tuyau.user.$post.mutationOptions())

  return (
    <div>
      <p>{userQuery.data?.name}</p>
      <button onClick={() => userCreator.mutate({ name: 'John' })}>
        Create User
      </button>
    </div>
  )
}
```

## Usage

The philosophy of this integration is to provide thin, type-safe factories that work natively with TanStack React Query. By following the autocompletes the client provides, you can focus on building with just the knowledge the [TanStack React Query docs](https://tanstack.com/query/latest/docs/framework/react/overview) provide.

```tsx
export default function Basics() {
  const tuyau = useTuyau()
  const queryClient = useQueryClient()
  
  // Create QueryOptions which can be passed to query hooks
  const myQueryOptions = tuyau.users.$get.queryOptions({ /** inputs */ })
  const myQuery = useQuery(myQueryOptions)
  // or: useSuspenseQuery(myQueryOptions)
  // or: useInfiniteQuery(myQueryOptions)
  
  // Create MutationOptions which can be passed to useMutation
  const myMutationOptions = tuyau.users.$post.mutationOptions()
  const myMutation = useMutation(myMutationOptions)
  
  // Create a QueryKey which can be used to manipulate many methods
  // on TanStack's QueryClient in a type-safe manner
  const myQueryKey = tuyau.users.$get.queryKey()
  const invalidateMyQueryKey = () => {
    queryClient.invalidateQueries({ queryKey: myQueryKey })
  }
  
  return (
    // Your app here
  )
}
```

The `tuyau` object is fully type-safe and provides autocompletes for all the routes in your AdonisJS API. At the end of the proxy, the following methods are available:

### `queryOptions` - querying data

Available for all GET procedures. Provides a type-safe wrapper around TanStack's queryOptions function. The first argument is the input for the route, and the second argument accepts any native TanStack React Query options.

```tsx
const queryOptions = tuyau.users.$get.queryOptions(
  {
    /** input */
  },
  {
    // Any TanStack React Query options
    staleTime: 1000,
  },
)
```

The result can be passed to `useQuery`, `useSuspenseQuery` hooks or query client methods like `fetchQuery`, `prefetchQuery`, `invalidateQueries`, etc.

### `infiniteQueryOptions` - querying infinite data

Available for all GET procedures that support pagination. Provides a type-safe wrapper around TanStack's infiniteQueryOptions function.

```tsx
const infiniteQueryOptions = tuyau.users.$get.infiniteQueryOptions(
  {
    /** input */
  },
  {
    // Any TanStack React Query options
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  },
)
```

### `queryKey` - getting the query key

Available for all GET procedures. Allows you to access the query key in a type-safe manner.

```tsx
const queryKey = tuyau.users.$get.queryKey()
```

The query key is essential for managing cache invalidation and other query client operations.

### `pathKey` - getting partial query keys

Available for all routes. Since TanStack React Query uses fuzzy matching for query keys, you can create a partial query key for any sub-path to match all queries belonging to a route:

```tsx
const pathKey = tuyau.users.pathKey()
```

This is particularly useful when you want to invalidate or manipulate multiple related queries at once. For example, if you have routes like:
- `tuyau.users.$get` - list all users
- `tuyau.users({ id: 1 }).$get` - get user by ID
- `tuyau.users({ id: 1 }).posts.$get` - get posts for a user

Using `tuyau.users.pathKey()` will match all of these queries, allowing you to invalidate all user-related queries with a single operation:

```tsx
// Invalidate all user-related queries
queryClient.invalidateQueries({ queryKey: tuyau.users.pathKey() })
```

### `queryFilter` - creating query filters

Available for all GET procedures. Allows creating [query filters](https://tanstack.com/query/latest/docs/framework/react/guides/filters#query-filters) in a type-safe manner.

```tsx
const queryFilter = tuyau.users.$get.queryFilter(
  {
    /** input */
  },
  {
    // Any TanStack React Query filter
    predicate: (query) => {
      return query.state.data
    },
  },
)
```

Like with query keys, if you want to run a filter across a whole route you can use `pathFilter`:

```tsx
const queryFilter = tuyau.users.pathFilter({
  // Any TanStack React Query filter
  predicate: (query) => {
    return query.state.data
  },
})
```

### `mutationOptions` - creating mutation options

Available for all mutation procedures (POST, PUT, PATCH, DELETE). Provides a type-safe wrapper for constructing options that can be passed to `useMutation`.

```tsx
const mutationOptions = tuyau.users.$post.mutationOptions({
  // Any TanStack React Query options
  onSuccess: (data) => {
    // do something with the data
  },
})
```

### `mutationKey` - getting the mutation key

Available for all mutation procedures. Allows you to get the mutation key in a type-safe manner.

```tsx
const mutationKey = tuyau.users.$post.mutationKey()
```

### Inferring Input and Output types

When you need to infer the input and output types for a procedure, you can use the provided utility types:

```tsx
import type { InferRequestType, InferResponseType } from '@tuyau/react-query'

function Component() {
  const tuyau = useTuyau()
  
  type Input = InferRequestType<typeof tuyau.users.$get>
  type Output = InferResponseType<typeof tuyau.users.$get>
}
```

### Accessing the Tuyau client

If you used the setup with React Context, you can access the Tuyau client using the `useTuyauClient` hook:

```tsx
import { useTuyauClient } from './tuyau'

function Component() {
  const tuyauClient = useTuyauClient()
  
  const result = await tuyauClient.users.$get({
    /** input */
  })
}
```

If you set up without React Context, you can import the global client instance directly instead:

```tsx
import { client } from './tuyau'

const result = await client.users.$get({
  /** input */
})
```

### Route Parameters: Two Syntaxes Available

With TanStack Query integration, you have two ways to handle routes with parameters, depending on your use case.

**Option 1: Parameters known at mutation creation time**
```tsx
// When you know the ID upfront
const mutation = useMutation(
  tuyau.users({ id: 1 }).$patch.mutationOptions()
)

mutation.mutate({ payload: { name: 'Updated' } })
```

**Option 2: Parameters provided at execution time**
```tsx
// When the ID is determined later
const mutation = useMutation(
  tuyau.users[':id'].$patch.mutationOptions()
)

mutation.mutate({ 
  params: { id: 1 }, 
  payload: { name: 'Updated' } 
})
```

**When to use each approach:**

- **Use Option 1** when you know the parameter values when creating the mutation (e.g., editing a specific user profile)
- **Use Option 2** when you need flexibility to use the same mutation with different parameters (e.g., a delete button in a user list)

```tsx
// ✅ Good - Use Option 2 for dynamic parameters
const deleteUserMutation = useMutation(
  tuyau.users[':id'].$delete.mutationOptions()
)

// Later, when user clicks delete button:
const handleDelete = (userId: number) => {
  deleteUserMutation.mutate({ params: { id: userId } })
}
```


## Examples

### Complete CRUD Example

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTuyau } from './lib/tuyau'

function UserManager() {
  const tuyau = useTuyau()
  const queryClient = useQueryClient()
  
  // List users
  const usersQuery = useQuery(tuyau.users.$get.queryOptions())
  
  // Create user
  const createUserMutation = useMutation(
    tuyau.users.$post.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ 
        queryKey: tuyau.users.$get.queryKey() 
      })
    })
  )
  
  // Update user
  const updateUserMutation = useMutation(
    tuyau.users[':id'].$patch.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.users.pathKey() })
    })
  )
  
  // Delete user
  const deleteUserMutation = useMutation(
    tuyau.users[':id'].$delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: tuyau.users.$get.queryKey() })
    })
  )

  return (
    <div>
      {usersQuery.data?.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => updateUserMutation.mutate({
            params: { id: user.id },
            payload: { name: 'Updated' }
          })}>
            Update
          </button>
          <button onClick={() => deleteUserMutation.mutate({ params: { id: user.id } })}>
            Delete
          </button>
        </div>
      ))}
      
      <button onClick={() => createUserMutation.mutate({ payload: { name: 'New User' } })}>
        Create User
      </button>
    </div>
  )
}
```
