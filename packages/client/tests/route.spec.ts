import nock from 'nock'
import { test } from '@japa/runner'

import { setWindow } from './helpers.js'
import { api } from './fixtures/routes.js'
import { createTuyau } from '../src/client.js'

test.group('Route Helpers', () => {
  test('basic', ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    const r1 = tuyau.$url('home')
    const r2 = tuyau.$url('home', { query: { id: 1 } })
    const r3 = tuyau.$url('posts_comments.create', { params: { postId: 2 } })
    const r4 = tuyau.$url('posts_comments.show', { params: { postId: 2, id: 1 } })

    assert.equal(r1, 'http://localhost:3333/')
    assert.equal(r2, 'http://localhost:3333/?id=1')
    assert.equal(r3, 'http://localhost:3333/posts/2/comments/create')
    assert.equal(r4, 'http://localhost:3333/posts/2/comments/1')
  })

  test('params as object', ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    const r1 = tuyau.$url('posts_comments.show', { params: { postId: 2, id: 1 } })
    assert.equal(r1, 'http://localhost:3333/posts/2/comments/1')
  })

  test('params as array', ({ assert }) => {
    const tuyau = createTuyau({
      api,
      baseUrl: 'http://localhost:3333',
    })

    const r1 = tuyau.$url('posts_comments.show', { params: [2, 1] })
    const r2 = tuyau.$url('posts_comments.show', { params: ['2', '1'] })

    assert.equal(r1, 'http://localhost:3333/posts/2/comments/1')
    assert.equal(r2, 'http://localhost:3333/posts/2/comments/1')
  })

  test('query params', ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    const r1 = tuyau.$url('home', { query: { id: 1 } })
    const r2 = tuyau.$url('home', { query: { id: [1, 2] } })
    const r3 = tuyau.$url('home', { query: { id: [1, 2], name: 'julr' } })
    const r4 = tuyau.$url('home', { query: { id: [1, 2], name: ['julr'] } })

    assert.equal(r1, 'http://localhost:3333/?id=1')
    assert.equal(r2, 'http://localhost:3333/?id[]=1&id[]=2')
    assert.equal(r3, 'http://localhost:3333/?id[]=1&id[]=2&name=julr')
    assert.equal(r4, 'http://localhost:3333/?id[]=1&id[]=2&name[]=julr')
  })

  test('throw if route not found', ({ assert }) => {
    const tuyau = createTuyau({
      api,
      baseUrl: 'http://localhost:3333',
    })

    // @ts-expect-error
    assert.throws(() => tuyau.$url('non-existing-route'), 'Route non-existing-route not found')
  })

  test('$has', ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    assert.isTrue(tuyau.$has('home'))
    assert.isFalse(tuyau.$has('non-existing-route'))
  })

  test('$has with wildcard', ({ assert }) => {
    const tuyau = createTuyau({
      api: {
        definition: {},
        routes: [
          { name: 'home', path: '/', params: [], method: ['GET'] },
          {
            name: 'posts_comments.create',
            path: '/posts/:postId/comments/create',
            params: ['postId'],
            method: ['GET'],
          },
          {
            name: 'posts_comments.foo.create',
            path: '/posts/:postId/comments/create',
            params: ['postId'],
            method: ['GET'],
          },
          {
            name: 'posts_comments.show',
            path: '/posts/:postId/comments/:id',
            params: ['postId', 'id'],
            method: ['GET'],
          },
        ],
      },
      baseUrl: 'http://localhost:3333',
    })

    assert.isTrue(tuyau.$has('posts_comments.*'))
    assert.isTrue(tuyau.$has('posts_comments.*.create'))
    assert.isFalse(tuyau.$has('posts_comments.*.edit'))
  })

  test('$route', async () => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .get('/posts/1/comments/2/edit')
      .reply(200, { id: 1, body: 'Hello world' })

    await tuyau.$route('posts_comments.edit', { id: 2, postId: 1 }).$get().unwrap()
  })

  test('$current', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const result = tuyau.$current()
    assert.deepEqual(result, 'posts_comments.edit')
  })

  test('$current with given route', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const r1 = tuyau.$current('home')
    assert.deepEqual(r1, false)

    const r2 = tuyau.$current('posts_comments.edit')
    assert.deepEqual(r2, true)
  })

  test('$current with given route and specific parameters', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const r3 = tuyau.$current('posts_comments.edit', {
      params: { id: 2, postId: 1 },
    })

    assert.deepEqual(r3, true)

    const r4 = tuyau.$current('posts_comments.edit', {
      params: { id: 3, postId: 1 },
    })
    assert.deepEqual(r4, false)
  })

  test('$current with given route and only some parameters', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const r5 = tuyau.$current('posts_comments.edit', {
      params: { id: 2 },
    })

    assert.deepEqual(r5, true)

    const r6 = tuyau.$current('posts_comments.edit', {
      params: { id: 3 },
    })

    assert.deepEqual(r6, false)
  })

  test('$current with given route and specific query params', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const r5 = tuyau.$current('posts_comments.edit', {
      query: { id: 1 },
    })

    assert.deepEqual(r5, true)

    const r6 = tuyau.$current('posts_comments.edit', {
      query: { id: 2 },
    })

    assert.deepEqual(r6, false)
  })

  test('$current with wildcard', async ({ assert }) => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    setWindow({
      location: {
        host: 'localhost:3333',
        search: '?id=1',
        pathname: '/posts/1/comments/2/edit',
      },
    })

    const r1 = tuyau.$current('posts_comments.*')
    const r2 = tuyau.$current('posts_comments.*.edit')
    const r3 = tuyau.$current('users.*')
    const r4 = tuyau.$current('*')

    assert.deepEqual(r1, true)
    assert.deepEqual(r2, false)
    assert.deepEqual(r3, false)
    assert.deepEqual(r4, true)
  })
})

test.group('Route Helpers | Typings', () => {
  test('$url typings', () => {
    const tuyau = createTuyau({ api, baseUrl: 'http://localhost:3333' })

    // @ts-expect-error Should error cause route doesnt exist
    tuyau.$url('non-existing-route')

    // @ts-expect-error Should error cause missing params
    tuyau.$url('posts_comments.create', {})

    // @ts-expect-error Should error cause missing params
    tuyau.$url('posts_comments.create', { params: {} })

    // @ts-expect-error Should error cause missing params
    tuyau.$url('posts_comments.create', { params: [] })

    // @ts-expect-error Should error cause missing params
    tuyau.$url('posts_comments.show', { params: [1] })

    // @ts-expect-error Should error cause too many params
    tuyau.$url('posts_comments.show', { params: [1, 2, 3] })

    // @ts-expect-error Should error cause not camelCase
    tuyau.$url('posts_comments.show', { params: { post_id: 1, id: 2 } })

    tuyau.$url('users.index')
    tuyau.$url('users.index', { query: { name: 'julr' } })
    tuyau.$url('posts_comments.show', { params: ['1', '2'] })
    tuyau.$url('posts_comments.show', { params: { postId: 1, id: 2 } })
  }).fails()

  test('$route typings', async ({ expectTypeOf }) => {
    const tuyau = createTuyau({
      api,
      baseUrl: 'http://localhost:3333',
    })

    const r1 = await tuyau.$route('simpleText').$get().unwrap()
    expectTypeOf(r1).toEqualTypeOf({ text: 'foo' })

    const r2 = await tuyau.$route('posts_comments.create', { postId: 1 }).$get().unwrap()
    expectTypeOf(r2).toEqualTypeOf({ post_id: 1 })

    // @ts-expect-error Should error cause missing params
    await tuyau.$route('posts.update').$patch().unwrap()

    const res = await tuyau
      .$route('posts.update', { id: 1 })
      .$patch({ comment: 'Hello world', title: 'Hello world' })
      .unwrap()

    expectTypeOf(res).toEqualTypeOf({ id: 1, title: 'Hello world', comment: 'Hello world' })
  }).fails()
})
