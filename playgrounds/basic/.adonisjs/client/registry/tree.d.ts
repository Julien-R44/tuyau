/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: (typeof routes)['home']
  posts: {
    page: (typeof routes)['posts.page']
    list: (typeof routes)['posts.list']
    show: (typeof routes)['posts.show']
    store: (typeof routes)['posts.store']
    update: (typeof routes)['posts.update']
    delete: (typeof routes)['posts.delete']
  }
  products: {
    page: (typeof routes)['products.page']
    search: (typeof routes)['products.search']
    categories: (typeof routes)['products.categories']
    byCategory: (typeof routes)['products.by_category']
    show: (typeof routes)['products.show']
    store: (typeof routes)['products.store']
    delete: (typeof routes)['products.delete']
  }
  users: {
    page: (typeof routes)['users.page']
    list: (typeof routes)['users.list']
    show: (typeof routes)['users.show']
    store: (typeof routes)['users.store']
    update: (typeof routes)['users.update']
    delete: (typeof routes)['users.delete']
  }
  accounts: {
    create: (typeof routes)['accounts.create']
    store: (typeof routes)['accounts.store']
    uploadProfilePicture: (typeof routes)['accounts.upload_profile_picture']
  }
  session: {
    create: (typeof routes)['session.create']
    store: (typeof routes)['session.store']
    destroy: (typeof routes)['session.destroy']
  }
  blog: {
    posts: {
      api: (typeof routes)['blog.posts.api']
    }
  }
}
