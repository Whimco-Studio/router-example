import { defineRoute, handleRoute, registerRoute, registerRoutes } from "@rbxts/router";
import { CharacterSchema } from "./models";

registerRoute(
	defineRoute(CharacterSchema, {
		name: "character",
		handler: ({ payload }) => {
			print(payload.quirkymal);
		},
	}),
);

registerRoutes("character", [
	defineRoute(CharacterSchema, {
		name: "get-quirkymal",
		handler: ({ payload }) => {
			print(payload.quirkymal);
		},
	}),
	defineRoute(CharacterSchema, {
		name: "create",
		handler: ({ payload }) => {
			print(payload); // { age: 10, name: "test" }
		},
	}),
]);

handleRoute("character:create", game.GetService("Players").LocalPlayer, {
	quirkymal: "test",
});
