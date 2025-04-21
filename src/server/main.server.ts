import { makeHello } from "shared/module";

import "./apps";
import { getRegisteredRoutes, handleRoute } from "@rbxts/router";

print(getRegisteredRoutes());

const player = game.GetService("Players").LocalPlayer;

print(player);
handleRoute("pets:create", player, {
	name: "Fluffy",
	type: "cat",
	level: 1,
});
