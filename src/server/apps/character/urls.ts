import { defineRoute, registerRoutes, type RouteContext, type Middleware } from "@rbxts/router";
import { CharacterSchema } from "./models";
import { getQuirkymalHandler, createCharacterHandler } from "./views";
import { characterMiddleware } from "./middleware";
import { generateCrudRoutes } from "shared/routes/utils/crud";

// registerRoutes("character", [
// 	defineRoute(CharacterSchema, {
// 		name: "get-quirkymal",
// 		handler: getQuirkymalHandler,
// 		middleware: [characterMiddleware],
// 	}),
// 	defineRoute(CharacterSchema, {
// 		name: "create",
// 		handler: createCharacterHandler,
// 	}),
// ]);

generateCrudRoutes(
	"character",
	{
		create: CharacterSchema,
		get: CharacterSchema,
		update: CharacterSchema,
		delete: CharacterSchema,
	},
	{
		create: (data) => {
			print("Creating character", data);
		},
		get: (data) => {
			print("Getting character", data);
		},
		update: (data) => {
			print("Updating character", data);
		},
		delete: (data) => {
			print("Deleting character", data);
		},
	},
);
