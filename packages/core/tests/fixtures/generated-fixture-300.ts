import type { AdonisEndpoint } from '../../src/client/types/types.ts'

const placeholder: any = {}

const routes = {
  'message.index': {
    methods: ['GET'],
    pattern: '/message/index',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'category.publish': {
    methods: ['GET'],
    pattern: '/category/publish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'feedback.review.update': {
    methods: ['GET'],
    pattern: '/feedback/review/update/:id/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; groupId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'file.quality.restore': {
    methods: ['POST'],
    pattern: '/file/quality/restore',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'filter.export': {
    methods: ['POST'],
    pattern: '/filter/export',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'import.social.block': {
    methods: ['POST'],
    pattern: '/import/social/block/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'chat.unfollow': {
    methods: ['GET'],
    pattern: '/chat/unfollow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'schedule.unpublish': {
    methods: ['DELETE'],
    pattern: '/schedule/unpublish',
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
  'shipment.favorite': {
    methods: ['DELETE'],
    pattern: '/shipment/favorite/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'pet.ban': {
    methods: ['DELETE'],
    pattern: '/pet/ban',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'feedback.game.confirm': {
    methods: ['GET'],
    pattern: '/feedback/game/confirm/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'search.filter': {
    methods: ['PUT'],
    pattern: '/search/filter/:id/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'shop.insert': {
    methods: ['GET'],
    pattern: '/shop/insert/:categoryId',
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
  'gallery.quality.add': {
    methods: ['GET'],
    pattern: '/gallery/quality/add',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'offer.category.split': {
    methods: ['PATCH'],
    pattern: '/offer/category/split',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'recipe.portfolio.clone': {
    methods: ['GET'],
    pattern: '/recipe/portfolio/clone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'authorization.preview': {
    methods: ['POST'],
    pattern: '/authorization/preview',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'schedule.favorite.block': {
    methods: ['DELETE'],
    pattern: '/schedule/favorite/block/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'export.ban': {
    methods: ['GET'],
    pattern: '/export/ban',
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
  'authentication.transfer': {
    methods: ['GET'],
    pattern: '/authentication/transfer',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'wiki.profile.validate': {
    methods: ['POST'],
    pattern: '/wiki/profile/validate/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'video.store': {
    methods: ['GET'],
    pattern: '/video/store',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'team.deactivate': {
    methods: ['GET', 'HEAD'],
    pattern: '/team/deactivate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { metrics: any; charts: any[] }
    },
  },
  'weather.leave': {
    methods: ['POST'],
    pattern: '/weather/leave',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'history.toggle': {
    methods: ['GET'],
    pattern: '/history/toggle',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { data: any[]; total: number }
    },
  },
  'task.message.backup': {
    methods: ['DELETE'],
    pattern: '/task/message/backup',
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
  'survey.unblock': {
    methods: ['GET'],
    pattern: '/survey/unblock/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'sports.payment.filter': {
    methods: ['POST'],
    pattern: '/sports/payment/filter/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { userId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'billing.refresh': {
    methods: ['POST'],
    pattern: '/billing/refresh',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'admin.workflow.decline': {
    methods: ['POST'],
    pattern: '/admin/workflow/decline/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { id: string; name: string }
    },
  },
  'maintenance.sync': {
    methods: ['POST'],
    pattern: '/maintenance/sync',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'music.confirm': {
    methods: ['PATCH'],
    pattern: '/music/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'search.create': {
    methods: ['POST'],
    pattern: '/search/create',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'market.lock': {
    methods: ['POST'],
    pattern: '/market/lock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'home.show': {
    methods: ['PATCH'],
    pattern: '/home/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'backup.sync': {
    methods: ['POST'],
    pattern: '/backup/sync/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'settings.mute': {
    methods: ['GET'],
    pattern: '/settings/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'market.schedule': {
    methods: ['PUT'],
    pattern: '/market/schedule/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { groupId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'fashion.deal.invite': {
    methods: ['DELETE'],
    pattern: '/fashion/deal/invite',
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
  'security.video.validate': {
    methods: ['GET'],
    pattern: '/security/video/validate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'history.validate': {
    methods: ['DELETE'],
    pattern: '/history/validate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'video.process': {
    methods: ['PATCH'],
    pattern: '/video/process',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: {}
      response: { success: boolean }
    },
  },
  'message.unsubscribe': {
    methods: ['GET'],
    pattern: '/message/unsubscribe',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'community.transform': {
    methods: ['DELETE'],
    pattern: '/community/transform/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'geolocation.unsubscribe': {
    methods: ['GET'],
    pattern: '/geolocation/unsubscribe',
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
  'garden.conference.duplicate': {
    methods: ['GET'],
    pattern: '/garden/conference/duplicate/:userId/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; entityId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'gallery.group': {
    methods: ['GET', 'HEAD'],
    pattern: '/gallery/group/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'bookmark.pricing.export': {
    methods: ['GET'],
    pattern: '/bookmark/pricing/export',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'shipment.generate': {
    methods: ['POST'],
    pattern: '/shipment/generate/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { groupId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'integration.analyze': {
    methods: ['POST'],
    pattern: '/integration/analyze',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'art.download': {
    methods: ['PUT'],
    pattern: '/art/download/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'discount.disable': {
    methods: ['POST'],
    pattern: '/discount/disable',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'integration.schedule.upload': {
    methods: ['GET'],
    pattern: '/integration/schedule/upload',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'portfolio.project.follow': {
    methods: ['GET'],
    pattern: '/portfolio/project/follow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'geolocation.payment.list': {
    methods: ['GET'],
    pattern: '/geolocation/payment/list/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'blog.migrate': {
    methods: ['GET', 'HEAD'],
    pattern: '/blog/migrate',
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
  'audio.cancel': {
    methods: ['PUT'],
    pattern: '/audio/cancel',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: { updated: boolean; changes: any }
    },
  },
  'recipe.sort': {
    methods: ['PUT'],
    pattern: '/recipe/sort',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'member.verify': {
    methods: ['POST'],
    pattern: '/member/verify/:itemId/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; userId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'upload.unblock': {
    methods: ['GET'],
    pattern: '/upload/unblock/:categoryId/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; userId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'art.file.ban': {
    methods: ['GET'],
    pattern: '/art/file/ban',
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
  'gallery.split': {
    methods: ['GET'],
    pattern: '/gallery/split/:categoryId/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'delivery.unsubscribe': {
    methods: ['GET'],
    pattern: '/delivery/unsubscribe',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'education.activity.leave': {
    methods: ['GET'],
    pattern: '/education/activity/leave/:itemId/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'deal.knowledge.unpublish': {
    methods: ['GET'],
    pattern: '/deal/knowledge/unpublish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'shop.market.secure': {
    methods: ['PATCH'],
    pattern: '/shop/market/secure',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'video.order.upload': {
    methods: ['GET'],
    pattern: '/video/order/upload/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'export.toggle': {
    methods: ['POST'],
    pattern: '/export/toggle/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'video.sports.accept': {
    methods: ['GET'],
    pattern: '/video/sports/accept',
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
  'search.member.destroy': {
    methods: ['GET'],
    pattern: '/search/member/destroy/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'maintenance.combine': {
    methods: ['DELETE'],
    pattern: '/maintenance/combine',
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
  'sync.postpone': {
    methods: ['GET'],
    pattern: '/sync/postpone',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'tracking.task.separate': {
    methods: ['GET'],
    pattern: '/tracking/task/separate',
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
  'tracking.analyze': {
    methods: ['PUT'],
    pattern: '/tracking/analyze',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: {}
      response: { success: boolean }
    },
  },
  'library.sync': {
    methods: ['GET'],
    pattern: '/library/sync',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'conference.assign': {
    methods: ['GET'],
    pattern: '/conference/assign',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'category.invoice.calculate': {
    methods: ['PATCH'],
    pattern: '/category/invoice/calculate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'library.ungroup': {
    methods: ['POST'],
    pattern: '/library/ungroup/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { url: string; filename: string }
    },
  },
  'user.weather.confirm': {
    methods: ['POST'],
    pattern: '/user/weather/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'campaign.draft': {
    methods: ['GET'],
    pattern: '/campaign/draft/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'tag.unsubscribe': {
    methods: ['PATCH'],
    pattern: '/tag/unsubscribe/:entityId/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { entityId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'integration.compute': {
    methods: ['GET'],
    pattern: '/integration/compute',
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
  'coupon.bookmark': {
    methods: ['PATCH'],
    pattern: '/coupon/bookmark/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'wiki.sync.process': {
    methods: ['POST'],
    pattern: '/wiki/sync/process',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'audio.unlike': {
    methods: ['DELETE'],
    pattern: '/audio/unlike',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'project.favorite': {
    methods: ['POST'],
    pattern: '/project/favorite',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'conference.rating.validate': {
    methods: ['GET'],
    pattern: '/conference/rating/validate/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'document.combine': {
    methods: ['PUT'],
    pattern: '/document/combine/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { itemId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'wiki.confirm': {
    methods: ['POST'],
    pattern: '/wiki/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'settings.transform': {
    methods: ['PATCH'],
    pattern: '/settings/transform',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'notification.reservation.compute': {
    methods: ['GET'],
    pattern: '/notification/reservation/compute',
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
  'chat.forward': {
    methods: ['GET'],
    pattern: '/chat/forward/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'appointment.like': {
    methods: ['GET'],
    pattern: '/appointment/like/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'knowledge.share': {
    methods: ['POST'],
    pattern: '/knowledge/share',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'recommendation.import': {
    methods: ['GET'],
    pattern: '/recommendation/import/:categoryId/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; entityId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'shop.index': {
    methods: ['POST'],
    pattern: '/shop/index/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'language.separate': {
    methods: ['GET'],
    pattern: '/language/separate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'task.bookmark.filter': {
    methods: ['PATCH'],
    pattern: '/task/bookmark/filter/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'video.edit': {
    methods: ['POST'],
    pattern: '/video/edit',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'video.put': {
    methods: ['PATCH'],
    pattern: '/video/put',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'subscription.tag.ban': {
    methods: ['GET'],
    pattern: '/subscription/tag/ban/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'inventory.backup': {
    methods: ['PATCH'],
    pattern: '/inventory/backup',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'home.unlock': {
    methods: ['POST'],
    pattern: '/home/unlock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'profile.payment.compute': {
    methods: ['GET', 'HEAD'],
    pattern: '/profile/payment/compute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'sports.download': {
    methods: ['PUT'],
    pattern: '/sports/download',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'travel.bookmark': {
    methods: ['POST'],
    pattern: '/travel/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'delivery.discount.migrate': {
    methods: ['GET'],
    pattern: '/delivery/discount/migrate/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'comment.get': {
    methods: ['PATCH'],
    pattern: '/comment/get/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { entityId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'activity.sports.split': {
    methods: ['DELETE'],
    pattern: '/activity/sports/split/:userId',
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
  'delivery.preview': {
    methods: ['GET'],
    pattern: '/delivery/preview',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { success: boolean }
    },
  },
  'payment.secure': {
    methods: ['POST'],
    pattern: '/payment/secure',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'sports.analyze': {
    methods: ['GET'],
    pattern: '/sports/analyze/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { url: string; filename: string }
    },
  },
  'dashboard.create': {
    methods: ['POST'],
    pattern: '/dashboard/create',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { id: string; name: string }
    },
  },
  'travel.pet.favorite': {
    methods: ['GET'],
    pattern: '/travel/pet/favorite',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'dashboard.unfollow': {
    methods: ['GET', 'HEAD'],
    pattern: '/dashboard/unfollow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'discount.transform': {
    methods: ['GET'],
    pattern: '/discount/transform',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'community.recipe.enable': {
    methods: ['POST'],
    pattern: '/community/recipe/enable/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'travel.collaboration.find': {
    methods: ['POST'],
    pattern: '/travel/collaboration/find',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'sports.order.transform': {
    methods: ['GET', 'HEAD'],
    pattern: '/sports/order/transform',
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
  'shop.travel.generate': {
    methods: ['DELETE'],
    pattern: '/shop/travel/generate/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'invoice.checkout.show': {
    methods: ['GET'],
    pattern: '/invoice/checkout/show/:userId/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { settings: any; preferences: any }
    },
  },
  'forum.confirm': {
    methods: ['POST'],
    pattern: '/forum/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'schedule.reject': {
    methods: ['POST'],
    pattern: '/schedule/reject',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'restaurant.migrate': {
    methods: ['PUT'],
    pattern: '/restaurant/migrate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { profile: any; permissions: string[] }
    },
  },
  'geolocation.project.mute': {
    methods: ['PATCH'],
    pattern: '/geolocation/project/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'review.update': {
    methods: ['DELETE'],
    pattern: '/review/update',
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
  'export.approve': {
    methods: ['GET', 'HEAD'],
    pattern: '/export/approve',
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
  'comment.reject': {
    methods: ['POST'],
    pattern: '/comment/reject',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'analytics.sports.sync': {
    methods: ['GET'],
    pattern: '/analytics/sports/sync/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'garden.inventory.refresh': {
    methods: ['GET'],
    pattern: '/garden/inventory/refresh',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'restaurant.add': {
    methods: ['GET'],
    pattern: '/restaurant/add/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'import.duplicate': {
    methods: ['PATCH'],
    pattern: '/import/duplicate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'favorite.ungroup': {
    methods: ['PATCH'],
    pattern: '/favorite/ungroup/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'upload.disable': {
    methods: ['POST'],
    pattern: '/upload/disable',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'tracking.protect': {
    methods: ['GET'],
    pattern: '/tracking/protect',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'permission.survey.approve': {
    methods: ['DELETE'],
    pattern: '/permission/survey/approve/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'pet.cancel': {
    methods: ['POST'],
    pattern: '/pet/cancel',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'permission.block': {
    methods: ['POST'],
    pattern: '/permission/block',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'dashboard.analyze': {
    methods: ['POST'],
    pattern: '/dashboard/analyze',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'survey.lock': {
    methods: ['PATCH'],
    pattern: '/survey/lock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'event.post': {
    methods: ['POST'],
    pattern: '/event/post',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'knowledge.schedule.leave': {
    methods: ['PATCH'],
    pattern: '/knowledge/schedule/leave/:resourceId/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { resourceId: string; userId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'shipment.art.list': {
    methods: ['POST'],
    pattern: '/shipment/art/list/:userId/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { userId: string; entityId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'social.unlock': {
    methods: ['POST'],
    pattern: '/social/unlock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { profile: any; permissions: string[] }
    },
  },
  'travel.favorite': {
    methods: ['PUT'],
    pattern: '/travel/favorite/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { id: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'search.validate': {
    methods: ['POST'],
    pattern: '/search/validate/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'import.report.unpublish': {
    methods: ['POST'],
    pattern: '/import/report/unpublish',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'document.show': {
    methods: ['PATCH'],
    pattern: '/document/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'forum.restore': {
    methods: ['POST'],
    pattern: '/forum/restore/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'report.get': {
    methods: ['PUT'],
    pattern: '/report/get/:id/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { id: string; resourceId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'invoice.subscribe': {
    methods: ['GET'],
    pattern: '/invoice/subscribe',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'appointment.preview': {
    methods: ['PATCH'],
    pattern: '/appointment/preview/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { teamId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'security.calculate': {
    methods: ['POST'],
    pattern: '/security/calculate/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'download.combine': {
    methods: ['GET'],
    pattern: '/download/combine',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'document.insert': {
    methods: ['PATCH'],
    pattern: '/document/insert',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'access.process': {
    methods: ['POST'],
    pattern: '/access/process',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'bookmark.transform': {
    methods: ['GET'],
    pattern: '/bookmark/transform/:groupId',
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
  'collaboration.block': {
    methods: ['GET'],
    pattern: '/collaboration/block/:resourceId/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; entityId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'portfolio.archive': {
    methods: ['POST'],
    pattern: '/portfolio/archive',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'reservation.kick': {
    methods: ['GET'],
    pattern: '/reservation/kick/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'podcast.shop.migrate': {
    methods: ['GET'],
    pattern: '/podcast/shop/migrate',
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
  'geolocation.lock': {
    methods: ['GET'],
    pattern: '/geolocation/lock/:teamId/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string; entityId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'booking.cancel': {
    methods: ['DELETE'],
    pattern: '/booking/cancel',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'music.filter.store': {
    methods: ['DELETE'],
    pattern: '/music/filter/store',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'gallery.assign': {
    methods: ['POST'],
    pattern: '/gallery/assign',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'sync.refresh': {
    methods: ['POST'],
    pattern: '/sync/refresh/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'team.blog.add': {
    methods: ['GET'],
    pattern: '/team/blog/add/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'import.podcast.validate': {
    methods: ['POST'],
    pattern: '/import/podcast/validate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'export.protect': {
    methods: ['GET'],
    pattern: '/export/protect',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'cinema.calendar.kick': {
    methods: ['GET'],
    pattern: '/cinema/calendar/kick',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'shipping.favorite': {
    methods: ['GET', 'HEAD'],
    pattern: '/shipping/favorite',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'discount.ungroup': {
    methods: ['PATCH'],
    pattern: '/discount/ungroup',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'import.delete': {
    methods: ['PATCH'],
    pattern: '/import/delete/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { groupId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'delivery.paginate': {
    methods: ['GET'],
    pattern: '/delivery/paginate/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'network.quality.backup': {
    methods: ['GET'],
    pattern: '/network/quality/backup',
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
  'analytics.disable': {
    methods: ['GET', 'HEAD'],
    pattern: '/analytics/disable/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'community.paginate': {
    methods: ['GET'],
    pattern: '/community/paginate/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'weather.approve': {
    methods: ['GET'],
    pattern: '/weather/approve',
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
  'shipment.mute': {
    methods: ['PATCH'],
    pattern: '/shipment/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'admin.deactivate': {
    methods: ['GET'],
    pattern: '/admin/deactivate/:id/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; entityId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'event.favorite.compute': {
    methods: ['POST'],
    pattern: '/event/favorite/compute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'file.follow': {
    methods: ['PATCH'],
    pattern: '/file/follow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'finance.restore': {
    methods: ['PUT'],
    pattern: '/finance/restore',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'history.notification.move': {
    methods: ['GET'],
    pattern: '/history/notification/move',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'preferences.disable': {
    methods: ['GET'],
    pattern: '/preferences/disable/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'download.preview': {
    methods: ['GET'],
    pattern: '/download/preview',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'offer.combine': {
    methods: ['GET'],
    pattern: '/offer/combine',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'game.draft': {
    methods: ['PATCH'],
    pattern: '/game/draft',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'rating.edit': {
    methods: ['GET'],
    pattern: '/rating/edit',
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
  'shipment.join': {
    methods: ['GET'],
    pattern: '/shipment/join',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'authentication.edit': {
    methods: ['GET'],
    pattern: '/authentication/edit/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'coupon.unfollow': {
    methods: ['PUT'],
    pattern: '/coupon/unfollow',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'profile.assign': {
    methods: ['GET'],
    pattern: '/profile/assign/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: {}
      response: { id: string; name: string }
    },
  },
  'permission.restore': {
    methods: ['DELETE'],
    pattern: '/permission/restore/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'dashboard.store': {
    methods: ['GET', 'HEAD'],
    pattern: '/dashboard/store',
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
  'shipment.sports.leave': {
    methods: ['DELETE'],
    pattern: '/shipment/sports/leave',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { created: boolean; item: any }
    },
  },
  'comment.show': {
    methods: ['GET'],
    pattern: '/comment/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'export.draft': {
    methods: ['DELETE'],
    pattern: '/export/draft',
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
  'admin.home.separate': {
    methods: ['DELETE'],
    pattern: '/admin/home/separate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'geolocation.archive': {
    methods: ['GET'],
    pattern: '/geolocation/archive',
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
  'deal.show': {
    methods: ['GET'],
    pattern: '/deal/show',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'delivery.filter': {
    methods: ['DELETE'],
    pattern: '/delivery/filter',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'chat.unassign': {
    methods: ['POST'],
    pattern: '/chat/unassign',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'portfolio.social.draft': {
    methods: ['GET'],
    pattern: '/portfolio/social/draft',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'project.cancel': {
    methods: ['DELETE'],
    pattern: '/project/cancel',
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
  'offer.gallery.bookmark': {
    methods: ['POST'],
    pattern: '/offer/gallery/bookmark',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'cinema.compute': {
    methods: ['GET'],
    pattern: '/cinema/compute/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'watchlist.category.separate': {
    methods: ['PATCH'],
    pattern: '/watchlist/category/separate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'collaboration.disable': {
    methods: ['GET'],
    pattern: '/collaboration/disable/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'cart.duplicate': {
    methods: ['GET'],
    pattern: '/cart/duplicate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'product.enable': {
    methods: ['DELETE'],
    pattern: '/product/enable',
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
  'watchlist.compute': {
    methods: ['GET', 'HEAD'],
    pattern: '/watchlist/compute/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'activity.portfolio.search': {
    methods: ['PUT'],
    pattern: '/activity/portfolio/search/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'restaurant.ban': {
    methods: ['POST'],
    pattern: '/restaurant/ban',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'sync.unlike': {
    methods: ['DELETE'],
    pattern: '/sync/unlike',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'role.relocate': {
    methods: ['DELETE'],
    pattern: '/role/relocate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'profile.add': {
    methods: ['GET'],
    pattern: '/profile/add/:groupId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; itemId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'history.scroll': {
    methods: ['GET', 'HEAD'],
    pattern: '/history/scroll',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { created: boolean; item: any }
    },
  },
  'restaurant.compute': {
    methods: ['GET'],
    pattern: '/restaurant/compute/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'library.postpone': {
    methods: ['GET'],
    pattern: '/library/postpone/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'collaboration.audio.lock': {
    methods: ['POST'],
    pattern: '/collaboration/audio/lock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'settings.campaign.paginate': {
    methods: ['GET'],
    pattern: '/settings/campaign/paginate/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'message.project.search': {
    methods: ['PUT'],
    pattern: '/message/project/search',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'comment.campaign.merge': {
    methods: ['PUT'],
    pattern: '/comment/campaign/merge',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'pricing.knowledge.unfollow': {
    methods: ['POST'],
    pattern: '/pricing/knowledge/unfollow/:groupId/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { groupId: string; id: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'survey.refresh': {
    methods: ['POST'],
    pattern: '/survey/refresh/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { itemId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'audio.toggle': {
    methods: ['PATCH'],
    pattern: '/audio/toggle/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'report.label.insert': {
    methods: ['GET'],
    pattern: '/report/label/insert/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'audio.restore': {
    methods: ['PATCH'],
    pattern: '/audio/restore',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'team.document.accept': {
    methods: ['POST'],
    pattern: '/team/document/accept/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'subscription.feedback.move': {
    methods: ['POST'],
    pattern: '/subscription/feedback/move',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: {}
      response: { settings: any; preferences: any }
    },
  },
  'profile.insert': {
    methods: ['GET'],
    pattern: '/profile/insert',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'activity.decline': {
    methods: ['POST'],
    pattern: '/activity/decline/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'user.export': {
    methods: ['POST'],
    pattern: '/user/export/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { success: boolean }
    },
  },
  'invoice.generate': {
    methods: ['GET'],
    pattern: '/invoice/generate/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { settings: any; preferences: any }
    },
  },
  'document.preview': {
    methods: ['PATCH'],
    pattern: '/document/preview/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { teamId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'tracking.unsubscribe': {
    methods: ['GET'],
    pattern: '/tracking/unsubscribe',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'game.accept': {
    methods: ['PUT'],
    pattern: '/game/accept/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { itemId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'comment.leave': {
    methods: ['GET', 'HEAD'],
    pattern: '/comment/leave',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'pet.process': {
    methods: ['GET'],
    pattern: '/pet/process',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'restaurant.separate': {
    methods: ['GET'],
    pattern: '/restaurant/separate/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'chat.export': {
    methods: ['PUT'],
    pattern: '/chat/export/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { id: string; name: string }
    },
  },
  'analytics.user.refresh': {
    methods: ['GET'],
    pattern: '/analytics/user/refresh/:id/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'log.weather.assign': {
    methods: ['GET'],
    pattern: '/log/weather/assign/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'tracking.appointment.paginate': {
    methods: ['GET'],
    pattern: '/tracking/appointment/paginate/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'task.profile.insert': {
    methods: ['GET', 'HEAD'],
    pattern: '/task/profile/insert/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'media.combine': {
    methods: ['POST'],
    pattern: '/media/combine/:itemId/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'network.sort': {
    methods: ['GET'],
    pattern: '/network/sort/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'backup.workflow.edit': {
    methods: ['PUT'],
    pattern: '/backup/workflow/edit/:entityId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'maintenance.unpublish': {
    methods: ['POST'],
    pattern: '/maintenance/unpublish/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'file.sports.process': {
    methods: ['DELETE'],
    pattern: '/file/sports/process',
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
  'payment.permission.sort': {
    methods: ['POST'],
    pattern: '/payment/permission/sort/:id/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { id: string; itemId: string }
      paramsTuple: [string, string]
      query: {}
      response: { success: boolean }
    },
  },
  'preferences.migrate': {
    methods: ['POST'],
    pattern: '/preferences/migrate',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'dashboard.search.create': {
    methods: ['POST'],
    pattern: '/dashboard/search/create',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'permission.share': {
    methods: ['POST'],
    pattern: '/permission/share',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { settings: any; preferences: any }
    },
  },
  'service.scroll': {
    methods: ['GET'],
    pattern: '/service/scroll/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'conference.sync': {
    methods: ['GET'],
    pattern: '/conference/sync',
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
  'settings.get': {
    methods: ['POST'],
    pattern: '/settings/get/:entityId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { entityId: string; itemId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'bookmark.create': {
    methods: ['POST'],
    pattern: '/bookmark/create',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'shipping.index': {
    methods: ['GET'],
    pattern: '/shipping/index',
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
  'feedback.ban': {
    methods: ['GET'],
    pattern: '/feedback/ban/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'document.billing.archive': {
    methods: ['DELETE'],
    pattern: '/document/billing/archive/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'bookmark.forum.confirm': {
    methods: ['GET'],
    pattern: '/bookmark/forum/confirm',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { success: boolean }
    },
  },
  'social.cancel': {
    methods: ['PUT'],
    pattern: '/social/cancel/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'checkout.subscribe': {
    methods: ['GET'],
    pattern: '/checkout/subscribe/:resourceId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'media.coupon.unassign': {
    methods: ['GET'],
    pattern: '/media/coupon/unassign/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'report.mute': {
    methods: ['PATCH'],
    pattern: '/report/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'invoice.discount.forward': {
    methods: ['PATCH'],
    pattern: '/invoice/discount/forward/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'recommendation.label.preview': {
    methods: ['GET'],
    pattern: '/recommendation/label/preview',
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
  'wiki.compute': {
    methods: ['PATCH'],
    pattern: '/wiki/compute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'product.mute': {
    methods: ['PATCH'],
    pattern: '/product/mute',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'maintenance.music.export': {
    methods: ['POST'],
    pattern: '/maintenance/music/export/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'event.dashboard.sort': {
    methods: ['PATCH'],
    pattern: '/event/dashboard/sort/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'survey.block': {
    methods: ['POST'],
    pattern: '/survey/block',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'member.toggle': {
    methods: ['PATCH'],
    pattern: '/member/toggle',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'social.filter': {
    methods: ['POST'],
    pattern: '/social/filter/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'delivery.scroll': {
    methods: ['POST'],
    pattern: '/delivery/scroll/:entityId/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { entityId: string; groupId: string }
      paramsTuple: [string, string]
      query: { sort?: string; order?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'permission.restaurant.validate': {
    methods: ['GET'],
    pattern: '/permission/restaurant/validate',
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
  'delivery.unblock': {
    methods: ['GET'],
    pattern: '/delivery/unblock',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'file.unfollow': {
    methods: ['GET'],
    pattern: '/file/unfollow/:resourceId',
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
  'upload.assign': {
    methods: ['PATCH'],
    pattern: '/upload/assign',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'music.download': {
    methods: ['PATCH'],
    pattern: '/music/download/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { teamId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'access.combine': {
    methods: ['GET'],
    pattern: '/access/combine',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'art.verify': {
    methods: ['GET'],
    pattern: '/art/verify/:categoryId/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; teamId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { created: boolean; item: any }
    },
  },
  'language.sports.move': {
    methods: ['GET', 'HEAD'],
    pattern: '/language/sports/move',
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
  'tracking.forward': {
    methods: ['POST'],
    pattern: '/tracking/forward',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'import.enable': {
    methods: ['GET'],
    pattern: '/import/enable',
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
  'inventory.activate': {
    methods: ['GET'],
    pattern: '/inventory/activate/:groupId/:itemId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; itemId: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'video.feedback.download': {
    methods: ['GET'],
    pattern: '/video/feedback/download',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'shipment.schedule': {
    methods: ['GET'],
    pattern: '/shipment/schedule/:teamId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'home.backup': {
    methods: ['GET'],
    pattern: '/home/backup',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'feedback.calculate': {
    methods: ['PATCH'],
    pattern: '/feedback/calculate/:groupId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'log.delete': {
    methods: ['PUT'],
    pattern: '/log/delete',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'blog.transfer': {
    methods: ['POST'],
    pattern: '/blog/transfer/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { created: boolean; item: any }
    },
  },
  'finance.patch': {
    methods: ['GET'],
    pattern: '/finance/patch',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'document.social.sync': {
    methods: ['DELETE'],
    pattern: '/document/social/sync/:userId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'review.patch': {
    methods: ['POST'],
    pattern: '/review/patch/:id',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { id: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'payment.like': {
    methods: ['GET'],
    pattern: '/payment/like',
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
  'booking.create': {
    methods: ['POST'],
    pattern: '/booking/create',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'promotion.notification.unfollow': {
    methods: ['POST'],
    pattern: '/promotion/notification/unfollow/:categoryId',
    domain: 'root',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { deleted: boolean; count: number }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type GeneratedRoutes = typeof routes

/**
 * Pre-computed API definition tree
 */
export interface GeneratedApiDefinition {
  message: {
    index: GeneratedRoutes['message.index']
    unsubscribe: GeneratedRoutes['message.unsubscribe']
    project: {
      search: GeneratedRoutes['message.project.search']
    }
  }
  category: {
    publish: GeneratedRoutes['category.publish']
    invoice: {
      calculate: GeneratedRoutes['category.invoice.calculate']
    }
  }
  feedback: {
    review: {
      update: GeneratedRoutes['feedback.review.update']
    }
    game: {
      confirm: GeneratedRoutes['feedback.game.confirm']
    }
    ban: GeneratedRoutes['feedback.ban']
    calculate: GeneratedRoutes['feedback.calculate']
  }
  file: {
    quality: {
      restore: GeneratedRoutes['file.quality.restore']
    }
    follow: GeneratedRoutes['file.follow']
    sports: {
      process: GeneratedRoutes['file.sports.process']
    }
    unfollow: GeneratedRoutes['file.unfollow']
  }
  filter: {
    export: GeneratedRoutes['filter.export']
  }
  import: {
    social: {
      block: GeneratedRoutes['import.social.block']
    }
    duplicate: GeneratedRoutes['import.duplicate']
    report: {
      unpublish: GeneratedRoutes['import.report.unpublish']
    }
    podcast: {
      validate: GeneratedRoutes['import.podcast.validate']
    }
    delete: GeneratedRoutes['import.delete']
    enable: GeneratedRoutes['import.enable']
  }
  chat: {
    unfollow: GeneratedRoutes['chat.unfollow']
    forward: GeneratedRoutes['chat.forward']
    unassign: GeneratedRoutes['chat.unassign']
    export: GeneratedRoutes['chat.export']
  }
  schedule: {
    unpublish: GeneratedRoutes['schedule.unpublish']
    favorite: {
      block: GeneratedRoutes['schedule.favorite.block']
    }
    reject: GeneratedRoutes['schedule.reject']
  }
  shipment: {
    favorite: GeneratedRoutes['shipment.favorite']
    generate: GeneratedRoutes['shipment.generate']
    art: {
      list: GeneratedRoutes['shipment.art.list']
    }
    mute: GeneratedRoutes['shipment.mute']
    join: GeneratedRoutes['shipment.join']
    sports: {
      leave: GeneratedRoutes['shipment.sports.leave']
    }
    schedule: GeneratedRoutes['shipment.schedule']
  }
  pet: {
    ban: GeneratedRoutes['pet.ban']
    cancel: GeneratedRoutes['pet.cancel']
    process: GeneratedRoutes['pet.process']
  }
  search: {
    filter: GeneratedRoutes['search.filter']
    create: GeneratedRoutes['search.create']
    member: {
      destroy: GeneratedRoutes['search.member.destroy']
    }
    validate: GeneratedRoutes['search.validate']
  }
  shop: {
    insert: GeneratedRoutes['shop.insert']
    market: {
      secure: GeneratedRoutes['shop.market.secure']
    }
    index: GeneratedRoutes['shop.index']
    travel: {
      generate: GeneratedRoutes['shop.travel.generate']
    }
  }
  gallery: {
    quality: {
      add: GeneratedRoutes['gallery.quality.add']
    }
    group: GeneratedRoutes['gallery.group']
    split: GeneratedRoutes['gallery.split']
    assign: GeneratedRoutes['gallery.assign']
  }
  offer: {
    category: {
      split: GeneratedRoutes['offer.category.split']
    }
    combine: GeneratedRoutes['offer.combine']
    gallery: {
      bookmark: GeneratedRoutes['offer.gallery.bookmark']
    }
  }
  recipe: {
    portfolio: {
      clone: GeneratedRoutes['recipe.portfolio.clone']
    }
    sort: GeneratedRoutes['recipe.sort']
  }
  authorization: {
    preview: GeneratedRoutes['authorization.preview']
  }
  export: {
    ban: GeneratedRoutes['export.ban']
    toggle: GeneratedRoutes['export.toggle']
    approve: GeneratedRoutes['export.approve']
    protect: GeneratedRoutes['export.protect']
    draft: GeneratedRoutes['export.draft']
  }
  authentication: {
    transfer: GeneratedRoutes['authentication.transfer']
    edit: GeneratedRoutes['authentication.edit']
  }
  wiki: {
    profile: {
      validate: GeneratedRoutes['wiki.profile.validate']
    }
    sync: {
      process: GeneratedRoutes['wiki.sync.process']
    }
    confirm: GeneratedRoutes['wiki.confirm']
    compute: GeneratedRoutes['wiki.compute']
  }
  video: {
    store: GeneratedRoutes['video.store']
    process: GeneratedRoutes['video.process']
    order: {
      upload: GeneratedRoutes['video.order.upload']
    }
    sports: {
      accept: GeneratedRoutes['video.sports.accept']
    }
    edit: GeneratedRoutes['video.edit']
    put: GeneratedRoutes['video.put']
    feedback: {
      download: GeneratedRoutes['video.feedback.download']
    }
  }
  team: {
    deactivate: GeneratedRoutes['team.deactivate']
    blog: {
      add: GeneratedRoutes['team.blog.add']
    }
    document: {
      accept: GeneratedRoutes['team.document.accept']
    }
  }
  weather: {
    leave: GeneratedRoutes['weather.leave']
    approve: GeneratedRoutes['weather.approve']
  }
  history: {
    toggle: GeneratedRoutes['history.toggle']
    validate: GeneratedRoutes['history.validate']
    notification: {
      move: GeneratedRoutes['history.notification.move']
    }
    scroll: GeneratedRoutes['history.scroll']
  }
  task: {
    message: {
      backup: GeneratedRoutes['task.message.backup']
    }
    bookmark: {
      filter: GeneratedRoutes['task.bookmark.filter']
    }
    profile: {
      insert: GeneratedRoutes['task.profile.insert']
    }
  }
  survey: {
    unblock: GeneratedRoutes['survey.unblock']
    lock: GeneratedRoutes['survey.lock']
    refresh: GeneratedRoutes['survey.refresh']
    block: GeneratedRoutes['survey.block']
  }
  sports: {
    payment: {
      filter: GeneratedRoutes['sports.payment.filter']
    }
    download: GeneratedRoutes['sports.download']
    analyze: GeneratedRoutes['sports.analyze']
    order: {
      transform: GeneratedRoutes['sports.order.transform']
    }
  }
  billing: {
    refresh: GeneratedRoutes['billing.refresh']
  }
  admin: {
    workflow: {
      decline: GeneratedRoutes['admin.workflow.decline']
    }
    deactivate: GeneratedRoutes['admin.deactivate']
    home: {
      separate: GeneratedRoutes['admin.home.separate']
    }
  }
  maintenance: {
    sync: GeneratedRoutes['maintenance.sync']
    combine: GeneratedRoutes['maintenance.combine']
    unpublish: GeneratedRoutes['maintenance.unpublish']
    music: {
      export: GeneratedRoutes['maintenance.music.export']
    }
  }
  music: {
    confirm: GeneratedRoutes['music.confirm']
    filter: {
      store: GeneratedRoutes['music.filter.store']
    }
    download: GeneratedRoutes['music.download']
  }
  market: {
    lock: GeneratedRoutes['market.lock']
    schedule: GeneratedRoutes['market.schedule']
  }
  home: {
    show: GeneratedRoutes['home.show']
    unlock: GeneratedRoutes['home.unlock']
    backup: GeneratedRoutes['home.backup']
  }
  backup: {
    sync: GeneratedRoutes['backup.sync']
    workflow: {
      edit: GeneratedRoutes['backup.workflow.edit']
    }
  }
  settings: {
    mute: GeneratedRoutes['settings.mute']
    transform: GeneratedRoutes['settings.transform']
    campaign: {
      paginate: GeneratedRoutes['settings.campaign.paginate']
    }
    get: GeneratedRoutes['settings.get']
  }
  fashion: {
    deal: {
      invite: GeneratedRoutes['fashion.deal.invite']
    }
  }
  security: {
    video: {
      validate: GeneratedRoutes['security.video.validate']
    }
    calculate: GeneratedRoutes['security.calculate']
  }
  community: {
    transform: GeneratedRoutes['community.transform']
    recipe: {
      enable: GeneratedRoutes['community.recipe.enable']
    }
    paginate: GeneratedRoutes['community.paginate']
  }
  geolocation: {
    unsubscribe: GeneratedRoutes['geolocation.unsubscribe']
    payment: {
      list: GeneratedRoutes['geolocation.payment.list']
    }
    project: {
      mute: GeneratedRoutes['geolocation.project.mute']
    }
    lock: GeneratedRoutes['geolocation.lock']
    archive: GeneratedRoutes['geolocation.archive']
  }
  garden: {
    conference: {
      duplicate: GeneratedRoutes['garden.conference.duplicate']
    }
    inventory: {
      refresh: GeneratedRoutes['garden.inventory.refresh']
    }
  }
  bookmark: {
    pricing: {
      export: GeneratedRoutes['bookmark.pricing.export']
    }
    transform: GeneratedRoutes['bookmark.transform']
    create: GeneratedRoutes['bookmark.create']
    forum: {
      confirm: GeneratedRoutes['bookmark.forum.confirm']
    }
  }
  integration: {
    analyze: GeneratedRoutes['integration.analyze']
    schedule: {
      upload: GeneratedRoutes['integration.schedule.upload']
    }
    compute: GeneratedRoutes['integration.compute']
  }
  art: {
    download: GeneratedRoutes['art.download']
    file: {
      ban: GeneratedRoutes['art.file.ban']
    }
    verify: GeneratedRoutes['art.verify']
  }
  discount: {
    disable: GeneratedRoutes['discount.disable']
    transform: GeneratedRoutes['discount.transform']
    ungroup: GeneratedRoutes['discount.ungroup']
  }
  portfolio: {
    project: {
      follow: GeneratedRoutes['portfolio.project.follow']
    }
    archive: GeneratedRoutes['portfolio.archive']
    social: {
      draft: GeneratedRoutes['portfolio.social.draft']
    }
  }
  blog: {
    migrate: GeneratedRoutes['blog.migrate']
    transfer: GeneratedRoutes['blog.transfer']
  }
  audio: {
    cancel: GeneratedRoutes['audio.cancel']
    unlike: GeneratedRoutes['audio.unlike']
    toggle: GeneratedRoutes['audio.toggle']
    restore: GeneratedRoutes['audio.restore']
  }
  member: {
    verify: GeneratedRoutes['member.verify']
    toggle: GeneratedRoutes['member.toggle']
  }
  upload: {
    unblock: GeneratedRoutes['upload.unblock']
    disable: GeneratedRoutes['upload.disable']
    assign: GeneratedRoutes['upload.assign']
  }
  delivery: {
    unsubscribe: GeneratedRoutes['delivery.unsubscribe']
    discount: {
      migrate: GeneratedRoutes['delivery.discount.migrate']
    }
    preview: GeneratedRoutes['delivery.preview']
    paginate: GeneratedRoutes['delivery.paginate']
    filter: GeneratedRoutes['delivery.filter']
    scroll: GeneratedRoutes['delivery.scroll']
    unblock: GeneratedRoutes['delivery.unblock']
  }
  education: {
    activity: {
      leave: GeneratedRoutes['education.activity.leave']
    }
  }
  deal: {
    knowledge: {
      unpublish: GeneratedRoutes['deal.knowledge.unpublish']
    }
    show: GeneratedRoutes['deal.show']
  }
  sync: {
    postpone: GeneratedRoutes['sync.postpone']
    refresh: GeneratedRoutes['sync.refresh']
    unlike: GeneratedRoutes['sync.unlike']
  }
  tracking: {
    task: {
      separate: GeneratedRoutes['tracking.task.separate']
    }
    analyze: GeneratedRoutes['tracking.analyze']
    protect: GeneratedRoutes['tracking.protect']
    unsubscribe: GeneratedRoutes['tracking.unsubscribe']
    appointment: {
      paginate: GeneratedRoutes['tracking.appointment.paginate']
    }
    forward: GeneratedRoutes['tracking.forward']
  }
  library: {
    sync: GeneratedRoutes['library.sync']
    ungroup: GeneratedRoutes['library.ungroup']
    postpone: GeneratedRoutes['library.postpone']
  }
  conference: {
    assign: GeneratedRoutes['conference.assign']
    rating: {
      validate: GeneratedRoutes['conference.rating.validate']
    }
    sync: GeneratedRoutes['conference.sync']
  }
  user: {
    weather: {
      confirm: GeneratedRoutes['user.weather.confirm']
    }
    export: GeneratedRoutes['user.export']
  }
  campaign: {
    draft: GeneratedRoutes['campaign.draft']
  }
  tag: {
    unsubscribe: GeneratedRoutes['tag.unsubscribe']
  }
  coupon: {
    bookmark: GeneratedRoutes['coupon.bookmark']
    unfollow: GeneratedRoutes['coupon.unfollow']
  }
  project: {
    favorite: GeneratedRoutes['project.favorite']
    cancel: GeneratedRoutes['project.cancel']
  }
  document: {
    combine: GeneratedRoutes['document.combine']
    show: GeneratedRoutes['document.show']
    insert: GeneratedRoutes['document.insert']
    preview: GeneratedRoutes['document.preview']
    billing: {
      archive: GeneratedRoutes['document.billing.archive']
    }
    social: {
      sync: GeneratedRoutes['document.social.sync']
    }
  }
  notification: {
    reservation: {
      compute: GeneratedRoutes['notification.reservation.compute']
    }
  }
  appointment: {
    like: GeneratedRoutes['appointment.like']
    preview: GeneratedRoutes['appointment.preview']
  }
  knowledge: {
    share: GeneratedRoutes['knowledge.share']
    schedule: {
      leave: GeneratedRoutes['knowledge.schedule.leave']
    }
  }
  recommendation: {
    import: GeneratedRoutes['recommendation.import']
    label: {
      preview: GeneratedRoutes['recommendation.label.preview']
    }
  }
  language: {
    separate: GeneratedRoutes['language.separate']
    sports: {
      move: GeneratedRoutes['language.sports.move']
    }
  }
  subscription: {
    tag: {
      ban: GeneratedRoutes['subscription.tag.ban']
    }
    feedback: {
      move: GeneratedRoutes['subscription.feedback.move']
    }
  }
  inventory: {
    backup: GeneratedRoutes['inventory.backup']
    activate: GeneratedRoutes['inventory.activate']
  }
  profile: {
    payment: {
      compute: GeneratedRoutes['profile.payment.compute']
    }
    assign: GeneratedRoutes['profile.assign']
    add: GeneratedRoutes['profile.add']
    insert: GeneratedRoutes['profile.insert']
  }
  travel: {
    bookmark: GeneratedRoutes['travel.bookmark']
    pet: {
      favorite: GeneratedRoutes['travel.pet.favorite']
    }
    collaboration: {
      find: GeneratedRoutes['travel.collaboration.find']
    }
    favorite: GeneratedRoutes['travel.favorite']
  }
  comment: {
    get: GeneratedRoutes['comment.get']
    reject: GeneratedRoutes['comment.reject']
    show: GeneratedRoutes['comment.show']
    campaign: {
      merge: GeneratedRoutes['comment.campaign.merge']
    }
    leave: GeneratedRoutes['comment.leave']
  }
  activity: {
    sports: {
      split: GeneratedRoutes['activity.sports.split']
    }
    portfolio: {
      search: GeneratedRoutes['activity.portfolio.search']
    }
    decline: GeneratedRoutes['activity.decline']
  }
  payment: {
    secure: GeneratedRoutes['payment.secure']
    permission: {
      sort: GeneratedRoutes['payment.permission.sort']
    }
    like: GeneratedRoutes['payment.like']
  }
  dashboard: {
    create: GeneratedRoutes['dashboard.create']
    unfollow: GeneratedRoutes['dashboard.unfollow']
    analyze: GeneratedRoutes['dashboard.analyze']
    store: GeneratedRoutes['dashboard.store']
    search: {
      create: GeneratedRoutes['dashboard.search.create']
    }
  }
  invoice: {
    checkout: {
      show: GeneratedRoutes['invoice.checkout.show']
    }
    subscribe: GeneratedRoutes['invoice.subscribe']
    generate: GeneratedRoutes['invoice.generate']
    discount: {
      forward: GeneratedRoutes['invoice.discount.forward']
    }
  }
  forum: {
    confirm: GeneratedRoutes['forum.confirm']
    restore: GeneratedRoutes['forum.restore']
  }
  restaurant: {
    migrate: GeneratedRoutes['restaurant.migrate']
    add: GeneratedRoutes['restaurant.add']
    ban: GeneratedRoutes['restaurant.ban']
    compute: GeneratedRoutes['restaurant.compute']
    separate: GeneratedRoutes['restaurant.separate']
  }
  review: {
    update: GeneratedRoutes['review.update']
    patch: GeneratedRoutes['review.patch']
  }
  analytics: {
    sports: {
      sync: GeneratedRoutes['analytics.sports.sync']
    }
    disable: GeneratedRoutes['analytics.disable']
    user: {
      refresh: GeneratedRoutes['analytics.user.refresh']
    }
  }
  favorite: {
    ungroup: GeneratedRoutes['favorite.ungroup']
  }
  permission: {
    survey: {
      approve: GeneratedRoutes['permission.survey.approve']
    }
    block: GeneratedRoutes['permission.block']
    restore: GeneratedRoutes['permission.restore']
    share: GeneratedRoutes['permission.share']
    restaurant: {
      validate: GeneratedRoutes['permission.restaurant.validate']
    }
  }
  event: {
    post: GeneratedRoutes['event.post']
    favorite: {
      compute: GeneratedRoutes['event.favorite.compute']
    }
    dashboard: {
      sort: GeneratedRoutes['event.dashboard.sort']
    }
  }
  social: {
    unlock: GeneratedRoutes['social.unlock']
    cancel: GeneratedRoutes['social.cancel']
    filter: GeneratedRoutes['social.filter']
  }
  report: {
    get: GeneratedRoutes['report.get']
    label: {
      insert: GeneratedRoutes['report.label.insert']
    }
    mute: GeneratedRoutes['report.mute']
  }
  download: {
    combine: GeneratedRoutes['download.combine']
    preview: GeneratedRoutes['download.preview']
  }
  access: {
    process: GeneratedRoutes['access.process']
    combine: GeneratedRoutes['access.combine']
  }
  collaboration: {
    block: GeneratedRoutes['collaboration.block']
    disable: GeneratedRoutes['collaboration.disable']
    audio: {
      lock: GeneratedRoutes['collaboration.audio.lock']
    }
  }
  reservation: {
    kick: GeneratedRoutes['reservation.kick']
  }
  podcast: {
    shop: {
      migrate: GeneratedRoutes['podcast.shop.migrate']
    }
  }
  booking: {
    cancel: GeneratedRoutes['booking.cancel']
    create: GeneratedRoutes['booking.create']
  }
  cinema: {
    calendar: {
      kick: GeneratedRoutes['cinema.calendar.kick']
    }
    compute: GeneratedRoutes['cinema.compute']
  }
  shipping: {
    favorite: GeneratedRoutes['shipping.favorite']
    index: GeneratedRoutes['shipping.index']
  }
  network: {
    quality: {
      backup: GeneratedRoutes['network.quality.backup']
    }
    sort: GeneratedRoutes['network.sort']
  }
  finance: {
    restore: GeneratedRoutes['finance.restore']
    patch: GeneratedRoutes['finance.patch']
  }
  preferences: {
    disable: GeneratedRoutes['preferences.disable']
    migrate: GeneratedRoutes['preferences.migrate']
  }
  game: {
    draft: GeneratedRoutes['game.draft']
    accept: GeneratedRoutes['game.accept']
  }
  rating: {
    edit: GeneratedRoutes['rating.edit']
  }
  watchlist: {
    category: {
      separate: GeneratedRoutes['watchlist.category.separate']
    }
    compute: GeneratedRoutes['watchlist.compute']
  }
  cart: {
    duplicate: GeneratedRoutes['cart.duplicate']
  }
  product: {
    enable: GeneratedRoutes['product.enable']
    mute: GeneratedRoutes['product.mute']
  }
  role: {
    relocate: GeneratedRoutes['role.relocate']
  }
  pricing: {
    knowledge: {
      unfollow: GeneratedRoutes['pricing.knowledge.unfollow']
    }
  }
  log: {
    weather: {
      assign: GeneratedRoutes['log.weather.assign']
    }
    delete: GeneratedRoutes['log.delete']
  }
  media: {
    combine: GeneratedRoutes['media.combine']
    coupon: {
      unassign: GeneratedRoutes['media.coupon.unassign']
    }
  }
  service: {
    scroll: GeneratedRoutes['service.scroll']
  }
  checkout: {
    subscribe: GeneratedRoutes['checkout.subscribe']
  }
  promotion: {
    notification: {
      unfollow: GeneratedRoutes['promotion.notification.unfollow']
    }
  }
}

export const generatedRegistry = {
  routes,
  $tree: {} as GeneratedApiDefinition,
}
