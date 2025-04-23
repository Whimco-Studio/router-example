import type { Request, RouteContext, Middleware, MiddlewareResult } from "@rbxts/router";
import type { CharacterSchema } from "./models";

export const characterMiddleware: Middleware = (ctx): MiddlewareResult => {
	warn(ctx);
	if (!ctx.player) {
		return { continue: false, error: "Unauthorized" };
	}

	return { continue: true };
};
