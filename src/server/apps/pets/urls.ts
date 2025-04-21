import { defineRoute, registerRoutes } from "@rbxts/router";

import { PetSchema } from "./models";
import { createPet } from "./views";

registerRoutes("pets", [
	defineRoute(PetSchema, {
		name: "get-quirkymal",
		handler: ({ payload }) => {
			print(payload);
		},
	}),
	defineRoute(PetSchema, {
		name: "create",
		handler: createPet,
	}),
]);
