import { RegisteredRoute } from "@rbxts/router";

import { defineRoute, registerRoutes } from "@rbxts/router";
import type { RegisteredRouteFromSchema, RouteHandler } from "@rbxts/router";
import type { t } from "@rbxts/t";

// Type helpers
type SchemaFunction = (val: unknown) => boolean | [boolean, string?];
type InferStatic<T> = t.static<T>;

/**
 * Registers a full set of CRUD routes under a single namespace.
 */
export function generateCrudRoutes<
	Create extends SchemaFunction,
	Get extends SchemaFunction,
	Update extends SchemaFunction,
	Delete extends SchemaFunction,
	List extends SchemaFunction | undefined = undefined,
>(
	name: string,
	schemas: {
		create: Create;
		get: Get;
		update: Update;
		delete: Delete;
		list?: List;
	},
	handlers: {
		create: RouteHandler<InferStatic<Create>>;
		get: RouteHandler<InferStatic<Get>>;
		update: RouteHandler<InferStatic<Update>>;
		delete: RouteHandler<InferStatic<Delete>>;
		list?: RouteHandler<InferStatic<List>>;
	},
) {
	const routes = [];

	routes.push(defineRoute(schemas.create, { name: "create", handler: handlers.create }));
	routes.push(defineRoute(schemas.get, { name: "get", handler: handlers.get }));
	routes.push(defineRoute(schemas.update, { name: "update", handler: handlers.update }));
	routes.push(defineRoute(schemas.delete, { name: "delete", handler: handlers.delete }));

	if (schemas.list && handlers.list) {
		routes.push(defineRoute(schemas.list, { name: "list", handler: handlers.list }));
	}

	registerRoutes(name, routes as RegisteredRouteFromSchema<(val: unknown) => unknown>[]);
}
