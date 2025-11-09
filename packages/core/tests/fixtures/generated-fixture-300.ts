import { AdonisEndpoint } from '../../src/client/types/types.ts'

const placeholder: any = {}

export const generatedRegistry = {
  'education.travel.delete': {
    methods: ['GET'],
    pattern: '/education/travel/delete',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'bookmark.export': {
    methods: ['GET'],
    pattern: '/bookmark/export/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { url: string; filename: string }
    },
  },
  'image.patch': {
    methods: ['POST'],
    pattern: '/image/patch/:teamId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'pet.post': {
    methods: ['PUT'],
    pattern: '/pet/post',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'wiki.unpublish': {
    methods: ['POST'],
    pattern: '/wiki/unpublish',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'appointment.restore': {
    methods: ['GET'],
    pattern: '/appointment/restore',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'music.migrate': {
    methods: ['PUT'],
    pattern: '/music/migrate',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'audio.process': {
    methods: ['GET'],
    pattern: '/audio/process/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'report.put': {
    methods: ['PUT'],
    pattern: '/report/put',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'billing.workflow.archive': {
    methods: ['PATCH'],
    pattern: '/billing/workflow/archive/:userId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: any
    },
  },
  'collaboration.search.paginate': {
    methods: ['GET'],
    pattern: '/collaboration/search/paginate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: any
    },
  },
  'profile.add': {
    methods: ['GET'],
    pattern: '/profile/add/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { status: string; message: string }
    },
  },
  'restaurant.approve': {
    methods: ['POST'],
    pattern: '/restaurant/approve',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { results: any[]; pagination: any }
    },
  },
  'discount.decline': {
    methods: ['GET'],
    pattern: '/discount/decline/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'maintenance.sync': {
    methods: ['POST'],
    pattern: '/maintenance/sync',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'security.decline': {
    methods: ['DELETE'],
    pattern: '/security/decline',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'reservation.sync': {
    methods: ['GET'],
    pattern: '/reservation/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'invoice.add': {
    methods: ['DELETE'],
    pattern: '/invoice/add',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { data: any[]; total: number }
    },
  },
  'profile.validate': {
    methods: ['PUT'],
    pattern: '/profile/validate',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'recommendation.switch': {
    methods: ['GET'],
    pattern: '/recommendation/switch',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { url: string; filename: string }
    },
  },
  'wiki.reject': {
    methods: ['GET'],
    pattern: '/wiki/reject/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'inventory.unfollow': {
    methods: ['GET'],
    pattern: '/inventory/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'geolocation.calculate': {
    methods: ['DELETE'],
    pattern: '/geolocation/calculate/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'media.maintenance.subscribe': {
    methods: ['DELETE'],
    pattern: '/media/maintenance/subscribe/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'offer.subscribe': {
    methods: ['POST'],
    pattern: '/offer/subscribe',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'social.enable': {
    methods: ['GET', 'HEAD'],
    pattern: '/social/enable',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'member.update': {
    methods: ['PATCH'],
    pattern: '/member/update/:teamId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'campaign.get': {
    methods: ['POST'],
    pattern: '/campaign/get/:groupId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { groupId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'order.add': {
    methods: ['PATCH'],
    pattern: '/order/add',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'podcast.export.postpone': {
    methods: ['GET'],
    pattern: '/podcast/export/postpone/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'travel.find': {
    methods: ['GET'],
    pattern: '/travel/find',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'schedule.pricing.verify': {
    methods: ['PUT'],
    pattern: '/schedule/pricing/verify/:id',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'offer.join': {
    methods: ['GET', 'HEAD'],
    pattern: '/offer/join/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { id: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'integration.music.list': {
    methods: ['POST'],
    pattern: '/integration/music/list',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'pet.home.accept': {
    methods: ['GET'],
    pattern: '/pet/home/accept',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { created: boolean; item: any }
    },
  },
  'portfolio.ban': {
    methods: ['GET'],
    pattern: '/portfolio/ban',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { token: string; expiresAt: string }
    },
  },
  'forum.offer.search': {
    methods: ['POST'],
    pattern: '/forum/offer/search/:entityId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: {}
      response: { success: boolean }
    },
  },
  'service.delete': {
    methods: ['POST'],
    pattern: '/service/delete/:groupId',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'workflow.pet.follow': {
    methods: ['GET'],
    pattern: '/workflow/pet/follow/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'travel.analyze': {
    methods: ['PUT'],
    pattern: '/travel/analyze',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'billing.transform': {
    methods: ['POST'],
    pattern: '/billing/transform/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: any
    },
  },
  'subscription.split': {
    methods: ['POST'],
    pattern: '/subscription/split',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'inventory.cinema.verify': {
    methods: ['POST'],
    pattern: '/inventory/cinema/verify',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'social.compute': {
    methods: ['GET'],
    pattern: '/social/compute/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'market.activate': {
    methods: ['GET'],
    pattern: '/market/activate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'recipe.combine': {
    methods: ['GET'],
    pattern: '/recipe/combine',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'role.show': {
    methods: ['GET'],
    pattern: '/role/show/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { status: string; message: string }
    },
  },
  'offer.survey.add': {
    methods: ['POST'],
    pattern: '/offer/survey/add',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'travel.disable': {
    methods: ['POST'],
    pattern: '/travel/disable/:teamId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { teamId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { status: string; message: string }
    },
  },
  'shop.message.archive': {
    methods: ['PATCH'],
    pattern: '/shop/message/archive/:entityId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'event.bookmark': {
    methods: ['DELETE'],
    pattern: '/event/bookmark',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'garden.draft': {
    methods: ['DELETE'],
    pattern: '/garden/draft/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'image.transfer': {
    methods: ['POST'],
    pattern: '/image/transfer/:entityId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'activity.social.draft': {
    methods: ['GET'],
    pattern: '/activity/social/draft/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'language.block': {
    methods: ['GET'],
    pattern: '/language/block/:itemId/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; teamId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'booking.store': {
    methods: ['DELETE'],
    pattern: '/booking/store/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: any
    },
  },
  'authorization.move': {
    methods: ['GET'],
    pattern: '/authorization/move',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'game.member.subscribe': {
    methods: ['GET'],
    pattern: '/game/member/subscribe',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { data: any[]; total: number }
    },
  },
  'game.publish': {
    methods: ['GET'],
    pattern: '/game/publish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'pricing.show': {
    methods: ['DELETE'],
    pattern: '/pricing/show/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'download.unassign': {
    methods: ['GET'],
    pattern: '/download/unassign/:itemId/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; resourceId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { settings: any; preferences: any }
    },
  },
  'coupon.kick': {
    methods: ['DELETE'],
    pattern: '/coupon/kick',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'role.settings.cancel': {
    methods: ['GET'],
    pattern: '/role/settings/cancel',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { token: string; expiresAt: string }
    },
  },
  'permission.lock': {
    methods: ['GET'],
    pattern: '/permission/lock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'discount.language.switch': {
    methods: ['GET'],
    pattern: '/discount/language/switch/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'feedback.gallery.sync': {
    methods: ['GET'],
    pattern: '/feedback/gallery/sync/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'user.post': {
    methods: ['PATCH'],
    pattern: '/user/post/:id',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: { id: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'fashion.show': {
    methods: ['GET'],
    pattern: '/fashion/show',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'subscription.message.paginate': {
    methods: ['PATCH'],
    pattern: '/subscription/message/paginate/:id',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'dashboard.protect': {
    methods: ['GET'],
    pattern: '/dashboard/protect/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'review.bookmark': {
    methods: ['GET'],
    pattern: '/review/bookmark',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'reservation.comment.follow': {
    methods: ['PUT'],
    pattern: '/reservation/comment/follow/:resourceId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { resourceId: string; entityId: string }
      paramsTuple: [string, string]
      query: { minPrice?: number; maxPrice?: number }
      response: { data: any[]; total: number }
    },
  },
  'booking.clone': {
    methods: ['GET'],
    pattern: '/booking/clone',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'workflow.switch': {
    methods: ['GET'],
    pattern: '/workflow/switch',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'download.clone': {
    methods: ['GET'],
    pattern: '/download/clone',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'download.publish': {
    methods: ['GET'],
    pattern: '/download/publish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { settings: any; preferences: any }
    },
  },
  'gallery.workflow.secure': {
    methods: ['GET'],
    pattern: '/gallery/workflow/secure',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'delivery.portfolio.copy': {
    methods: ['GET'],
    pattern: '/delivery/portfolio/copy',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { created: boolean; item: any }
    },
  },
  'settings.forward': {
    methods: ['POST'],
    pattern: '/settings/forward',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { url: string; filename: string }
    },
  },
  'category.draft': {
    methods: ['GET'],
    pattern: '/category/draft',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'inventory.verify': {
    methods: ['GET'],
    pattern: '/inventory/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'label.product.process': {
    methods: ['POST'],
    pattern: '/label/product/process',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'integration.collaboration.ban': {
    methods: ['PUT'],
    pattern: '/integration/collaboration/ban',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'music.shipping.show': {
    methods: ['PATCH'],
    pattern: '/music/shipping/show',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: {}
      response: { settings: any; preferences: any }
    },
  },
  'access.deactivate': {
    methods: ['DELETE'],
    pattern: '/access/deactivate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'comment.knowledge.reject': {
    methods: ['GET'],
    pattern: '/comment/knowledge/reject',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'feedback.delete': {
    methods: ['DELETE'],
    pattern: '/feedback/delete',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { created: boolean; item: any }
    },
  },
  'task.blog.join': {
    methods: ['GET'],
    pattern: '/task/blog/join/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'comment.search': {
    methods: ['GET', 'HEAD'],
    pattern: '/comment/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'watchlist.market.verify': {
    methods: ['PUT'],
    pattern: '/watchlist/market/verify',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'image.preview': {
    methods: ['POST'],
    pattern: '/image/preview/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: any
    },
  },
  'conference.calculate': {
    methods: ['GET'],
    pattern: '/conference/calculate/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'service.unpublish': {
    methods: ['GET'],
    pattern: '/service/unpublish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'promotion.maintenance.patch': {
    methods: ['PUT'],
    pattern: '/promotion/maintenance/patch/:itemId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'favorite.service.duplicate': {
    methods: ['PUT'],
    pattern: '/favorite/service/duplicate/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: {}
      response: { settings: any; preferences: any }
    },
  },
  'invoice.import': {
    methods: ['POST'],
    pattern: '/invoice/import/:id',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { id: string }
      paramsTuple: [string]
      query: {}
      response: any
    },
  },
  'network.draft': {
    methods: ['PUT'],
    pattern: '/network/draft/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { success: boolean }
    },
  },
  'task.block': {
    methods: ['GET'],
    pattern: '/task/block',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'image.duplicate': {
    methods: ['POST'],
    pattern: '/image/duplicate',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { id: string; name: string }
    },
  },
  'billing.download': {
    methods: ['GET'],
    pattern: '/billing/download',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'cinema.separate': {
    methods: ['GET'],
    pattern: '/cinema/separate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'permission.decline': {
    methods: ['POST'],
    pattern: '/permission/decline/:id',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { id: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'portfolio.restore': {
    methods: ['PUT'],
    pattern: '/portfolio/restore/:entityId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { entityId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { profile: any; permissions: string[] }
    },
  },
  'art.edit': {
    methods: ['GET'],
    pattern: '/art/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'reservation.store': {
    methods: ['GET'],
    pattern: '/reservation/store/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'history.search.split': {
    methods: ['POST'],
    pattern: '/history/search/split',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'game.store': {
    methods: ['POST'],
    pattern: '/game/store/:id',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'shipping.geolocation.download': {
    methods: ['GET'],
    pattern: '/shipping/geolocation/download/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { profile: any; permissions: string[] }
    },
  },
  'tag.unassign': {
    methods: ['DELETE'],
    pattern: '/tag/unassign',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'search.follow': {
    methods: ['POST'],
    pattern: '/search/follow',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'history.merge': {
    methods: ['POST'],
    pattern: '/history/merge',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'geolocation.schedule': {
    methods: ['GET', 'HEAD'],
    pattern: '/geolocation/schedule',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { updated: boolean; changes: any }
    },
  },
  'cart.unmute': {
    methods: ['POST'],
    pattern: '/cart/unmute',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'quality.lock': {
    methods: ['GET'],
    pattern: '/quality/lock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { status: string; message: string }
    },
  },
  'project.task.search': {
    methods: ['GET'],
    pattern: '/project/task/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'admin.like': {
    methods: ['DELETE'],
    pattern: '/admin/like/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { created: boolean; item: any }
    },
  },
  'member.toggle': {
    methods: ['GET'],
    pattern: '/member/toggle',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'survey.generate': {
    methods: ['POST'],
    pattern: '/survey/generate',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'knowledge.assign': {
    methods: ['POST'],
    pattern: '/knowledge/assign',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'deal.compute': {
    methods: ['GET', 'HEAD'],
    pattern: '/deal/compute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'subscription.chat.unmute': {
    methods: ['PATCH'],
    pattern: '/subscription/chat/unmute',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'bookmark.generate': {
    methods: ['POST'],
    pattern: '/bookmark/generate/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'subscription.knowledge.create': {
    methods: ['GET'],
    pattern: '/subscription/knowledge/create/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'review.separate': {
    methods: ['PATCH'],
    pattern: '/review/separate/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'recommendation.workflow.sync': {
    methods: ['POST'],
    pattern: '/recommendation/workflow/sync/:id',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { id: string }
      paramsTuple: [string]
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'watchlist.conference.scroll': {
    methods: ['DELETE'],
    pattern: '/watchlist/conference/scroll/:itemId/:groupId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string; groupId: string }
      paramsTuple: [string, string]
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'category.portfolio.accept': {
    methods: ['DELETE'],
    pattern: '/category/portfolio/accept/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'comment.combine': {
    methods: ['POST'],
    pattern: '/comment/combine/:categoryId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { categoryId: string; entityId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'travel.ungroup': {
    methods: ['GET'],
    pattern: '/travel/ungroup/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'export.sync': {
    methods: ['GET', 'HEAD'],
    pattern: '/export/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'network.import': {
    methods: ['GET'],
    pattern: '/network/import/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'deal.search.postpone': {
    methods: ['GET'],
    pattern: '/deal/search/postpone',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: any
    },
  },
  'user.integration.protect': {
    methods: ['DELETE'],
    pattern: '/user/integration/protect/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'travel.member.duplicate': {
    methods: ['DELETE'],
    pattern: '/travel/member/duplicate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'library.transfer': {
    methods: ['GET', 'HEAD'],
    pattern: '/library/transfer',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'upload.unlike': {
    methods: ['GET', 'HEAD'],
    pattern: '/upload/unlike',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'dashboard.split': {
    methods: ['GET'],
    pattern: '/dashboard/split',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'pricing.follow': {
    methods: ['GET'],
    pattern: '/pricing/follow/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'sync.preview': {
    methods: ['POST'],
    pattern: '/sync/preview',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { data: any[]; total: number }
    },
  },
  'education.forward': {
    methods: ['GET'],
    pattern: '/education/forward',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { settings: any; preferences: any }
    },
  },
  'favorite.unlock': {
    methods: ['PUT'],
    pattern: '/favorite/unlock',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'authorization.verify': {
    methods: ['GET'],
    pattern: '/authorization/verify',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'tracking.unblock': {
    methods: ['PATCH'],
    pattern: '/tracking/unblock',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'activity.language.ungroup': {
    methods: ['POST'],
    pattern: '/activity/language/ungroup',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { success: boolean }
    },
  },
  'wiki.art.export': {
    methods: ['GET', 'HEAD'],
    pattern: '/wiki/art/export',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'authorization.preferences.lock': {
    methods: ['PUT'],
    pattern: '/authorization/preferences/lock',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'user.upload.sync': {
    methods: ['PUT'],
    pattern: '/user/upload/sync',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'file.preferences.assign': {
    methods: ['GET'],
    pattern: '/file/preferences/assign/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'profile.forum.store': {
    methods: ['GET'],
    pattern: '/profile/forum/store/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'podcast.calculate': {
    methods: ['DELETE'],
    pattern: '/podcast/calculate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'discount.workflow.verify': {
    methods: ['PUT'],
    pattern: '/discount/workflow/verify',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'member.add': {
    methods: ['POST'],
    pattern: '/member/add',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'analytics.watchlist.unsubscribe': {
    methods: ['PATCH'],
    pattern: '/analytics/watchlist/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: {}
      paramsTuple: []
      query: {}
      response: any
    },
  },
  'image.video.invite': {
    methods: ['GET'],
    pattern: '/image/video/invite/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'language.sync': {
    methods: ['GET'],
    pattern: '/language/sync',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'security.settings.relocate': {
    methods: ['PUT'],
    pattern: '/security/settings/relocate',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'authorization.paginate': {
    methods: ['DELETE'],
    pattern: '/authorization/paginate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'filter.member.enable': {
    methods: ['PUT'],
    pattern: '/filter/member/enable',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'backup.group': {
    methods: ['GET', 'HEAD'],
    pattern: '/backup/group/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'history.library.schedule': {
    methods: ['POST'],
    pattern: '/history/library/schedule/:teamId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { teamId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'pricing.generate': {
    methods: ['GET'],
    pattern: '/pricing/generate/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'search.search': {
    methods: ['PATCH'],
    pattern: '/search/search/:userId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { userId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'garden.shipment.activate': {
    methods: ['GET'],
    pattern: '/garden/shipment/activate/:teamId/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string; id: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'cart.publish': {
    methods: ['DELETE'],
    pattern: '/cart/publish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'backup.generate': {
    methods: ['POST'],
    pattern: '/backup/generate/:itemId',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: { itemId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { data: any[]; total: number }
    },
  },
  'reservation.create': {
    methods: ['PATCH'],
    pattern: '/reservation/create/:userId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { userId: string }
      paramsTuple: [string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'settings.shipment.draft': {
    methods: ['POST'],
    pattern: '/settings/shipment/draft',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'media.lock': {
    methods: ['POST'],
    pattern: '/media/lock',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { results: any[]; pagination: any }
    },
  },
  'service.reject': {
    methods: ['POST'],
    pattern: '/service/reject/:id',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: { id: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'conference.delete': {
    methods: ['GET'],
    pattern: '/conference/delete',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: any
    },
  },
  'recommendation.decline': {
    methods: ['PATCH'],
    pattern: '/recommendation/decline',
    tokens: [],
    types: placeholder as {
      body: { amount: number; currency?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { success: boolean }
    },
  },
  'activity.search': {
    methods: ['POST'],
    pattern: '/activity/search',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { status: string; message: string }
    },
  },
  'report.store': {
    methods: ['GET'],
    pattern: '/report/store/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { url: string; filename: string }
    },
  },
  'tag.activity.postpone': {
    methods: ['GET'],
    pattern: '/tag/activity/postpone/:entityId/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string; id: string }
      paramsTuple: [string, string]
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'order.migrate': {
    methods: ['POST'],
    pattern: '/order/migrate',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'game.calculate': {
    methods: ['GET'],
    pattern: '/game/calculate/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'offer.workflow.unblock': {
    methods: ['GET'],
    pattern: '/offer/workflow/unblock',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { data: any[]; total: number }
    },
  },
  'integration.cart.search': {
    methods: ['POST'],
    pattern: '/integration/cart/search/:teamId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { teamId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'conference.transfer': {
    methods: ['PATCH'],
    pattern: '/conference/transfer',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { url: string; filename: string }
    },
  },
  'delivery.add': {
    methods: ['GET'],
    pattern: '/delivery/add/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'maintenance.rating.bookmark': {
    methods: ['PATCH'],
    pattern: '/maintenance/rating/bookmark',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { created: boolean; item: any }
    },
  },
  'campaign.move': {
    methods: ['GET', 'HEAD'],
    pattern: '/campaign/move',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { id: string; name: string }
    },
  },
  'project.fashion.put': {
    methods: ['GET'],
    pattern: '/project/fashion/put',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { url: string; filename: string }
    },
  },
  'message.post': {
    methods: ['GET'],
    pattern: '/message/post',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'blog.unpublish': {
    methods: ['POST'],
    pattern: '/blog/unpublish',
    tokens: [],
    types: placeholder as {
      body: { file: Blob }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { status: string; message: string }
    },
  },
  'security.patch': {
    methods: ['PUT'],
    pattern: '/security/patch',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'home.favorite': {
    methods: ['GET'],
    pattern: '/home/favorite',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { data: any[]; total: number }
    },
  },
  'social.upload': {
    methods: ['GET'],
    pattern: '/social/upload',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'inventory.unmute': {
    methods: ['GET'],
    pattern: '/inventory/unmute',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'category.music.search': {
    methods: ['DELETE'],
    pattern: '/category/music/search',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: any
    },
  },
  'favorite.split': {
    methods: ['POST'],
    pattern: '/favorite/split/:id/:groupId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { id: string; groupId: string }
      paramsTuple: [string, string]
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'portfolio.follow': {
    methods: ['GET'],
    pattern: '/portfolio/follow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'maintenance.block': {
    methods: ['POST'],
    pattern: '/maintenance/block',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { success: boolean }
    },
  },
  'tracking.backup.download': {
    methods: ['GET'],
    pattern: '/tracking/backup/download/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'game.disable': {
    methods: ['DELETE'],
    pattern: '/game/disable',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { url: string; filename: string }
    },
  },
  'product.shop.create': {
    methods: ['POST'],
    pattern: '/product/shop/create/:itemId',
    tokens: [],
    types: placeholder as {
      body: { content: string; tags?: string[] }
      params: { itemId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'comment.recommendation.refresh': {
    methods: ['GET'],
    pattern: '/comment/recommendation/refresh/:groupId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { url: string; filename: string }
    },
  },
  'social.cinema.block': {
    methods: ['GET'],
    pattern: '/social/cinema/block',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { created: boolean; item: any }
    },
  },
  'weather.cancel': {
    methods: ['PATCH'],
    pattern: '/weather/cancel',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'maintenance.join': {
    methods: ['POST'],
    pattern: '/maintenance/join',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'shop.music.leave': {
    methods: ['POST'],
    pattern: '/shop/music/leave/:userId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { userId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { id: string; name: string }
    },
  },
  'watchlist.paginate': {
    methods: ['POST'],
    pattern: '/watchlist/paginate',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'checkout.subscribe': {
    methods: ['PUT'],
    pattern: '/checkout/subscribe/:itemId',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { created: boolean; item: any }
    },
  },
  'social.show': {
    methods: ['POST'],
    pattern: '/social/show',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'tracking.enable': {
    methods: ['GET'],
    pattern: '/tracking/enable/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'message.music.show': {
    methods: ['PATCH'],
    pattern: '/message/music/show',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { success: boolean }
    },
  },
  'service.lock': {
    methods: ['GET', 'HEAD'],
    pattern: '/service/lock/:resourceId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'sports.archive': {
    methods: ['POST'],
    pattern: '/sports/archive/:groupId',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'product.ban': {
    methods: ['GET'],
    pattern: '/product/ban/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'authentication.payment.list': {
    methods: ['POST'],
    pattern: '/authentication/payment/list',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'analytics.show': {
    methods: ['POST'],
    pattern: '/analytics/show/:id',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { id: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { items: any[]; categories: string[] }
    },
  },
  'invoice.join': {
    methods: ['POST'],
    pattern: '/invoice/join',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { id: string; name: string }
    },
  },
  'podcast.generate': {
    methods: ['POST'],
    pattern: '/podcast/generate',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: any
    },
  },
  'reservation.download': {
    methods: ['POST'],
    pattern: '/reservation/download',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { items: any[]; categories: string[] }
    },
  },
  'feedback.scroll': {
    methods: ['DELETE'],
    pattern: '/feedback/scroll',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'review.analyze': {
    methods: ['GET'],
    pattern: '/review/analyze',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { data: any[]; total: number }
    },
  },
  'label.archive': {
    methods: ['GET'],
    pattern: '/label/archive',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'profile.unlock': {
    methods: ['POST'],
    pattern: '/profile/unlock/:groupId',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: { groupId: string }
      paramsTuple: [string]
      query: { sort?: string; order?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'survey.postpone': {
    methods: ['PATCH'],
    pattern: '/survey/postpone',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: {}
      response: { items: any[]; categories: string[] }
    },
  },
  'checkout.unlike': {
    methods: ['POST'],
    pattern: '/checkout/unlike',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { deleted: boolean; count: number }
    },
  },
  'payment.leave': {
    methods: ['GET'],
    pattern: '/payment/leave',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'video.bookmark.sync': {
    methods: ['POST'],
    pattern: '/video/bookmark/sync',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { data: any[]; total: number }
    },
  },
  'integration.task.deactivate': {
    methods: ['POST'],
    pattern: '/integration/task/deactivate',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { url: string; filename: string }
    },
  },
  'sync.home.generate': {
    methods: ['DELETE'],
    pattern: '/sync/home/generate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'quality.destroy': {
    methods: ['PATCH'],
    pattern: '/quality/destroy',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'integration.history.bookmark': {
    methods: ['POST'],
    pattern: '/integration/history/bookmark',
    tokens: [],
    types: placeholder as {
      body: { startDate: string; endDate: string }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { status: string; message: string }
    },
  },
  'media.invite': {
    methods: ['POST'],
    pattern: '/media/invite',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'game.collaboration.preview': {
    methods: ['PATCH'],
    pattern: '/game/collaboration/preview',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: {}
      response: { url: string; filename: string }
    },
  },
  'shop.refresh': {
    methods: ['GET'],
    pattern: '/shop/refresh',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { data: any[]; total: number }
    },
  },
  'knowledge.ban': {
    methods: ['GET'],
    pattern: '/knowledge/ban',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { id: string; name: string }
    },
  },
  'education.inventory.kick': {
    methods: ['PATCH'],
    pattern: '/education/inventory/kick/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: { resourceId: string }
      paramsTuple: [string]
      query: {}
      response: { token: string; expiresAt: string }
    },
  },
  'geolocation.travel.remove': {
    methods: ['PUT'],
    pattern: '/geolocation/travel/remove',
    tokens: [],
    types: placeholder as {
      body: { token: string; expiresAt?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'discount.post': {
    methods: ['GET'],
    pattern: '/discount/post',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'pricing.approve': {
    methods: ['GET'],
    pattern: '/pricing/approve',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: { id: string; name: string }
    },
  },
  'appointment.restaurant.restore': {
    methods: ['GET'],
    pattern: '/appointment/restaurant/restore',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'portfolio.copy': {
    methods: ['DELETE'],
    pattern: '/portfolio/copy',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'export.scroll': {
    methods: ['GET'],
    pattern: '/export/scroll',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { status: string; message: string }
    },
  },
  'wiki.post': {
    methods: ['POST'],
    pattern: '/wiki/post/:teamId',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: { teamId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { success: boolean }
    },
  },
  'authentication.unpublish': {
    methods: ['GET'],
    pattern: '/authentication/unpublish',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'pricing.store': {
    methods: ['GET'],
    pattern: '/pricing/store/:categoryId/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string; teamId: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { data: any[]; total: number }
    },
  },
  'invoice.preferences.assign': {
    methods: ['GET'],
    pattern: '/invoice/preferences/assign',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'role.unsubscribe': {
    methods: ['POST'],
    pattern: '/role/unsubscribe/:itemId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { itemId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { settings: any; preferences: any }
    },
  },
  'search.list': {
    methods: ['POST'],
    pattern: '/search/list',
    tokens: [],
    types: placeholder as {
      body: { settings: Record<string, any> }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { profile: any; permissions: string[] }
    },
  },
  'sync.unpublish': {
    methods: ['PATCH'],
    pattern: '/sync/unpublish/:groupId/:userId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { groupId: string; userId: string }
      paramsTuple: [string, string]
      query: { limit?: number; page?: number }
      response: { updated: boolean; changes: any }
    },
  },
  'sync.patch': {
    methods: ['DELETE'],
    pattern: '/sync/patch',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { deleted: boolean; count: number }
    },
  },
  'subscription.discount.analyze': {
    methods: ['GET'],
    pattern: '/subscription/discount/analyze/:userId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string }
      paramsTuple: [string]
      query: { format?: string; locale?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'shipment.secure': {
    methods: ['GET'],
    pattern: '/shipment/secure',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { success: boolean }
    },
  },
  'wiki.booking.activate': {
    methods: ['POST'],
    pattern: '/wiki/booking/activate',
    tokens: [],
    types: placeholder as {
      body: { userId: string; permissions: string[] }
      params: {}
      paramsTuple: []
      query: { minPrice?: number; maxPrice?: number }
      response: { profile: any; permissions: string[] }
    },
  },
  'pricing.enable': {
    methods: ['POST'],
    pattern: '/pricing/enable/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { category?: string; tags?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'conference.refresh': {
    methods: ['DELETE'],
    pattern: '/conference/refresh',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'security.sync.update': {
    methods: ['GET'],
    pattern: '/security/sync/update',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { profile: any; permissions: string[] }
    },
  },
  'rating.accept': {
    methods: ['GET', 'HEAD'],
    pattern: '/rating/accept',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { url: string; filename: string }
    },
  },
  'sync.leave': {
    methods: ['PATCH'],
    pattern: '/sync/leave/:groupId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: { groupId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'project.follow': {
    methods: ['GET'],
    pattern: '/project/follow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'admin.generate': {
    methods: ['GET'],
    pattern: '/admin/generate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { id: string; name: string }
    },
  },
  'settings.show': {
    methods: ['GET'],
    pattern: '/settings/show/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { teamId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { results: any[]; pagination: any }
    },
  },
  'booking.subscription.group': {
    methods: ['GET'],
    pattern: '/booking/subscription/group',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'conference.art.restore': {
    methods: ['POST'],
    pattern: '/conference/art/restore',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: { data: any[]; total: number }
    },
  },
  'coupon.toggle': {
    methods: ['POST'],
    pattern: '/coupon/toggle/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { url: string; filename: string }
    },
  },
  'video.unfollow': {
    methods: ['GET'],
    pattern: '/video/unfollow',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { id: string; name: string }
    },
  },
  'collaboration.conference.relocate': {
    methods: ['GET'],
    pattern: '/collaboration/conference/relocate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { metrics: any; charts: any[] }
    },
  },
  'subscription.duplicate': {
    methods: ['DELETE'],
    pattern: '/subscription/duplicate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: any
    },
  },
  'art.collaboration.forward': {
    methods: ['POST'],
    pattern: '/art/collaboration/forward',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { status: string; message: string }
    },
  },
  'geolocation.video.unassign': {
    methods: ['GET'],
    pattern: '/geolocation/video/unassign',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
  'language.search': {
    methods: ['GET'],
    pattern: '/language/search/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { metrics: any; charts: any[] }
    },
  },
  'promotion.calendar.bookmark': {
    methods: ['POST'],
    pattern: '/promotion/calendar/bookmark',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { items: any[]; categories: string[] }
    },
  },
  'history.log.block': {
    methods: ['DELETE'],
    pattern: '/history/log/block/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { limit?: number; page?: number }
      response: { settings: any; preferences: any }
    },
  },
  'weather.upload.post': {
    methods: ['GET'],
    pattern: '/weather/upload/post',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { items: any[]; categories: string[] }
    },
  },
  'image.edit': {
    methods: ['GET', 'HEAD'],
    pattern: '/image/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { success: boolean }
    },
  },
  'geolocation.show': {
    methods: ['GET'],
    pattern: '/geolocation/show',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'sync.bookmark': {
    methods: ['GET'],
    pattern: '/sync/bookmark',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { success: boolean }
    },
  },
  'geolocation.profile.sort': {
    methods: ['PUT'],
    pattern: '/geolocation/profile/sort',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { success: boolean }
    },
  },
  'survey.accept': {
    methods: ['POST'],
    pattern: '/survey/accept/:entityId',
    tokens: [],
    types: placeholder as {
      body: { filters: any[]; options?: any }
      params: { entityId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { deleted: boolean; count: number }
    },
  },
  'community.post': {
    methods: ['GET'],
    pattern: '/community/post',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: { results: any[]; pagination: any }
    },
  },
  'sports.assign': {
    methods: ['PUT'],
    pattern: '/sports/assign/:resourceId',
    tokens: [],
    types: placeholder as {
      body: { coordinates: [number, number] }
      params: { resourceId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'offer.backup': {
    methods: ['GET'],
    pattern: '/offer/backup',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { limit?: number; page?: number }
      response: { created: boolean; item: any }
    },
  },
  'preferences.cinema.destroy': {
    methods: ['GET'],
    pattern: '/preferences/cinema/destroy/:userId/:id',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { userId: string; id: string }
      paramsTuple: [string, string]
      query: { active?: boolean; archived?: boolean }
      response: { deleted: boolean; count: number }
    },
  },
  'knowledge.unsubscribe': {
    methods: ['POST'],
    pattern: '/knowledge/unsubscribe',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { id: string; name: string }
    },
  },
  'tag.team.transfer': {
    methods: ['POST'],
    pattern: '/tag/team/transfer',
    tokens: [],
    types: placeholder as {
      body: { name: string; email: string }
      params: {}
      paramsTuple: []
      query: { category?: string; tags?: string[] }
      response: { results: any[]; pagination: any }
    },
  },
  'billing.permission.put': {
    methods: ['GET'],
    pattern: '/billing/permission/put',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { id: string; name: string }
    },
  },
  'maintenance.pricing.add': {
    methods: ['GET'],
    pattern: '/maintenance/pricing/add',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { format?: string; locale?: string }
      response: any
    },
  },
  'upload.home.combine': {
    methods: ['GET'],
    pattern: '/upload/home/combine',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { startDate?: string; endDate?: string }
      response: any
    },
  },
  'inventory.disable': {
    methods: ['GET'],
    pattern: '/inventory/disable/:resourceId/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { resourceId: string; categoryId: string }
      paramsTuple: [string, string]
      query: { category?: string; tags?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'filter.campaign.backup': {
    methods: ['GET'],
    pattern: '/filter/campaign/backup/:groupId/:teamId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { groupId: string; teamId: string }
      paramsTuple: [string, string]
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'bookmark.mute': {
    methods: ['POST'],
    pattern: '/bookmark/mute',
    tokens: [],
    types: placeholder as {
      body: { data: any; metadata?: any }
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { id: string; name: string }
    },
  },
  'social.export': {
    methods: ['POST'],
    pattern: '/social/export/:userId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { userId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { updated: boolean; changes: any }
    },
  },
  'cart.appointment.add': {
    methods: ['GET', 'HEAD'],
    pattern: '/cart/appointment/add/:itemId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { itemId: string }
      paramsTuple: [string]
      query: { startDate?: string; endDate?: string }
      response: { token: string; expiresAt: string }
    },
  },
  'authentication.cancel': {
    methods: ['GET', 'HEAD'],
    pattern: '/authentication/cancel',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { profile: any; permissions: string[] }
    },
  },
  'art.put': {
    methods: ['PATCH'],
    pattern: '/art/put/:teamId/:entityId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { teamId: string; entityId: string }
      paramsTuple: [string, string]
      query: { search?: string; filter?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'bookmark.invoice.move': {
    methods: ['PATCH'],
    pattern: '/bookmark/invoice/move',
    tokens: [],
    types: placeholder as {
      body: { priority: string; status?: string }
      params: {}
      paramsTuple: []
      query: { sort?: string; order?: string }
      response: { metrics: any; charts: any[] }
    },
  },
  'comment.leave': {
    methods: ['POST'],
    pattern: '/comment/leave/:userId',
    tokens: [],
    types: placeholder as {
      body: { query: string; limit?: number }
      params: { userId: string }
      paramsTuple: [string]
      query: { minPrice?: number; maxPrice?: number }
      response: { created: boolean; item: any }
    },
  },
  'offer.kick': {
    methods: ['GET'],
    pattern: '/offer/kick/:categoryId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { categoryId: string }
      paramsTuple: [string]
      query: { search?: string; filter?: string }
      response: { settings: any; preferences: any }
    },
  },
  'recipe.validate': {
    methods: ['GET'],
    pattern: '/recipe/validate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { metrics: any; charts: any[] }
    },
  },
  'filter.kick': {
    methods: ['GET', 'HEAD'],
    pattern: '/filter/kick',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { deleted: boolean; count: number }
    },
  },
  'analytics.edit': {
    methods: ['DELETE'],
    pattern: '/analytics/edit',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { status: string; message: string }
    },
  },
  'product.search': {
    methods: ['PATCH'],
    pattern: '/product/search/:entityId',
    tokens: [],
    types: placeholder as {
      body: {}
      params: { entityId: string }
      paramsTuple: [string]
      query: { active?: boolean; archived?: boolean }
      response: { token: string; expiresAt: string }
    },
  },
  'sync.validate': {
    methods: ['POST'],
    pattern: '/sync/validate',
    tokens: [],
    types: placeholder as {
      body: { title: string; description?: string }
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { token: string; expiresAt: string }
    },
  },
  'community.language.find': {
    methods: ['DELETE'],
    pattern: '/community/language/find',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { includeDeleted?: boolean; expand?: string[] }
      response: { settings: any; preferences: any }
    },
  },
  'settings.admin.migrate': {
    methods: ['GET'],
    pattern: '/settings/admin/migrate',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { search?: string; filter?: string }
      response: any
    },
  },
  'wiki.postpone': {
    methods: ['GET'],
    pattern: '/wiki/postpone',
    tokens: [],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { active?: boolean; archived?: boolean }
      response: { updated: boolean; changes: any }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>
