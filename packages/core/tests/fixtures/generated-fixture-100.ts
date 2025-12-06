import type { AdonisEndpoint } from '../../src/client/types/types.ts'

const placeholder: any = {}

const routes = {
  'offer.blog.share': {
    methods: ['PUT'],
    pattern: '/offer/blog/share/:groupId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { groupId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'document.archive': {
    methods: ['POST'],
    pattern: '/document/archive',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'education.quality.block': {
    methods: ['DELETE'],
    pattern: '/education/quality/block',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'coupon.index': {
    methods: ['DELETE'],
    pattern: '/coupon/index/:itemId/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'language.market.leave': {
    methods: ['DELETE'],
    pattern: '/language/market/leave/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'product.sync': {
    methods: ['GET', 'HEAD'],
    pattern: '/product/sync/:groupId/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; userId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'cart.search': {
    methods: ['GET', 'HEAD'],
    pattern: '/cart/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'garden.upload': {
    methods: ['GET'],
    pattern: '/garden/upload',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'wiki.archive': {
    methods: ['PATCH'],
    pattern: '/wiki/archive',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'feedback.sort': {
    methods: ['DELETE'],
    pattern: '/feedback/sort/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'fashion.bookmark': {
    methods: ['GET'],
    pattern: '/fashion/bookmark',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { id: string; name: string }
    },
  },
  'filter.service.move': {
    methods: ['POST'],
    pattern: '/filter/service/move',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'travel.discount.generate': {
    methods: ['PATCH'],
    pattern: '/travel/discount/generate',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'invoice.edit': {
    methods: ['GET'],
    pattern: '/invoice/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { success: boolean }
    },
  },
  'comment.switch': {
    methods: ['DELETE'],
    pattern: '/comment/switch',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: any
    },
  },
  'billing.show': {
    methods: ['POST'],
    pattern: '/billing/show',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'sync.user.postpone': {
    methods: ['PUT'],
    pattern: '/sync/user/postpone',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'label.generate': {
    methods: ['POST'],
    pattern: '/label/generate',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'sports.unpublish': {
    methods: ['GET', 'HEAD'],
    pattern: '/sports/unpublish/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'watchlist.unmute': {
    methods: ['DELETE'],
    pattern: '/watchlist/unmute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'security.validate': {
    methods: ['PATCH'],
    pattern: '/security/validate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'export.sync': {
    methods: ['POST'],
    pattern: '/export/sync/:id',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { id: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'filter.migrate': {
    methods: ['DELETE'],
    pattern: '/filter/migrate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'shipment.leave': {
    methods: ['GET'],
    pattern: '/shipment/leave/:categoryId/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; userId: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'shipment.decline': {
    methods: ['DELETE'],
    pattern: '/shipment/decline/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { success: boolean }
    },
  },
  'search.patch': {
    methods: ['DELETE'],
    pattern: '/search/patch',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'chat.transfer': {
    methods: ['GET'],
    pattern: '/chat/transfer',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'checkout.team.index': {
    methods: ['POST'],
    pattern: '/checkout/team/index/:entityId',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'team.block': {
    methods: ['POST'],
    pattern: '/team/block',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'order.schedule.enable': {
    methods: ['GET'],
    pattern: '/order/schedule/enable/:groupId/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; itemId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'podcast.ban': {
    methods: ['GET'],
    pattern: '/podcast/ban',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'library.invite': {
    methods: ['GET'],
    pattern: '/library/invite',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'label.download': {
    methods: ['POST'],
    pattern: '/label/download/:userId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { userId: string; entityId: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'access.get': {
    methods: ['PUT'],
    pattern: '/access/get',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'sync.index': {
    methods: ['POST'],
    pattern: '/sync/index',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'pricing.message.compute': {
    methods: ['POST'],
    pattern: '/pricing/message/compute',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'restaurant.insert': {
    methods: ['GET', 'HEAD'],
    pattern: '/restaurant/insert/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'library.appointment.unsubscribe': {
    methods: ['POST'],
    pattern: '/library/appointment/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'travel.campaign.group': {
    methods: ['GET'],
    pattern: '/travel/campaign/group',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'image.bookmark': {
    methods: ['GET'],
    pattern: '/image/bookmark',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'schedule.analyze': {
    methods: ['PUT'],
    pattern: '/schedule/analyze',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { data: any[]; total: number }
    },
  },
  'history.collaboration.destroy': {
    methods: ['POST'],
    pattern: '/history/collaboration/destroy',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'gallery.toggle': {
    methods: ['GET', 'HEAD'],
    pattern: '/gallery/toggle',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { data: any[]; total: number }
    },
  },
  'checkout.favorite.like': {
    methods: ['POST'],
    pattern: '/checkout/favorite/like/:groupId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'analytics.sync': {
    methods: ['GET'],
    pattern: '/analytics/sync/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'shipping.shipment.kick': {
    methods: ['PUT'],
    pattern: '/shipping/shipment/kick',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'discount.edit': {
    methods: ['GET'],
    pattern: '/discount/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'authorization.put': {
    methods: ['GET'],
    pattern: '/authorization/put',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'campaign.unassign': {
    methods: ['PATCH'],
    pattern: '/campaign/unassign/:id',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'document.destroy': {
    methods: ['PUT'],
    pattern: '/document/destroy',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'task.unblock': {
    methods: ['PUT'],
    pattern: '/task/unblock/:teamId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { teamId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'search.combine': {
    methods: ['POST'],
    pattern: '/search/combine/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'video.review.draft': {
    methods: ['GET'],
    pattern: '/video/review/draft/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'notification.analytics.create': {
    methods: ['PATCH'],
    pattern: '/notification/analytics/create/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'upload.approve': {
    methods: ['GET'],
    pattern: '/upload/approve',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'document.music.like': {
    methods: ['GET'],
    pattern: '/document/music/like/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'checkout.pet.refresh': {
    methods: ['GET'],
    pattern: '/checkout/pet/refresh',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'label.store': {
    methods: ['GET'],
    pattern: '/label/store',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'access.video.edit': {
    methods: ['GET'],
    pattern: '/access/video/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'bookmark.lock': {
    methods: ['PUT'],
    pattern: '/bookmark/lock',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'download.podcast.activate': {
    methods: ['POST'],
    pattern: '/download/podcast/activate',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'audio.share': {
    methods: ['POST'],
    pattern: '/audio/share',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'integration.unpublish': {
    methods: ['GET', 'HEAD'],
    pattern: '/integration/unpublish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'discount.admin.unfollow': {
    methods: ['GET'],
    pattern: '/discount/admin/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'blog.create': {
    methods: ['GET'],
    pattern: '/blog/create',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'art.show': {
    methods: ['GET'],
    pattern: '/art/show',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'reservation.unassign': {
    methods: ['POST'],
    pattern: '/reservation/unassign/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'image.role.assign': {
    methods: ['PUT'],
    pattern: '/image/role/assign',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'wiki.postpone': {
    methods: ['GET'],
    pattern: '/wiki/postpone/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'log.unmute': {
    methods: ['PUT'],
    pattern: '/log/unmute/:entityId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'tracking.find': {
    methods: ['PATCH'],
    pattern: '/tracking/find/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'community.group': {
    methods: ['DELETE'],
    pattern: '/community/group/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'podcast.download': {
    methods: ['GET'],
    pattern: '/podcast/download/:id/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'backup.message.move': {
    methods: ['GET'],
    pattern: '/backup/message/move',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'restaurant.verify': {
    methods: ['GET'],
    pattern: '/restaurant/verify/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: {}
      response: { success: boolean }
    },
  },
  'import.share': {
    methods: ['PUT'],
    pattern: '/import/share/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'task.upload': {
    methods: ['GET'],
    pattern: '/task/upload/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'reservation.unmute': {
    methods: ['GET'],
    pattern: '/reservation/unmute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'pricing.store': {
    methods: ['GET'],
    pattern: '/pricing/store/:groupId/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; userId: string }
      paramsTuple: [string, string]
      query: {}
      response: any
    },
  },
  'campaign.combine': {
    methods: ['PATCH'],
    pattern: '/campaign/combine',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'service.generate': {
    methods: ['GET'],
    pattern: '/service/generate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'garden.disable': {
    methods: ['POST'],
    pattern: '/garden/disable',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'forum.join': {
    methods: ['PUT'],
    pattern: '/forum/join',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'weather.validate': {
    methods: ['PATCH'],
    pattern: '/weather/validate/:id',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { id: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'weather.paginate': {
    methods: ['GET'],
    pattern: '/weather/paginate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'image.authentication.list': {
    methods: ['PATCH'],
    pattern: '/image/authentication/list/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'recommendation.recipe.switch': {
    methods: ['POST'],
    pattern: '/recommendation/recipe/switch/:id',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'file.block': {
    methods: ['POST'],
    pattern: '/file/block',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'coupon.backup': {
    methods: ['POST'],
    pattern: '/coupon/backup',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { created: boolean; item: any }
    },
  },
  'label.authorization.unblock': {
    methods: ['DELETE'],
    pattern: '/label/authorization/unblock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'maintenance.document.unpublish': {
    methods: ['POST'],
    pattern: '/maintenance/document/unpublish',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'finance.unfollow': {
    methods: ['GET'],
    pattern: '/finance/unfollow/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'reservation.store': {
    methods: ['PUT'],
    pattern: '/reservation/store',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { settings: any; preferences: any }
    },
  },
  'integration.group': {
    methods: ['GET'],
    pattern: '/integration/group',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'user.product.sort': {
    methods: ['PUT'],
    pattern: '/user/product/sort/:id',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { success: boolean }
    },
  },
  'admin.draft': {
    methods: ['GET'],
    pattern: '/admin/draft',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'knowledge.unpublish': {
    methods: ['GET'],
    pattern: '/knowledge/unpublish/:id/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; itemId: string }
      paramsTuple: [string, string]
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'shipment.access.unmute': {
    methods: ['GET'],
    pattern: '/shipment/access/unmute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'recipe.sync': {
    methods: ['GET'],
    pattern: '/recipe/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'chat.confirm': {
    methods: ['POST'],
    pattern: '/chat/confirm/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type GeneratedRoutes = typeof routes

/**
 * Pre-computed API definition tree
 */
export interface GeneratedApiDefinition {
  offer: {
    blog: {
      share: GeneratedRoutes['offer.blog.share']
    }
  }
  document: {
    archive: GeneratedRoutes['document.archive']
    destroy: GeneratedRoutes['document.destroy']
    music: {
      like: GeneratedRoutes['document.music.like']
    }
  }
  education: {
    quality: {
      block: GeneratedRoutes['education.quality.block']
    }
  }
  coupon: {
    index: GeneratedRoutes['coupon.index']
    backup: GeneratedRoutes['coupon.backup']
  }
  language: {
    market: {
      leave: GeneratedRoutes['language.market.leave']
    }
  }
  product: {
    sync: GeneratedRoutes['product.sync']
  }
  cart: {
    search: GeneratedRoutes['cart.search']
  }
  garden: {
    upload: GeneratedRoutes['garden.upload']
    disable: GeneratedRoutes['garden.disable']
  }
  wiki: {
    archive: GeneratedRoutes['wiki.archive']
    postpone: GeneratedRoutes['wiki.postpone']
  }
  feedback: {
    sort: GeneratedRoutes['feedback.sort']
  }
  fashion: {
    bookmark: GeneratedRoutes['fashion.bookmark']
  }
  filter: {
    service: {
      move: GeneratedRoutes['filter.service.move']
    }
    migrate: GeneratedRoutes['filter.migrate']
  }
  travel: {
    discount: {
      generate: GeneratedRoutes['travel.discount.generate']
    }
    campaign: {
      group: GeneratedRoutes['travel.campaign.group']
    }
  }
  invoice: {
    edit: GeneratedRoutes['invoice.edit']
  }
  comment: {
    switch: GeneratedRoutes['comment.switch']
  }
  billing: {
    show: GeneratedRoutes['billing.show']
  }
  sync: {
    user: {
      postpone: GeneratedRoutes['sync.user.postpone']
    }
    index: GeneratedRoutes['sync.index']
  }
  label: {
    generate: GeneratedRoutes['label.generate']
    download: GeneratedRoutes['label.download']
    store: GeneratedRoutes['label.store']
    authorization: {
      unblock: GeneratedRoutes['label.authorization.unblock']
    }
  }
  sports: {
    unpublish: GeneratedRoutes['sports.unpublish']
  }
  watchlist: {
    unmute: GeneratedRoutes['watchlist.unmute']
  }
  security: {
    validate: GeneratedRoutes['security.validate']
  }
  export: {
    sync: GeneratedRoutes['export.sync']
  }
  shipment: {
    leave: GeneratedRoutes['shipment.leave']
    decline: GeneratedRoutes['shipment.decline']
    access: {
      unmute: GeneratedRoutes['shipment.access.unmute']
    }
  }
  search: {
    patch: GeneratedRoutes['search.patch']
    combine: GeneratedRoutes['search.combine']
  }
  chat: {
    transfer: GeneratedRoutes['chat.transfer']
    confirm: GeneratedRoutes['chat.confirm']
  }
  checkout: {
    team: {
      index: GeneratedRoutes['checkout.team.index']
    }
    favorite: {
      like: GeneratedRoutes['checkout.favorite.like']
    }
    pet: {
      refresh: GeneratedRoutes['checkout.pet.refresh']
    }
  }
  team: {
    block: GeneratedRoutes['team.block']
  }
  order: {
    schedule: {
      enable: GeneratedRoutes['order.schedule.enable']
    }
  }
  podcast: {
    ban: GeneratedRoutes['podcast.ban']
    download: GeneratedRoutes['podcast.download']
  }
  library: {
    invite: GeneratedRoutes['library.invite']
    appointment: {
      unsubscribe: GeneratedRoutes['library.appointment.unsubscribe']
    }
  }
  access: {
    get: GeneratedRoutes['access.get']
    video: {
      edit: GeneratedRoutes['access.video.edit']
    }
  }
  pricing: {
    message: {
      compute: GeneratedRoutes['pricing.message.compute']
    }
    store: GeneratedRoutes['pricing.store']
  }
  restaurant: {
    insert: GeneratedRoutes['restaurant.insert']
    verify: GeneratedRoutes['restaurant.verify']
  }
  image: {
    bookmark: GeneratedRoutes['image.bookmark']
    role: {
      assign: GeneratedRoutes['image.role.assign']
    }
    authentication: {
      list: GeneratedRoutes['image.authentication.list']
    }
  }
  schedule: {
    analyze: GeneratedRoutes['schedule.analyze']
  }
  history: {
    collaboration: {
      destroy: GeneratedRoutes['history.collaboration.destroy']
    }
  }
  gallery: {
    toggle: GeneratedRoutes['gallery.toggle']
  }
  analytics: {
    sync: GeneratedRoutes['analytics.sync']
  }
  shipping: {
    shipment: {
      kick: GeneratedRoutes['shipping.shipment.kick']
    }
  }
  discount: {
    edit: GeneratedRoutes['discount.edit']
    admin: {
      unfollow: GeneratedRoutes['discount.admin.unfollow']
    }
  }
  authorization: {
    put: GeneratedRoutes['authorization.put']
  }
  campaign: {
    unassign: GeneratedRoutes['campaign.unassign']
    combine: GeneratedRoutes['campaign.combine']
  }
  task: {
    unblock: GeneratedRoutes['task.unblock']
    upload: GeneratedRoutes['task.upload']
  }
  video: {
    review: {
      draft: GeneratedRoutes['video.review.draft']
    }
  }
  notification: {
    analytics: {
      create: GeneratedRoutes['notification.analytics.create']
    }
  }
  upload: {
    approve: GeneratedRoutes['upload.approve']
  }
  bookmark: {
    lock: GeneratedRoutes['bookmark.lock']
  }
  download: {
    podcast: {
      activate: GeneratedRoutes['download.podcast.activate']
    }
  }
  audio: {
    share: GeneratedRoutes['audio.share']
  }
  integration: {
    unpublish: GeneratedRoutes['integration.unpublish']
    group: GeneratedRoutes['integration.group']
  }
  blog: {
    create: GeneratedRoutes['blog.create']
  }
  art: {
    show: GeneratedRoutes['art.show']
  }
  reservation: {
    unassign: GeneratedRoutes['reservation.unassign']
    unmute: GeneratedRoutes['reservation.unmute']
    store: GeneratedRoutes['reservation.store']
  }
  log: {
    unmute: GeneratedRoutes['log.unmute']
  }
  tracking: {
    find: GeneratedRoutes['tracking.find']
  }
  community: {
    group: GeneratedRoutes['community.group']
  }
  backup: {
    message: {
      move: GeneratedRoutes['backup.message.move']
    }
  }
  import: {
    share: GeneratedRoutes['import.share']
  }
  service: {
    generate: GeneratedRoutes['service.generate']
  }
  forum: {
    join: GeneratedRoutes['forum.join']
  }
  weather: {
    validate: GeneratedRoutes['weather.validate']
    paginate: GeneratedRoutes['weather.paginate']
  }
  recommendation: {
    recipe: {
      switch: GeneratedRoutes['recommendation.recipe.switch']
    }
  }
  file: {
    block: GeneratedRoutes['file.block']
  }
  maintenance: {
    document: {
      unpublish: GeneratedRoutes['maintenance.document.unpublish']
    }
  }
  finance: {
    unfollow: GeneratedRoutes['finance.unfollow']
  }
  user: {
    product: {
      sort: GeneratedRoutes['user.product.sort']
    }
  }
  admin: {
    draft: GeneratedRoutes['admin.draft']
  }
  knowledge: {
    unpublish: GeneratedRoutes['knowledge.unpublish']
  }
  recipe: {
    sync: GeneratedRoutes['recipe.sync']
  }
}

export const generatedRegistry = {
  routes,
  $tree: {} as GeneratedApiDefinition,
}
