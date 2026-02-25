import type { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

const routes = {
  'game.secure': {
    methods: ['PATCH'],
    pattern: '/game/secure',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'category.download.insert': {
    methods: ['GET', 'HEAD'],
    pattern: '/category/download/insert',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'category.deal.forward': {
    methods: ['DELETE'],
    pattern: '/category/deal/forward/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'coupon.unblock': {
    methods: ['GET'],
    pattern: '/coupon/unblock/:itemId/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; userId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'video.protect': {
    methods: ['GET'],
    pattern: '/video/protect',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'document.upload': {
    methods: ['GET'],
    pattern: '/document/upload',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'payment.invoice.activate': {
    methods: ['PATCH'],
    pattern: '/payment/invoice/activate/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { entityId: string }
      paramsTuple: [string]
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'home.block': {
    methods: ['GET'],
    pattern: '/home/block/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'filter.booking.scroll': {
    methods: ['GET'],
    pattern: '/filter/booking/scroll',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'dashboard.list': {
    methods: ['GET'],
    pattern: '/dashboard/list/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'discount.postpone': {
    methods: ['GET'],
    pattern: '/discount/postpone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'garden.analyze': {
    methods: ['GET'],
    pattern: '/garden/analyze',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'library.disable': {
    methods: ['GET'],
    pattern: '/library/disable',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'library.split': {
    methods: ['POST'],
    pattern: '/library/split/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'bookmark.import': {
    methods: ['PATCH'],
    pattern: '/bookmark/import',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'member.unmute': {
    methods: ['GET'],
    pattern: '/member/unmute/:userId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; itemId: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'permission.relocate': {
    methods: ['GET'],
    pattern: '/permission/relocate/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'filter.network.join': {
    methods: ['POST'],
    pattern: '/filter/network/join',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'upload.import': {
    methods: ['POST'],
    pattern: '/upload/import',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'knowledge.patch': {
    methods: ['GET', 'HEAD'],
    pattern: '/knowledge/patch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { success: boolean }
    },
  },
  'weather.deal.restore': {
    methods: ['GET'],
    pattern: '/weather/deal/restore/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'backup.filter': {
    methods: ['GET'],
    pattern: '/backup/filter',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'review.language.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/review/language/index/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'reservation.like': {
    methods: ['PATCH'],
    pattern: '/reservation/like',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'gallery.analyze': {
    methods: ['GET'],
    pattern: '/gallery/analyze/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { settings: any; preferences: any }
    },
  },
  'search.refresh': {
    methods: ['POST'],
    pattern: '/search/refresh/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { settings: any; preferences: any }
    },
  },
  'permission.assign': {
    methods: ['POST'],
    pattern: '/permission/assign',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'preferences.combine': {
    methods: ['PATCH'],
    pattern: '/preferences/combine',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'task.like': {
    methods: ['DELETE'],
    pattern: '/task/like',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: any
    },
  },
  'quality.search.switch': {
    methods: ['GET'],
    pattern: '/quality/search/switch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'schedule.authorization.update': {
    methods: ['GET'],
    pattern: '/schedule/authorization/update',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'upload.protect': {
    methods: ['GET'],
    pattern: '/upload/protect',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'music.generate': {
    methods: ['GET'],
    pattern: '/music/generate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'inventory.block': {
    methods: ['PATCH'],
    pattern: '/inventory/block/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'backup.subscribe': {
    methods: ['GET'],
    pattern: '/backup/subscribe/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'wiki.profile.unpublish': {
    methods: ['POST'],
    pattern: '/wiki/profile/unpublish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'watchlist.geolocation.show': {
    methods: ['GET'],
    pattern: '/watchlist/geolocation/show/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'comment.report.disable': {
    methods: ['GET'],
    pattern: '/comment/report/disable/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'bookmark.sort': {
    methods: ['POST'],
    pattern: '/bookmark/sort',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { created: boolean; item: any }
    },
  },
  'shipping.validate': {
    methods: ['PUT'],
    pattern: '/shipping/validate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'pricing.generate': {
    methods: ['GET'],
    pattern: '/pricing/generate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'user.disable': {
    methods: ['PATCH'],
    pattern: '/user/disable/:entityId/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { entityId: string; id: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'reservation.remove': {
    methods: ['GET'],
    pattern: '/reservation/remove',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'sync.decline': {
    methods: ['POST'],
    pattern: '/sync/decline',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'member.accept': {
    methods: ['GET'],
    pattern: '/member/accept/:entityId/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { status: string; message: string }
    },
  },
  'authentication.draft': {
    methods: ['PATCH'],
    pattern: '/authentication/draft',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: {}
      response: { id: string; name: string }
    },
  },
  'shop.network.store': {
    methods: ['POST'],
    pattern: '/shop/network/store',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'tracking.secure': {
    methods: ['POST'],
    pattern: '/tracking/secure/:teamId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { teamId: string; itemId: string }
      paramsTuple: [string, string]
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'home.copy': {
    methods: ['GET'],
    pattern: '/home/copy',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'knowledge.schedule': {
    methods: ['GET'],
    pattern: '/knowledge/schedule',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'backup.campaign.show': {
    methods: ['POST'],
    pattern: '/backup/campaign/show/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { teamId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'chat.unmute': {
    methods: ['GET'],
    pattern: '/chat/unmute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { success: boolean }
    },
  },
  'geolocation.block': {
    methods: ['POST'],
    pattern: '/geolocation/block',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'home.download': {
    methods: ['PATCH'],
    pattern: '/home/download',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'shipment.unlock': {
    methods: ['GET'],
    pattern: '/shipment/unlock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'preferences.post': {
    methods: ['GET'],
    pattern: '/preferences/post',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'recommendation.reservation.migrate': {
    methods: ['POST'],
    pattern: '/recommendation/reservation/migrate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'comment.refresh': {
    methods: ['GET'],
    pattern: '/comment/refresh/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'discount.ungroup': {
    methods: ['DELETE'],
    pattern: '/discount/ungroup',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'appointment.upload': {
    methods: ['PATCH'],
    pattern: '/appointment/upload',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'admin.appointment.confirm': {
    methods: ['GET'],
    pattern: '/admin/appointment/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'restaurant.post': {
    methods: ['GET'],
    pattern: '/restaurant/post',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'portfolio.lock': {
    methods: ['PUT'],
    pattern: '/portfolio/lock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'role.integration.draft': {
    methods: ['POST'],
    pattern: '/role/integration/draft/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'role.analytics.destroy': {
    methods: ['POST'],
    pattern: '/role/analytics/destroy/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'game.bookmark': {
    methods: ['GET'],
    pattern: '/game/bookmark/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { id: string; name: string }
    },
  },
  'backup.separate': {
    methods: ['PUT'],
    pattern: '/backup/separate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'settings.travel.unpublish': {
    methods: ['PATCH'],
    pattern: '/settings/travel/unpublish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'authorization.leave': {
    methods: ['GET'],
    pattern: '/authorization/leave',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'music.team.transfer': {
    methods: ['DELETE'],
    pattern: '/music/team/transfer/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'label.switch': {
    methods: ['GET'],
    pattern: '/label/switch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'booking.shop.enable': {
    methods: ['GET'],
    pattern: '/booking/shop/enable',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'order.patch': {
    methods: ['GET'],
    pattern: '/order/patch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'conference.reservation.analyze': {
    methods: ['PUT'],
    pattern: '/conference/reservation/analyze/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'order.scroll': {
    methods: ['GET'],
    pattern: '/order/scroll',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'settings.index': {
    methods: ['DELETE'],
    pattern: '/settings/index',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'social.unassign': {
    methods: ['GET'],
    pattern: '/social/unassign/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'weather.patch': {
    methods: ['PUT'],
    pattern: '/weather/patch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'security.refresh': {
    methods: ['POST'],
    pattern: '/security/refresh/:teamId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { teamId: string; itemId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'art.store': {
    methods: ['POST'],
    pattern: '/art/store/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'user.bookmark': {
    methods: ['GET'],
    pattern: '/user/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'campaign.service.clone': {
    methods: ['GET'],
    pattern: '/campaign/service/clone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'file.publish': {
    methods: ['PUT'],
    pattern: '/file/publish/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'cart.activate': {
    methods: ['POST'],
    pattern: '/cart/activate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'integration.restore': {
    methods: ['GET', 'HEAD'],
    pattern: '/integration/restore/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'game.insert': {
    methods: ['DELETE'],
    pattern: '/game/insert',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { status: string; message: string }
    },
  },
  'media.list': {
    methods: ['POST'],
    pattern: '/media/list',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'discount.mute': {
    methods: ['POST'],
    pattern: '/discount/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'library.draft': {
    methods: ['GET'],
    pattern: '/library/draft',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'shipping.secure': {
    methods: ['PATCH'],
    pattern: '/shipping/secure',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'bookmark.upload': {
    methods: ['GET', 'HEAD'],
    pattern: '/bookmark/upload',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { settings: any; preferences: any }
    },
  },
  'portfolio.label.move': {
    methods: ['DELETE'],
    pattern: '/portfolio/label/move',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'notification.deactivate': {
    methods: ['POST'],
    pattern: '/notification/deactivate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'portfolio.show': {
    methods: ['GET'],
    pattern: '/portfolio/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'team.user.unmute': {
    methods: ['POST'],
    pattern: '/team/user/unmute/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'community.toggle': {
    methods: ['POST'],
    pattern: '/community/toggle',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'security.maintenance.duplicate': {
    methods: ['POST'],
    pattern: '/security/maintenance/duplicate/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'booking.get': {
    methods: ['GET', 'HEAD'],
    pattern: '/booking/get',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'document.split': {
    methods: ['DELETE'],
    pattern: '/document/split',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'booking.find': {
    methods: ['GET'],
    pattern: '/booking/find',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type GeneratedRoutes = typeof routes

/**
 * Pre-computed API definition tree
 */
export interface GeneratedApiDefinition {
  game: {
    secure: GeneratedRoutes['game.secure']
    bookmark: GeneratedRoutes['game.bookmark']
    insert: GeneratedRoutes['game.insert']
  }
  category: {
    download: {
      insert: GeneratedRoutes['category.download.insert']
    }
    deal: {
      forward: GeneratedRoutes['category.deal.forward']
    }
  }
  coupon: {
    unblock: GeneratedRoutes['coupon.unblock']
  }
  video: {
    protect: GeneratedRoutes['video.protect']
  }
  document: {
    upload: GeneratedRoutes['document.upload']
    split: GeneratedRoutes['document.split']
  }
  payment: {
    invoice: {
      activate: GeneratedRoutes['payment.invoice.activate']
    }
  }
  home: {
    block: GeneratedRoutes['home.block']
    copy: GeneratedRoutes['home.copy']
    download: GeneratedRoutes['home.download']
  }
  filter: {
    booking: {
      scroll: GeneratedRoutes['filter.booking.scroll']
    }
    network: {
      join: GeneratedRoutes['filter.network.join']
    }
  }
  dashboard: {
    list: GeneratedRoutes['dashboard.list']
  }
  discount: {
    postpone: GeneratedRoutes['discount.postpone']
    ungroup: GeneratedRoutes['discount.ungroup']
    mute: GeneratedRoutes['discount.mute']
  }
  garden: {
    analyze: GeneratedRoutes['garden.analyze']
  }
  library: {
    disable: GeneratedRoutes['library.disable']
    split: GeneratedRoutes['library.split']
    draft: GeneratedRoutes['library.draft']
  }
  bookmark: {
    import: GeneratedRoutes['bookmark.import']
    sort: GeneratedRoutes['bookmark.sort']
    upload: GeneratedRoutes['bookmark.upload']
  }
  member: {
    unmute: GeneratedRoutes['member.unmute']
    accept: GeneratedRoutes['member.accept']
  }
  permission: {
    relocate: GeneratedRoutes['permission.relocate']
    assign: GeneratedRoutes['permission.assign']
  }
  upload: {
    import: GeneratedRoutes['upload.import']
    protect: GeneratedRoutes['upload.protect']
  }
  knowledge: {
    patch: GeneratedRoutes['knowledge.patch']
    schedule: GeneratedRoutes['knowledge.schedule']
  }
  weather: {
    deal: {
      restore: GeneratedRoutes['weather.deal.restore']
    }
    patch: GeneratedRoutes['weather.patch']
  }
  backup: {
    filter: GeneratedRoutes['backup.filter']
    subscribe: GeneratedRoutes['backup.subscribe']
    campaign: {
      show: GeneratedRoutes['backup.campaign.show']
    }
    separate: GeneratedRoutes['backup.separate']
  }
  review: {
    language: {
      index: GeneratedRoutes['review.language.index']
    }
  }
  reservation: {
    like: GeneratedRoutes['reservation.like']
    remove: GeneratedRoutes['reservation.remove']
  }
  gallery: {
    analyze: GeneratedRoutes['gallery.analyze']
  }
  search: {
    refresh: GeneratedRoutes['search.refresh']
  }
  preferences: {
    combine: GeneratedRoutes['preferences.combine']
    post: GeneratedRoutes['preferences.post']
  }
  task: {
    like: GeneratedRoutes['task.like']
  }
  quality: {
    search: {
      switch: GeneratedRoutes['quality.search.switch']
    }
  }
  schedule: {
    authorization: {
      update: GeneratedRoutes['schedule.authorization.update']
    }
  }
  music: {
    generate: GeneratedRoutes['music.generate']
    team: {
      transfer: GeneratedRoutes['music.team.transfer']
    }
  }
  inventory: {
    block: GeneratedRoutes['inventory.block']
  }
  wiki: {
    profile: {
      unpublish: GeneratedRoutes['wiki.profile.unpublish']
    }
  }
  watchlist: {
    geolocation: {
      show: GeneratedRoutes['watchlist.geolocation.show']
    }
  }
  comment: {
    report: {
      disable: GeneratedRoutes['comment.report.disable']
    }
    refresh: GeneratedRoutes['comment.refresh']
  }
  shipping: {
    validate: GeneratedRoutes['shipping.validate']
    secure: GeneratedRoutes['shipping.secure']
  }
  pricing: {
    generate: GeneratedRoutes['pricing.generate']
  }
  user: {
    disable: GeneratedRoutes['user.disable']
    bookmark: GeneratedRoutes['user.bookmark']
  }
  sync: {
    decline: GeneratedRoutes['sync.decline']
  }
  authentication: {
    draft: GeneratedRoutes['authentication.draft']
  }
  shop: {
    network: {
      store: GeneratedRoutes['shop.network.store']
    }
  }
  tracking: {
    secure: GeneratedRoutes['tracking.secure']
  }
  chat: {
    unmute: GeneratedRoutes['chat.unmute']
  }
  geolocation: {
    block: GeneratedRoutes['geolocation.block']
  }
  shipment: {
    unlock: GeneratedRoutes['shipment.unlock']
  }
  recommendation: {
    reservation: {
      migrate: GeneratedRoutes['recommendation.reservation.migrate']
    }
  }
  appointment: {
    upload: GeneratedRoutes['appointment.upload']
  }
  admin: {
    appointment: {
      confirm: GeneratedRoutes['admin.appointment.confirm']
    }
  }
  restaurant: {
    post: GeneratedRoutes['restaurant.post']
  }
  portfolio: {
    lock: GeneratedRoutes['portfolio.lock']
    label: {
      move: GeneratedRoutes['portfolio.label.move']
    }
    show: GeneratedRoutes['portfolio.show']
  }
  role: {
    integration: {
      draft: GeneratedRoutes['role.integration.draft']
    }
    analytics: {
      destroy: GeneratedRoutes['role.analytics.destroy']
    }
  }
  settings: {
    travel: {
      unpublish: GeneratedRoutes['settings.travel.unpublish']
    }
    index: GeneratedRoutes['settings.index']
  }
  authorization: {
    leave: GeneratedRoutes['authorization.leave']
  }
  label: {
    switch: GeneratedRoutes['label.switch']
  }
  booking: {
    shop: {
      enable: GeneratedRoutes['booking.shop.enable']
    }
    get: GeneratedRoutes['booking.get']
    find: GeneratedRoutes['booking.find']
  }
  order: {
    patch: GeneratedRoutes['order.patch']
    scroll: GeneratedRoutes['order.scroll']
  }
  conference: {
    reservation: {
      analyze: GeneratedRoutes['conference.reservation.analyze']
    }
  }
  social: {
    unassign: GeneratedRoutes['social.unassign']
  }
  security: {
    refresh: GeneratedRoutes['security.refresh']
    maintenance: {
      duplicate: GeneratedRoutes['security.maintenance.duplicate']
    }
  }
  art: {
    store: GeneratedRoutes['art.store']
  }
  campaign: {
    service: {
      clone: GeneratedRoutes['campaign.service.clone']
    }
  }
  file: {
    publish: GeneratedRoutes['file.publish']
  }
  cart: {
    activate: GeneratedRoutes['cart.activate']
  }
  integration: {
    restore: GeneratedRoutes['integration.restore']
  }
  media: {
    list: GeneratedRoutes['media.list']
  }
  notification: {
    deactivate: GeneratedRoutes['notification.deactivate']
  }
  team: {
    user: {
      unmute: GeneratedRoutes['team.user.unmute']
    }
  }
  community: {
    toggle: GeneratedRoutes['community.toggle']
  }
}

export const generatedRegistry = {
  routes,
  $tree: {} as GeneratedApiDefinition,
}
