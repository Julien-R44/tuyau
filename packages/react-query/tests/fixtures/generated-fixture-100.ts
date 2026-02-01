import { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

export const generatedRegistry = {
  'event.history.separate': {
    methods: ['POST'],
    pattern: '/event/history/separate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'watchlist.sports.relocate': {
    methods: ['GET'],
    pattern: '/watchlist/sports/relocate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'settings.team.subscribe': {
    methods: ['PATCH'],
    pattern: '/settings/team/subscribe/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { itemId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'payment.unfollow': {
    methods: ['GET'],
    pattern: '/payment/unfollow/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'shop.export.delete': {
    methods: ['GET'],
    pattern: '/shop/export/delete/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'tracking.task.process': {
    methods: ['POST'],
    pattern: '/tracking/task/process',
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
  'preferences.unfollow': {
    methods: ['POST'],
    pattern: '/preferences/unfollow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'chat.toggle': {
    methods: ['POST'],
    pattern: '/chat/toggle/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'blog.combine': {
    methods: ['GET'],
    pattern: '/blog/combine',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'payment.split': {
    methods: ['GET'],
    pattern: '/payment/split/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'game.show': {
    methods: ['PUT'],
    pattern: '/game/show/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'security.generate': {
    methods: ['PATCH'],
    pattern: '/security/generate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'settings.history.paginate': {
    methods: ['POST'],
    pattern: '/settings/history/paginate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'preferences.unassign': {
    methods: ['GET'],
    pattern: '/preferences/unassign',
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
  'discount.remove': {
    methods: ['GET', 'HEAD'],
    pattern: '/discount/remove',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'market.coupon.delete': {
    methods: ['GET'],
    pattern: '/market/coupon/delete',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'product.restore': {
    methods: ['PATCH'],
    pattern: '/product/restore/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'art.bookmark': {
    methods: ['POST'],
    pattern: '/art/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'message.download': {
    methods: ['PUT'],
    pattern: '/message/download/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'document.show': {
    methods: ['GET'],
    pattern: '/document/show/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'shipment.leave': {
    methods: ['PATCH'],
    pattern: '/shipment/leave/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'schedule.share': {
    methods: ['GET'],
    pattern: '/schedule/share/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'analytics.share': {
    methods: ['PATCH'],
    pattern: '/analytics/share',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'maintenance.activate': {
    methods: ['PATCH'],
    pattern: '/maintenance/activate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'security.store': {
    methods: ['GET'],
    pattern: '/security/store/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'label.dashboard.forward': {
    methods: ['GET'],
    pattern: '/label/dashboard/forward',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'cart.sports.transform': {
    methods: ['GET'],
    pattern: '/cart/sports/transform/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'authorization.calculate': {
    methods: ['POST'],
    pattern: '/authorization/calculate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'home.preview': {
    methods: ['PUT'],
    pattern: '/home/preview',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'label.list': {
    methods: ['GET'],
    pattern: '/label/list',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'access.refresh': {
    methods: ['PATCH'],
    pattern: '/access/refresh',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'podcast.forward': {
    methods: ['PATCH'],
    pattern: '/podcast/forward',
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
  'message.destroy': {
    methods: ['POST'],
    pattern: '/message/destroy',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'file.block': {
    methods: ['DELETE'],
    pattern: '/file/block/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'project.ban': {
    methods: ['POST'],
    pattern: '/project/ban',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'gallery.watchlist.ungroup': {
    methods: ['GET'],
    pattern: '/gallery/watchlist/ungroup/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { success: boolean }
    },
  },
  'cinema.backup': {
    methods: ['PUT'],
    pattern: '/cinema/backup',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'pricing.favorite': {
    methods: ['PUT'],
    pattern: '/pricing/favorite',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'backup.ungroup': {
    methods: ['GET'],
    pattern: '/backup/ungroup',
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
  'wiki.offer.bookmark': {
    methods: ['GET'],
    pattern: '/wiki/offer/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { token: string; expiresAt: string }
    },
  },
  'education.sort': {
    methods: ['PATCH'],
    pattern: '/education/sort/:itemId/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { itemId: string; id: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'project.edit': {
    methods: ['GET'],
    pattern: '/project/edit/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'integration.process': {
    methods: ['GET'],
    pattern: '/integration/process/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'bookmark.home.unassign': {
    methods: ['PUT'],
    pattern: '/bookmark/home/unassign/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'permission.member.leave': {
    methods: ['GET'],
    pattern: '/permission/member/leave/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'feedback.clone': {
    methods: ['POST'],
    pattern: '/feedback/clone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'discount.patch': {
    methods: ['GET'],
    pattern: '/discount/patch/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'import.subscription.clone': {
    methods: ['GET'],
    pattern: '/import/subscription/clone/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { status: string; message: string }
    },
  },
  'schedule.audio.invite': {
    methods: ['GET'],
    pattern: '/schedule/audio/invite/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'authentication.kick': {
    methods: ['PUT'],
    pattern: '/authentication/kick/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'feedback.show': {
    methods: ['DELETE'],
    pattern: '/feedback/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'filter.recommendation.ungroup': {
    methods: ['GET'],
    pattern: '/filter/recommendation/ungroup/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'language.put': {
    methods: ['GET'],
    pattern: '/language/put',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'network.forum.import': {
    methods: ['PATCH'],
    pattern: '/network/forum/import',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'cart.bookmark': {
    methods: ['POST'],
    pattern: '/cart/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'message.analytics.merge': {
    methods: ['POST'],
    pattern: '/message/analytics/merge/:itemId/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'community.archive': {
    methods: ['GET'],
    pattern: '/community/archive',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { token: string; expiresAt: string }
    },
  },
  'reservation.offer.follow': {
    methods: ['DELETE'],
    pattern: '/reservation/offer/follow/:resourceId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; itemId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'music.blog.import': {
    methods: ['PATCH'],
    pattern: '/music/blog/import/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'history.paginate': {
    methods: ['POST'],
    pattern: '/history/paginate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'filter.schedule': {
    methods: ['POST'],
    pattern: '/filter/schedule',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'subscription.role.unblock': {
    methods: ['POST'],
    pattern: '/subscription/role/unblock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { id: string; name: string }
    },
  },
  'label.patch': {
    methods: ['GET'],
    pattern: '/label/patch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'role.billing.preview': {
    methods: ['GET'],
    pattern: '/role/billing/preview',
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
  'shipping.user.upload': {
    methods: ['POST'],
    pattern: '/shipping/user/upload',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { url: string; filename: string }
    },
  },
  'community.quality.confirm': {
    methods: ['PUT'],
    pattern: '/community/quality/confirm/:id/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { id: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'blog.protect': {
    methods: ['DELETE'],
    pattern: '/blog/protect',
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
  'conference.discount.kick': {
    methods: ['GET'],
    pattern: '/conference/discount/kick',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'deal.transfer': {
    methods: ['PUT'],
    pattern: '/deal/transfer',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'cinema.social.copy': {
    methods: ['PATCH'],
    pattern: '/cinema/social/copy',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'community.activate': {
    methods: ['DELETE'],
    pattern: '/community/activate/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'education.ban': {
    methods: ['POST'],
    pattern: '/education/ban/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'integration.disable': {
    methods: ['GET'],
    pattern: '/integration/disable',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'billing.decline': {
    methods: ['PATCH'],
    pattern: '/billing/decline',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'report.backup': {
    methods: ['GET', 'HEAD'],
    pattern: '/report/backup/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'calendar.offer.postpone': {
    methods: ['GET'],
    pattern: '/calendar/offer/postpone/:userId/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; id: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'maintenance.approve': {
    methods: ['DELETE'],
    pattern: '/maintenance/approve',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'favorite.preview': {
    methods: ['DELETE'],
    pattern: '/favorite/preview/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'subscription.cart.draft': {
    methods: ['DELETE'],
    pattern: '/subscription/cart/draft/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'chat.mute': {
    methods: ['GET'],
    pattern: '/chat/mute/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'calendar.pricing.validate': {
    methods: ['GET'],
    pattern: '/calendar/pricing/validate/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'checkout.share': {
    methods: ['POST'],
    pattern: '/checkout/share',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'analytics.publish': {
    methods: ['GET'],
    pattern: '/analytics/publish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'payment.project.postpone': {
    methods: ['POST'],
    pattern: '/payment/project/postpone/:categoryId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { categoryId: string; itemId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'profile.lock': {
    methods: ['GET'],
    pattern: '/profile/lock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'forum.refresh': {
    methods: ['GET'],
    pattern: '/forum/refresh/:resourceId/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; id: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'feedback.postpone': {
    methods: ['POST'],
    pattern: '/feedback/postpone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: any
    },
  },
  'product.library.postpone': {
    methods: ['GET'],
    pattern: '/product/library/postpone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'cart.unfollow': {
    methods: ['DELETE'],
    pattern: '/cart/unfollow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'maintenance.market.unlike': {
    methods: ['POST'],
    pattern: '/maintenance/market/unlike',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'pet.dashboard.paginate': {
    methods: ['DELETE'],
    pattern: '/pet/dashboard/paginate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'import.forward': {
    methods: ['GET'],
    pattern: '/import/forward',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'chat.forum.ban': {
    methods: ['GET'],
    pattern: '/chat/forum/ban',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'log.coupon.postpone': {
    methods: ['GET'],
    pattern: '/log/coupon/postpone/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'recipe.video.process': {
    methods: ['GET'],
    pattern: '/recipe/video/process/:resourceId/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; groupId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'geolocation.unblock': {
    methods: ['GET'],
    pattern: '/geolocation/unblock/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'appointment.migrate': {
    methods: ['POST'],
    pattern: '/appointment/migrate/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'recipe.invoice.subscribe': {
    methods: ['PATCH'],
    pattern: '/recipe/invoice/subscribe/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'knowledge.accept': {
    methods: ['POST'],
    pattern: '/knowledge/accept/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { itemId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'discount.kick': {
    methods: ['PUT'],
    pattern: '/discount/kick',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { data: any[]; total: number }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>
