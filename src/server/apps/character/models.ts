import { t } from "@rbxts/t";
import { PetSchema } from "../pets/models";

export const CharacterSchema = t.interface({
	id: t.string,
	pet: PetSchema,
	quirkymal: t.string,
	level: t.number,
});
