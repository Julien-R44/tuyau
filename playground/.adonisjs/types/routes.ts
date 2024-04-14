export const routes = [
	{
		"params": [],
		"name": "users.index",
		"path": "/users"
	},
	{
		"params": [],
		"name": "users.create",
		"path": "/users/create"
	},
	{
		"params": [],
		"name": "users.store",
		"path": "/users"
	},
	{
		"params": [
			"id"
		],
		"name": "users.show",
		"path": "/users/:id"
	},
	{
		"params": [
			"id"
		],
		"name": "users.edit",
		"path": "/users/:id/edit"
	},
	{
		"params": [
			"id"
		],
		"name": "users.update",
		"path": "/users/:id"
	},
	{
		"params": [
			"id"
		],
		"name": "users.destroy",
		"path": "/users/:id"
	}
] as const;

export type Routes = typeof routes;

export type Route = Routes[number];

export type RouteWithName = Extract<Route, { name: string }>;

export type RouteWithParams = Extract<Route, { params: ReadonlyArray<string> }>;