import type { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

const routes = {
  'fashion.combine': {
    methods: ['POST'],
    pattern: '/fashion/combine',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'inventory.knowledge.merge': {
    methods: ['GET'],
    pattern: '/inventory/knowledge/merge',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'download.download': {
    methods: ['GET'],
    pattern: '/download/download',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'booking.social.publish': {
    methods: ['GET'],
    pattern: '/booking/social/publish/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'sports.destroy': {
    methods: ['PUT'],
    pattern: '/sports/destroy',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'fashion.block': {
    methods: ['POST'],
    pattern: '/fashion/block',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'settings.unsubscribe': {
    methods: ['GET'],
    pattern: '/settings/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'tag.download.clone': {
    methods: ['GET'],
    pattern: '/tag/download/clone/:id/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; categoryId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'media.team.remove': {
    methods: ['GET'],
    pattern: '/media/team/remove/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'weather.unassign': {
    methods: ['POST'],
    pattern: '/weather/unassign/:teamId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { url: string; filename: string }
    },
  },
  'document.kick': {
    methods: ['GET'],
    pattern: '/document/kick',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'workflow.wiki.export': {
    methods: ['GET'],
    pattern: '/workflow/wiki/export',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'cinema.split': {
    methods: ['GET', 'HEAD'],
    pattern: '/cinema/split/:id/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'audio.destroy': {
    methods: ['POST'],
    pattern: '/audio/destroy',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'language.confirm': {
    methods: ['GET'],
    pattern: '/language/confirm/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'coupon.find': {
    methods: ['PUT'],
    pattern: '/coupon/find',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'project.postpone': {
    methods: ['POST'],
    pattern: '/project/postpone/:id',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { id: string }
      paramsTuple: [string]
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'travel.confirm': {
    methods: ['GET'],
    pattern: '/travel/confirm',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'tracking.forward': {
    methods: ['GET'],
    pattern: '/tracking/forward/:groupId/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'recommendation.preview': {
    methods: ['POST'],
    pattern: '/recommendation/preview/:id/:userId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { id: string; userId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'admin.unmute': {
    methods: ['POST'],
    pattern: '/admin/unmute',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'appointment.log.disable': {
    methods: ['POST'],
    pattern: '/appointment/log/disable/:entityId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'language.index': {
    methods: ['PUT'],
    pattern: '/language/index',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'podcast.access.refresh': {
    methods: ['POST'],
    pattern: '/podcast/access/refresh/:entityId/:itemId',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { entityId: string; itemId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'deal.secure': {
    methods: ['PATCH'],
    pattern: '/deal/secure',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'booking.role.unlike': {
    methods: ['GET', 'HEAD'],
    pattern: '/booking/role/unlike',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'comment.wiki.unfollow': {
    methods: ['GET'],
    pattern: '/comment/wiki/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'inventory.migrate': {
    methods: ['GET'],
    pattern: '/inventory/migrate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'forum.shop.refresh': {
    methods: ['GET', 'HEAD'],
    pattern: '/forum/shop/refresh/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'invoice.unlike': {
    methods: ['GET'],
    pattern: '/invoice/unlike',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'portfolio.insert': {
    methods: ['POST'],
    pattern: '/portfolio/insert',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'calendar.event.find': {
    methods: ['POST'],
    pattern: '/calendar/event/find',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'access.schedule': {
    methods: ['POST'],
    pattern: '/access/schedule',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'tag.scroll': {
    methods: ['GET'],
    pattern: '/tag/scroll',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'language.split': {
    methods: ['PUT'],
    pattern: '/language/split',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'art.merge': {
    methods: ['GET'],
    pattern: '/art/merge/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'booking.schedule.relocate': {
    methods: ['GET'],
    pattern: '/booking/schedule/relocate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { id: string; name: string }
    },
  },
  'social.invite': {
    methods: ['POST'],
    pattern: '/social/invite',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'forum.unfollow': {
    methods: ['GET'],
    pattern: '/forum/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'gallery.activate': {
    methods: ['DELETE'],
    pattern: '/gallery/activate/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: any
    },
  },
  'search.block': {
    methods: ['POST'],
    pattern: '/search/block/:entityId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'image.list': {
    methods: ['GET'],
    pattern: '/image/list/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'watchlist.calculate': {
    methods: ['DELETE'],
    pattern: '/watchlist/calculate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'education.social.sync': {
    methods: ['GET'],
    pattern: '/education/social/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'discount.chat.get': {
    methods: ['GET', 'HEAD'],
    pattern: '/discount/chat/get/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { profile: any; permissions: string[] }
    },
  },
  'service.download': {
    methods: ['POST'],
    pattern: '/service/download/:teamId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'member.get': {
    methods: ['POST'],
    pattern: '/member/get',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'garden.import': {
    methods: ['PUT'],
    pattern: '/garden/import',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'filter.backup': {
    methods: ['GET'],
    pattern: '/filter/backup/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'gallery.find': {
    methods: ['GET'],
    pattern: '/gallery/find/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'community.calculate': {
    methods: ['GET'],
    pattern: '/community/calculate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'message.chat.duplicate': {
    methods: ['GET'],
    pattern: '/message/chat/duplicate/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'weather.conference.export': {
    methods: ['PATCH'],
    pattern: '/weather/conference/export/:groupId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { groupId: string }
      paramsTuple: [string]
      query: {}
      response: { url: string; filename: string }
    },
  },
  'authentication.join': {
    methods: ['POST'],
    pattern: '/authentication/join/:itemId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { itemId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'bookmark.merge': {
    methods: ['DELETE'],
    pattern: '/bookmark/merge',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'filter.favorite': {
    methods: ['GET'],
    pattern: '/filter/favorite',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'message.network.migrate': {
    methods: ['POST'],
    pattern: '/message/network/migrate',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'review.maintenance.remove': {
    methods: ['GET'],
    pattern: '/review/maintenance/remove',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'access.accept': {
    methods: ['POST'],
    pattern: '/access/accept',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'bookmark.unpublish': {
    methods: ['GET'],
    pattern: '/bookmark/unpublish/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'access.activate': {
    methods: ['POST'],
    pattern: '/access/activate',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'schedule.coupon.verify': {
    methods: ['GET'],
    pattern: '/schedule/coupon/verify/:resourceId/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; itemId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'education.move': {
    methods: ['POST'],
    pattern: '/education/move/:groupId/:itemId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { groupId: string; itemId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'collaboration.sync': {
    methods: ['GET'],
    pattern: '/collaboration/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { id: string; name: string }
    },
  },
  'community.approve': {
    methods: ['GET'],
    pattern: '/community/approve',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'shipping.comment.unblock': {
    methods: ['GET'],
    pattern: '/shipping/comment/unblock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'access.reject': {
    methods: ['DELETE'],
    pattern: '/access/reject/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'education.deactivate': {
    methods: ['POST'],
    pattern: '/education/deactivate',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'education.assign': {
    methods: ['POST'],
    pattern: '/education/assign/:itemId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { itemId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'pricing.weather.unassign': {
    methods: ['POST'],
    pattern: '/pricing/weather/unassign',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'admin.search': {
    methods: ['GET'],
    pattern: '/admin/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'watchlist.analyze': {
    methods: ['GET'],
    pattern: '/watchlist/analyze/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'integration.patch': {
    methods: ['POST'],
    pattern: '/integration/patch/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'permission.unlock': {
    methods: ['GET'],
    pattern: '/permission/unlock/:entityId/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string; groupId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'authentication.merge': {
    methods: ['DELETE'],
    pattern: '/authentication/merge/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { settings: any; preferences: any }
    },
  },
  'team.shop.generate': {
    methods: ['PUT'],
    pattern: '/team/shop/generate',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'coupon.unassign': {
    methods: ['POST'],
    pattern: '/coupon/unassign',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'category.document.destroy': {
    methods: ['DELETE'],
    pattern: '/category/document/destroy/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'community.put': {
    methods: ['GET'],
    pattern: '/community/put',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'market.unfollow': {
    methods: ['PUT'],
    pattern: '/market/unfollow/:teamId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { teamId: string; entityId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'rating.split': {
    methods: ['POST'],
    pattern: '/rating/split',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'access.media.paginate': {
    methods: ['PATCH'],
    pattern: '/access/media/paginate',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { success: boolean }
    },
  },
  'calendar.list': {
    methods: ['GET'],
    pattern: '/calendar/list/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'collaboration.conference.lock': {
    methods: ['POST'],
    pattern: '/collaboration/conference/lock',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'analytics.verify': {
    methods: ['GET'],
    pattern: '/analytics/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'library.export': {
    methods: ['GET'],
    pattern: '/library/export/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'filter.publish': {
    methods: ['GET', 'HEAD'],
    pattern: '/filter/publish/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { success: boolean }
    },
  },
  'tracking.list': {
    methods: ['GET'],
    pattern: '/tracking/list',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'export.export': {
    methods: ['GET'],
    pattern: '/export/export',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'workflow.market.unlock': {
    methods: ['GET'],
    pattern: '/workflow/market/unlock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'export.insert': {
    methods: ['POST'],
    pattern: '/export/insert',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'maintenance.publish': {
    methods: ['POST'],
    pattern: '/maintenance/publish',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'home.scroll': {
    methods: ['POST'],
    pattern: '/home/scroll',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'document.compute': {
    methods: ['DELETE'],
    pattern: '/document/compute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'feedback.import.cancel': {
    methods: ['GET'],
    pattern: '/feedback/import/cancel',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'document.clone': {
    methods: ['GET'],
    pattern: '/document/clone',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'payment.ban': {
    methods: ['DELETE'],
    pattern: '/payment/ban',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'appointment.filter': {
    methods: ['GET'],
    pattern: '/appointment/filter/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'checkout.unfollow': {
    methods: ['PUT'],
    pattern: '/checkout/unfollow',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'payment.delete': {
    methods: ['GET'],
    pattern: '/payment/delete/:groupId/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; teamId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'checkout.block': {
    methods: ['GET'],
    pattern: '/checkout/block/:id/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'search.like': {
    methods: ['DELETE'],
    pattern: '/search/like',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'campaign.appointment.post': {
    methods: ['POST'],
    pattern: '/campaign/appointment/post/:teamId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { teamId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'music.sort': {
    methods: ['GET'],
    pattern: '/music/sort',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'tracking.restaurant.verify': {
    methods: ['POST'],
    pattern: '/tracking/restaurant/verify/:userId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'schedule.group': {
    methods: ['GET'],
    pattern: '/schedule/group',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'garden.refresh': {
    methods: ['POST'],
    pattern: '/garden/refresh',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'backup.invite': {
    methods: ['GET'],
    pattern: '/backup/invite/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'backup.update': {
    methods: ['GET'],
    pattern: '/backup/update',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'order.billing.draft': {
    methods: ['PUT'],
    pattern: '/order/billing/draft/:itemId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: {}
      response: { id: string; name: string }
    },
  },
  'audio.publish': {
    methods: ['GET'],
    pattern: '/audio/publish/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'import.separate': {
    methods: ['POST'],
    pattern: '/import/separate',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'upload.post': {
    methods: ['PUT'],
    pattern: '/upload/post',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'social.message.relocate': {
    methods: ['DELETE'],
    pattern: '/social/message/relocate/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'cart.bookmark': {
    methods: ['GET'],
    pattern: '/cart/bookmark/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'schedule.subscription.migrate': {
    methods: ['PUT'],
    pattern: '/schedule/subscription/migrate/:categoryId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { categoryId: string; entityId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'social.show': {
    methods: ['POST'],
    pattern: '/social/show/:teamId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { teamId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'notification.unpublish': {
    methods: ['PUT'],
    pattern: '/notification/unpublish',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'download.relocate': {
    methods: ['GET'],
    pattern: '/download/relocate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'education.knowledge.verify': {
    methods: ['POST'],
    pattern: '/education/knowledge/verify',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { token: string; expiresAt: string }
    },
  },
  'label.refresh': {
    methods: ['GET'],
    pattern: '/label/refresh',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'calendar.upload': {
    methods: ['GET'],
    pattern: '/calendar/upload/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'survey.booking.update': {
    methods: ['DELETE'],
    pattern: '/survey/booking/update',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'favorite.secure': {
    methods: ['PATCH'],
    pattern: '/favorite/secure',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'music.bookmark.combine': {
    methods: ['PATCH'],
    pattern: '/music/bookmark/combine',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'authorization.import': {
    methods: ['POST'],
    pattern: '/authorization/import/:entityId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { entityId: string }
      paramsTuple: [string]
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'cinema.transfer': {
    methods: ['PUT'],
    pattern: '/cinema/transfer/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'collaboration.reject': {
    methods: ['POST'],
    pattern: '/collaboration/reject',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'label.migrate': {
    methods: ['POST'],
    pattern: '/label/migrate',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'blog.permission.update': {
    methods: ['PATCH'],
    pattern: '/blog/permission/update/:entityId/:id',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { entityId: string; id: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'rating.search': {
    methods: ['GET'],
    pattern: '/rating/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'education.postpone': {
    methods: ['PUT'],
    pattern: '/education/postpone/:itemId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { itemId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'music.store': {
    methods: ['POST'],
    pattern: '/music/store',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'pet.preview': {
    methods: ['POST'],
    pattern: '/pet/preview',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { id: string; name: string }
    },
  },
  'portfolio.permission.confirm': {
    methods: ['GET'],
    pattern: '/portfolio/permission/confirm',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'report.event.transform': {
    methods: ['GET'],
    pattern: '/report/event/transform',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'tag.archive': {
    methods: ['GET'],
    pattern: '/tag/archive',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'notification.approve': {
    methods: ['DELETE'],
    pattern: '/notification/approve/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { success: boolean }
    },
  },
  'upload.store': {
    methods: ['GET', 'HEAD'],
    pattern: '/upload/store/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'dashboard.decline': {
    methods: ['GET', 'HEAD'],
    pattern: '/dashboard/decline/:userId/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; teamId: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'document.lock': {
    methods: ['POST'],
    pattern: '/document/lock',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'restaurant.report.favorite': {
    methods: ['GET'],
    pattern: '/restaurant/report/favorite',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'category.unmute': {
    methods: ['GET'],
    pattern: '/category/unmute/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'reservation.relocate': {
    methods: ['DELETE'],
    pattern: '/reservation/relocate/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'chat.verify': {
    methods: ['DELETE'],
    pattern: '/chat/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'member.leave': {
    methods: ['GET', 'HEAD'],
    pattern: '/member/leave',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'feedback.deactivate': {
    methods: ['DELETE'],
    pattern: '/feedback/deactivate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'project.history.split': {
    methods: ['GET'],
    pattern: '/project/history/split/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'social.approve': {
    methods: ['POST'],
    pattern: '/social/approve/:itemId/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; userId: string }
      paramsTuple: [string, string]
      query: {}
      response: { status: string; message: string }
    },
  },
  'authentication.list': {
    methods: ['GET'],
    pattern: '/authentication/list/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'filter.calculate': {
    methods: ['GET'],
    pattern: '/filter/calculate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'category.export': {
    methods: ['GET', 'HEAD'],
    pattern: '/category/export',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'coupon.document.unlike': {
    methods: ['GET'],
    pattern: '/coupon/document/unlike/:groupId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'travel.get': {
    methods: ['GET'],
    pattern: '/travel/get',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'review.sort': {
    methods: ['GET'],
    pattern: '/review/sort/:id/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; groupId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'language.reject': {
    methods: ['DELETE'],
    pattern: '/language/reject/:entityId/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string; groupId: string }
      paramsTuple: [string, string]
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'fashion.unfollow': {
    methods: ['DELETE'],
    pattern: '/fashion/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'preferences.unpublish': {
    methods: ['GET'],
    pattern: '/preferences/unpublish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'chat.sort': {
    methods: ['PUT'],
    pattern: '/chat/sort',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'maintenance.unassign': {
    methods: ['PATCH'],
    pattern: '/maintenance/unassign/:entityId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'feedback.verify': {
    methods: ['GET'],
    pattern: '/feedback/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'community.import': {
    methods: ['PUT'],
    pattern: '/community/import',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { settings: any; preferences: any }
    },
  },
  'collaboration.favorite': {
    methods: ['PUT'],
    pattern: '/collaboration/favorite',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'audio.merge': {
    methods: ['POST'],
    pattern: '/audio/merge/:categoryId/:userId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { categoryId: string; userId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'wiki.calculate': {
    methods: ['PATCH'],
    pattern: '/wiki/calculate',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'order.preview': {
    methods: ['DELETE'],
    pattern: '/order/preview',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'wiki.user.index': {
    methods: ['GET'],
    pattern: '/wiki/user/index',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'task.get': {
    methods: ['DELETE'],
    pattern: '/task/get/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'delivery.merge': {
    methods: ['POST'],
    pattern: '/delivery/merge',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'shop.export.put': {
    methods: ['POST'],
    pattern: '/shop/export/put',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'game.maintenance.backup': {
    methods: ['GET'],
    pattern: '/game/maintenance/backup',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'community.mute': {
    methods: ['GET'],
    pattern: '/community/mute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'comment.filter.accept': {
    methods: ['GET'],
    pattern: '/comment/filter/accept/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'education.export': {
    methods: ['DELETE'],
    pattern: '/education/export',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { data: any[]; total: number }
    },
  },
  'blog.unpublish': {
    methods: ['DELETE'],
    pattern: '/blog/unpublish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'wiki.bookmark': {
    methods: ['GET'],
    pattern: '/wiki/bookmark/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'shipping.relocate': {
    methods: ['POST'],
    pattern: '/shipping/relocate/:itemId/:teamId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { itemId: string; teamId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'task.refresh': {
    methods: ['POST'],
    pattern: '/task/refresh',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'sync.reject': {
    methods: ['GET'],
    pattern: '/sync/reject',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'invoice.move': {
    methods: ['PATCH'],
    pattern: '/invoice/move',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { created: boolean; item: any }
    },
  },
  'backup.store': {
    methods: ['GET'],
    pattern: '/backup/store/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'appointment.lock': {
    methods: ['POST'],
    pattern: '/appointment/lock',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { success: boolean }
    },
  },
  'audio.analytics.scroll': {
    methods: ['GET'],
    pattern: '/audio/analytics/scroll',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { success: boolean }
    },
  },
  'analytics.paginate': {
    methods: ['GET'],
    pattern: '/analytics/paginate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'audio.archive': {
    methods: ['GET'],
    pattern: '/audio/archive',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'social.garden.publish': {
    methods: ['POST'],
    pattern: '/social/garden/publish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'restaurant.remove': {
    methods: ['DELETE'],
    pattern: '/restaurant/remove/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'home.rating.sort': {
    methods: ['GET'],
    pattern: '/home/rating/sort',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { success: boolean }
    },
  },
  'tracking.remove': {
    methods: ['POST'],
    pattern: '/tracking/remove',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'favorite.network.remove': {
    methods: ['GET'],
    pattern: '/favorite/network/remove',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'import.postpone': {
    methods: ['PUT'],
    pattern: '/import/postpone/:itemId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'message.toggle': {
    methods: ['POST'],
    pattern: '/message/toggle',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'invoice.upload': {
    methods: ['GET'],
    pattern: '/invoice/upload',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'game.rating.find': {
    methods: ['PATCH'],
    pattern: '/game/rating/find/:userId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { url: string; filename: string }
    },
  },
  'library.backup.enable': {
    methods: ['GET'],
    pattern: '/library/backup/enable',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'pricing.search': {
    methods: ['GET'],
    pattern: '/pricing/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'blog.follow': {
    methods: ['GET'],
    pattern: '/blog/follow/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'game.secure': {
    methods: ['POST'],
    pattern: '/game/secure/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'quality.patch': {
    methods: ['POST'],
    pattern: '/quality/patch/:userId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { userId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'bookmark.restaurant.copy': {
    methods: ['PATCH'],
    pattern: '/bookmark/restaurant/copy',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'podcast.filter': {
    methods: ['GET'],
    pattern: '/podcast/filter/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'product.paginate': {
    methods: ['PATCH'],
    pattern: '/product/paginate/:id',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { id: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'home.cancel': {
    methods: ['POST'],
    pattern: '/home/cancel',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'pet.unsubscribe': {
    methods: ['POST'],
    pattern: '/pet/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'user.put': {
    methods: ['POST'],
    pattern: '/user/put',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'cart.remove': {
    methods: ['PATCH'],
    pattern: '/cart/remove/:id',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { id: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'checkout.disable': {
    methods: ['POST'],
    pattern: '/checkout/disable',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'blog.education.combine': {
    methods: ['GET'],
    pattern: '/blog/education/combine',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'pet.update': {
    methods: ['GET'],
    pattern: '/pet/update',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'bookmark.verify': {
    methods: ['GET'],
    pattern: '/bookmark/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'shipment.copy': {
    methods: ['PUT'],
    pattern: '/shipment/copy/:userId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'authorization.preview': {
    methods: ['GET'],
    pattern: '/authorization/preview/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'network.filter': {
    methods: ['GET'],
    pattern: '/network/filter',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'document.leave': {
    methods: ['PUT'],
    pattern: '/document/leave',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'integration.combine': {
    methods: ['POST'],
    pattern: '/integration/combine/:teamId/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { teamId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'search.unpublish': {
    methods: ['PUT'],
    pattern: '/search/unpublish/:entityId/:itemId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { entityId: string; itemId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'filter.filter': {
    methods: ['GET'],
    pattern: '/filter/filter',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'billing.remove': {
    methods: ['GET'],
    pattern: '/billing/remove/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'activity.clone': {
    methods: ['POST'],
    pattern: '/activity/clone',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'feedback.preferences.favorite': {
    methods: ['POST'],
    pattern: '/feedback/preferences/favorite',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'media.fashion.lock': {
    methods: ['POST'],
    pattern: '/media/fashion/lock/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'download.forward': {
    methods: ['PUT'],
    pattern: '/download/forward/:resourceId/:id',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { resourceId: string; id: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'security.export.post': {
    methods: ['GET'],
    pattern: '/security/export/post',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'category.sync': {
    methods: ['GET'],
    pattern: '/category/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'download.merge': {
    methods: ['GET'],
    pattern: '/download/merge',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'workflow.import': {
    methods: ['POST'],
    pattern: '/workflow/import',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'wiki.product.accept': {
    methods: ['DELETE'],
    pattern: '/wiki/product/accept',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'task.add': {
    methods: ['GET'],
    pattern: '/task/add/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'bookmark.unblock': {
    methods: ['GET'],
    pattern: '/bookmark/unblock/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'billing.enable': {
    methods: ['POST'],
    pattern: '/billing/enable/:id',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { id: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'analytics.unlike': {
    methods: ['GET', 'HEAD'],
    pattern: '/analytics/unlike',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'sports.garden.show': {
    methods: ['DELETE'],
    pattern: '/sports/garden/show',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'admin.label.sync': {
    methods: ['GET'],
    pattern: '/admin/label/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'library.clone': {
    methods: ['POST'],
    pattern: '/library/clone',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'comment.analyze': {
    methods: ['PATCH'],
    pattern: '/comment/analyze',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'video.separate': {
    methods: ['POST'],
    pattern: '/video/separate',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'billing.recipe.lock': {
    methods: ['GET'],
    pattern: '/billing/recipe/lock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'weather.market.calculate': {
    methods: ['PUT'],
    pattern: '/weather/market/calculate',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'workflow.unassign': {
    methods: ['PATCH'],
    pattern: '/workflow/unassign/:itemId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { itemId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'schedule.comment.unfollow': {
    methods: ['POST'],
    pattern: '/schedule/comment/unfollow/:entityId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'report.destroy': {
    methods: ['GET', 'HEAD'],
    pattern: '/report/destroy',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'rating.like': {
    methods: ['GET'],
    pattern: '/rating/like',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'forum.calculate': {
    methods: ['DELETE'],
    pattern: '/forum/calculate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'delivery.put': {
    methods: ['GET'],
    pattern: '/delivery/put',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'comment.verify': {
    methods: ['PUT'],
    pattern: '/comment/verify/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'home.access.upload': {
    methods: ['POST'],
    pattern: '/home/access/upload/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'audio.verify': {
    methods: ['GET'],
    pattern: '/audio/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'appointment.join': {
    methods: ['POST'],
    pattern: '/appointment/join',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'garden.download.migrate': {
    methods: ['POST'],
    pattern: '/garden/download/migrate',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'upload.market.forward': {
    methods: ['GET'],
    pattern: '/upload/market/forward',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'podcast.service.process': {
    methods: ['PATCH'],
    pattern: '/podcast/service/process/:groupId/:userId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { groupId: string; userId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'knowledge.add': {
    methods: ['PATCH'],
    pattern: '/knowledge/add',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'order.schedule.subscribe': {
    methods: ['POST'],
    pattern: '/order/schedule/subscribe',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { url: string; filename: string }
    },
  },
  'product.restore': {
    methods: ['GET'],
    pattern: '/product/restore/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { url: string; filename: string }
    },
  },
  'travel.unsubscribe': {
    methods: ['GET'],
    pattern: '/travel/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'schedule.geolocation.postpone': {
    methods: ['GET'],
    pattern: '/schedule/geolocation/postpone/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'integration.relocate': {
    methods: ['POST'],
    pattern: '/integration/relocate',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'restaurant.switch': {
    methods: ['PATCH'],
    pattern: '/restaurant/switch/:categoryId/:id',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { categoryId: string; id: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'role.ban': {
    methods: ['GET'],
    pattern: '/role/ban',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'network.assign': {
    methods: ['GET'],
    pattern: '/network/assign/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'tracking.export': {
    methods: ['GET'],
    pattern: '/tracking/export/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'log.split': {
    methods: ['GET'],
    pattern: '/log/split/:id/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'integration.schedule': {
    methods: ['DELETE'],
    pattern: '/integration/schedule',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'event.merge': {
    methods: ['POST'],
    pattern: '/event/merge/:teamId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { teamId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'image.filter': {
    methods: ['DELETE'],
    pattern: '/image/filter',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'sports.relocate': {
    methods: ['POST'],
    pattern: '/sports/relocate/:userId/:groupId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { userId: string; groupId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'watchlist.share': {
    methods: ['GET'],
    pattern: '/watchlist/share/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'report.file.secure': {
    methods: ['GET'],
    pattern: '/report/file/secure',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'feedback.restore': {
    methods: ['POST'],
    pattern: '/feedback/restore',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'member.join': {
    methods: ['PATCH'],
    pattern: '/member/join/:entityId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { entityId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'music.switch': {
    methods: ['GET'],
    pattern: '/music/switch/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: any
    },
  },
  'profile.favorite': {
    methods: ['GET'],
    pattern: '/profile/favorite',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'payment.knowledge.put': {
    methods: ['PUT'],
    pattern: '/payment/knowledge/put/:entityId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'fashion.migrate': {
    methods: ['POST'],
    pattern: '/fashion/migrate',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'recommendation.relocate': {
    methods: ['GET'],
    pattern: '/recommendation/relocate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'category.event.preview': {
    methods: ['GET'],
    pattern: '/category/event/preview/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'export.file.list': {
    methods: ['POST'],
    pattern: '/export/file/list',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'appointment.activity.transfer': {
    methods: ['GET', 'HEAD'],
    pattern: '/appointment/activity/transfer/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'watchlist.move': {
    methods: ['DELETE'],
    pattern: '/watchlist/move',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { url: string; filename: string }
    },
  },
  'portfolio.disable': {
    methods: ['PATCH'],
    pattern: '/portfolio/disable',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'network.transform': {
    methods: ['PATCH'],
    pattern: '/network/transform/:entityId/:userId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { entityId: string; userId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'cinema.order.merge': {
    methods: ['GET'],
    pattern: '/cinema/order/merge/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'bookmark.activate': {
    methods: ['POST'],
    pattern: '/bookmark/activate',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'music.travel.destroy': {
    methods: ['PATCH'],
    pattern: '/music/travel/destroy',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { id: string; name: string }
    },
  },
  'project.restaurant.process': {
    methods: ['POST'],
    pattern: '/project/restaurant/process/:userId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { userId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'shipment.campaign.enable': {
    methods: ['PATCH'],
    pattern: '/shipment/campaign/enable',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'authentication.backup': {
    methods: ['POST'],
    pattern: '/authentication/backup',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: any
    },
  },
  'subscription.post': {
    methods: ['GET'],
    pattern: '/subscription/post/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'report.delete': {
    methods: ['PATCH'],
    pattern: '/report/delete',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'import.subscription.secure': {
    methods: ['GET', 'HEAD'],
    pattern: '/import/subscription/secure/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'restaurant.add': {
    methods: ['DELETE'],
    pattern: '/restaurant/add',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'library.ungroup': {
    methods: ['POST'],
    pattern: '/library/ungroup/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'upload.compute': {
    methods: ['GET'],
    pattern: '/upload/compute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'network.index': {
    methods: ['GET'],
    pattern: '/network/index',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'tag.education.preview': {
    methods: ['POST'],
    pattern: '/tag/education/preview',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'travel.index': {
    methods: ['POST'],
    pattern: '/travel/index',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'recipe.authentication.protect': {
    methods: ['GET'],
    pattern: '/recipe/authentication/protect',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'offer.document.restore': {
    methods: ['POST'],
    pattern: '/offer/document/restore/:groupId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'settings.put': {
    methods: ['POST'],
    pattern: '/settings/put/:entityId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { entityId: string }
      paramsTuple: [string]
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'promotion.unlock': {
    methods: ['POST'],
    pattern: '/promotion/unlock',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type GeneratedRoutes = typeof routes

/**
 * Pre-computed API definition tree
 */
export interface GeneratedApiDefinition {
  fashion: {
    combine: GeneratedRoutes['fashion.combine']
    block: GeneratedRoutes['fashion.block']
    unfollow: GeneratedRoutes['fashion.unfollow']
    migrate: GeneratedRoutes['fashion.migrate']
  }
  inventory: {
    knowledge: {
      merge: GeneratedRoutes['inventory.knowledge.merge']
    }
    migrate: GeneratedRoutes['inventory.migrate']
  }
  download: {
    download: GeneratedRoutes['download.download']
    relocate: GeneratedRoutes['download.relocate']
    forward: GeneratedRoutes['download.forward']
    merge: GeneratedRoutes['download.merge']
  }
  booking: {
    social: {
      publish: GeneratedRoutes['booking.social.publish']
    }
    role: {
      unlike: GeneratedRoutes['booking.role.unlike']
    }
    schedule: {
      relocate: GeneratedRoutes['booking.schedule.relocate']
    }
  }
  sports: {
    destroy: GeneratedRoutes['sports.destroy']
    garden: {
      show: GeneratedRoutes['sports.garden.show']
    }
    relocate: GeneratedRoutes['sports.relocate']
  }
  settings: {
    unsubscribe: GeneratedRoutes['settings.unsubscribe']
    put: GeneratedRoutes['settings.put']
  }
  tag: {
    download: {
      clone: GeneratedRoutes['tag.download.clone']
    }
    scroll: GeneratedRoutes['tag.scroll']
    archive: GeneratedRoutes['tag.archive']
    education: {
      preview: GeneratedRoutes['tag.education.preview']
    }
  }
  media: {
    team: {
      remove: GeneratedRoutes['media.team.remove']
    }
    fashion: {
      lock: GeneratedRoutes['media.fashion.lock']
    }
  }
  weather: {
    unassign: GeneratedRoutes['weather.unassign']
    conference: {
      export: GeneratedRoutes['weather.conference.export']
    }
    market: {
      calculate: GeneratedRoutes['weather.market.calculate']
    }
  }
  document: {
    kick: GeneratedRoutes['document.kick']
    compute: GeneratedRoutes['document.compute']
    clone: GeneratedRoutes['document.clone']
    lock: GeneratedRoutes['document.lock']
    leave: GeneratedRoutes['document.leave']
  }
  workflow: {
    wiki: {
      export: GeneratedRoutes['workflow.wiki.export']
    }
    market: {
      unlock: GeneratedRoutes['workflow.market.unlock']
    }
    import: GeneratedRoutes['workflow.import']
    unassign: GeneratedRoutes['workflow.unassign']
  }
  cinema: {
    split: GeneratedRoutes['cinema.split']
    transfer: GeneratedRoutes['cinema.transfer']
    order: {
      merge: GeneratedRoutes['cinema.order.merge']
    }
  }
  audio: {
    destroy: GeneratedRoutes['audio.destroy']
    publish: GeneratedRoutes['audio.publish']
    merge: GeneratedRoutes['audio.merge']
    analytics: {
      scroll: GeneratedRoutes['audio.analytics.scroll']
    }
    archive: GeneratedRoutes['audio.archive']
    verify: GeneratedRoutes['audio.verify']
  }
  language: {
    confirm: GeneratedRoutes['language.confirm']
    index: GeneratedRoutes['language.index']
    split: GeneratedRoutes['language.split']
    reject: GeneratedRoutes['language.reject']
  }
  coupon: {
    find: GeneratedRoutes['coupon.find']
    unassign: GeneratedRoutes['coupon.unassign']
    document: {
      unlike: GeneratedRoutes['coupon.document.unlike']
    }
  }
  project: {
    postpone: GeneratedRoutes['project.postpone']
    history: {
      split: GeneratedRoutes['project.history.split']
    }
    restaurant: {
      process: GeneratedRoutes['project.restaurant.process']
    }
  }
  travel: {
    confirm: GeneratedRoutes['travel.confirm']
    get: GeneratedRoutes['travel.get']
    unsubscribe: GeneratedRoutes['travel.unsubscribe']
    index: GeneratedRoutes['travel.index']
  }
  tracking: {
    forward: GeneratedRoutes['tracking.forward']
    list: GeneratedRoutes['tracking.list']
    restaurant: {
      verify: GeneratedRoutes['tracking.restaurant.verify']
    }
    remove: GeneratedRoutes['tracking.remove']
    export: GeneratedRoutes['tracking.export']
  }
  recommendation: {
    preview: GeneratedRoutes['recommendation.preview']
    relocate: GeneratedRoutes['recommendation.relocate']
  }
  admin: {
    unmute: GeneratedRoutes['admin.unmute']
    search: GeneratedRoutes['admin.search']
    label: {
      sync: GeneratedRoutes['admin.label.sync']
    }
  }
  appointment: {
    log: {
      disable: GeneratedRoutes['appointment.log.disable']
    }
    filter: GeneratedRoutes['appointment.filter']
    lock: GeneratedRoutes['appointment.lock']
    join: GeneratedRoutes['appointment.join']
    activity: {
      transfer: GeneratedRoutes['appointment.activity.transfer']
    }
  }
  podcast: {
    access: {
      refresh: GeneratedRoutes['podcast.access.refresh']
    }
    filter: GeneratedRoutes['podcast.filter']
    service: {
      process: GeneratedRoutes['podcast.service.process']
    }
  }
  deal: {
    secure: GeneratedRoutes['deal.secure']
  }
  comment: {
    wiki: {
      unfollow: GeneratedRoutes['comment.wiki.unfollow']
    }
    filter: {
      accept: GeneratedRoutes['comment.filter.accept']
    }
    analyze: GeneratedRoutes['comment.analyze']
    verify: GeneratedRoutes['comment.verify']
  }
  forum: {
    shop: {
      refresh: GeneratedRoutes['forum.shop.refresh']
    }
    unfollow: GeneratedRoutes['forum.unfollow']
    calculate: GeneratedRoutes['forum.calculate']
  }
  invoice: {
    unlike: GeneratedRoutes['invoice.unlike']
    move: GeneratedRoutes['invoice.move']
    upload: GeneratedRoutes['invoice.upload']
  }
  portfolio: {
    insert: GeneratedRoutes['portfolio.insert']
    permission: {
      confirm: GeneratedRoutes['portfolio.permission.confirm']
    }
    disable: GeneratedRoutes['portfolio.disable']
  }
  calendar: {
    event: {
      find: GeneratedRoutes['calendar.event.find']
    }
    list: GeneratedRoutes['calendar.list']
    upload: GeneratedRoutes['calendar.upload']
  }
  access: {
    schedule: GeneratedRoutes['access.schedule']
    accept: GeneratedRoutes['access.accept']
    activate: GeneratedRoutes['access.activate']
    reject: GeneratedRoutes['access.reject']
    media: {
      paginate: GeneratedRoutes['access.media.paginate']
    }
  }
  art: {
    merge: GeneratedRoutes['art.merge']
  }
  social: {
    invite: GeneratedRoutes['social.invite']
    message: {
      relocate: GeneratedRoutes['social.message.relocate']
    }
    show: GeneratedRoutes['social.show']
    approve: GeneratedRoutes['social.approve']
    garden: {
      publish: GeneratedRoutes['social.garden.publish']
    }
  }
  gallery: {
    activate: GeneratedRoutes['gallery.activate']
    find: GeneratedRoutes['gallery.find']
  }
  search: {
    block: GeneratedRoutes['search.block']
    like: GeneratedRoutes['search.like']
    unpublish: GeneratedRoutes['search.unpublish']
  }
  image: {
    list: GeneratedRoutes['image.list']
    filter: GeneratedRoutes['image.filter']
  }
  watchlist: {
    calculate: GeneratedRoutes['watchlist.calculate']
    analyze: GeneratedRoutes['watchlist.analyze']
    share: GeneratedRoutes['watchlist.share']
    move: GeneratedRoutes['watchlist.move']
  }
  education: {
    social: {
      sync: GeneratedRoutes['education.social.sync']
    }
    move: GeneratedRoutes['education.move']
    deactivate: GeneratedRoutes['education.deactivate']
    assign: GeneratedRoutes['education.assign']
    knowledge: {
      verify: GeneratedRoutes['education.knowledge.verify']
    }
    postpone: GeneratedRoutes['education.postpone']
    export: GeneratedRoutes['education.export']
  }
  discount: {
    chat: {
      get: GeneratedRoutes['discount.chat.get']
    }
  }
  service: {
    download: GeneratedRoutes['service.download']
  }
  member: {
    get: GeneratedRoutes['member.get']
    leave: GeneratedRoutes['member.leave']
    join: GeneratedRoutes['member.join']
  }
  garden: {
    import: GeneratedRoutes['garden.import']
    refresh: GeneratedRoutes['garden.refresh']
    download: {
      migrate: GeneratedRoutes['garden.download.migrate']
    }
  }
  filter: {
    backup: GeneratedRoutes['filter.backup']
    favorite: GeneratedRoutes['filter.favorite']
    publish: GeneratedRoutes['filter.publish']
    calculate: GeneratedRoutes['filter.calculate']
    filter: GeneratedRoutes['filter.filter']
  }
  community: {
    calculate: GeneratedRoutes['community.calculate']
    approve: GeneratedRoutes['community.approve']
    put: GeneratedRoutes['community.put']
    import: GeneratedRoutes['community.import']
    mute: GeneratedRoutes['community.mute']
  }
  message: {
    chat: {
      duplicate: GeneratedRoutes['message.chat.duplicate']
    }
    network: {
      migrate: GeneratedRoutes['message.network.migrate']
    }
    toggle: GeneratedRoutes['message.toggle']
  }
  authentication: {
    join: GeneratedRoutes['authentication.join']
    merge: GeneratedRoutes['authentication.merge']
    list: GeneratedRoutes['authentication.list']
    backup: GeneratedRoutes['authentication.backup']
  }
  bookmark: {
    merge: GeneratedRoutes['bookmark.merge']
    unpublish: GeneratedRoutes['bookmark.unpublish']
    restaurant: {
      copy: GeneratedRoutes['bookmark.restaurant.copy']
    }
    verify: GeneratedRoutes['bookmark.verify']
    unblock: GeneratedRoutes['bookmark.unblock']
    activate: GeneratedRoutes['bookmark.activate']
  }
  review: {
    maintenance: {
      remove: GeneratedRoutes['review.maintenance.remove']
    }
    sort: GeneratedRoutes['review.sort']
  }
  schedule: {
    coupon: {
      verify: GeneratedRoutes['schedule.coupon.verify']
    }
    group: GeneratedRoutes['schedule.group']
    subscription: {
      migrate: GeneratedRoutes['schedule.subscription.migrate']
    }
    comment: {
      unfollow: GeneratedRoutes['schedule.comment.unfollow']
    }
    geolocation: {
      postpone: GeneratedRoutes['schedule.geolocation.postpone']
    }
  }
  collaboration: {
    sync: GeneratedRoutes['collaboration.sync']
    conference: {
      lock: GeneratedRoutes['collaboration.conference.lock']
    }
    reject: GeneratedRoutes['collaboration.reject']
    favorite: GeneratedRoutes['collaboration.favorite']
  }
  shipping: {
    comment: {
      unblock: GeneratedRoutes['shipping.comment.unblock']
    }
    relocate: GeneratedRoutes['shipping.relocate']
  }
  pricing: {
    weather: {
      unassign: GeneratedRoutes['pricing.weather.unassign']
    }
    search: GeneratedRoutes['pricing.search']
  }
  integration: {
    patch: GeneratedRoutes['integration.patch']
    combine: GeneratedRoutes['integration.combine']
    relocate: GeneratedRoutes['integration.relocate']
    schedule: GeneratedRoutes['integration.schedule']
  }
  permission: {
    unlock: GeneratedRoutes['permission.unlock']
  }
  team: {
    shop: {
      generate: GeneratedRoutes['team.shop.generate']
    }
  }
  category: {
    document: {
      destroy: GeneratedRoutes['category.document.destroy']
    }
    unmute: GeneratedRoutes['category.unmute']
    export: GeneratedRoutes['category.export']
    sync: GeneratedRoutes['category.sync']
    event: {
      preview: GeneratedRoutes['category.event.preview']
    }
  }
  market: {
    unfollow: GeneratedRoutes['market.unfollow']
  }
  rating: {
    split: GeneratedRoutes['rating.split']
    search: GeneratedRoutes['rating.search']
    like: GeneratedRoutes['rating.like']
  }
  analytics: {
    verify: GeneratedRoutes['analytics.verify']
    paginate: GeneratedRoutes['analytics.paginate']
    unlike: GeneratedRoutes['analytics.unlike']
  }
  library: {
    export: GeneratedRoutes['library.export']
    backup: {
      enable: GeneratedRoutes['library.backup.enable']
    }
    clone: GeneratedRoutes['library.clone']
    ungroup: GeneratedRoutes['library.ungroup']
  }
  export: {
    export: GeneratedRoutes['export.export']
    insert: GeneratedRoutes['export.insert']
    file: {
      list: GeneratedRoutes['export.file.list']
    }
  }
  maintenance: {
    publish: GeneratedRoutes['maintenance.publish']
    unassign: GeneratedRoutes['maintenance.unassign']
  }
  home: {
    scroll: GeneratedRoutes['home.scroll']
    rating: {
      sort: GeneratedRoutes['home.rating.sort']
    }
    cancel: GeneratedRoutes['home.cancel']
    access: {
      upload: GeneratedRoutes['home.access.upload']
    }
  }
  feedback: {
    import: {
      cancel: GeneratedRoutes['feedback.import.cancel']
    }
    deactivate: GeneratedRoutes['feedback.deactivate']
    verify: GeneratedRoutes['feedback.verify']
    preferences: {
      favorite: GeneratedRoutes['feedback.preferences.favorite']
    }
    restore: GeneratedRoutes['feedback.restore']
  }
  payment: {
    ban: GeneratedRoutes['payment.ban']
    delete: GeneratedRoutes['payment.delete']
    knowledge: {
      put: GeneratedRoutes['payment.knowledge.put']
    }
  }
  checkout: {
    unfollow: GeneratedRoutes['checkout.unfollow']
    block: GeneratedRoutes['checkout.block']
    disable: GeneratedRoutes['checkout.disable']
  }
  campaign: {
    appointment: {
      post: GeneratedRoutes['campaign.appointment.post']
    }
  }
  music: {
    sort: GeneratedRoutes['music.sort']
    bookmark: {
      combine: GeneratedRoutes['music.bookmark.combine']
    }
    store: GeneratedRoutes['music.store']
    switch: GeneratedRoutes['music.switch']
    travel: {
      destroy: GeneratedRoutes['music.travel.destroy']
    }
  }
  backup: {
    invite: GeneratedRoutes['backup.invite']
    update: GeneratedRoutes['backup.update']
    store: GeneratedRoutes['backup.store']
  }
  order: {
    billing: {
      draft: GeneratedRoutes['order.billing.draft']
    }
    preview: GeneratedRoutes['order.preview']
    schedule: {
      subscribe: GeneratedRoutes['order.schedule.subscribe']
    }
  }
  import: {
    separate: GeneratedRoutes['import.separate']
    postpone: GeneratedRoutes['import.postpone']
    subscription: {
      secure: GeneratedRoutes['import.subscription.secure']
    }
  }
  upload: {
    post: GeneratedRoutes['upload.post']
    store: GeneratedRoutes['upload.store']
    market: {
      forward: GeneratedRoutes['upload.market.forward']
    }
    compute: GeneratedRoutes['upload.compute']
  }
  cart: {
    bookmark: GeneratedRoutes['cart.bookmark']
    remove: GeneratedRoutes['cart.remove']
  }
  notification: {
    unpublish: GeneratedRoutes['notification.unpublish']
    approve: GeneratedRoutes['notification.approve']
  }
  label: {
    refresh: GeneratedRoutes['label.refresh']
    migrate: GeneratedRoutes['label.migrate']
  }
  survey: {
    booking: {
      update: GeneratedRoutes['survey.booking.update']
    }
  }
  favorite: {
    secure: GeneratedRoutes['favorite.secure']
    network: {
      remove: GeneratedRoutes['favorite.network.remove']
    }
  }
  authorization: {
    import: GeneratedRoutes['authorization.import']
    preview: GeneratedRoutes['authorization.preview']
  }
  blog: {
    permission: {
      update: GeneratedRoutes['blog.permission.update']
    }
    unpublish: GeneratedRoutes['blog.unpublish']
    follow: GeneratedRoutes['blog.follow']
    education: {
      combine: GeneratedRoutes['blog.education.combine']
    }
  }
  pet: {
    preview: GeneratedRoutes['pet.preview']
    unsubscribe: GeneratedRoutes['pet.unsubscribe']
    update: GeneratedRoutes['pet.update']
  }
  report: {
    event: {
      transform: GeneratedRoutes['report.event.transform']
    }
    destroy: GeneratedRoutes['report.destroy']
    file: {
      secure: GeneratedRoutes['report.file.secure']
    }
    delete: GeneratedRoutes['report.delete']
  }
  dashboard: {
    decline: GeneratedRoutes['dashboard.decline']
  }
  restaurant: {
    report: {
      favorite: GeneratedRoutes['restaurant.report.favorite']
    }
    remove: GeneratedRoutes['restaurant.remove']
    switch: GeneratedRoutes['restaurant.switch']
    add: GeneratedRoutes['restaurant.add']
  }
  reservation: {
    relocate: GeneratedRoutes['reservation.relocate']
  }
  chat: {
    verify: GeneratedRoutes['chat.verify']
    sort: GeneratedRoutes['chat.sort']
  }
  preferences: {
    unpublish: GeneratedRoutes['preferences.unpublish']
  }
  wiki: {
    calculate: GeneratedRoutes['wiki.calculate']
    user: {
      index: GeneratedRoutes['wiki.user.index']
    }
    bookmark: GeneratedRoutes['wiki.bookmark']
    product: {
      accept: GeneratedRoutes['wiki.product.accept']
    }
  }
  task: {
    get: GeneratedRoutes['task.get']
    refresh: GeneratedRoutes['task.refresh']
    add: GeneratedRoutes['task.add']
  }
  delivery: {
    merge: GeneratedRoutes['delivery.merge']
    put: GeneratedRoutes['delivery.put']
  }
  shop: {
    export: {
      put: GeneratedRoutes['shop.export.put']
    }
  }
  game: {
    maintenance: {
      backup: GeneratedRoutes['game.maintenance.backup']
    }
    rating: {
      find: GeneratedRoutes['game.rating.find']
    }
    secure: GeneratedRoutes['game.secure']
  }
  sync: {
    reject: GeneratedRoutes['sync.reject']
  }
  quality: {
    patch: GeneratedRoutes['quality.patch']
  }
  product: {
    paginate: GeneratedRoutes['product.paginate']
    restore: GeneratedRoutes['product.restore']
  }
  user: {
    put: GeneratedRoutes['user.put']
  }
  shipment: {
    copy: GeneratedRoutes['shipment.copy']
    campaign: {
      enable: GeneratedRoutes['shipment.campaign.enable']
    }
  }
  network: {
    filter: GeneratedRoutes['network.filter']
    assign: GeneratedRoutes['network.assign']
    transform: GeneratedRoutes['network.transform']
    index: GeneratedRoutes['network.index']
  }
  billing: {
    remove: GeneratedRoutes['billing.remove']
    enable: GeneratedRoutes['billing.enable']
    recipe: {
      lock: GeneratedRoutes['billing.recipe.lock']
    }
  }
  activity: {
    clone: GeneratedRoutes['activity.clone']
  }
  security: {
    export: {
      post: GeneratedRoutes['security.export.post']
    }
  }
  video: {
    separate: GeneratedRoutes['video.separate']
  }
  knowledge: {
    add: GeneratedRoutes['knowledge.add']
  }
  role: {
    ban: GeneratedRoutes['role.ban']
  }
  log: {
    split: GeneratedRoutes['log.split']
  }
  event: {
    merge: GeneratedRoutes['event.merge']
  }
  profile: {
    favorite: GeneratedRoutes['profile.favorite']
  }
  subscription: {
    post: GeneratedRoutes['subscription.post']
  }
  recipe: {
    authentication: {
      protect: GeneratedRoutes['recipe.authentication.protect']
    }
  }
  offer: {
    document: {
      restore: GeneratedRoutes['offer.document.restore']
    }
  }
  promotion: {
    unlock: GeneratedRoutes['promotion.unlock']
  }
}

export const generatedRegistry = {
  routes,
  $tree: {} as GeneratedApiDefinition,
}
