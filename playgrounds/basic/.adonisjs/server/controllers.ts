export const controllers = {
  Accounts: () => import('#controllers/accounts_controller'),
  Posts: () => import('#controllers/posts_controller'),
  Products: () => import('#controllers/products_controller'),
  Session: () => import('#controllers/session_controller'),
  Users: () => import('#controllers/users_controller'),
}
