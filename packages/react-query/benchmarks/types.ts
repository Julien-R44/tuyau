import { bench } from '@ark/attest'
import { createTuyau } from '@tuyau/core/client'
import { QueryClient } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauReactQueryClient } from '../src/main.ts'
import { generatedRegistry as registry100 } from './fixtures/generated-fixture-100.ts'
import { generatedRegistry as registry300 } from './fixtures/generated-fixture-300.ts'

const queryClient = new QueryClient()

bench('Small registry', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
  const query = createTuyauReactQueryClient({ client: tuyau, queryClient })

  query.auth.login.show.queryOptions({})
  query.users.index.queryOptions({ query: { email: 'test' } })

  query.auth.login.mutationOptions()

  query.auth.login.show.queryKey({})
  query.pathKey()

  return {}
}).types([1246, 'instantiations'])

bench('Big registry 100 routes', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })
  const query = createTuyauReactQueryClient({ client: tuyau, queryClient })

  query.coupon.unblock.queryOptions({ params: { itemId: '1', userId: '2' } })
  query.library.split.mutationOptions()

  return {}
}).types([3647, 'instantiations'])

bench('Huge registry 300 routes', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })
  const query = createTuyauReactQueryClient({ client: tuyau, queryClient })

  query.inventory.knowledge.merge.queryOptions({})
  query.fashion.combine.mutationOptions()

  return {}
}).types([9507, 'instantiations'])
