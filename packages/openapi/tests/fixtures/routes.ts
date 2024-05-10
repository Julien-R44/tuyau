import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'

type UsersGetHead = {
  request: MakeTuyauRequest<{ limit: number; page?: number }>
  response: MakeTuyauResponse<() => Promise<{ id: number; name: string; email: string }>>
}
type SimpleTextGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ text: string }>>
}
type FileUploadPost = {
  request: MakeTuyauRequest<{ file: Blob }>
  response: MakeTuyauResponse<() => Promise<{ id: number; name: string; email: string }>>
}
type PostsGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }[]>>
}
type PostscreateGetHead = {
  request: MakeTuyauRequest<{
    limit: number
    page?: number
  }>
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsPost = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsIdGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsIdeditGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsIdPutPatch = {
  request: MakeTuyauRequest<{ comment: string; title: string }>
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}

type PostsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsPostIdcommentsGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsPostIdcommentscreateGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ post_id: number }>>
}
type PostsPostIdcommentsPost = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ id: number; title: string; comment: string }>>
}
type PostsPostIdcommentsIdGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ test: string }>>
}
type PostsPostIdcommentsIdeditGetHead = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ test: string }>>
}
type PostsPostIdcommentsIdPutPatch = {
  request: MakeTuyauRequest<{ body: string }>
  response: MakeTuyauResponse<() => Promise<{ id: number; body: string }>>
}
type PostsPostIdcommentsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<() => Promise<{ test: string }>>
}

interface AdonisApi {
  'users': {
    $url: {}
    $get: UsersGetHead
    $head: UsersGetHead
  }
  'simple-text': {
    $url: {}
    $get: SimpleTextGetHead
    $head: SimpleTextGetHead
  }
  'file-upload': {
    $url: {}
    $post: FileUploadPost
  }
  'posts': {
    '$url': {}
    '$get': PostsGetHead
    '$head': PostsGetHead
    'create': {
      $url: {}
      $get: PostscreateGetHead
      $head: PostscreateGetHead
    }
    '$post': PostsPost
    ':id': {
      $url: {}
      $get: PostsIdGetHead
      $head: PostsIdGetHead
      edit: {
        $url: {}
        $get: PostsIdeditGetHead
        $head: PostsIdeditGetHead
      }
      $put: PostsIdPutPatch
      $patch: PostsIdPutPatch
      $delete: PostsIdDelete
    }
    ':post_id': {
      comments: {
        '$url': {}
        '$get': PostsPostIdcommentsGetHead
        '$head': PostsPostIdcommentsGetHead
        'create': {
          $url: {}
          $get: PostsPostIdcommentscreateGetHead
          $head: PostsPostIdcommentscreateGetHead
        }
        '$post': PostsPostIdcommentsPost
        ':id': {
          $url: {}
          $get: PostsPostIdcommentsIdGetHead
          $head: PostsPostIdcommentsIdGetHead
          edit: {
            $url: {}
            $get: PostsPostIdcommentsIdeditGetHead
            $head: PostsPostIdcommentsIdeditGetHead
          }
          $put: PostsPostIdcommentsIdPutPatch
          $patch: PostsPostIdcommentsIdPutPatch
          $delete: PostsPostIdcommentsIdDelete
        }
      }
    }
  }
}
const routes = [
  {
    params: [],
    name: 'users.index',
    path: '/users',
    method: ['GET', 'HEAD'],
    types: {} as UsersGetHead,
  },
  {
    params: [],
    name: 'simpleText',
    path: '/simple-text',
    method: ['GET', 'HEAD'],
    types: {} as SimpleTextGetHead,
  },
  {
    params: [],
    name: 'fileUpload',
    path: '/file-upload',
    method: ['POST'],
    types: {} as FileUploadPost,
  },
  {
    params: [],
    name: 'home',
    path: '/',
    method: ['GET', 'HEAD'],
    types: {} as any,
  },
  {
    params: [],
    name: 'posts.index',
    path: '/posts',
    method: ['GET', 'HEAD'],
    types: {} as PostsGetHead,
  },
  {
    params: [],
    name: 'posts.create',
    path: '/posts/create',
    method: ['GET', 'HEAD'],
    types: {} as PostscreateGetHead,
  },
  {
    params: [],
    name: 'posts.store',
    path: '/posts',
    method: ['POST'],
    types: {} as PostsPost,
  },
  {
    params: ['id'],
    name: 'posts.show',
    path: '/posts/:id',
    method: ['GET', 'HEAD'],
    types: {} as PostsIdGetHead,
  },
  {
    params: ['id'],
    name: 'posts.edit',
    path: '/posts/:id/edit',
    method: ['GET', 'HEAD'],
    types: {} as PostsIdeditGetHead,
  },
  {
    params: ['id'],
    name: 'posts.update',
    path: '/posts/:id',
    method: ['PUT', 'PATCH'],
    types: {} as PostsIdPutPatch,
  },
  {
    params: ['id'],
    name: 'posts.destroy',
    path: '/posts/:id',
    method: ['DELETE'],
    types: {} as PostsIdDelete,
  },
  {
    params: ['post_id'],
    name: 'posts_comments.index',
    path: '/posts/:post_id/comments',
    method: ['GET', 'HEAD'],
    types: {} as PostsPostIdcommentsGetHead,
  },
  {
    params: ['post_id'],
    name: 'posts_comments.create',
    path: '/posts/:post_id/comments/create',
    method: ['GET', 'HEAD'],
    types: {} as PostsPostIdcommentscreateGetHead,
  },
  {
    params: ['post_id'],
    name: 'posts_comments.store',
    path: '/posts/:post_id/comments',
    method: ['POST'],
    types: {} as PostsPostIdcommentsPost,
  },
  {
    params: ['post_id', 'id'],
    name: 'posts_comments.show',
    path: '/posts/:post_id/comments/:id',
    method: ['GET', 'HEAD'],
    types: {} as PostsPostIdcommentsIdGetHead,
  },
  {
    params: ['post_id', 'id'],
    name: 'posts_comments.edit',
    path: '/posts/:post_id/comments/:id/edit',
    method: ['GET', 'HEAD'],
    types: {} as PostsPostIdcommentsIdeditGetHead,
  },
  {
    params: ['post_id', 'id'],
    name: 'posts_comments.update',
    path: '/posts/:post_id/comments/:id',
    method: ['PUT', 'PATCH'],
    types: {} as PostsPostIdcommentsIdPutPatch,
  },
  {
    params: ['post_id', 'id'],
    name: 'posts_comments.destroy',
    path: '/posts/:post_id/comments/:id',
    method: ['DELETE'],
    types: {} as PostsPostIdcommentsIdDelete,
  },
] as const
export const api = {
  routes,
  definition: {} as AdonisApi,
}
