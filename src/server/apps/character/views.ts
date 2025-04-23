import type { t } from "@rbxts/t";
import type { CharacterSchema } from "./models";
import { getRegisteredRoutes, type Request } from "@rbxts/router";
import { generateCrudRoutes } from "shared/routes/utils/crud";

// // T is the actual schema object created with t.interface, t.array, etc.

// export const handlerFromSchema = <T extends t.static<unknown>>(schema: T) => {
// 	return;
// };

export function getQuirkymalHandler(req: Request<typeof CharacterSchema>) {
	print("Getting quirkymal:", req.payload.id);
}

export function createCharacterHandler(req: Request<typeof CharacterSchema>) {
	print("Creating:", req.payload.id);
	print("By player:", req.player.Name);

	return {
		success: true,
		message: "Character created successfully",
	};
}
