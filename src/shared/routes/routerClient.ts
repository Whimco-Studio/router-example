import type { t } from "@rbxts/t";
import type { CharacterSchema } from "./routerSchemas";
import { getRouterClient } from "@rbxts/router";

const routerFunction = getRouterClient();

export const routerClient = {
	"character:create": (payload: t.static<typeof CharacterSchema>) =>
		routerFunction.InvokeServer("character:create", payload),
	"character:get": (payload: t.static<typeof CharacterSchema>) =>
		routerFunction.InvokeServer("character:get", payload),
	"character:update": (payload: t.static<typeof CharacterSchema>) =>
		routerFunction.InvokeServer("character:update", payload),
	"character:delete": (payload: t.static<typeof CharacterSchema>) =>
		routerFunction.InvokeServer("character:delete", payload),
} as const;
