import { t } from "@rbxts/t";
import { generateCrudRoutes } from "shared/routes/utils/crud";

export const CharacterSchema = t.interface({
	id: t.string,
});
