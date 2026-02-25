import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'posts.page': { paramsTuple?: []; params?: {} }
    'products.page': { paramsTuple?: []; params?: {} }
    'users.page': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'accounts.store': { paramsTuple?: []; params?: {} }
    'accounts.upload_profile_picture': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'users.list': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.list': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.search': { paramsTuple?: []; params?: {} }
    'products.categories': { paramsTuple?: []; params?: {} }
    'products.by_category': { paramsTuple: [ParamValue]; params: {'category': ParamValue} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'blog.posts.api': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'posts.page': { paramsTuple?: []; params?: {} }
    'products.page': { paramsTuple?: []; params?: {} }
    'users.page': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'users.list': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.list': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.search': { paramsTuple?: []; params?: {} }
    'products.categories': { paramsTuple?: []; params?: {} }
    'products.by_category': { paramsTuple: [ParamValue]; params: {'category': ParamValue} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'blog.posts.api': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'posts.page': { paramsTuple?: []; params?: {} }
    'products.page': { paramsTuple?: []; params?: {} }
    'users.page': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'users.list': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.list': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.search': { paramsTuple?: []; params?: {} }
    'products.categories': { paramsTuple?: []; params?: {} }
    'products.by_category': { paramsTuple: [ParamValue]; params: {'category': ParamValue} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'blog.posts.api': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'accounts.store': { paramsTuple?: []; params?: {} }
    'accounts.upload_profile_picture': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}